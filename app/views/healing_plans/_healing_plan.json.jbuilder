json.extract! healing_plan, :id, :user_id, :name, :description, :created_at, :updated_at
json.url healing_plan_url(healing_plan, format: :json)
