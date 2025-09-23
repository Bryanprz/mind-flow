class PlanItem < ApplicationRecord
  # Enable debug logging for this class
  cattr_accessor :debug_position_changes
  self.debug_position_changes = true

  acts_as_list scope: :plan_section,
               column: :position,
               top_of_list: 1,
               sequential_updates: true
  
  around_save :log_position_changes_around_save
  before_update :log_before_position_update, if: :will_save_change_to_position?
  after_save :log_after_position_update
  after_commit :log_after_commit
  
  private

  def log_position_changes_around_save
    if debug_position_changes
      Rails.logger.debug("[Position Debug] #{self.class}##{id || 'new'} - Starting save")
      Rails.logger.debug("[Position Debug]   Changes: #{saved_changes.inspect}")
      Rails.logger.debug("[Position Debug]   Position changing from: #{position_in_database}")
    end
    
    yield
    
    if debug_position_changes && persisted?
      Rails.logger.debug("[Position Debug] #{self.class}##{id} - After save")
      Rails.logger.debug("[Position Debug]   New position: #{position}")
      Rails.logger.debug("[Position Debug]   Position in DB: #{reload.position}")
    end
  end
  
  def log_before_position_update
    return unless debug_position_changes
    
    Rails.logger.debug("[Position Debug] #{self.class}##{id} - Before position update")
    Rails.logger.debug("[Position Debug]   Position changing from: #{position_in_database} to: #{position}")
    Rails.logger.debug("[Position Debug]   Current scope positions: #{current_scope_positions}")
  end
  
  def log_after_position_update
    return unless debug_position_changes
    
    Rails.logger.debug("[Position Debug] #{self.class}##{id} - After position update")
    Rails.logger.debug("[Position Debug]   New position: #{position}")
    Rails.logger.debug("[Position Debug]   Current scope positions: #{current_scope_positions}")
  end
  
  def log_after_commit
    return unless debug_position_changes
    
    Rails.logger.debug("[Position Debug] #{self.class}##{id} - After commit")
    Rails.logger.debug("[Position Debug]   Final position in DB: #{reload.position}")
    Rails.logger.debug("[Position Debug]   Final scope positions: #{current_scope_positions}")
  end
  
  def current_scope_positions
    self.class.where(plan_section_id: plan_section_id)
             .order(:position)
             .pluck(:id, :position)
             .map { |i, p| "#{i}:#{p}" }
             .join(', ')
  end

  belongs_to :plan_section
  has_many :plan_item_logs, dependent: :destroy
end
