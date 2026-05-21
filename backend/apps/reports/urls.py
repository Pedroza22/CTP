from django.urls import path
from .views import PDFReportView, ExcelReportView

urlpatterns = [
    path('pdf/', PDFReportView.as_view(), name='report-pdf'),
    path('excel/', ExcelReportView.as_view(), name='report-excel'),
]
