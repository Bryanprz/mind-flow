class QuizEntry < ApplicationRecord
  belongs_to :quiz
  belongs_to :user, optional: true
  has_many :quiz_answers, dependent: :destroy

  # Scopes
  scope :completed, -> { where.not(completed_at: nil) }
  scope :incomplete, -> { where(completed_at: nil) }

  # This is the main method for calculating quiz results.
  # It tallies scores based on the selected quiz options' dosha enum.
  def calculate_primary_doshas
    # Step 1: Get all selected doshas for this quiz entry.
    selected_doshas = self.quiz_answers.joins(quiz_option: :question).pluck('quiz_options.dosha')

    # Step 2: Count the occurrences of each dosha.
    dosha_scores = { "Vata" => 0, "Pitta" => 0, "Kapha" => 0 }
    selected_doshas.each do |dosha_enum_value|
      case dosha_enum_value
      when 1 # Corresponds to 'vata'
        dosha_scores["Vata"] += 1
      when 2 # Corresponds to 'pitta'
        dosha_scores["Pitta"] += 1
      when 3 # Corresponds to 'kapha'
        dosha_scores["Kapha"] += 1
      end
    end

    # Step 3: Sort the doshas by score to find the primary and secondary.
    sorted_doshas = dosha_scores.sort_by { |_, score| -score }

    primary_dosha_name = sorted_doshas[0][0]
    secondary_dosha_name = sorted_doshas[1][0]

    # Step 4: Return the results.
    {
      primary_dosha: primary_dosha_name,
      secondary_dosha: secondary_dosha_name,
      scores: dosha_scores
    }
  end

  # Updates the user's prakruti (primary and secondary doshas)
  def update_user_prakruti!
    return unless user && completed_at?

    results = calculate_primary_doshas
    primary_dosha_name = results[:primary_dosha]
    secondary_dosha_name = results[:secondary_dosha]

    # Find the Dosha records from the database
    primary_dosha = Dosha.find_by(name: primary_dosha_name) if primary_dosha_name
    secondary_dosha = Dosha.find_by(name: secondary_dosha_name) if secondary_dosha_name

    # Update the user's prakruti
    user.update!(primary_dosha: primary_dosha, secondary_dosha: secondary_dosha)
  end
end
