from rest_framework.permissions import BasePermission
from rest_framework.permissions import BasePermission, SAFE_METHODS
from enum import Enum

class Permisions(Enum):
	plats_admin = 0b1
	plats_readonly = 0b10
	shift_supervisor_tank_admin = 0b100
	shift_supervisor_tank_readonly = 0b1000
	shift_supervisor_btb_admin = 0x10000
	shift_supervisor_btb_readonly= 0x100000
	shift_supervisor_pb_readonly= 0x1000000
	shift_supervisor_pb_admin= 0x10000000
	shift_supervisor_reforming_admin= 0b100000000
	shift_supervisor_reforming_readonly= 0b1000000000
	

class HasAppPermisionOrReadOnly(BasePermission): # add this class to permision _list 
	""""
	  Create cls prop for each app inherting this model by enum value 
		app_permision = HasAppPermisionOrReadOnly
		app_permision.readonly_permission = shift_supervisor_tank_readonly
		app_permision.admin_permission = shift_supervisor_tank_admin
		...
		class ExampleView(Viewset):
			permission_classes=[app_permision]
	"""
	readonly_permission:Permisions = 0x0
	admin_permission:Permisions = 0x0
	def has_permission(self, request, view):
		if not request.user.is_authenticated:
			return False
		# Admin or specific permission 
		if request.user.is_staff or (request.user.permision_bit&self.admin_permission)==self.admin_permission:
			return True
		# Read-only access with 'access_readonly' permission
		if request.method in SAFE_METHODS and (request.user.permision_bit&self.readonly_permission)==self.readonly_permission:
			return True
		return False