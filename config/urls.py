"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse
from django.urls import path, include
from django.contrib import admin
from django.shortcuts import render
from django.db.models import Avg, Count
from movies.models import Movie, Rating  # <-- اضافه شد


def home(request):
    # Latest movies
    latest_movies = Movie.objects.all().order_by('-created_at')[:8]

    # Top rated movies (based on avg rating from movie_ratings)
    top_rated_movies = Movie.objects.annotate(
        avg_rating=Avg('movie_ratings__score')
    ).filter(avg_rating__isnull=False).order_by('-avg_rating')[:8]

    # All movies (for movies page)
    all_movies = Movie.objects.all().order_by('-created_at')

    # Recommended movies for logged-in user
    recommended_movies = []
    if request.user.is_authenticated:
        user_ratings = Rating.objects.filter(user=request.user)
        favorite_genres = (
            user_ratings
            .values('movie__genre__name')
            .annotate(count=Count('movie__genre__name'))
            .order_by('-count')
        )

        if favorite_genres:
            top_genre = favorite_genres[0]['movie__genre__name']
            seen_movies = user_ratings.values_list('movie_id', flat=True)
            recommended_movies = Movie.objects.filter(
                genre__name=top_genre
            ).exclude(id__in=seen_movies).order_by('-imdb_rating')[:12]
        else:
            recommended_movies = Movie.objects.all().order_by('-imdb_rating')[:12]

    context = {
        'latest_movies': latest_movies,
        'top_rated_movies': top_rated_movies,
        'all_movies': all_movies,
        'recommended_movies': recommended_movies,
        'genres': Movie.objects.values_list('genre__name', flat=True).distinct(),
    }

    # اگر قالب اختصاصی خودتان را دارید، نام آن را به دلخواه تغییر دهید.
    # فعلاً 'home.html' فرض می‌کنیم. (می‌توانید بعداً به '__base.html' یا هر نام دیگر تغییر دهید)
    return render(request, '__base.html', context)
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),
    path('movies/', include('movies.urls')),
    path('accounts/', include('accounts.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)