class CuresController < ApplicationController
  before_action :set_cure, only: %i[ show edit update destroy ]

  # GET /cures or /cures.json
  def index
    @cures = Cure.all
  end

  # GET /cures/1 or /cures/1.json
  def show
  end

  # GET /cures/new
  def new
    @cure = Cure.new
  end

  # GET /cures/1/edit
  def edit
  end

  # POST /cures or /cures.json
  def create
    @cure = Cure.new(cure_params)

    respond_to do |format|
      if @cure.save
        format.html { redirect_to @cure, notice: "Cure was successfully created." }
        format.json { render :show, status: :created, location: @cure }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @cure.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /cures/1 or /cures/1.json
  def update
    respond_to do |format|
      if @cure.update(cure_params)
        format.html { redirect_to @cure, notice: "Cure was successfully updated." }
        format.json { render :show, status: :ok, location: @cure }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @cure.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /cures/1 or /cures/1.json
  def destroy
    @cure.destroy!

    respond_to do |format|
      format.html { redirect_to cures_path, status: :see_other, notice: "Cure was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_cure
      @cure = Cure.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def cure_params
      params.expect(cure: [ :name, :recommendation, :contraindication, :details, :rasa_taste, :virya_potency, :vipaka_post_digestive_effect, :prabhava_special_action, :guna_quality, :samskara_preparation, :habitat_and_source, :form_of_intake, :samyoga_combination, :elements, :recipes ])
    end
end
