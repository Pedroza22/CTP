from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, CommentViewSet

router = DefaultRouter()
router.register(r'comments', CommentViewSet)
router.register(r'', TaskViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
