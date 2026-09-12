from django.shortcuts import render, get_object_or_404
from django.views.generic import ListView, DetailView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Avg, Count, Q
from django.core.paginator import Paginator
from .models import Movie, Genre, Rating, Watchlist, Favorite, Comment, Season, Episode   # Episode را اضافه کنید
from django.contrib import messages
from django.views.decorators.http import require_POST   # <-- این خط جدید
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required



class MovieListView(ListView):
    model = Movie
    template_name = 'movies/movie_list.html'
    context_object_name = 'movies'
    paginate_by = 12

    def get_queryset(self):
        queryset = Movie.objects.all()
        type_filter = self.request.GET.get('type')
        genre_filter = self.request.GET.get('genre')
        
        if type_filter:
            queryset = queryset.filter(type=type_filter)
        if genre_filter:
            queryset = queryset.filter(genre__name=genre_filter)
            
        return queryset.order_by('-created_at')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['genres'] = Genre.objects.all()
        context['current_type'] = self.request.GET.get('type', '')
        context['current_genre'] = self.request.GET.get('genre', '')
        
        # Add type choices for template
        context['type_choices'] = Movie.TYPE_CHOICES
        
        return context


class MovieDetailView(DetailView):
    model = Movie
    template_name = 'movies/movie_detail.html'  # مطابق UI خود تغییر دهید
    context_object_name = 'movie'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        # اضافه کردن فصل‌ها و قسمت‌ها (اگر نوع سریال باشد)
        if self.object.type == 'series':
            seasons = self.object.seasons.all().prefetch_related('episodes')
            context['seasons'] = seasons
        else:
            context['seasons'] = []

        # ... بقیه کدهای قبلی (امتیاز، کامنت، واچ‌لیست) باقی می‌ماند ...
        if self.request.user.is_authenticated:
            context['is_in_watchlist'] = self.object.movie_watchlist.filter(user=self.request.user).exists()
            context['user_rating'] = self.object.movie_ratings.filter(user=self.request.user).first()

        context['comments'] = self.object.movie_comments.all().order_by('-created_at')
        context['average_rating'] = self.object.movie_ratings.aggregate(avg_rating=Avg('score'))['avg_rating'] or 0
        context['total_ratings'] = self.object.movie_ratings.count()

        return context

class MoviesByGenreView(ListView):
    model = Movie
    template_name = 'movies/movies_by_genre.html'
    context_object_name = 'movies'
    paginate_by = 12

    def get_queryset(self):
        self.genre = get_object_or_404(Genre, name=self.kwargs['genre_name'])
        return Movie.objects.filter(genre=self.genre).order_by('-created_at')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['genre'] = self.genre
        context['genres'] = Genre.objects.all()
        return context


class SearchMoviesView(ListView):
    model = Movie
    template_name = 'movies/search_results.html'
    context_object_name = 'movies'
    paginate_by = 12

    def get_queryset(self):
        query = self.request.GET.get('q')
        if query:
            return Movie.objects.filter(
                Q(title__icontains=query) |
                Q(description__icontains=query)
            ).order_by('-created_at')
        return Movie.objects.none()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['search_query'] = self.request.GET.get('q', '')
        return context


class LatestMoviesView(ListView):
    model = Movie
    template_name = 'movies/latest_movies.html'
    context_object_name = 'movies'
    paginate_by = 12

    def get_queryset(self):
        return Movie.objects.all().order_by('-created_at')


class TopRatedMoviesView(ListView):
    model = Movie
    template_name = 'movies/top_rated.html'
    context_object_name = 'movies'
    paginate_by = 12

    def get_queryset(self):
        return Movie.objects.all().order_by('-imdb_rating')


class RecommendedMoviesView(LoginRequiredMixin, ListView):
    model = Movie
    template_name = 'movies/recommended_movies.html'
    context_object_name = 'movies'
    paginate_by = 12

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            # اگر لاگین نکرده، فقط پربازدیدترین‌ها یا بالاترین امتیاز
            return Movie.objects.all().order_by('-imdb_rating')

        # ژانرهای مورد علاقه کاربر: ژانرهایی که بیشتر امتیاز داده
        user_ratings = Rating.objects.filter(user=user)
        favorite_genres = (
            user_ratings
            .values('movie__genre__name')
            .annotate(count=Count('movie__genre__name'))
            .order_by('-count')
        )

        if favorite_genres:
            top_genre = favorite_genres[0]['movie__genre__name']
            # فیلم‌هایی که کارر دیده حذف می‌کنیم
            seen_movies = user_ratings.values_list('movie_id', flat=True)
            return Movie.objects.filter(genre__name=top_genre).exclude(id__in=seen_movies).order_by('-imdb_rating')
        else:
            # اگر امتیازی نداده، بالاترین امتیاز
            return Movie.objects.all().order_by('-imdb_rating')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['is_paginated'] = context['page_obj'].has_other_pages()
        return context


@login_required
def toggle_watchlist(request, movie_id):
    movie = get_object_or_404(Movie, id=movie_id)
    watchlist_item, created = Watchlist.objects.get_or_create(user=request.user, movie=movie)
    
    if not created:
        watchlist_item.delete()
        return JsonResponse({'status': 'removed', 'message': 'Removed from watchlist'})
    else:
        return JsonResponse({'status': 'added', 'message': 'Added to watchlist'})



@login_required
def rate_movie(request, movie_id):
    if request.method == 'POST':
        movie = get_object_or_404(Movie, id=movie_id)
        score = request.POST.get('score')
        
        if score and 1 <= int(score) <= 10:
            rating, created = Rating.objects.update_or_create(
                user=request.user,
                movie=movie,
                defaults={'score': int(score)}
            )
            
            return JsonResponse({
                'status': 'success', 
                'message': 'Rating saved',
                'new_average': movie.average_rating
            })
    
    return JsonResponse({'status': 'error', 'message': 'Invalid rating'}, status=400)



# ========== اضافه شدن ویوهای جدید ==========

class UserWatchlistView(LoginRequiredMixin, ListView):
    """نمایش لیست تماشای کاربر"""
    model = Watchlist
    template_name = 'movies/watchlist.html'   # نام قالب را مطابق UI خود تغییر دهید
    context_object_name = 'watchlist_items'
    paginate_by = 12

    def get_queryset(self):
        return Watchlist.objects.filter(user=self.request.user).select_related('movie').order_by('-added_at')


class UserRatingsView(LoginRequiredMixin, ListView):
    """نمایش لیست امتیازهای کاربر"""
    model = Rating
    template_name = 'movies/user_ratings.html'
    context_object_name = 'ratings'
    paginate_by = 12

    def get_queryset(self):
        return Rating.objects.filter(user=self.request.user).select_related('movie').order_by('-created_at')


class UserCommentsView(LoginRequiredMixin, ListView):
    """نمایش لیست کامنت‌های کاربر"""
    model = Comment
    template_name = 'movies/user_comments.html'
    context_object_name = 'comments'
    paginate_by = 12

    def get_queryset(self):
        return Comment.objects.filter(user=self.request.user).select_related('movie').order_by('-created_at')


@login_required
@require_POST
def delete_comment(request, comment_id):
    """حذف کامنت (AJAX)"""
    comment = get_object_or_404(Comment, id=comment_id)
    if comment.user != request.user:
        return JsonResponse({'status': 'error', 'message': 'شما اجازه حذف این کامنت را ندارید.'}, status=403)
    comment.delete()
    return JsonResponse({'status': 'success', 'message': 'کامنت حذف شد.'})


@login_required
def movie_stats(request, movie_id):
    """دریافت آمار فیلم برای AJAX"""
    movie = get_object_or_404(Movie, id=movie_id)
    stats = {
        'total_ratings': movie.movie_ratings.count(),
        'average_rating': movie.movie_ratings.aggregate(avg=Avg('score'))['avg'] or 0,
        'total_comments': movie.movie_comments.count(),
        'in_watchlist': False,
        'user_rating': None
    }
    if request.user.is_authenticated:
        stats['in_watchlist'] = movie.movie_watchlist.filter(user=request.user).exists()
        user_rating = movie.movie_ratings.filter(user=request.user).first()
        stats['user_rating'] = user_rating.score if user_rating else None
    return JsonResponse(stats)




def episode_detail(request, episode_id):
    episode = get_object_or_404(Episode, id=episode_id)
    # اعمال محدودیت پریمیوم در آینده
    return render(request, 'movies/episode_detail.html', {'episode': episode})




@login_required
def api_watchlist(request):
    watchlist_items = Watchlist.objects.filter(user=request.user).select_related('movie')
    data = {
        'status': 'success',
        'watchlist': [{'movie_id': item.movie.id} for item in watchlist_items]
    }
    return JsonResponse(data)



@login_required
def api_favorites(request):
    favorite_items = Favorite.objects.filter(user=request.user).select_related('movie')
    data = {
        'status': 'success',
        'favorites': [{'movie_id': item.movie.id} for item in favorite_items]
    }
    return JsonResponse(data)


@login_required
def toggle_favorite(request, movie_id):
    movie = get_object_or_404(Movie, id=movie_id)
    favorite_item, created = Favorite.objects.get_or_create(user=request.user, movie=movie)

    if not created:
        favorite_item.delete()
        return JsonResponse({'status': 'removed', 'message': 'Removed from favorites'})
    else:
        return JsonResponse({'status': 'added', 'message': 'Added to favorites'})

class UserFavoritesView(LoginRequiredMixin, ListView):
    model = Favorite
    template_name = 'movies/favorites.html'
    context_object_name = 'favorites'
    paginate_by = 12

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user).select_related('movie').order_by('-added_at')


@login_required
def api_user_ratings(request):
    ratings = Rating.objects.filter(user=request.user).select_related('movie')
    data = {
        'status': 'success',
        'ratings': [{'movie_id': r.movie.id, 'score': r.score} for r in ratings]
    }
    return JsonResponse(data)



@login_required
def api_movie_comments(request, movie_id):
    """دریافت لیست کامنت‌های یک فیلم (JSON)"""
    movie = get_object_or_404(Movie, id=movie_id)
    comments = movie.movie_comments.select_related('user').order_by('-created_at')
    data = {
        'status': 'success',
        'comments': [
            {
                'id': c.id,
                'text': c.text,
                'user_name': c.user.profile.full_name or c.user.phone,
                'user_id': c.user.id,
                'created_at': c.created_at.strftime('%Y-%m-%d %H:%M'),
                'can_delete': c.user == request.user
            } for c in comments
        ]
    }
    return JsonResponse(data)


@login_required
@require_POST
def add_comment(request, movie_id):
    """افزودن کامنت جدید به فیلم"""
    movie = get_object_or_404(Movie, id=movie_id)
    text = request.POST.get('text', '').strip()
    if not text:
        return JsonResponse({'status': 'error', 'message': 'متن کامنت نمی‌تواند خالی باشد'}, status=400)
    if len(text) > 1000:
        return JsonResponse({'status': 'error', 'message': 'متن کامنت نباید بیشتر از 1000 کاراکتر باشد'}, status=400)

    comment = Comment.objects.create(
        user=request.user,
        movie=movie,
        text=text
    )
    return JsonResponse({
        'status': 'success',
        'message': 'کامنت با موفقیت ثبت شد',
        'comment': {
            'id': comment.id,
            'text': comment.text,
            'user_name': request.user.profile.full_name or request.user.phone,
            'user_id': request.user.id,
            'created_at': comment.created_at.strftime('%Y-%m-%d %H:%M'),
            'can_delete': True
        }
    })





from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q

def advanced_search(request):
    """API برای جستجوی پیشرفته (JSON)"""
    query = request.GET.get('q', '').strip()
    genre = request.GET.get('genre', '')
    year_from = request.GET.get('year_from', '')
    year_to = request.GET.get('year_to', '')
    min_rating = request.GET.get('min_rating', '')
    media_type = request.GET.get('type', '')  # movie / series
    page = request.GET.get('page', 1)

    movies = Movie.objects.all()

    # فیلتر بر اساس متن جستجو
    if query:
        movies = movies.filter(
            Q(title__icontains=query) |
            Q(description__icontains=query)
        )

    # فیلتر بر اساس ژانر
    if genre:
        movies = movies.filter(genre__name=genre)

    # فیلتر سال
    if year_from:
        movies = movies.filter(release_year__gte=year_from)
    if year_to:
        movies = movies.filter(release_year__lte=year_to)

    # فیلتر امتیاز IMDB
    if min_rating:
        try:
            min_val = float(min_rating)
            movies = movies.filter(imdb_rating__gte=min_val)
        except ValueError:
            pass

    # فیلتر نوع
    if media_type in ['movie', 'series']:
        movies = movies.filter(type=media_type)

    # مرتب‌سازی پیش‌فرض (جدیدترین)
    movies = movies.order_by('-release_year')

    # صفحه‌بندی (12 فیلم در هر صفحه)
    paginator = Paginator(movies, 12)
    try:
        movies_page = paginator.page(page)
    except PageNotAnInteger:
        movies_page = paginator.page(1)
    except EmptyPage:
        movies_page = paginator.page(paginator.num_pages)

    # آماده‌سازی خروجی JSON
    results = []
    for m in movies_page:
        results.append({
            'id': m.id,
            'title': m.title,
            'poster': m.poster.url if m.poster else None,
            'year': m.release_year,
            'imdb': m.imdb_rating,
            'type': m.type,
            'genre': list(m.genre.values_list('name', flat=True)),
        })

    return JsonResponse({
        'status': 'success',
        'results': results,
        'total': paginator.count,
        'page': movies_page.number,
        'num_pages': paginator.num_pages,
        'has_next': movies_page.has_next(),
        'has_previous': movies_page.has_previous(),
    })


# در movies/views.py
def api_series_seasons(request, movie_id):
    movie = get_object_or_404(Movie, id=movie_id, type='series')
    seasons = movie.seasons.all().prefetch_related('episodes').order_by('season_number')
    data = {
        'status': 'success',
        'seasons': [
            {
                'id': season.id,
                'season_number': season.season_number,
                'title': season.title,
                'episodes': [
                    {
                        'id': ep.id,
                        'episode_number': ep.episode_number,
                        'title': ep.title,
                        'duration': ep.duration,
                        'video_url': ep.video_url,
                    } for ep in season.episodes.all().order_by('episode_number')
                ]
            } for season in seasons
        ]
    }
    return JsonResponse(data)



@login_required
def api_recommended(request):
    user = request.user
    seen_movie_ids = Rating.objects.filter(user=user).values_list('movie_id', flat=True)
    movies = Movie.objects.exclude(id__in=seen_movie_ids).order_by('-imdb_rating')[:12]
    data = {'status': 'success', 'movies': []}
    data['movies'] = [{
        'id': m.id,
        'title': m.title,
        'poster': m.poster.url if m.poster else None,
        'year': m.release_year,
        'imdb': m.imdb_rating,
        'genre': list(m.genre.values_list('name', flat=True)),
        'type': m.type
    } for m in movies]
    return JsonResponse(data)