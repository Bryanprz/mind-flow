class RenamePlanItemTemplatePositionToOrdering < ActiveRecord::Migration[8.0]
  def change
    rename_column :plan_item_templates, :position, :ordering
  end
end
