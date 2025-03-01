from rest_framework import serializers 
from .models import User,userRoles
from .permision import Permisions,andbytes,orbytes,allowed_roles
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
	firstname =serializers.CharField(allow_blank=True) 
	lastname = serializers.CharField(allow_blank=True)
	username =serializers.CharField(allow_blank=True)
	phone_number = serializers.CharField(allow_blank=True)
	email = serializers.EmailField(allow_blank=True)	
	password = serializers.CharField(allow_blank=True)
	is_superuser = serializers.BooleanField()
	roleName = serializers.CharField()
	current_password = serializers.CharField()
	def update(self, instance, validated_data):
		for k,v in validated_data.items():
			if(k=="current_password"):
				continue
			if(k=="password"):
				instance.set_password(v)
			elif(k =="roleName"):
				ur = get_object_or_404(userRoles,name=v)
				userPermision = self.request.user.role
				for p in Permisions:
					if andbytes(p.value,userPermision)==p:
						for role in allowed_roles[p]:
							if andbytes(ur.userRole,role)!=role: #if the target role doesn't have permsion araise eror
								raise PermissionError
				setattr(instance,"role",ur.userRole)
			else:
				setattr(instance,k,v)
		instance.save()
	def create(self, validated_data):
		permision = userRoles.objects.filter(name=validated_data.get("roleName",None)).first().userRole
		userPermision = self.request.user.role
		for p in Permisions:
			if andbytes(p.value,userPermision)==p:
				for role in allowed_roles[p]:
					if andbytes(permision,role)!=role: #if the target role doesn't have permsion araise eror
						raise PermissionError

		if validated_data["is_superuser"]:
			return User.objects.create_superuser(username=validated_data["username"],password=validated_data["password"],
										firstname=validated_data["firstname"],
										lastname=validated_data["lastname"]
										,email=validated_data["email"],phone_number=validated_data["phone_number"],
										role=permision)
		else:
			return User.objects.create_user(username=validated_data["username"],password=validated_data["password"],
										firstname=validated_data["firstname"],
										lastname=validated_data["lastname"]
										,email=validated_data["email"],phone_number=validated_data["phone_number"],
										role=permision)
class UserSerilizer(serializers.ModelSerializer):
	role = serializers.SerializerMethodField()
	def get_role(self,obj):
		print(obj.role)
		ur = get_object_or_404(userRoles,userRole=obj.role)
		return  ur.name
	class Meta:
		fields = ["email","firstname","lastname","username","is_superuser","is_staff","is_active","is_verified","phone_number","created_date","updated_date","role"]
		model = User

