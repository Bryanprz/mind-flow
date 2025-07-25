# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_07_25_075718) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "foods", force: :cascade do |t|
    t.string "name"
    t.string "recommendation"
    t.string "contraindication"
    t.text "details"
    t.string "elements", default: [], array: true
    t.string "recipes", default: [], array: true
    t.integer "rasa_taste"
    t.text "virya_potency"
    t.text "vipaka_post_digestive_effect"
    t.string "prabhava_special_action"
    t.integer "guna_quality"
    t.text "samskara_preparation"
    t.text "habitat_and_source"
    t.integer "form_of_intake"
    t.text "samyoga_combination"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.date "dob"
    t.integer "prakruti"
    t.integer "vikruti"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end
end
