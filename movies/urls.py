from django.urls import path
from . import views

app_name = 'movies'

urlpatterns = [
    # Movie listing and filtering
    path('', views.MovieListView.as_view(), name='movie_list'),
    path('latest/', views.LatestMoviesView.as_view(), name='latest_movies'),
    path('top-rated/', views.TopRatedMoviesView.as_view(), name='top_rated'),
    path('recommended/', views.RecommendedMoviesView.as_view(), name='recommended_movies'),
    path('genre/<str:genre_name>/', views.MoviesByGenreView.as_view(), name='movies_by_genre'),
    path('search/', views.SearchMoviesView.as_view(), name='search'),
    path('advanced-search/', views.advanced_search, name='advanced_search'),

    # Movie details
    path('movie/<int:pk>/', views.MovieDetailView.as_view(), name='movie_detail'),

    # API endpoints (JSON)
    path('watchlist/api/', views.api_watchlist, name='api_watchlist'),
    path('favorites/api/', views.api_favorites, name='api_favorites'),
    path('my-ratings/api/', views.api_user_ratings, name='api_user_ratings'),
    path('comments/api/<int:movie_id>/', views.api_movie_comments, name='api_movie_comments'),
    path('api/series-seasons/<int:movie_id>/', views.api_series_seasons, name='api_series_seasons'),
path('api/recommended/', views.api_recommended, name='api_recommended'),

    # Action endpoints (POST)
    path('toggle-watchlist/<int:movie_id>/', views.toggle_watchlist, name='toggle_watchlist'),
    path('toggle-favorite/<int:movie_id>/', views.toggle_favorite, name='toggle_favorite'),
    path('rate/<int:movie_id>/', views.rate_movie, name='rate_movie'),
    path('comment/add/<int:movie_id>/', views.add_comment, name='add_comment'),
    path('comment/delete/<int:comment_id>/', views.delete_comment, name='delete_comment'),
    path('movie-stats/<int:movie_id>/', views.movie_stats, name='movie_stats'),

    # User dashboard pages (HTML)
    path('watchlist/', views.UserWatchlistView.as_view(), name='user_watchlist'),
    path('favorites/', views.UserFavoritesView.as_view(), name='user_favorites'),
    path('my-ratings/', views.UserRatingsView.as_view(), name='user_ratings'),
    path('my-comments/', views.UserCommentsView.as_view(), name='user_comments'),

    # Episode detail
    path('episode/<int:episode_id>/', views.episode_detail, name='episode_detail'),
]