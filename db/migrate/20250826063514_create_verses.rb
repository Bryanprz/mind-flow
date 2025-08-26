class CreateVerses < ActiveRecord::Migration[8.0]
  def change
    create_table :verses do |t|
      t.references :book, null: false, foreign_key: true
      t.integer :verse_number
      t.string :text_header
      t.text :text
      t.string :chapter_title
      t.integer :chapter
      t.integer :page_number

      t.timestamps
    end
  end
end
