from rest_framework import serializers 
from .models import User,UserMapping
from .permision import Permisions,andbytes,orbytes


class UserMappingSerilizer(serializers.Serializer):
	permision_bit = serializers.SerializerMethodField()
	name = serializers.CharField()
	def get_permision_bit(self,obj):
		permisions_list = []
		if(obj.permision_bit):
			for perm in Permisions:
					if andbytes(perm.value,obj.permision_bit)==perm.value:
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
	permision_bit = serializers.CharField()
	def update(self, instance, validated_data):
		for k,v in validated_data.items():
			if(k=="password"):
				instance.set_password(v)
			if(k =="permision_bit"):
				perms = v.split(",")
				base_perms = b"000000000"
				print(perms)
				for perm in perms:
					perm = getattr(Permisions,perm)
					base_perms = orbytes(base_perms,perm.value)
					print(perm.value,base_perms)
				setattr(instance,k,base_perms)
			else:
				setattr(instance,k,v)
		print(instance.username,instance.email,instance.permision_bit)
		instance.save()
	def create(self, validated_data):
		
		print(validated_data.get("permision_bit",None))
		permision = UserMapping.objects.filter(name=validated_data.get("permision_bit",None)).first().permision_bit
		if validated_data["is_superuser"]:
			return User.objects.create_superuser(username=validated_data["username"],password=validated_data["password"]
										,email=validated_data["email"],phone_number=validated_data["phone_number"],
										permision_bit=permision)
		else:
			return User.objects.create_user(username=validated_data["username"],password=validated_data["password"]
										,email=validated_data["email"],phone_number=validated_data["phone_number"],
										permision_bit=permision)
class UserSerilizer(serializers.ModelSerializer):
	permision_bit = serializers.SerializerMethodField()
	def get_permision_bit(self,obj):
		permisions_list = []
		if(obj.permision_bit):
			for perm in Permisions:
					if andbytes(perm.value,obj.permision_bit)==perm.value:
						permisions_list.append(perm.name)
			return ",".join(permisions_list)
		return ""
	class Meta:
		fields = ["email","username","is_superuser","is_staff","is_active","is_verified","phone_number","created_date","updated_date","permision_bit"]
		model = User

