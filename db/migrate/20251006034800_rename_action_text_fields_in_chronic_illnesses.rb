class RenameActionTextFieldsInChronicIllnesses < ActiveRecord::Migration[8.0]
  def up
    # Rename ActionText rich text fields
    ActionText::RichText.where(record_type: 'ChronicIllness', name: 'effect_on_doshas').update_all(name: 'effects')
    ActionText::RichText.where(record_type: 'ChronicIllness', name: 'causative_factors').update_all(name: 'causes')
  end

  def down
    # Revert the changes
    ActionText::RichText.where(record_type: 'ChronicIllness', name: 'effects').update_all(name: 'effect_on_doshas')
    ActionText::RichText.where(record_type: 'ChronicIllness', name: 'causes').update_all(name: 'causative_factors')
  end
end
