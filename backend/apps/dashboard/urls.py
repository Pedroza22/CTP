from django.urls import path
from .views import GlobalStatsView, ProjectProgressView, TasksByStatusView

urlpatterns = [
    path('stats/', GlobalStatsView.as_view(), name='global-stats'),
    path('project-progress/', ProjectProgressView.as_view(), name='project-progress'),
    path('tasks-by-status/', TasksByStatusView.as_view(), name='tasks-by-status'),
]
