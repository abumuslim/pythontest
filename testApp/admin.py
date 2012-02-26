
from django.contrib import admin
from Test.testApp.models import User

class UserAdmin(admin.ModelAdmin):
    fieldsets = \
    [
        ('Username', {'fields':['username']}),
        ('Password', {'fields':['password']})
    ]

admin.site.register(User, UserAdmin)