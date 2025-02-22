from rest_framework import serializers 
from .models import User,userRoles
from .permision import Permisions,andbytes,orbytes
from django.shortcuts import  get_object_or_404


class UserMappingSerilizer(serializers.Serializer):
	roles = serializers.SerializerMethodField()
	name = serializers.CharField()
	def get_roles(self,obj):
		permisions_list = []
		if(obj.userRole):
			for perm in Permisions:
					if andbytes(perm.value,obj.userRole)==perm.value:
						permisions_list.append(perm.name)
			return ",".join(permisions_list)
		return ""
class create_codeSerilizer(serializers.BaseSerializer):
	phone_number = serializers.CharField()

class reset_passwordSerializer(serializers.BaseSerializer):
	password = serializers.CharField()
	confirmation = serializers.CharField()
	phonenumber=serializers.CharField()

class is_validSerializer(serializers.BaseSerializer):
	code = serializers.CharField()

class  registerSerilizer(serializers.Serializer):
	username =serializers.CharField(allow_blank=True)
	phone_number = serializers.CharField(allow_blank=True)
	email = serializers.EmailField(allow_blank=True)	
	password = serializers.CharField(allow_blank=True)
	is_superuser = serializers.BooleanField()
	roleName = serializers.CharField()
	def update(self, instance, validated_data):
		for k,v in validated_data.items():
			if(k=="password"):
				instance.set_password(v)
			elif(k =="roleName"):
				ur = get_object_or_404(userRoles,name=v)
				setattr(instance,"role",ur.userRole)
			else:
				setattr(instance,k,v)
		instance.save()
	def create(self, validated_data):
		permision = userRoles.objects.filter(name=validated_data.get("roleName",None)).first().userRole
		if validated_data["is_superuser"]:
			return User.objects.create_superuser(username=validated_data["username"],password=validated_data["password"]
										,email=validated_data["email"],phone_number=validated_data["phone_number"],
										role=permision)
		else:
			return User.objects.create_user(username=validated_data["username"],password=validated_data["password"]
										,email=validated_data["email"],phone_number=validated_data["phone_number"],
										role=permision)
class UserSerilizer(serializers.ModelSerializer):
	role = serializers.SerializerMethodField()
	def get_role(self,obj):
		permisions_list = []
		if(obj.role):
			for perm in Permisions:
					if andbytes(perm.value,obj.role)==perm.value:
						permisions_list.append(perm.name)
			return ",".join(permisions_list)
		return ""
	class Meta:
		fields = ["email","username","is_superuser","is_staff","is_active","is_verified","phone_number","created_date","updated_date","role"]
		model = User

