from rest_framework import serializers 
from .models import User


class create_codeSerilizer(serializers.BaseSerializer):
	phone_number = serializers.CharField()
class reset_passwordSerializer(serializers.BaseSerializer):
	password = serializers.CharField()
	confirmation = serializers.CharField()
	phonenumber=serializers.CharField()
class is_validSerializer(serializers.BaseSerializer):
	code = serializers.CharField()

class  registerSerilizer(serializers.Serializer):
	username =serializers.CharField()
	firstname = serializers.CharField()
	lastname= serializers.CharField()
	email = serializers.EmailField()	
	password = serializers.CharField()
	is_admin = serializers.BooleanField()
	def create(self, validated_data):
		if validated_data["is_admin"]:
			return User.objects.create_superuser(username=validated_data["username"],password=validated_data["password"],first_name=validated_data["firstname"],last_name=validated_data["lastname"],email=validated_data["email"])
		else:
			return User.objects.create_user(username=validated_data["username"],password=validated_data["password"],first_name=validated_data["firstname"],last_name=validated_data["lastname"],email=validated_data["email"])

class UserSerilizer(serializers.Serializer):
	username =serializers.CharField()
	firstname = serializers.CharField
	lastname= serializers.CharField()
	is_admin = serializers.BooleanField()