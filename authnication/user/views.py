from rest_framework.decorators import api_view,permission_classes
from rest_framework.viewsets import  ModelViewSet
from rest_framework.permissions import AllowAny
from django.core.mail import send_mail
from .permision import perimision_dict
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .utils import send_message,check_sso_is_valid,genrate_random_digit
from .models import User,UserMapping
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
	tags=["ResetPassword"],
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
		if andbytes(p.value,user.permision_bit) == p.value:
			permission[p.name] = True
		else:
			permission[p.name] = False
	print(permission)
	permission.update({
		'refresh': str(refresh),
        'access': str(refresh.access_token),
	}
	)

	return Response(permission)
	
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
    properties={
        'code': openapi.Schema(type=openapi.TYPE_STRING, description='string'),
        'phone_number': openapi.Schema(type=openapi.TYPE_STRING, description='09111111111'),
    },
))
@api_view(["POST"])
@permission_classes([AllowAny])
def is_valid(request):
	code = request.data.get("code",None)
	phone_number= request.data("phone_number",None)
	mail= request.data["mail"]
	try:
		if(mail):
			check_sso_is_valid(mail,code)
			return   Response(status=201)
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

@swagger_auto_schema(method="POST",response={"200":UserSerilizer},request_body=registerSerilizer)
@api_view(["POST"])
def register(request):
	pattern = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[*^$&]).{8,}$"
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
@swagger_auto_schema(method="PATCH",response={"200":UserSerilizer},request_body=registerSerilizer)
@swagger_auto_schema(method="DELETE",request_body=openapi.Schema(
	type=openapi.TYPE_OBJECT, 
    properties={
        'username': openapi.Schema(type=openapi.TYPE_STRING, description='string'),
    },
))
@api_view(["PATCH","DELETE","GET"])
def userPatch(request):
	if(request.method =="PATCH"):
		user= User.objects.get(username=request.data["username"])
		if(user):
			validated_data = registerSerilizer(data=request.data)
			try:
				if(validated_data.is_valid()):
					validated_data.update(user,validated_data.validated_data)
					return Response(status=201)
				else:
					return Response({"error":validated_data.errors},status=400)
			except Exception as e:
				print(traceback.format_exc())
				return Response({"error":e.__str__()} )
		return  Response(status=400)
	elif(request.method=="GET"):
		if(request.user.is_staff ==True):
			users  =User.objects.all()
			serializer = UserSerilizer(users,many=True)
			return Response(serializer.data)
		return  Response(request.user)
	elif (request.method=="DELETE"):
		user= User.objects.get(username=request.data["username"])
		if(user):
			user.delete()
			return   Response(status=201)
		return  Response(status=400)
	return Response(status=403)
class UserMappinView(ModelViewSet):
	queryset = UserMapping.objects.all()
	serializer_class = UserMappingSerilizer
	lookup_field = "name"
	@swagger_auto_schema(request_body=openapi.Schema(
		type=openapi.TYPE_OBJECT, 
		properties={
			'name': openapi.Schema(type=openapi.TYPE_STRING, description='string'),
			'permision_bit': openapi.Schema(type=openapi.TYPE_STRING, description='string'),
		},
	))
	def create(self, request, *args, **kwargs):
		permData = self.request.data.get("permision_bit",None)
		name = self.request.data.get("name",None)
		permisionNames = []
		if permData:
			perms = permData.split(",")
			base_perms = b"000000000"
			for p in perms:
				perm = getattr(Permisions,p)
				base_perms = orbytes(base_perms,perm.value)
				print(base_perms,perm.name,perm.value,orbytes(base_perms,perm.value))
				permisionNames.append(perm.name)
			print(base_perms)
			UserMapping.objects.create(permision_bit=base_perms,name=name)
			return Response({"name":name,"permisions":permisionNames})
		return Response(status=404)
	def get_object(self):
		print(self.queryset)
		return self.queryset.filter(name=self.kwargs["name"])
	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		for i in instance:
			i.delete()
		return Response(status=204)
		
		