from rest_framework.decorators import api_view,permission_classes
from rest_framework.viewsets import  ModelViewSet
from rest_framework.permissions import AllowAny
from django.core.mail import send_mail
from .permision import perimision_dict
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .utils import send_message,check_sso_is_valid,genrate_random_digit
from .models import User,userRoles
from .serilaizers import *
from rest_framework.response import Response
from .permision import Permisions
from drf_yasg.utils import swagger_auto_schema
from drf_yasg  import openapi
import re
from django.db.utils import IntegrityError
import traceback


@api_view(["GET"])
@permission_classes([AllowAny])
def get_permistion(request):
	return Response({"permision":[{m.name:v} for m,v in perimision_dict.items()]})

@swagger_auto_schema(method="POST",
	tags=["login"],
	response={"200":int},request_body=openapi.Schema(
	type=openapi.TYPE_OBJECT, 
    properties={
        'username': openapi.Schema(type=openapi.TYPE_STRING, description='09111111111'),
        'password': openapi.Schema(type=openapi.TYPE_STRING, description='a@example.com'),
    },
))
@api_view(["POST"])
@permission_classes([AllowAny])
def get_token(reqeuest):
	username =reqeuest.data["username"]
	password =reqeuest.data["password"]
	user = authenticate(username=username,password=password)
	if user==None:
		return Response(status=404) 
	refresh = RefreshToken.for_user(user)

	permission = { }
	def andbytes(abytes, bbytes):
		return bytes([a & b for a, b in zip(abytes[::-1], bbytes[::-1])][::-1])
	for p in Permisions:
		if user.role and andbytes(p.value,user.role) == p.value:
			permission[p.name] = True
		else:
			permission[p.name] = False
	permission.update({
		'refresh': str(refresh),
		'access': str(refresh.access_token),
	})
	return Response(permission)
	
@swagger_auto_schema(method="POST",
	tags=["ResetPassword"],
	response={"200":int},request_body=openapi.Schema(
	type=openapi.TYPE_OBJECT, 
    properties={
        'email': openapi.Schema(type=openapi.TYPE_STRING, description='string'),
        'phone_number': openapi.Schema(type=openapi.TYPE_STRING, description='09111111111'),
    }
	))
@api_view(["POST"])
@permission_classes([AllowAny])
def create_code(request):
	phone_number = request.data.get("phone_number",None)
	email= request.data.get("email",None)
	try:
		if email:
			code = genrate_random_digit(5)
			try:
				send_mail("احراز هویت کد",f"کد تاییدی شما {code}",from_email="test4@nopc.co",recipient_list=[email],fail_silently=False)
			except Exception as e:
				return Response({"error":str(e)},status=400)
			return Response({"code":code})
		else:
			return Response({"code":send_message(phone_number)})
	except	ValueError as e:
		return Response(data={"error":e.__str__()},status=400)

@swagger_auto_schema(method="POST",
	tags=["ResetPassword"],
	response={"200":int},request_body=openapi.Schema(
	type=openapi.TYPE_OBJECT, 
	required=[],
    properties={
        'code': openapi.Schema(type=openapi.TYPE_STRING, description='string'),
        'phone_number':openapi.Schema(type=openapi.TYPE_STRING, description='string'),
		'email': openapi.Schema(type=openapi.TYPE_STRING, description='string'),
    },
))
@api_view(["POST"])
@permission_classes([AllowAny])
def is_valid(request):
	code = request.data.get("code",None)
	phone_number= request.data.get("phone_number",None)
	mail= request.data.get("mail",None)
	try:
		if(mail):
			check_sso_is_valid(mail,code)
			return   Response(status=201)
		check_sso_is_valid(phone_number,code)
		return   Response(status=201)
	except	ValueError as e:
		return Response(data={"error":"کاربر یافت نشد"},status=404)
	except KeyError as e:
		return Response(data={"error":"ایمیل  یا شماره واردی اشتباه ثبت نشده"},status=400)

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
			user.reset_password = False
			user.save()
			return Response(status=201)
		return Response(data={"error":"کاربر نمیتواند رمز عبور رو عوض  کند"},status=400)
	else:
		return Response(data={"error":"پسورد ضعیف است"},status=400)

@swagger_auto_schema(method="POST",response={"200":UserSerilizer},request_body=registerSerilizer)
@swagger_auto_schema(method="PUT",response={"200":UserSerilizer},request_body=registerSerilizer)
@swagger_auto_schema(method="DELETE",request_body=openapi.Schema(
	type=openapi.TYPE_OBJECT, 
    properties={
        'username': openapi.Schema(type=openapi.TYPE_STRING, description='string'),
    },
))
@api_view(["PUT","DELETE","GET","POST"])
def userPatch(request):
	if(request.method =="POST"):
		pattern = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#!*^$@&]).{8,}$"
		if (re.match(pattern,request.data["password"]) is None):
			return Response({"Error":"Password is weak"},400)
		registerData =registerSerilizer(data=request.data)
		if registerData.is_valid():
			try:
				registerData.save()
			except IntegrityError:
				return Response({"username":"user with this username aleady exist"})
			return Response(status=201)
		else:
			return Response(registerData.errors,status=400)
	if(request.method =="PUT"):
		user= User.objects.get(username=request.data["username"])
		if(user):
			validated_data = registerSerilizer(data=request.data)
			try:
				if(validated_data.is_valid()):
					current_password = validated_data.data["current_password"]
					targetUser = authenticate(username=request.user.username,password=current_password)
					if(targetUser==None):
						return Response(status=400,)
					if(targetUser.is_superuser or user==targetUser):
						validated_data.update(user,validated_data.validated_data)
						return Response(status=201)
					else:
						return Response(status=400,data={"error":"User is not admin nor the current user"})
				else:
					return Response({"error":validated_data.errors},status=400)
			except Exception as e:
				print(traceback.format_exc())
				return Response({"error":e.__str__()} )
		return  Response(status=400)
	elif(request.method=="GET"):
		users = request.user
		if users.is_anonymous:
			return Response(status=404)
		if(request.user.is_staff ==True):
			users  =User.objects.all()
			serializer = UserSerilizer(users,many=True)
			return Response(serializer.data)
		serializer = UserSerilizer(request.user,many=True)
		return  Response(serializer.data)
	elif (request.method=="DELETE"):
		user= User.objects.get(username=request.data["username"])
		if(user):
			user.delete()
			return   Response(status=201)
		return  Response(status=400)
	return Response(status=403)



class UserMappinView(ModelViewSet):
	queryset = userRoles.objects.all()
	serializer_class = UserMappingSerilizer
	lookup_field = "name"
	@swagger_auto_schema(
		operation_description="PUT /userPermisions/{name}/"	,
			request_body=openapi.Schema(
		type=openapi.TYPE_OBJECT, 
		properties={
			'name': openapi.Schema(type=openapi.TYPE_STRING, description='string'),
			'roles': openapi.Schema(type=openapi.TYPE_STRING, description='string'),
		},
	))
	def update(self, request, *args, **kwargs):
		permNames  = self.request.data.get("roles")
		userRole = self.get_object()
		if(userRole is None):
			return Response(status=404)
		userRole.name = self.request.data.get("name")
		permisionNames=[]
		if permNames:
			perms = permNames.split(",")
			base_perms = b"000000000"
			for p in perms:
				perm = getattr(Permisions,p)
				base_perms = orbytes(base_perms,perm.value)
				permisionNames.append(perm.name)
			userRole.userRole = base_perms
		userRole.name = self.request.data.get("name")
		userRole.save()
		return Response(status=201)
	@swagger_auto_schema(request_body=openapi.Schema(
		type=openapi.TYPE_OBJECT, 
		properties={
			'name': openapi.Schema(type=openapi.TYPE_STRING, description='string'),
			'roles': openapi.Schema(type=openapi.TYPE_STRING, description='string'),
		},
	))
	def create(self, request, *args, **kwargs):
		permData = self.request.data.get("roles",None)
		name = self.request.data.get("name",None)
		permisionNames = []
		if permData and len(permData)!=0:
			perms = permData.split(",")
			base_perms = b"000000000"
			for p in perms:
				perm = getattr(Permisions,p)
				base_perms = orbytes(base_perms,perm.value)
				permisionNames.append(perm.name)
			userRoles.objects.create(userRole=base_perms,name=name)
			return Response({"name":name,"permisions":permisionNames})
		userRoles.objects.create(userRole=b"000000000",name=name)
		return Response({"name":name,"permisions":""})
	def get_object(self):
		return self.queryset.filter(name=self.kwargs["name"]).first()
	def destroy(self, request, *args, **kwargs):
		self.get_object().delete()
		return Response(status=204)
		
		