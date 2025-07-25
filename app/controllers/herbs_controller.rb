class HerbsController < ApplicationController
  before_action :set_herb, only: %i[ show edit update destroy ]

  # GET /herbs or /herbs.json
  def index
    @herbs = Herb.all
  end

  # GET /herbs/1 or /herbs/1.json
  def show
  end

  # GET /herbs/new
  def new
    @herb = Herb.new
  end

  # GET /herbs/1/edit
  def edit
  end

  # POST /herbs or /herbs.json
  def create
    @herb = Herb.new(herb_params)

    respond_to do |format|
      if @herb.save
        format.html { redirect_to @herb, notice: "Herb was successfully created." }
        format.json { render :show, status: :created, location: @herb }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @herb.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /herbs/1 or /herbs/1.json
  def update
    respond_to do |format|
      if @herb.update(herb_params)
        format.html { redirect_to @herb, notice: "Herb was successfully updated." }
        format.json { render :show, status: :ok, location: @herb }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @herb.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /herbs/1 or /herbs/1.json
  def destroy
    @herb.destroy!

    respond_to do |format|
      format.html { redirect_to herbs_path, status: :see_other, notice: "Herb was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_herb
      @herb = Herb.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def herb_params
      params.expect(herb: [ :name, :recommendation, :contraindication, :details, :rasa_taste, :virya_potency, :vipaka_post_digestive_effect, :prabhava_special_action, :guna_quality, :samskara_preparation, :habitat_and_source, :form_of_intake, :samyoga_combination, :elements, :recipes ])
    end
end
