from rest_framework.serializers import BaseSerializer,CharField


class create_codeSerilizer(BaseSerializer):
	phone_number = CharField()
class reset_passwordSerializer(BaseSerializer):
	password = CharField()
	confirmation = CharField()
	phonenumber=CharField()
class is_validSerializer(BaseSerializer):
	code = CharField()