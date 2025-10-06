class AddColumnsToChronicIllnesses < ActiveRecord::Migration[8.0]
  def change
    add_column :chronic_illnesses, :sanskrit_name, :string
    rename_column :chronic_illnesses, :description, :allo_description
    add_column :chronic_illnesses, :ayu_description, :text
    add_column :chronic_illnesses, :disease_evolution, :text
    add_column :chronic_illnesses, :effect_on_doshas, :text
    add_column :chronic_illnesses, :causative_factors, :text
    add_column :chronic_illnesses, :manifestation, :text
  end
end
