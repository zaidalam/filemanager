# Generated by Django 4.0.2 on 2022-03-04 09:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='file',
            name='downloads',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
    ]