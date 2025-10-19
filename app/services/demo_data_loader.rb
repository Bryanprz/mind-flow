class DemoDataLoader
  # Load demo data from YAML files
  def self.load_demo_data(file_name, default_value = [])
    file_path = Rails.root.join('config', 'demo_data', "#{file_name}.yml")
    return default_value unless File.exist?(file_path)
    
    data = YAML.load_file(file_path) || default_value
    # Convert string keys to symbol keys for consistency
    symbolize_keys(data)
  rescue => e
    Rails.logger.error "Error loading demo data from #{file_name}: #{e.message}"
    default_value
  end
  
  # Recursively convert string keys to symbols
  def self.symbolize_keys(data)
    case data
    when Hash
      data.transform_keys(&:to_sym).transform_values { |v| symbolize_keys(v) }
    when Array
      data.map { |item| symbolize_keys(item) }
    else
      data
    end
  end
  
  # Analytics demo data
  def self.analytics_data
    {
      focus_sessions: load_demo_data('focus_sessions', []),
      performance_metrics: load_demo_data('performance_metrics', {}),
      weekly_summary: load_demo_data('weekly_summary', {})
    }
  end
  
  # Goals demo data
  def self.goals_data
    {
      active_goals: load_demo_data('active_goals'),
      completed_goals: load_demo_data('completed_goals'),
      goal_categories: load_demo_data('goal_categories')
    }
  end
  
  # Learning demo data
  def self.learning_data
    {
      courses: load_demo_data('courses'),
      progress: load_demo_data('learning_progress'),
      achievements: load_demo_data('achievements')
    }
  end
end
