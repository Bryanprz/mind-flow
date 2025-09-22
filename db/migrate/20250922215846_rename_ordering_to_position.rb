class RenameOrderingToPosition < ActiveRecord::Migration[8.0]
  def change
    # Rename columns
    rename_column :plan_items, :ordering, :position
    rename_column :plan_item_templates, :ordering, :position
    rename_column :plan_sections, :ordering, :position
    rename_column :plan_section_templates, :ordering, :position

    # Update indexes if they exist
    remove_index :plan_items, name: 'index_plan_items_on_plan_section_id_and_ordering', if_exists: true
    add_index :plan_items, [:plan_section_id, :position], name: 'index_plan_items_on_plan_section_id_and_position'

    remove_index :plan_item_templates, name: 'index_plan_item_templates_on_plan_section_template_id_and_ordering', if_exists: true
    add_index :plan_item_templates, [:plan_section_template_id, :position], name: 'idx_plan_item_templates_on_section_and_position'

    remove_index :plan_sections, name: 'index_plan_sections_on_healing_plan_id_and_ordering', if_exists: true
    add_index :plan_sections, [:healing_plan_id, :position], name: 'index_plan_sections_on_healing_plan_id_and_position'

    remove_index :plan_section_templates, name: 'index_plan_section_templates_on_healing_plan_template_id_and_ordering', if_exists: true
    add_index :plan_section_templates, [:healing_plan_template_id, :position], name: 'idx_plan_section_templates_on_plan_and_position'
  end
end
