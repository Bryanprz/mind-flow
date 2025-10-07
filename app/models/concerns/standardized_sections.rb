module StandardizedSections
  extend ActiveSupport::Concern

  STANDARDIZED_SECTION_TITLES = [
    "Quick Wins",
    "Morning Routine", 
    "Midday Routine",
    "Evening Routine",
    "Dietary Guidelines",
    "Lifestyle Practices",
    "Herbal Remedies",
    "Mind-Body Connection",
    "Long-term Goals",
    "Advanced Practices",
    "Seasonal Adjustments",
    "Sustained Well-being",
    "Daily Practices",
    "Weekly Practices",
    "Monthly Goals"
  ].freeze

  class_methods do
    def standardized_section_titles
      STANDARDIZED_SECTION_TITLES
    end
  end
end
