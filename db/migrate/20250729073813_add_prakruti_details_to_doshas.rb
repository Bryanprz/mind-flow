class AddPrakrutiDetailsToDoshas < ActiveRecord::Migration[8.0]
  def change
    add_column :doshas, :archetype_info, :jsonb
    add_column :doshas, :people_manifestation, :jsonb
  end
end
