import logging
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer

logger = logging.getLogger(__name__)

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        try:
            return Notification.objects.filter(recipient=self.request.user).order_by('-created_at')
        except Exception as e:
            logger.error(f"Error in NotificationViewSet get_queryset: {str(e)}", exc_info=True)
            return Notification.objects.none()

    def list(self, request, *args, **kwargs):
        try:
            return super().list(request, *args, **kwargs)
        except Exception as e:
            logger.error(f"Error in NotificationViewSet list: {str(e)}", exc_info=True)
            return Response({"error": str(e)}, status=500)

    @action(detail=True, methods=['patch'])
    def read(self, request, pk=None):
        try:
            notification = self.get_object()
            notification.is_read = True
            notification.save()
            return Response({'status': 'marked as read'})
        except Exception as e:
            logger.error(f"Error in NotificationViewSet read: {str(e)}", exc_info=True)
            return Response({"error": str(e)}, status=500)

    @action(detail=False, methods=['post'], url_path='read-all')
    def read_all(self, request):
        try:
            Notification.objects.filter(recipient=request.user, is_read=False).update(is_read=True)
            return Response({'status': 'all marked as read'})
        except Exception as e:
            logger.error(f"Error in NotificationViewSet read_all: {str(e)}", exc_info=True)
            return Response({"error": str(e)}, status=500)
