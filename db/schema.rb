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

ActiveRecord::Schema[8.0].define(version: 2025_07_29_073813) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "active_admin_comments", force: :cascade do |t|
    t.string "namespace"
    t.text "body"
    t.string "resource_type"
    t.bigint "resource_id"
    t.string "author_type"
    t.bigint "author_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["author_type", "author_id"], name: "index_active_admin_comments_on_author"
    t.index ["namespace"], name: "index_active_admin_comments_on_namespace"
    t.index ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource"
  end

  create_table "admin_users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_admin_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_admin_users_on_reset_password_token", unique: true
  end

  create_table "cures", force: :cascade do |t|
    t.string "name"
    t.string "severity"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
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
    t.string "elements", default: [], array: true
    t.string "recipes", default: [], array: true
  end

  create_table "disease_cures", id: false, force: :cascade do |t|
    t.bigint "disease_id", null: false
    t.bigint "cure_id", null: false
  end

  create_table "disease_stages", force: :cascade do |t|
    t.integer "formation_stage"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "diseases", force: :cascade do |t|
    t.string "name"
    t.bigint "disease_stage_id", null: false
    t.string "symptoms", default: [], array: true
    t.string "root_cause", default: [], array: true
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["disease_stage_id"], name: "index_diseases_on_disease_stage_id"
  end

  create_table "dosha_cures", id: false, force: :cascade do |t|
    t.bigint "dosha_id", null: false
    t.bigint "cure_id", null: false
  end

  create_table "doshas", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "core_qualities"
    t.jsonb "strengths"
    t.jsonb "growth_areas"
    t.text "affirmations"
    t.jsonb "archetype_info"
    t.jsonb "people_manifestation"
    t.index ["name"], name: "index_doshas_on_name", unique: true
  end

  create_table "doshas_lifestyle_plans", id: false, force: :cascade do |t|
    t.bigint "dosha_id", null: false
    t.bigint "lifestyle_plan_id", null: false
  end

  create_table "elements", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_elements_on_name", unique: true
  end

  create_table "elements_seasons", id: false, force: :cascade do |t|
    t.bigint "season_id", null: false
    t.bigint "element_id", null: false
  end

  create_table "food_bad_for_doshas", id: false, force: :cascade do |t|
    t.bigint "food_id", null: false
    t.bigint "dosha_id", null: false
  end

  create_table "food_bad_for_seasons", id: false, force: :cascade do |t|
    t.bigint "food_id", null: false
    t.bigint "season_id", null: false
  end

  create_table "food_good_for_doshas", id: false, force: :cascade do |t|
    t.bigint "food_id", null: false
    t.bigint "dosha_id", null: false
  end

  create_table "food_good_for_seasons", id: false, force: :cascade do |t|
    t.bigint "food_id", null: false
    t.bigint "season_id", null: false
  end

  create_table "foods", force: :cascade do |t|
    t.string "name"
    t.string "recommendation"
    t.text "reason"
    t.string "elements", default: [], array: true
    t.string "recipes", default: [], array: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "rasa_taste"
    t.text "virya_potency"
    t.text "vipaka_post_digestive_effect"
    t.string "prabhava_special_action"
    t.integer "guna_quality"
    t.text "samskara_preparation"
    t.text "habitat_and_source"
    t.integer "form_of_intake"
    t.text "samyoga_combination"
  end

  create_table "herbal_cures", id: false, force: :cascade do |t|
    t.bigint "herb_id", null: false
    t.bigint "cure_id", null: false
  end

  create_table "herbs", force: :cascade do |t|
    t.string "name"
    t.text "energetics"
    t.string "origin"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "lifestyle_plans", force: :cascade do |t|
    t.jsonb "daily_routine_items"
    t.jsonb "seasonal_practices_data"
    t.jsonb "spiritual_practices_items"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "quest_missions", force: :cascade do |t|
    t.bigint "quest_theme_id", null: false
    t.integer "stage"
    t.string "title"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["quest_theme_id"], name: "index_quest_missions_on_quest_theme_id"
  end

  create_table "quest_themes", force: :cascade do |t|
    t.bigint "quest_id", null: false
    t.string "title"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "stage"
    t.index ["quest_id"], name: "index_quest_themes_on_quest_id"
  end

  create_table "questions", force: :cascade do |t|
    t.bigint "quiz_id", null: false
    t.text "text"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "points"
    t.index ["quiz_id"], name: "index_questions_on_quiz_id"
  end

  create_table "quests", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.string "color"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "quiz_answers", force: :cascade do |t|
    t.bigint "quiz_entry_id", null: false
    t.bigint "quiz_option_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["quiz_entry_id"], name: "index_quiz_answers_on_quiz_entry_id"
    t.index ["quiz_option_id"], name: "index_quiz_answers_on_quiz_option_id"
  end

  create_table "quiz_entries", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "quiz_id", null: false
    t.datetime "completed_at"
    t.jsonb "results", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["quiz_id"], name: "index_quiz_entries_on_quiz_id"
    t.index ["user_id"], name: "index_quiz_entries_on_user_id"
  end

  create_table "quiz_options", force: :cascade do |t|
    t.bigint "question_id", null: false
    t.string "text"
    t.integer "dosha"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["question_id"], name: "index_quiz_options_on_question_id"
  end

  create_table "quizzes", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "category"
  end

  create_table "seasons", force: :cascade do |t|
    t.string "name"
    t.string "time_span"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_seasons_on_name", unique: true
  end

  create_table "tissue_cures", id: false, force: :cascade do |t|
    t.bigint "tissue_system_id", null: false
    t.bigint "cure_id", null: false
  end

  create_table "tissue_systems", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_tissue_systems_on_name", unique: true
  end

  create_table "user_quest_progresses", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "quest_module_id", null: false
    t.boolean "completed"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["quest_module_id"], name: "index_user_quest_progresses_on_quest_module_id"
    t.index ["user_id"], name: "index_user_quest_progresses_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "first_name"
    t.string "last_name"
    t.string "password_digest", null: false
    t.date "date_of_birth"
    t.time "time_of_birth"
    t.bigint "prakruti_id"
    t.bigint "vikruti_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "authentication_token"
    t.index ["authentication_token"], name: "index_users_on_authentication_token"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["prakruti_id"], name: "index_users_on_prakruti_id"
    t.index ["vikruti_id"], name: "index_users_on_vikruti_id"
  end

  add_foreign_key "diseases", "disease_stages"
  add_foreign_key "quest_missions", "quest_themes"
  add_foreign_key "quest_themes", "quests"
  add_foreign_key "questions", "quizzes"
  add_foreign_key "quiz_answers", "quiz_entries"
  add_foreign_key "quiz_answers", "quiz_options"
  add_foreign_key "quiz_entries", "quizzes"
  add_foreign_key "quiz_entries", "users"
  add_foreign_key "quiz_options", "questions"
  add_foreign_key "user_quest_progresses", "quest_themes", column: "quest_module_id"
  add_foreign_key "user_quest_progresses", "users"
  add_foreign_key "users", "doshas", column: "prakruti_id"
  add_foreign_key "users", "doshas", column: "vikruti_id"
end
