require "test_helper"

class SocialPostsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get social_posts_index_url
    assert_response :success
  end

  test "should get create" do
    get social_posts_create_url
    assert_response :success
  end
end
