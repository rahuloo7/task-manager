from django.urls import path
from rest_framework import routers

from .api import TaskViewSet
from .gemma_view import GemmaSuggestView

router = routers.DefaultRouter()
router.register('api/tasks', TaskViewSet, 'tasks')

urlpatterns = router.urls + [
    path('api/gemma/suggest/', GemmaSuggestView.as_view(), name='gemma-suggest'),
]