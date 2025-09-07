class HealthAssessmentsController < ApplicationController
  before_action :set_health_assessment, only: [:submit_answers]
  before_action :set_assessment_entry, only: [:show_results, :current_imbalance_results]
  allow_unauthenticated_access only: [:intro_prakruti_assessment, :start_assessment, :start_prakruti_assessment, :submit_answers, :show_results]

  def ensure_current_session_is_resumed
    resume_session
  end

  def start_prakruti_assessment
    start_assessment(:prakruti)
  end

  def start_vikruti_assessment
    start_assessment(:vikruti)
  end

  def start_assessment(assessment_type)
    @health_assessment = HealthAssessment.find_by(assessment_type: assessment_type)
    @chronic_illnesses = ChronicIllness.all.order(:name)

    # Eager load all questions and their options to avoid N+1 queries
    @questions = @health_assessment.assessment_questions.includes(:assessment_options).order(:id)

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace(
          "assessment_frame",
          "chronic_illnesses/index",
          locals: { 
            chronic_illnesses: @chronic_illnesses
          }
        )
      end
      format.json do
        render json: { chronic_illnesses: @chronic_illnesses.as_json(only: [:id, :name, :description, :icon] )}
      end
      format.html { render 'chronic_illnesses/index' }
    end
  end

  def submit_answers
    if params[:chronic_illness_ids].present?
      session[:chronic_illness_ids] = params[:chronic_illness_ids].reject(&:blank?)

      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace(
            "assessment_frame",
            partial: "health_assessments/reason_for_visit",
            locals: { health_assessment: @health_assessment }
          )
        end
        format.html do
          render "health_assessments/reason_for_visit", locals: { health_assessment: @health_assessment }
        end
      end
    elsif params[:reason_for_visit].present?
      binding.pry
      @questions = @health_assessment.assessment_questions.includes(:assessment_options).order(:id)

      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace(
            "assessment_frame",
            partial: "health_assessments/question",
            locals: { questions: @questions, health_assessment: @health_assessment }
          )
        end
        format.html do
          render "health_assessments/questions", locals: { questions: @questions, health_assessment: @health_assessment }
        end
      end
    elsif params[:answers].present?
      binding.pry
      # Parse the JSON string if it's a string, otherwise use as is
      answers_param = params.require(:answers)
      answers = if answers_param.is_a?(String)
                  JSON.parse(answers_param, symbolize_names: true)
                else
                  answers_param.map { |a| a.permit(:question_id, :option_id).to_h.symbolize_keys }
                end

      @assessment_entry = CreateHealthAssessmentEntry.call(
        health_assessment: @health_assessment,
        answers: answers,
        chronic_illness_ids: session[:chronic_illness_ids],
      )

      # Clean up session
      session.delete(:chronic_illness_ids)

      # Determine and apply the appropriate healing protocol based on the assessment type
      if Current.user
        CreateHealingPlan.new(Current.user, @health_assessment).call
      else
        # Store the entry ID in the session for the results page to find.
        session[:assessment_entry_id] = @assessment_entry.id
      end

      respond_to do |format|
        format.turbo_stream do
          redirect_path = if @assessment_entry.is_a?(VikrutiEntry)
                            current_imbalance_results_path
                          else
                            assessment_results_path
                          end
          render turbo_stream: turbo_stream.replace('main_content_area',
            partial: 'health_assessments/analyzing',
            locals: { redirect_path: redirect_path }
          )
        end
        format.html do
          if @assessment_entry.is_a?(VikrutiEntry)
            redirect_to current_imbalance_results_path
          else
            redirect_to assessment_results_path
          end
        end
      end
    else
      # Handle case where neither is present, maybe redirect with an error
      redirect_to root_path, alert: "Invalid submission."
    end
  end

  def show_results
    # @assessment_entry is loaded by the set_assessment_entry before_action
    render "health_assessments/results", locals: {
      assessment_entry: @assessment_entry,
      primary_dosha: @assessment_entry.primary_dosha, 
      current_user: current_user
    }
  end

  def current_imbalance_results
    # @assessment_entry is loaded by the set_assessment_entry before_action
    # Ensure it's a VikrutiEntry
    unless @assessment_entry.is_a?(VikrutiEntry)
      redirect_to root_path, alert: "Invalid assessment type for this page."
      return
    end

    render "health_assessments/current_imbalance_results", locals: {
      assessment_entry: @assessment_entry,
      primary_dosha: @assessment_entry.primary_dosha, 
      current_user: current_user
    }
  end

  # This action will simply render the intro_prakruti_assessment.html.erb view
  def intro_prakruti_assessment
  end

  def intro_vikruti_assessment
  end

  private

  def set_health_assessment
    @health_assessment = HealthAssessment.find(params[:health_assessment_id])
  end

  def set_assessment_entry
    if Current.user
      # For authenticated users, find the most recent assessment entry
      @assessment_entry = Current.user.assessment_entries.order(created_at: :desc).first
    elsif session[:assessment_entry_id].present?
      # For unauthenticated users, load from session
      @assessment_entry = AssessmentEntry.find_by(id: session[:assessment_entry_id])
    end

    unless @assessment_entry
      redirect_to root_path,
        alert: "Assessment results not found or your session has expired. Please try again."
      return
    end
  end
end
