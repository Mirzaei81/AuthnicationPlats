from rest_framework.decorators import api_view
from .permision import Permisions
from rest_framework.response import Response

@api_view("GET")
def get_permistion(self,request):
	return Response({"permision":[m.name for m in Permisions]})