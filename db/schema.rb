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

ActiveRecord::Schema[8.0].define(version: 2025_08_17_064233) do
  create_table "cures", force: :cascade do |t|
    t.string "name"
    t.string "severity"
    t.text "recommendation"
    t.text "contraindication"
    t.text "details"
    t.integer "rasa_taste"
    t.text "virya_potency"
    t.text "vipaka_post_digestive_effect"
    t.string "prabhava_special_action"
    t.integer "guna_quality"
    t.text "samskara_preparation"
    t.text "habitat_and_source"
    t.integer "form_of_intake"
    t.text "samyoga_combination"
    t.json "elements", default: []
    t.json "recipes", default: []
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "disease_stages", force: :cascade do |t|
    t.integer "formation_stage"
    t.string "name"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "doshas", force: :cascade do |t|
    t.string "name"
    t.text "core_qualities"
    t.text "strengths"
    t.text "growth_areas"
    t.text "affirmations"
    t.text "archetype_info"
    t.text "people_manifestation"
    t.string "color"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_doshas_on_name", unique: true
  end

  create_table "questions", force: :cascade do |t|
    t.integer "quiz_id", null: false
    t.string "category"
    t.string "kosha"
    t.text "text"
    t.integer "points"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["quiz_id"], name: "index_questions_on_quiz_id"
  end

  create_table "quiz_answers", force: :cascade do |t|
    t.integer "quiz_submission_id", null: false
    t.integer "quiz_option_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["quiz_option_id"], name: "index_quiz_answers_on_quiz_option_id"
    t.index ["quiz_submission_id"], name: "index_quiz_answers_on_quiz_submission_id"
  end

  create_table "quiz_entries", force: :cascade do |t|
    t.integer "quiz_id", null: false
    t.integer "user_id"
    t.datetime "completed_at"
    t.json "results", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["quiz_id"], name: "index_quiz_entries_on_quiz_id"
    t.index ["user_id"], name: "index_quiz_entries_on_user_id"
  end

  create_table "quiz_options", force: :cascade do |t|
    t.integer "question_id", null: false
    t.string "text"
    t.integer "dosha"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["question_id"], name: "index_quiz_options_on_question_id"
  end

  create_table "quiz_submissions", force: :cascade do |t|
    t.integer "user_id"
    t.integer "quiz_id", null: false
    t.datetime "completed_at"
    t.text "results", default: "{}"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["quiz_id"], name: "index_quiz_submissions_on_quiz_id"
    t.index ["user_id"], name: "index_quiz_submissions_on_user_id"
  end

  create_table "quizzes", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.integer "category"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "sessions", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "ip_address"
    t.string "user_agent"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_sessions_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email_address", null: false
    t.string "first_name"
    t.string "last_name"
    t.string "password_digest", null: false
    t.date "date_of_birth"
    t.time "time_of_birth"
    t.bigint "prakruti_id"
    t.bigint "vikruti_id"
    t.string "authentication_token"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "time_zone"
    t.index ["authentication_token"], name: "index_users_on_authentication_token"
    t.index ["email_address"], name: "index_users_on_email_address", unique: true
    t.index ["prakruti_id"], name: "index_users_on_prakruti_id"
    t.index ["vikruti_id"], name: "index_users_on_vikruti_id"
  end

  add_foreign_key "questions", "quizzes"
  add_foreign_key "quiz_answers", "quiz_options"
  add_foreign_key "quiz_answers", "quiz_submissions"
  add_foreign_key "quiz_entries", "quizzes"
  add_foreign_key "quiz_entries", "users"
  add_foreign_key "quiz_options", "questions"
  add_foreign_key "sessions", "users"
end
