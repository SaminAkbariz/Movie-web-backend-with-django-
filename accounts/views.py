from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import UpdateView, DetailView
from django.contrib import messages
from django.urls import reverse_lazy
from django.http import JsonResponse
from .models import User, Profile
from .forms import UserRegistrationForm, UserLoginForm, ProfileUpdateForm


# Helper function to detect AJAX requests
def is_ajax(request):
    return request.headers.get('x-requested-with') == 'XMLHttpRequest'


def register_view(request):
    if request.user.is_authenticated:
        if is_ajax(request):
            return JsonResponse({'status': 'success', 'message': 'already logged in'})
        return redirect('accounts:profile')

    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            if is_ajax(request):
                return JsonResponse({'status': 'success', 'message': 'registered and logged in'})
            messages.success(request, 'ثبت‌نام شما با موفقیت انجام شد!')
            return redirect('accounts:profile')
        else:
            if is_ajax(request):
                errors = dict(form.errors)
                return JsonResponse({'status': 'error', 'message': 'Validation error', 'errors': errors}, status=400)
    else:
        form = UserRegistrationForm()

    if is_ajax(request):
        return JsonResponse({'status': 'error', 'message': 'GET not allowed'}, status=405)

    return render(request, 'accounts/register.html', {'form': form})


def login_view(request):
    if request.user.is_authenticated:
        if is_ajax(request):
            return JsonResponse({'status': 'success', 'message': 'already logged in'})
        return redirect('accounts:profile')

    if request.method == 'POST':
        form = UserLoginForm(request.POST)
        if form.is_valid():
            phone = form.cleaned_data.get('phone')
            password = form.cleaned_data.get('password')
            user = authenticate(request, phone=phone, password=password)
            if user is not None:
                login(request, user)
                if is_ajax(request):
                    return JsonResponse({'status': 'success', 'message': 'logged in'})
                next_url = request.GET.get('next')
                return redirect(next_url or 'accounts:profile')
            else:
                if is_ajax(request):
                    return JsonResponse({'status': 'error', 'message': 'Wrong phone or password'}, status=400)
                messages.error(request, 'شماره تلفن یا رمز عبور اشتباه است!')
        else:
            if is_ajax(request):
                errors = dict(form.errors)
                return JsonResponse({'status': 'error', 'message': 'Invalid data', 'errors': errors}, status=400)
    else:
        form = UserLoginForm()

    if is_ajax(request):
        return JsonResponse({'status': 'error', 'message': 'GET not allowed'}, status=405)

    return render(request, 'accounts/login.html', {'form': form})


@login_required
def logout_view(request):
    logout(request)
    if is_ajax(request):
        return JsonResponse({'status': 'success', 'message': 'logged out'})
    messages.success(request, 'با موفقیت خارج شدید!')
    return redirect('accounts:login')


class ProfileDetailView(LoginRequiredMixin, DetailView):
    model = Profile
    template_name = 'accounts/profile.html'
    context_object_name = 'profile'

    def get_object(self):
        return get_object_or_404(Profile, user=self.request.user)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['user'] = self.request.user

        from django.utils import timezone
        user = self.request.user
        context['is_premium_active'] = user.is_premium and (
                user.premium_expire is None or
                user.premium_expire > timezone.now()
        )

        from movies.models import Watchlist, Rating, Comment
        context['watchlist_count'] = Watchlist.objects.filter(user=self.request.user).count()
        context['ratings_count'] = Rating.objects.filter(user=self.request.user).count()
        context['comments_count'] = Comment.objects.filter(user=self.request.user).count()

        return context


class ProfileUpdateView(LoginRequiredMixin, UpdateView):
    model = Profile
    form_class = ProfileUpdateForm
    template_name = 'accounts/edit_profile.html'
    success_url = reverse_lazy('accounts:profile')

    def get_object(self):
        return get_object_or_404(Profile, user=self.request.user)

    def form_valid(self, form):
        response = super().form_valid(form)
        if is_ajax(self.request):
            return JsonResponse({'status': 'success', 'message': 'Profile updated'})
        messages.success(self.request, 'پروفایل شما با موفقیت به‌روزرسانی شد!')
        return response

    def form_invalid(self, form):
        if is_ajax(self.request):
            errors = dict(form.errors)
            return JsonResponse({'status': 'error', 'message': 'Validation error', 'errors': errors}, status=400)
        return super().form_invalid(form)


@login_required
def premium_view(request):
    return render(request, 'accounts/premium.html')


@login_required
def upgrade_to_premium_view(request):
    if request.method == 'POST':
        user = request.user
        user.is_premium = True
        from django.utils import timezone
        from datetime import timedelta
        user.premium_expire = timezone.now() + timedelta(days=365)
        user.save()
        messages.success(request, 'اشتراک ویژه شما با موفقیت فعال شد!')
        return redirect('accounts:profile')
    return render(request, 'accounts/upgrade_premium.html')