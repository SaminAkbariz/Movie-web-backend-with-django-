from django.db import models
from django.contrib.auth import get_user_model
from django.conf import settings   # <-- اضافه شود


User = get_user_model()
User = settings.AUTH_USER_MODEL    # <-- اضافه شود


class Genre(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Movie(models.Model):

    TYPE_CHOICES = (
        ('movie', 'Movie'),
        ('series', 'Series'),
    )

    title = models.CharField(max_length=200)
    description = models.TextField()
    genre = models.ManyToManyField(Genre)

    release_year = models.PositiveIntegerField()
    duration = models.PositiveIntegerField(help_text="Duration in minutes")

    poster = models.ImageField(upload_to='posters/')
    imdb_rating = models.FloatField(default=0)

    type = models.CharField(max_length=10, choices=TYPE_CHOICES)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    @property
    def average_rating(self):
        ratings = self.movie_ratings.all()
        if ratings:
            return sum(r.score for r in ratings) / len(ratings)
        return 0


class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='movie_ratings')
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='movie_ratings')
    score = models.IntegerField(choices=[(i, i) for i in range(1, 11)])
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'movie']

    def __str__(self):
        return f"{self.user.phone} - {self.movie.title} - {self.score}"


class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='movie_watchlist')
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='movie_watchlist')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'movie']

    def __str__(self):
        return f"{self.user.phone} - {self.movie.title}"


class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='movie_favorites')
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='movie_favorites')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'movie']

    def __str__(self):
        return f"{self.user.phone} - {self.movie.title}"


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='movie_comments')
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='movie_comments')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.phone} - {self.movie.title[:50]}"


class Season(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='seasons')
    season_number = models.PositiveIntegerField()
    title = models.CharField(max_length=200, blank=True)
    poster = models.ImageField(upload_to='seasons/', blank=True, null=True)
    description = models.TextField(blank=True)
    release_year = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['movie', 'season_number']
        ordering = ['season_number']

    def __str__(self):
        return f"{self.movie.title} - Season {self.season_number}"


class Episode(models.Model):
    season = models.ForeignKey(Season, on_delete=models.CASCADE, related_name='episodes')
    episode_number = models.PositiveIntegerField()
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    duration = models.PositiveIntegerField(help_text="Duration in minutes", default=0)
    video_url = models.URLField(blank=True, help_text="YouTube or other video URL")
    thumbnail = models.ImageField(upload_to='episodes/', blank=True, null=True)
    release_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['season', 'episode_number']
        ordering = ['episode_number']

    def __str__(self):
        return f"{self.season.movie.title} S{self.season.season_number}E{self.episode_number} - {self.title}"