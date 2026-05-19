from rest_framework import permissions

class IsAdminRole(permissions.BasePermission):
    """
    Allows access only to users with the 'admin' role.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'admin')

class IsProjectMember(permissions.BasePermission):
    """
    Allows access only to members of the project.
    """
    def has_object_permission(self, request, view, obj):
        # Assuming obj is a Project or has a 'project' attribute
        project = obj if hasattr(obj, 'members') else getattr(obj, 'project', None)
        if not project:
            return False
        return request.user in project.members.all() or request.user.role == 'admin'

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Allows access to the owner of the object or admins.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        
        # Check for various owner fields
        owner_fields = ['created_by', 'author', 'user', 'recipient']
        for field in owner_fields:
            if hasattr(obj, field) and getattr(obj, field) == request.user:
                return True
        return False
