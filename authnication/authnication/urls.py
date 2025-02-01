from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import AllowAny
from drf_yasg.views import  get_schema_view
from drf_yasg import openapi
from user import views as user_view
schema_view = get_schema_view(
    openapi.Info(
        title="Shift Api",
        default_version="v1",
        description="this is a test api for Shiftsupervisor",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="malevin2020@gmail.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=[AllowAny],
    authentication_classes=[JWTAuthentication],
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/permisions/',user_view.get_permistion, name='perrmision'),
    path('api/code/',      user_view.create_code, name='Code'),
    path('api/valid/',     user_view.is_valid, name='Code'),
    path('api/reset/',     user_view.reset_password, name='Code'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("api/docs",schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui')
]
