json.extract! chronic_illness, :id, :name, :sanskrit_name, :icon, :color, :created_at, :updated_at
json.allo_description chronic_illness.allo_description.to_s
json.ayu_description chronic_illness.ayu_description.to_s
json.disease_evolution chronic_illness.disease_evolution.to_s
json.effect_on_doshas chronic_illness.effect_on_doshas.to_s
json.causative_factors chronic_illness.causative_factors.to_s
json.manifestation chronic_illness.manifestation.to_s
json.url chronic_illness_url(chronic_illness, format: :json)
