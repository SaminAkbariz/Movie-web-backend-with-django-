from django.contrib import admin
from .models import Movie, Genre
from .models import Movie, Genre, Season, Episode   # Season, Episode را اضافه کنید



@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'release_year', 'imdb_rating')
    list_filter = ('type', 'release_year', 'genre')
    search_fields = ('title',)
    filter_horizontal = ('genre',)



# ... بقیه adminها ...

@admin.register(Season)
class SeasonAdmin(admin.ModelAdmin):
    list_display = ('movie', 'season_number', 'title')
    list_filter = ('movie',)
    search_fields = ('movie__title', 'title')

@admin.register(Episode)
class EpisodeAdmin(admin.ModelAdmin):
    list_display = ('season', 'episode_number', 'title', 'duration')
    list_filter = ('season__movie', 'season')
    search_fields = ('title',)