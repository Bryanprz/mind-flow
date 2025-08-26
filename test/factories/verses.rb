FactoryBot.define do
  factory :verse do
    book { nil }
    verse_number { 1 }
    text_header { "MyString" }
    text { "MyText" }
    chapter_title { "MyString" }
    chapter { 1 }
    page_number { 1 }
  end
end
