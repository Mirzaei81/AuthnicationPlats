from rest_framework.permissions import BasePermission
from rest_framework.permissions import BasePermission, SAFE_METHODS
from enum import Enum

class Permisions(Enum):
	plats_admin = b"1"
	plats_readonly = b"10"
	shift_supervisor_tank = b"100"
	shift_supervisor_btx = b"10000"
	shift_supervisor_admin = b"1000"
	shift_supervisor_readonly= b"10000"
	shift_supervisor_px= b"1000000"
	shift_supervisor_reforming= b"1000000000"
allowed_roles = {
	Permisions.shift_supervisor_admin :[Permisions.shift_supervisor_admin,Permisions.shift_supervisor_admin],
	Permisions.shift_supervisor_btx :[Permisions.shift_supervisor_btx],
	Permisions.shift_supervisor_tank :[Permisions.shift_supervisor_tank],
	Permisions.shift_supervisor_px :[Permisions.shift_supervisor_px],
	Permisions.shift_supervisor_reforming :[Permisions.shift_supervisor_reforming],
	Permisions.plats_admin :[Permisions.plats_admin,Permisions.plats_readonly],
}
perimision_dict = {
	Permisions.plats_admin :"ادمین پلتس",
	Permisions.plats_readonly :"پلتس خواندن",
	Permisions.shift_supervisor_admin :" ادمین کشیک ارشد",
	Permisions.shift_supervisor_readonly :"کشیک ارشد خواندن",
	Permisions.shift_supervisor_tank :"کشیک ارشد - تانک ",
	Permisions.shift_supervisor_btx :"کشیک ارشد - btx",
	Permisions.shift_supervisor_px:"کشیک ارشد - px",
	Permisions.shift_supervisor_reforming:"کشیک ارشد - refroming",
}	
def andbytes(abytes:bytes, bbytes:bytes):
	return bytes([a & b for a, b in zip(abytes[::-1], bbytes[::-1])][::-1])

def orbytes(a, b):
	return (int.from_bytes(a,"big") | int.from_bytes(b,"big")).to_bytes(max(len(a),len(b)),"big")

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
		if request.user.is_staff or andbytes(request.user.role,self.admin_permission)==self.admin_permission:
			return True
		# Read-only access with 'access_readonly' permission
		if request.method in SAFE_METHODS and andbytes(request.user.role&self.readonly_permission)==self.readonly_permission:
			return True
		return False