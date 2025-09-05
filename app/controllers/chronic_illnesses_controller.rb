class ChronicIllnessesController < ApplicationController
  allow_unauthenticated_access only: %i[ index ]
  before_action :set_chronic_illness, only: %i[ show edit update destroy ]

  # GET /chronic_illnesses or /chronic_illnesses.json
  def index
    @chronic_illnesses = ChronicIllness.all
  end

  # GET /chronic_illnesses/1 or /chronic_illnesses/1.json
  def show
  end

  # GET /chronic_illnesses/new
  def new
    @chronic_illness = ChronicIllness.new
  end

  # GET /chronic_illnesses/1/edit
  def edit
  end

  # POST /chronic_illnesses or /chronic_illnesses.json
  def create
    @chronic_illness = ChronicIllness.new(chronic_illness_params)

    respond_to do |format|
      if @chronic_illness.save
        format.html { redirect_to @chronic_illness, notice: "Chronic illness was successfully created." }
        format.json { render :show, status: :created, location: @chronic_illness }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @chronic_illness.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /chronic_illnesses/1 or /chronic_illnesses/1.json
  def update
    respond_to do |format|
      if @chronic_illness.update(chronic_illness_params)
        format.html { redirect_to @chronic_illness, notice: "Chronic illness was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @chronic_illness }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @chronic_illness.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /chronic_illnesses/1 or /chronic_illnesses/1.json
  def destroy
    @chronic_illness.destroy!

    respond_to do |format|
      format.html { redirect_to chronic_illnesses_path, notice: "Chronic illness was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_chronic_illness
      @chronic_illness = ChronicIllness.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def chronic_illness_params
      params.expect(chronic_illness: [ :name, :description, :icon ])
    end
end
