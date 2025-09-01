require 'csv'

class BooksImporter
  def initialize
    @file_path = Rails.root.join('data', 'caraka_samhita_verses.csv')
  end

  def call
    book = Book.find_or_initialize_by(title: "Charaka Samhita")
    book.category = 'classical'
    book.save!

    # Ensure all operations are atomic: if one fails, all are rolled back.
    ActiveRecord::Base.transaction do
      CSV.foreach(@file_path, headers: true) do |row|
        Verse.create!(
          book: book,
          verse_number: row['verse_number'],
          text_header: row['text_header'],
          text: row['text'],
          chapter_title: row['chapter_title'],
          chapter: row['chapter'],
          page_number: row['page_number'],
        )
      end

      puts "Successfully imported all data from #{@file_path}."
    end
  rescue ActiveRecord::RecordInvalid => e
    puts "Import failed due to validation error: #{e.message}. All changes rolled back."
    puts "Please check your CSV data for invalid entries."
  rescue StandardError => e
    puts "Import failed due to an unexpected error: #{e.message}. All changes rolled back."
    puts "Please check the CSV file format or the import logic."
  end
end
