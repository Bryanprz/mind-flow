class CreateChronicIllnessChannelSystems < ActiveRecord::Migration[8.0]
  def change
    create_table :chronic_illness_channel_systems do |t|
      t.references :chronic_illness, null: false, foreign_key: true
      t.references :channel_system, null: false, foreign_key: true
      t.string :description

      t.timestamps
    end
  end
end
