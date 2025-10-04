class AddColorToChronicIllnesses < ActiveRecord::Migration[8.0]
  def change
    add_column :chronic_illnesses, :color, :string
  end
end
