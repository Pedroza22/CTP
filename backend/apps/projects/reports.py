import io
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from openpyxl import Workbook
from .models import Project
from apps.tasks.models import Task

def generate_project_pdf(project):
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    
    p.setFont("Helvetica-Bold", 16)
    p.drawString(100, 750, f"Project Report: {project.name}")
    
    p.setFont("Helvetica", 12)
    p.drawString(100, 730, f"Status: {project.status}")
    p.drawString(100, 715, f"Start Date: {project.start_date}")
    p.drawString(100, 700, f"End Date: {project.end_date}")
    p.drawString(100, 685, f"Description: {project.description[:100]}...")
    
    p.setFont("Helvetica-Bold", 14)
    p.drawString(100, 650, "Tasks:")
    
    y = 630
    tasks = project.tasks.all()
    p.setFont("Helvetica", 10)
    for task in tasks:
        if y < 50:
            p.showPage()
            y = 750
        p.drawString(120, y, f"- {task.title} ({task.status}) - Due: {task.due_date}")
        y -= 15
        
    p.showPage()
    p.save()
    
    buffer.seek(0)
    return buffer

def generate_project_excel(project):
    wb = Workbook()
    ws = wb.active
    ws.title = "Project Report"
    
    # Headers
    ws.append(["Project Name", project.name])
    ws.append(["Status", project.status])
    ws.append(["Start Date", project.start_date])
    ws.append(["End Date", project.end_date])
    ws.append([])
    
    ws.append(["Task ID", "Title", "Status", "Priority", "Due Date", "Assigned To"])
    
    tasks = project.tasks.all()
    for task in tasks:
        ws.append([
            task.id, 
            task.title, 
            task.status, 
            task.priority, 
            task.due_date, 
            task.assigned_to.email if task.assigned_to else "Unassigned"
        ])
    
    buffer = io.BytesIO()
    wb.save(buffer)
    buffer.seek(0)
    return buffer
