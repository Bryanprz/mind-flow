class RemoveTextColumnsFromChronicIllnesses < ActiveRecord::Migration[8.0]
  def change
    remove_column :chronic_illnesses, :allo_description, :text
    remove_column :chronic_illnesses, :ayu_description, :text
    remove_column :chronic_illnesses, :disease_evolution, :text
    remove_column :chronic_illnesses, :effect_on_doshas, :text
    remove_column :chronic_illnesses, :causative_factors, :text
    remove_column :chronic_illnesses, :manifestation, :text
  end
end
