# Generated by Django 5.1.4 on 2025-02-21 13:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0003_alter_user_permision_bit'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserMapping',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('permision_bit', models.BinaryField()),
            ],
        ),
    ]
