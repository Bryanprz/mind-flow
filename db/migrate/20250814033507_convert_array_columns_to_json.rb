class ConvertArrayColumnsToJson < ActiveRecord::Migration[8.0]
  def up
    # Since we've already loaded the schema with the correct column types,
    # we don't need to do anything in this migration.
    # The schema is already in the correct state.
  end
  
  def down
    # Revert cures table
    change_column :cures, :elements, :string, array: true, default: []
    change_column :cures, :recipes, :string, array: true, default: []
    
    # Revert foods table
    change_column :foods, :elements, :string, array: true, default: []
    change_column :foods, :recipes, :string, array: true, default: []
    
    # Revert diseases table
    change_column :diseases, :symptoms, :string, array: true, default: []
    change_column :diseases, :root_cause, :string, array: true, default: []
  end
end
