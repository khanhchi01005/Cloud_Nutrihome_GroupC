from .AI_services import get_simple_family_meal

def AI_generate_family_meal(family_id, start_date=None, end_date=None, available_ingredients=None):
    get_simple_family_meal(family_id, start_date=start_date, end_date=end_date, available_ingredients=available_ingredients)
