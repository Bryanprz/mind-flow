json.extract! verse, :id, :book_id, :verse_number, :text_header, :text, :chapter_title, :chapter, :page_number, :created_at, :updated_at
json.url verse_url(verse, format: :json)
