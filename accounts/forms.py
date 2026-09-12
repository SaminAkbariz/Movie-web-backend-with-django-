from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from .models import User, Profile


class UserRegistrationForm(UserCreationForm):
    email = forms.EmailField(required=False, help_text='اختیاری')
    
    class Meta:
        model = User
        fields = ('phone', 'email', 'password1', 'password2')
        labels = {
            'phone': 'شماره تلفن',
            'email': 'ایمیل',
            'password1': 'رمز عبور',
            'password2': 'تکرار رمز عبور',
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['phone'].help_text = 'شماره تلفن باید 11 رقم و با 09 شروع شود'
        self.fields['password1'].help_text = 'حداقل 8 کاراکتر'
    
    def clean_phone(self):
        phone = self.cleaned_data.get('phone')
        if not phone.startswith('09'):
            raise ValidationError('شماره تلفن باید با 09 شروع شود.')
        if len(phone) != 11:
            raise ValidationError('شماره تلفن باید 11 رقم باشد.')
        
        # Check if phone already exists
        if User.objects.filter(phone=phone).exists():
            raise ValidationError('این شماره تلفن قبلاً ثبت شده است.')
        
        return phone


class UserLoginForm(forms.Form):
    phone = forms.CharField(
        max_length=11,
        widget=forms.TextInput(attrs={
            'placeholder': 'شماره تلفن',
            'class': 'form-control'
        })
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'placeholder': 'رمز عبور',
            'class': 'form-control'
        })
    )
    
    class Meta:
        fields = ('phone', 'password')
        labels = {
            'phone': 'شماره تلفن',
            'password': 'رمز عبور',
        }
    
    def clean_phone(self):
        phone = self.cleaned_data.get('phone')
        if not phone.startswith('09'):
            raise forms.ValidationError('شماره تلفن باید با 09 شروع شود.')
        if len(phone) != 11:
            raise forms.ValidationError('شماره تلفن باید 11 رقم باشد.')
        return phone


class ProfileUpdateForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ('full_name', 'avatar', 'bio')
        labels = {
            'full_name': 'نام کامل',
            'avatar': 'تصویر پروفایل',
            'bio': 'درباره من',
        }
        widgets = {
            'full_name': forms.TextInput(attrs={
                'placeholder': 'نام و نام خانوادگی خود را وارد کنید',
                'class': 'form-control'
            }),
            'bio': forms.Textarea(attrs={
                'placeholder': 'چند خطی درباره خودتان بنویسید...',
                'rows': 4,
                'class': 'form-control'
            }),
            'avatar': forms.FileInput(attrs={
                'class': 'form-control',
                'accept': 'image/*'
            })
        }
