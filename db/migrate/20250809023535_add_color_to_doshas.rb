class AddColorToDoshas < ActiveRecord::Migration[8.0]
  def change
    add_column :doshas, :color, :string
  end
end
