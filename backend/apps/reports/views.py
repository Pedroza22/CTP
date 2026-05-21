from rest_framework import views, permissions, status
from django.http import HttpResponse
from .utils import generate_pdf_report, generate_excel_report

class PDFReportView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        report_name = request.query_params.get('report', 'Resumen General')
        buffer = generate_pdf_report(report_name, request.user)
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="reporte_{report_name.lower().replace(" ", "_")}.pdf"'
        return response

class ExcelReportView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        report_name = request.query_params.get('report', 'Resumen General')
        buffer = generate_excel_report(report_name, request.user)
        response = HttpResponse(buffer, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = f'attachment; filename="reporte_{report_name.lower().replace(" ", "_")}.xlsx"'
        return response
