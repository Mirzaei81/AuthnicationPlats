from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import AllowAny
from .permision import Permisions
from .utils import send_message,check_sso_is_valid
from .models import User
from .serilaizers import *
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg  import openapi
import re

@api_view(["GET"])
def get_permistion(request):
	return Response({"permision":[m.name for m in Permisions]})

@swagger_auto_schema(method="POST",
	tags=["ResetPassword"],
	response={"200":int},request_body=openapi.Schema(
	type=openapi.TYPE_OBJECT, 
    properties={
        'phone_number': openapi.Schema(type=openapi.TYPE_STRING, description='09111111111'),
    },
))
@api_view(["POST"])
@permission_classes([AllowAny])
def create_code(request):
	phone_number = request.data["phone_number"]
	try:
		return Response({"code":send_message(phone_number)})
	except	ValueError as e:
		return Response(data={"error":e.__str__()},status=400)

@swagger_auto_schema(method="POST",
	tags=["ResetPassword"],
	response={"200":int},request_body=openapi.Schema(
	type=openapi.TYPE_OBJECT, 
    properties={
        'code': openapi.Schema(type=openapi.TYPE_STRING, description='string'),
        'phone_number': openapi.Schema(type=openapi.TYPE_STRING, description='09111111111'),
    },
))
@api_view(["POST"])
@permission_classes([AllowAny])
def is_valid(request):
	code = request.data["code"]
	phone_number= request.data["phone_number"]
	print(request.data,code)
	try:
		check_sso_is_valid(phone_number,code)
		return   Response(status=201)
	except	ValueError as e:
		return Response(data={"error":e.__str__()},status=400)
	except KeyError as e:
		return Response(data={"error":e.__str__()},status=400)
@swagger_auto_schema(method="POST",
	tags=["ResetPassword"],
	response={"200":int},request_body=openapi.Schema(
	type=openapi.TYPE_OBJECT, 
    properties={
        'password': openapi.Schema(type=openapi.TYPE_STRING, description='string'),
        'confirmation': openapi.Schema(type=openapi.TYPE_STRING, description='string'),
        'phone_number': openapi.Schema(type=openapi.TYPE_STRING, description='09111111111'),
    },
))
@api_view(["POST"])
@permission_classes([AllowAny])
def reset_password(request):
	passoword = request.data["password"]
	phoneNumber = request.data["phone_number"]
	pattern =r"^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
	if(re.match(pattern,passoword)):
		user = 	 User.objects.get(phone_number=phoneNumber)
		if user is None:
			return  Response(status=500)
		if user.reset_password:
			user.set_password(passoword)
			user.save()
			return Response(status=201)
		return Response(data={"error":"کاربر نمیتواند رمز عبور رو عوض  کند"},status=400)
	else:
		return Response(data={"error":"پسورد ضعیف است"},status=400)
@api_view(["Post"])
@permission_classes([AllowAny])
@swagger_auto_schema(method="POST",
	tags=["ResetPassword"],
	response={"200":int},request_body=openapi.Schema(
	type=openapi.TYPE_OBJECT, 
    properties={
        'phone_number': openapi.Schema(type=openapi.TYPE_STRING, description='09111111111'),
        'email': openapi.Schema(type=openapi.TYPE_STRING, description='mail@example.com'),
        'username': openapi.Schema(type=openapi.TYPE_STRING, description='string'),
        'password': openapi.Schema(type=openapi.TYPE_STRING, description='string'),
    },
))
def register(request):
	phone_number=request.data['phone_number']
	email=request.data['email']
	username=request.data['username']
	password=request.data['password']
	try:
		User.objects.create_user(phone_number=phone_number,username=username,password=password,email=email)
		return Response(status=201)
	except Exception as e:
		return Response({"error":str(e)},status=400)