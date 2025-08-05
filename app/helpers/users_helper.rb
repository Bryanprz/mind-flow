module UsersHelper
  def render_symptom_badges(symptoms)
    symptoms.map do |symptom|
      content_tag(:span, symptom, class: "badge badge-sm badge-error mr-2 mb-2 cursor-pointer transition")
    end.join.html_safe
  end
end
