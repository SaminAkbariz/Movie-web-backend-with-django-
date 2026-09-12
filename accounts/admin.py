from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Profile


class UserAdmin(BaseUserAdmin):
    model = User

    list_display = ('phone', 'is_staff', 'is_active', 'is_premium')
    list_filter = ('is_staff', 'is_active', 'is_premium')
    ordering = ('phone',)
    search_fields = ('phone', 'email')

    fieldsets = (
        (None, {'fields': ('phone', 'password')}),
        ('Personal Info', {'fields': ('email',)}),
        ('Premium', {'fields': ('is_premium', 'premium_expire')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('phone', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )


class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name')
    search_fields = ('user__phone', 'full_name')


admin.site.register(User, UserAdmin)
admin.site.register(Profile, ProfileAdmin)
