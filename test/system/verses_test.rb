require "application_system_test_case"

class VersesTest < ApplicationSystemTestCase
  setup do
    @verse = verses(:one)
  end

  test "visiting the index" do
    visit verses_url
    assert_selector "h1", text: "Verses"
  end

  test "should create verse" do
    visit verses_url
    click_on "New verse"

    fill_in "Book", with: @verse.book_id
    fill_in "Chapter", with: @verse.chapter
    fill_in "Chapter title", with: @verse.chapter_title
    fill_in "Page number", with: @verse.page_number
    fill_in "Text", with: @verse.text
    fill_in "Text header", with: @verse.text_header
    fill_in "Verse number", with: @verse.verse_number
    click_on "Create Verse"

    assert_text "Verse was successfully created"
    click_on "Back"
  end

  test "should update Verse" do
    visit verse_url(@verse)
    click_on "Edit this verse", match: :first

    fill_in "Book", with: @verse.book_id
    fill_in "Chapter", with: @verse.chapter
    fill_in "Chapter title", with: @verse.chapter_title
    fill_in "Page number", with: @verse.page_number
    fill_in "Text", with: @verse.text
    fill_in "Text header", with: @verse.text_header
    fill_in "Verse number", with: @verse.verse_number
    click_on "Update Verse"

    assert_text "Verse was successfully updated"
    click_on "Back"
  end

  test "should destroy Verse" do
    visit verse_url(@verse)
    click_on "Destroy this verse", match: :first

    assert_text "Verse was successfully destroyed"
  end
end
