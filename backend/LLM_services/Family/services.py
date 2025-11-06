from .AI_services import get_simple_family_meal
from .AI_services import delete_family_weekly_menu

def AI_generate_family_meal(family_id):
    get_simple_family_meal(family_id)

def Delete_family_weekly_menu(family_id):
    delete_family_weekly_menu(family_id)
