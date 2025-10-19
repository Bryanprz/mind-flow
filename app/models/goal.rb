class Goal < ApplicationRecord
  belongs_to :user
  
  enum :status, { active: 0, completed: 1, cancelled: 2 }
  
  validates :title, presence: true
  validates :target, presence: true, numericality: { greater_than: 0 }
  validates :progress, numericality: { greater_than_or_equal_to: 0 }
  
  validate :progress_not_greater_than_target
  
  scope :active, -> { where(status: :active).order(deadline: :asc) }
  scope :completed, -> { where(status: :completed).order(updated_at: :desc) }
  scope :by_category, ->(category) { where(category: category) }
  
  # Calculate progress percentage
  def progress_percentage
    return 0 if target.zero?
    ((progress.to_f / target) * 100).round
  end
  
  # Check if goal is completed
  def completed?
    progress >= target
  end
  
  # Auto-complete goal if progress reaches target
  def auto_complete!
    update(status: :completed) if completed? && active?
  end
  
  # Check if goal is overdue
  def overdue?
    deadline.present? && deadline < Date.current && active?
  end
  
  # Days until deadline
  def days_until_deadline
    return nil unless deadline
    (deadline - Date.current).to_i
  end
  
  private
  
  def progress_not_greater_than_target
    if progress.present? && target.present? && progress > target
      errors.add(:progress, "cannot be greater than target")
    end
  end
end
