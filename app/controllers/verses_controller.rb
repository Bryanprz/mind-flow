class VersesController < ApplicationController
  before_action :set_verse, only: %i[ show edit update destroy ]

  # GET /verses or /verses.json
  def index
    if params[:book_id]
      @book = Book.find_by!(slug: params[:book_id])
      @verses = @book.verses
    else
      @verses = Verse.all
    end
  end

  # GET /verses/1 or /verses/1.json
  def show
  end

  # GET /verses/new
  def new
    @verse = Verse.new
  end

  # GET /verses/1/edit
  def edit
  end

  # POST /verses or /verses.json
  def create
    @verse = Verse.new(verse_params)

    respond_to do |format|
      if @verse.save
        format.html { redirect_to @verse, notice: "Verse was successfully created." }
        format.json { render :show, status: :created, location: @verse }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @verse.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /verses/1 or /verses/1.json
  def update
    respond_to do |format|
      if @verse.update(verse_params)
        format.html { redirect_to @verse, notice: "Verse was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @verse }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @verse.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /verses/1 or /verses/1.json
  def destroy
    @verse.destroy!

    respond_to do |format|
      format.html { redirect_to verses_path, notice: "Verse was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_verse
      @verse = Verse.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def verse_params
      params.expect(verse: [ :book_id, :verse_number, :text_header, :text, :chapter_title, :chapter, :page_number ])
    end
end
