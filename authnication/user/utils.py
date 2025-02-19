from random import choices
from .models import User
import requests
import os
USER = os.getenv("TSMS_USER")
PASS = os.getenv("TSMS_PASS")
FROM = os.getenv("TSMS_FROM")
phoneNumber_singelton = {}
def genrate_random_digit(k:int):
	return "".join(choices("0123456789",k=k))

def send_message(number:str):
	user = User.objects.filter(phone_number=number)
	if(user == None):
		raise ValueError("کاربری با همچین شماره همراهی موحود نیست")
	random =  genrate_random_digit(5)
	phoneNumber_singelton[number] =random
	message = f"""
		کد تایید تلفن همراه شما 
			{random}
	"""
	response = requests.get(f"http://tsms.ir/url/tsmshttp.php?from={FROM}&to={number}&username={USER}&password={PASS}&message={message}")
	return response.text

def check_sso_is_valid(phone_number:str,sso:str):
	if("@" in phone_number):
		user:User | None = User.objects.get(email=phone_number)
	else:
		user:User | None = User.objects.get(phone_number=phone_number)
	if(user == None):
		raise ValueError("کاربری با همچین شماره همراهی موحود نیست")
	if phone_number in phoneNumber_singelton:
		if sso != phoneNumber_singelton[phone_number]:
			raise ValueError("کد پیامکی وارد شده اشتباه است!")
	else :
		raise KeyError("شماره همراه واردی اشتباه ثبت شده است!")