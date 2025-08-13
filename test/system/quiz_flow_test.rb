require "application_system_test_case"

class QuizFlowTest < ApplicationSystemTestCase
  include ActionView::RecordIdentifier
  
  setup do
    # Create a quiz with questions and options
    @quiz = create(:quiz, category: :prakruti)
    
    # Create 7 questions with options
    7.times do |i|
      question = create(:question, quiz: @quiz, text: "Question #{i+1}")
      
      # Create 3 options for each question
      ["Vata", "Pitta", "Kapha"].each_with_index do |dosha, index|
        create(:"quiz_option_#{dosha.downcase}", 
               question: question, 
               text: "#{dosha} Option #{index+1}")
      end
    end
    
    # Create doshas
    create(:dosha, name: 'Vata', color: 'blue')
    create(:dosha, name: 'Pitta', color: 'red')
    create(:dosha, name: 'Kapha', color: 'green')
  end
  
  test "complete quiz flow with results" do
    # Enable verbose logging for the test
    Capybara.server = :puma, { Silent: false }
    
    # Start the quiz
    visit root_path
    
    # Wait for the page to load
    assert_selector "h1", text: /Welcome to natureHealer/
    
    # Start the quiz by clicking the button
    click_on "Get started"
    
    # Wait for the first question to load
    assert_selector "h2", text: /Question 1/, wait: 10
    
    # Answer all questions
    7.times do |i|
      question_num = i + 1
      
      # Wait for the question to be visible
      assert_selector "h2", text: /Question #{question_num}/, wait: 5
      
      # Find the quiz question form (the one with data-controller="quiz-question")
      form = find('form[data-controller="quiz-question"]')
      
      # Get the quiz entry ID and question ID from hidden fields
      quiz_entry_id = form.find('input[name="quiz_entry_id"]', visible: false).value
      question_id = form.find('input[name="question_id"]', visible: false).value
      
      # Get all radio buttons and select the first one
      radio_buttons = all('input[type="radio"]', visible: :all)
      first_radio = radio_buttons.first
      first_radio_id = first_radio['id']
      first_radio_value = first_radio.value
      
      puts "\nAnswering question #{question_num} with option: #{first_radio_value}"
      
      # Debug: Print the radio button and its parent elements
      puts "Radio button HTML:"
      puts first_radio.native.attribute('outerHTML')
      
      # Find the parent label element
      parent_label = first_radio.find(:xpath, "./ancestor::label[contains(@class, 'block')]")
      puts "Parent label found: #{parent_label.present?}"
      
      # Click the parent label to select the radio button
      parent_label.click
      
      # Verify the radio button is checked
      is_checked = evaluate_script("document.getElementById('#{first_radio_id}').checked")
      puts "Radio button checked: #{is_checked}"
      
      # Log the form data being submitted
      puts "\nSubmitting form with:"
      puts "  quiz_entry_id: #{quiz_entry_id}"
      puts "  question_id: #{question_id}"
      puts "  quiz_option_id: #{first_radio_value}"
      
      # Find the quiz form again to avoid staleness
      form = find('form[data-controller="quiz-question"]')
      
      # Submit the form using the form's submit button
      begin
        within(form) do
          # Try to find and click the submit button
          submit_button = find('button[type="submit"], input[type="submit"]', match: :first, visible: :all) rescue nil
          if submit_button
            submit_button.click
          else
            # If no explicit submit button, try to submit the form directly
            form.execute_script("this.submit()")
          end
        end
      rescue => e
        puts "Error submitting form: #{e.message}"
        # As a fallback, use JavaScript to submit the first form
        page.execute_script("document.querySelector('form[data-controller=\"quiz-question\"]').submit()")
      end
      
      # Wait for the Turbo Stream to update the page
      begin
        if question_num < 7
          puts "Waiting for question #{question_num + 1}..."
          assert_selector "h2", text: /Question #{question_num + 1}/, wait: 10
        else
          puts "Waiting for results page..."
          assert_selector "h1", text: /Results/, wait: 10
        end
      rescue => e
        puts "\nError after submitting question #{question_num}:"
        puts "Current URL: #{current_url}"
        puts "Page title: #{page.title}"
        puts "Page source:"
        puts page.html
        
        # Take a screenshot for debugging
        timestamp = Time.now.strftime("%Y%m%d_%H%M%S")
        page.save_screenshot("tmp/capybara/error_#{timestamp}.png")
        puts "Screenshot saved to tmp/capybara/error_#{timestamp}.png"
        
        raise e
      end
      
      # Add a small delay between questions
      sleep 0.5
    end
    
    # Verify results page
    assert_selector "h1", text: /Results/, wait: 10
    assert_text /Your dominant dosha is (Vata|Pitta|Kapha)/
  end
end
