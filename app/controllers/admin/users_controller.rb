class Admin::UsersController < ApplicationController
  before_action :require_admin
  before_action :set_user, only: %i[ show edit update destroy ]

  # GET /admin/users or /admin/users.json
  def index
    @users = User.all
  end

  # GET /admin/users/1 or /admin/users/1.json
  def show
  end

  # GET /admin/users/new
  def new
    @user = User.new
  end

  # GET /admin/users/1/edit
  def edit
  end

  # POST /admin/users or /admin/users.json
  def create
    @user = User.new(user_params)

    respond_to do |format|
      if @user.save
        format.html { redirect_to admin_user_path(@user), notice: "User was successfully created." }
        format.json { render :show, status: :created, location: admin_user_path(@user) }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /admin/users/1 or /admin/users/1.json
  def update
    respond_to do |format|
      if @user.update(user_params)
        format.html { redirect_to @user, notice: "User was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @user }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /admin/users/1 or /admin/users/1.json
  def destroy
    @user.destroy!

    respond_to do |format|
      format.html { redirect_to admin_users_path, notice: "User was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
  def set_user
    # Try to find by ID first (for numeric IDs), then search by slug
    if params[:slug].match?(/\A\d+\z/)
      @user = User.find_by(id: params[:slug])
    else
      @user = User.all.find { |user| user.slug == params[:slug] }
    end
    
    raise ActiveRecord::RecordNotFound unless @user
  end

  def require_admin
    unless Current.user.admin?
      redirect_to root_path, alert: "Not authorized."
    end
  end

  # Only allow a list of trusted parameters through.
  def user_params
    params.require(:user).permit(:name, :email_address, :password)
  end
end
