import io
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from openpyxl import Workbook
from apps.projects.models import Project
from apps.tasks.models import Task
from django.db.models import Count

def generate_pdf_report(report_name, user):
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    
    # Header
    p.setFont("Helvetica-Bold", 18)
    p.drawString(100, 750, "Precision Flow - Reporte del Sistema")
    p.setFont("Helvetica", 12)
    p.drawString(100, 730, f"Tipo de Reporte: {report_name}")
    p.drawString(100, 715, f"Generado por: {user.username}")
    
    p.line(100, 705, 500, 705)
    
    y = 680
    
    if report_name == "Resumen Ejecutivo":
        projects = Project.objects.all() if user.role == 'admin' else Project.objects.filter(members=user)
        p.setFont("Helvetica-Bold", 14)
        p.drawString(100, y, "Resumen de Proyectos")
        y -= 25
        p.setFont("Helvetica", 11)
        for proj in projects:
            p.drawString(120, y, f"• {proj.name} - Estado: {proj.status}")
            y -= 15
            if y < 100:
                p.showPage()
                y = 750
                
    elif report_name == "Productividad de Tareas":
        tasks = Task.objects.all() if user.role == 'admin' else Task.objects.filter(assigned_to=user)
        done_count = tasks.filter(status='done').count()
        total_count = tasks.count()
        
        p.setFont("Helvetica-Bold", 14)
        p.drawString(100, y, "Métricas de Productividad")
        y -= 25
        p.setFont("Helvetica", 11)
        p.drawString(120, y, f"Total de Tareas: {total_count}")
        y -= 15
        p.drawString(120, y, f"Tareas Completadas: {done_count}")
        y -= 15
        p.drawString(120, y, f"Tasa de Completitud: {(done_count/total_count*100) if total_count > 0 else 0:.1f}%")
        
    else: # Distribución de Carga
        tasks_by_user = Task.objects.values('assigned_to__username').annotate(count=Count('id'))
        p.setFont("Helvetica-Bold", 14)
        p.drawString(100, y, "Distribución de Carga por Usuario")
        y -= 25
        p.setFont("Helvetica", 11)
        for item in tasks_by_user:
            username = item['assigned_to__username'] or "Sin asignar"
            p.drawString(120, y, f"• {username}: {item['count']} tareas")
            y -= 15

    p.showPage()
    p.save()
    buffer.seek(0)
    return buffer

def generate_excel_report(report_name, user):
    wb = Workbook()
    ws = wb.active
    ws.title = "Reporte"
    
    ws.append(["Precision Flow - Reporte del Sistema"])
    ws.append([f"Reporte: {report_name}"])
    ws.append([f"Generado por: {user.username}"])
    ws.append([])
    
    if report_name == "Resumen Ejecutivo":
        ws.append(["ID Proyecto", "Nombre", "Estado", "Fecha Inicio"])
        projects = Project.objects.all() if user.role == 'admin' else Project.objects.filter(members=user)
        for proj in projects:
            ws.append([str(proj.id), proj.name, proj.status, proj.start_date])
            
    elif report_name == "Productividad de Tareas":
        ws.append(["ID Tarea", "Título", "Estado", "Prioridad", "Asignado a"])
        tasks = Task.objects.all() if user.role == 'admin' else Task.objects.filter(assigned_to=user)
        for task in tasks:
            ws.append([str(task.id), task.title, task.status, task.priority, task.assigned_to.username if task.assigned_to else "N/A"])
            
    else: # Distribución de Carga
        ws.append(["Usuario", "Cantidad de Tareas"])
        tasks_by_user = Task.objects.values('assigned_to__username').annotate(count=Count('id'))
        for item in tasks_by_user:
            ws.append([item['assigned_to__username'] or "Sin asignar", item['count']])
            
    buffer = io.BytesIO()
    wb.save(buffer)
    buffer.seek(0)
    return buffer
