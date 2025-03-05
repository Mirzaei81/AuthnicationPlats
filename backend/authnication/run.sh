python manage.py migrate
gunicorn --workers=2 authnication.wsgi:application 