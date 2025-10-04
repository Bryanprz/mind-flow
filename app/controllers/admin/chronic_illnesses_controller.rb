class Admin::ChronicIllnessesController < ApplicationController
  before_action :set_chronic_illness, only: [:show, :edit, :update, :destroy]

  def index
    @chronic_illnesses = ChronicIllness.all.order(:name)
  end

  def show
  end

  def new
    @chronic_illness = ChronicIllness.new
  end

  def edit
  end

  def create
    @chronic_illness = ChronicIllness.new(chronic_illness_params)

    if @chronic_illness.save
      redirect_to admin_chronic_illness_path(@chronic_illness), notice: 'Chronic illness was successfully created.'
    else
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @chronic_illness.update(chronic_illness_params)
      redirect_to admin_chronic_illness_path(@chronic_illness), notice: 'Chronic illness was successfully updated.'
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @chronic_illness.destroy
    redirect_to admin_chronic_illnesses_path, notice: 'Chronic illness was successfully deleted.'
  end

  private

  def set_chronic_illness
    @chronic_illness = ChronicIllness.find(params[:id])
  end

  def chronic_illness_params
    params.require(:chronic_illness).permit(:name, :description, :color)
  end
end
