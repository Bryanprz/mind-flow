module HealthAssessmentsHelper
  def dosha_description(dosha_name)
    dosha_name = dosha_name.titleize
    {
      "Vata" => "Vata is the energy of movement, like wind, governing the nervous system, circulation, and creativity.",
      "Pitta" => "Pitta is the energy of transformation, like fire, driving digestion, metabolism, and sharp thinking.",
      "Kapha" => "Kapha is the energy of stability, like earth and water, providing strength, immunity, and calmness."
    }[dosha_name]
  end

  def render_dosha_bullet_points(dosha_name)
    bullet_points = case dosha_name.to_s.downcase
                    when 'vata'
                      [
                        "Governs movement, creativity, and the nervous system.",
                        "Prone to dryness, anxiety, and irregular routines.",
                        "Balances with warmth, routine, and grounding foods."
                      ]
                    when 'pitta'
                      [
                        "Controls digestion, metabolism, and intelligence.",
                        "Can be fiery, irritable, and intense under stress.",
                        "Finds harmony with cooling foods and a calm environment."
                      ]
                    when 'kapha'
                      [
                        "Provides stability, immunity, and structure.",
                        "May experience sluggishness, congestion, and attachment.",
                        "Thrives with stimulation, exercise, and light foods."
                      ]
                    else
                      []
                    end

    content_tag(:ul, class: "list-disc list-inside space-y-1") do
      safe_join(bullet_points.map { |point| content_tag(:li, point) })
    end
  end

  def render_dosha_in_balance_text(dosha_name)
    case dosha_name.to_s.downcase
    when 'vata'
      'When Vata is in balance, you feel creative, energetic, and enthusiastic. Your mind is clear, and you are adaptable and inspired.'
    when 'pitta'
      'When Pitta is in balance, you are intelligent, focused, and a strong leader. You have a sharp wit and a good appetite.'
    when 'kapha'
      'When Kapha is in balance, you are calm, loving, and compassionate. You feel strong, stable, and have a robust immune system.'
    else
      ''
    end
  end

  def render_dosha_out_of_balance_text(dosha_name)
    case dosha_name.to_s.downcase
    when 'vata'
      'When Vata is out of balance, you may experience anxiety, fear, and restlessness. You might have dry skin, constipation, and difficulty sleeping.'
    when 'pitta'
      'When Pitta is out of balance, you can become irritable, angry, and critical. You may suffer from indigestion, inflammation, and skin rashes.'
    when 'kapha'
      'When Kapha is out of balance, you may feel lethargic, possessive, and resistant to change. You might experience congestion, weight gain, and excessive sleep.'
    else
      ''
    end
  end
end
