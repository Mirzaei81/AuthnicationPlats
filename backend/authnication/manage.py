#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

def run_seed():
    """ Seed database based on mode

    :param mode: refresh / clear 
    :return:
    """
    # Creating 15 addresses
    from user.models import userRoles
    admin =  userRoles.objects.get(name="Admin")
    anon =  userRoles.objects.get(name="ananymous")
    if admin==None :
        userRoles.objects.create(name="Admin",userRole=b"111111111")
    if anon==None:
        userRoles.objects.create(name="ananymous",userRole=b"000000000")

def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'authnication.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)
    run_seed()


if __name__ == '__main__':
    main()
