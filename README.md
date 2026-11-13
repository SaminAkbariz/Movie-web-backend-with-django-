# 🎬 Sky Movie — Movie & TV Series Web Backend

A Django-based web application backend for streaming and managing movies and TV series. The project provides a range of features, including phone-number-based authentication, user profiles, premium subscriptions, ratings, comments, watchlists, favorites, and season and episode management for TV series.

## Website Preview

![Movie Website Preview](site%20movie.png)

## 🎬 Project Demo

Watch the full demonstration of this project on YouTube:

[▶ Watch the Movie Website Demo](https://youtu.be/bp8D_hoEnAo)


## ✨ Features

- **User Authentication:** Dedicated user accounts based on mobile phone numbers, without requiring usernames.
- **User Profiles:** Individual profiles for registered users.
- **Premium Subscription:** A subscription system that provides premium features for users.
- **Movie & TV Series Management:** Manage movies and TV shows with genres, release years, IMDb ratings, and posters.
- **Season & Episode Management:** Organized season and episode structures for TV series.
- **Rating System:** Allow users to rate movies and TV shows.
- **Comments:** Enable users to share their opinions and discuss content.
- **Watchlist & Favorites:** Let users save content to their personal watchlists and favorites.
- **Content Discovery:**
  - Latest releases
  - Most-viewed content
  - Personalized recommendations
  - Search and advanced search
- **JSON APIs:** API endpoints for managing watchlists, favorites, ratings, and comments.

## 🛠 Technologies

- **Python 3.14+**
- **Django 6.0**
- **Pillow** — Image processing
- **SQLite** — Default development database
- **HTML, CSS, JavaScript**

## 📁 Project Structure

```text
sky-movie-web-backend/
├── accounts/         # User accounts, profiles, and premium subscriptions
├── movies/           # Movies, TV series, seasons, episodes, ratings, and comments
├── config/           # Project configuration and URL routing
├── static/           # CSS, JavaScript, and static images
├── templates/        # HTML templates
├── media/            # Uploaded files (posters and season/episode images)
├── requirements.txt  # Project dependencies
├── .env.example      # Environment variable template
└── manage.py         # Django management utility
```

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/SaminAkbariz/Movie-web-backend-with-django-.git
cd Movie-web-backend-with-django-
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
```

**Windows:**
```bash
venv\Scripts\activate
```

**Linux / macOS:**
```bash
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file based on the provided example:

```bash
cp .env.example .env
```

Generate a secure Django secret key using:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Add the generated key to your `.env` file and configure the required environment variables.

### 5. Apply Database Migrations

```bash
python manage.py migrate
```

### 6. Create a Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 7. Run the Development Server

```bash
python manage.py runserver
```

The application will be available at:

- **Website:** http://127.0.0.1:8000/
- **Django Admin:** http://127.0.0.1:8000/admin/

## 🔐 Security Considerations

Before deploying the project to a production environment:

- Never expose your `.env` file or Django secret key.
- Keep `db.sqlite3` and the `media/` directory out of version control.
- Set `DEBUG=False` in production.
- Configure `ALLOWED_HOSTS` to include only your trusted domain names.
- Generate a new and secure `SECRET_KEY` for production.

## 📄 License

This project is licensed under the **MIT License**. You are free to use, modify, and distribute the software in accordance with the license terms.
