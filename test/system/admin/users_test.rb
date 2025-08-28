require "application_system_test_case"

class Admin::UsersTest < ApplicationSystemTestCase
  setup do
    @admin_user = admin_users(:one)
  end

  test "visiting the index" do
    visit admin_users_url
    assert_selector "h1", text: "Users"
  end

  test "should create user" do
    visit admin_users_url
    click_on "New user"

    click_on "Create User"

    assert_text "User was successfully created"
    click_on "Back"
  end

  test "should update User" do
    visit admin_user_url(@admin_user)
    click_on "Edit this user", match: :first

    click_on "Update User"

    assert_text "User was successfully updated"
    click_on "Back"
  end

  test "should destroy User" do
    visit admin_user_url(@admin_user)
    click_on "Destroy this user", match: :first

    assert_text "User was successfully destroyed"
  end
end
