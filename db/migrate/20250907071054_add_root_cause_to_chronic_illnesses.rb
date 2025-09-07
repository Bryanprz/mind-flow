class AddRootCauseToChronicIllnesses < ActiveRecord::Migration[8.0]
  def change
    add_column :chronic_illnesses, :root_cause, :text
  end
end
