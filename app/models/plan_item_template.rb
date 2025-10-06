class PlanItemTemplate < ApplicationRecord
  belongs_to :plan_section_template
  has_rich_text :content
end