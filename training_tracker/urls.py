from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenRefreshView
from training.views import CustomTokenObtainPairView

def api_root(request):
    """API root endpoint that provides information about available endpoints."""
    return JsonResponse({
        "message": "Welcome to Training Tracker API",
        "version": "1.0.0",
        "endpoints": {
            "admin": "/admin/",
            "api": "/api/",
            "api_auth": "/api-auth/",
            "token_obtain": "/api/token/",
            "token_refresh": "/api/token/refresh/"
        }
    })

urlpatterns = [
    path("", api_root, name="api_root"),
    path("admin/", admin.site.urls),
    path("api/", include("training.urls")),
    path("api-auth/", include("rest_framework.urls")),
    path("api/token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
