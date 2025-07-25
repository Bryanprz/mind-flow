class AddContraindicationToCures < ActiveRecord::Migration[8.0]
  def change
    add_column :cures, :contraindication, :text
  end
end
