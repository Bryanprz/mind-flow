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

ActiveRecord::Schema[8.0].define(version: 2025_09_07_023016) do
  create_table "action_text_rich_texts", force: :cascade do |t|
    t.string "name", null: false
    t.text "body"
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["record_type", "record_id", "name"], name: "index_action_text_rich_texts_uniqueness", unique: true
  end

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "assessment_answers", force: :cascade do |t|
    t.integer "assessment_entry_id", null: false
    t.integer "assessment_option_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["assessment_entry_id"], name: "index_assessment_answers_on_assessment_entry_id"
    t.index ["assessment_option_id"], name: "index_assessment_answers_on_assessment_option_id"
  end

  create_table "assessment_chronic_illnesses", force: :cascade do |t|
    t.integer "assessment_entry_id", null: false
    t.integer "chronic_illness_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["assessment_entry_id"], name: "index_assessment_chronic_illnesses_on_assessment_entry_id"
    t.index ["chronic_illness_id"], name: "index_assessment_chronic_illnesses_on_chronic_illness_id"
  end

  create_table "assessment_entries", force: :cascade do |t|
    t.integer "user_id"
    t.integer "health_assessment_id", null: false
    t.datetime "completed_at"
    t.text "results", default: "{}"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "type"
    t.text "notes"
    t.text "reason_for_visit"
    t.index ["health_assessment_id"], name: "index_assessment_entries_on_health_assessment_id"
    t.index ["user_id"], name: "index_assessment_entries_on_user_id"
  end

  create_table "assessment_options", force: :cascade do |t|
    t.integer "assessment_question_id", null: false
    t.string "text"
    t.integer "dosha"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["assessment_question_id"], name: "index_assessment_options_on_assessment_question_id"
  end

  create_table "assessment_questions", force: :cascade do |t|
    t.integer "health_assessment_id", null: false
    t.string "category"
    t.string "kosha"
    t.text "text"
    t.integer "points"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "question_group"
    t.index ["health_assessment_id"], name: "index_assessment_questions_on_health_assessment_id"
  end

  create_table "books", force: :cascade do |t|
    t.string "title"
    t.integer "category"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "slug"
    t.text "description"
    t.index ["category"], name: "index_books_on_category"
    t.index ["slug"], name: "index_books_on_slug", unique: true
  end

  create_table "chronic_illnesses", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.string "icon"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

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

  create_table "foods", force: :cascade do |t|
    t.string "name"
    t.string "recommendation"
    t.string "contraindication"
    t.text "details"
    t.json "elements", default: []
    t.json "recipes", default: []
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

  create_table "healing_plan_foods", force: :cascade do |t|
    t.integer "healing_plan_id", null: false
    t.integer "food_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["food_id"], name: "index_healing_plan_foods_on_food_id"
    t.index ["healing_plan_id"], name: "index_healing_plan_foods_on_healing_plan_id"
  end

  create_table "healing_plan_logs", force: :cascade do |t|
    t.integer "healing_plan_id", null: false
    t.string "completed_at"
    t.text "journal_entry"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.date "date"
    t.index ["healing_plan_id"], name: "index_healing_plan_logs_on_healing_plan_id"
  end

  create_table "healing_plan_templates", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.integer "dosha_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "duration_type"
    t.index ["dosha_id"], name: "index_healing_plan_templates_on_dosha_id"
  end

  create_table "healing_plans", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "name"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "version"
    t.string "lineage_id"
    t.boolean "is_active"
    t.integer "healing_plan_template_id"
    t.string "type"
    t.integer "duration_type"
    t.index ["healing_plan_template_id"], name: "index_healing_plans_on_healing_plan_template_id"
    t.index ["type"], name: "index_healing_plans_on_type"
    t.index ["user_id"], name: "index_healing_plans_on_user_id"
  end

  create_table "health_assessments", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.integer "assessment_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "herbs", force: :cascade do |t|
    t.string "name"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "lifestyle_plans", force: :cascade do |t|
    t.json "daily_routine_items"
    t.json "seasonal_practices_data"
    t.json "spiritual_practices_items"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "plan_item_logs", force: :cascade do |t|
    t.integer "plan_item_id", null: false
    t.integer "healing_plan_log_id", null: false
    t.text "note"
    t.datetime "completed_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["healing_plan_log_id"], name: "index_plan_item_logs_on_healing_plan_log_id"
    t.index ["plan_item_id"], name: "index_plan_item_logs_on_plan_item_id"
  end

  create_table "plan_item_templates", force: :cascade do |t|
    t.integer "plan_section_template_id", null: false
    t.text "content"
    t.integer "ordering"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["plan_section_template_id"], name: "index_plan_item_templates_on_plan_section_template_id"
  end

  create_table "plan_items", force: :cascade do |t|
    t.text "content"
    t.boolean "completed", default: false
    t.integer "ordering"
    t.integer "plan_section_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["plan_section_id"], name: "index_plan_items_on_plan_section_id"
  end

  create_table "plan_section_templates", force: :cascade do |t|
    t.integer "healing_plan_template_id", null: false
    t.string "name"
    t.integer "ordering"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["healing_plan_template_id"], name: "index_plan_section_templates_on_healing_plan_template_id"
  end

  create_table "plan_sections", force: :cascade do |t|
    t.string "name"
    t.integer "ordering"
    t.integer "healing_plan_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["healing_plan_id"], name: "index_plan_sections_on_healing_plan_id"
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
    t.string "name"
    t.string "password_digest", null: false
    t.date "date_of_birth"
    t.time "time_of_birth"
    t.bigint "prakruti_id"
    t.bigint "vikruti_id"
    t.string "authentication_token"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "time_zone"
    t.boolean "admin"
    t.index ["authentication_token"], name: "index_users_on_authentication_token"
    t.index ["email_address"], name: "index_users_on_email_address", unique: true
    t.index ["prakruti_id"], name: "index_users_on_prakruti_id"
    t.index ["vikruti_id"], name: "index_users_on_vikruti_id"
  end

  create_table "verses", force: :cascade do |t|
    t.integer "book_id", null: false
    t.integer "verse_number"
    t.string "text_header"
    t.text "text"
    t.string "chapter_title"
    t.integer "chapter"
    t.integer "page_number"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["book_id"], name: "index_verses_on_book_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "assessment_answers", "assessment_entries"
  add_foreign_key "assessment_answers", "assessment_options"
  add_foreign_key "assessment_chronic_illnesses", "assessment_entries"
  add_foreign_key "assessment_chronic_illnesses", "chronic_illnesses"
  add_foreign_key "assessment_options", "assessment_questions"
  add_foreign_key "assessment_questions", "health_assessments"
  add_foreign_key "healing_plan_foods", "foods"
  add_foreign_key "healing_plan_foods", "healing_plans"
  add_foreign_key "healing_plan_logs", "healing_plans"
  add_foreign_key "healing_plan_templates", "doshas"
  add_foreign_key "healing_plans", "healing_plan_templates"
  add_foreign_key "healing_plans", "users"
  add_foreign_key "plan_item_logs", "healing_plan_logs"
  add_foreign_key "plan_item_logs", "plan_items"
  add_foreign_key "plan_item_templates", "plan_section_templates"
  add_foreign_key "plan_items", "plan_sections"
  add_foreign_key "plan_section_templates", "healing_plan_templates"
  add_foreign_key "plan_sections", "healing_plans"
  add_foreign_key "sessions", "users"
  add_foreign_key "verses", "books"
end
