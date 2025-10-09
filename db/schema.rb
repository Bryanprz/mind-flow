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

ActiveRecord::Schema[8.0].define(version: 2025_10_09_201552) do
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

  create_table "assessment_entries", force: :cascade do |t|
    t.integer "user_id"
    t.integer "health_assessment_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "type"
    t.text "notes"
    t.text "reason_for_visit"
    t.datetime "completed_at"
    t.text "results", default: "{}"
    t.index ["health_assessment_id"], name: "index_assessment_entries_on_health_assessment_id"
    t.index ["user_id"], name: "index_assessment_entries_on_user_id"
  end

  create_table "assessment_options", force: :cascade do |t|
    t.integer "assessment_question_id", null: false
    t.string "text"
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

  create_table "bio_profile_aggravating_foods", force: :cascade do |t|
    t.integer "bio_profile_id", null: false
    t.string "name", null: false
    t.text "description", null: false
    t.text "recommendations", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["bio_profile_id"], name: "index_bio_profile_aggravating_foods_on_bio_profile_id"
  end

  create_table "bio_profile_healing_foods", force: :cascade do |t|
    t.integer "bio_profile_id", null: false
    t.string "name", null: false
    t.text "description", null: false
    t.text "recommendations", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["bio_profile_id"], name: "index_bio_profile_healing_foods_on_bio_profile_id"
  end

  create_table "bio_profile_supplements", force: :cascade do |t|
    t.integer "bio_profile_id", null: false
    t.string "name", null: false
    t.text "description", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["bio_profile_id"], name: "index_bio_profile_supplements_on_bio_profile_id"
  end

  create_table "bio_profiles", force: :cascade do |t|
    t.string "name", null: false
    t.string "color", null: false
    t.json "archetype_info"
    t.json "people_manifestation"
    t.text "general_recommendations"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_bio_profiles_on_name", unique: true
  end

  create_table "habit_logs", force: :cascade do |t|
    t.integer "habit_plan_id", null: false
    t.string "completed_at"
    t.text "journal_entry"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.date "date"
    t.index ["habit_plan_id"], name: "index_habit_logs_on_habit_plan_id"
  end

  create_table "habit_plan_templates", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "duration_type"
    t.string "healing_focus_type"
    t.integer "healing_focus_id"
  end

  create_table "habit_plans", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "version"
    t.string "lineage_id"
    t.boolean "is_active"
    t.integer "habit_plan_template_id"
    t.string "type"
    t.integer "duration_type"
    t.json "overview"
    t.index ["habit_plan_template_id"], name: "index_habit_plans_on_habit_plan_template_id"
    t.index ["type"], name: "index_habit_plans_on_type"
    t.index ["user_id"], name: "index_habit_plans_on_user_id"
  end

  create_table "healing_plan_templates", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.string "duration_type"
    t.string "healing_focus_type", null: false
    t.integer "healing_focus_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["healing_focus_type", "healing_focus_id"], name: "index_healing_plan_templates_on_healing_focus"
  end

  create_table "health_assessments", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.integer "assessment_type"
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

  create_table "newsletters", force: :cascade do |t|
    t.string "email_address", null: false
    t.string "status", default: "subscribed"
    t.boolean "active", default: true
    t.datetime "subscribed_at", default: -> { "CURRENT_TIMESTAMP" }
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email_address"], name: "index_newsletters_on_email_address", unique: true
  end

  create_table "plan_item_logs", force: :cascade do |t|
    t.integer "plan_item_id", null: false
    t.integer "habit_log_id", null: false
    t.text "note"
    t.datetime "completed_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["habit_log_id"], name: "index_plan_item_logs_on_habit_log_id"
    t.index ["plan_item_id"], name: "index_plan_item_logs_on_plan_item_id"
  end

  create_table "plan_item_templates", force: :cascade do |t|
    t.integer "plan_section_template_id", null: false
    t.text "content"
    t.integer "position"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["plan_section_template_id", "position"], name: "idx_plan_item_templates_on_section_and_position"
    t.index ["plan_section_template_id"], name: "index_plan_item_templates_on_plan_section_template_id"
  end

  create_table "plan_items", force: :cascade do |t|
    t.text "content"
    t.boolean "completed", default: false
    t.integer "position"
    t.integer "plan_section_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["plan_section_id", "position"], name: "index_plan_items_on_plan_section_id_and_position"
    t.index ["plan_section_id"], name: "index_plan_items_on_plan_section_id"
  end

  create_table "plan_section_templates", force: :cascade do |t|
    t.integer "habit_plan_template_id", null: false
    t.string "name"
    t.integer "position"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["habit_plan_template_id", "position"], name: "idx_plan_section_templates_on_plan_and_position"
    t.index ["habit_plan_template_id"], name: "index_plan_section_templates_on_habit_plan_template_id"
  end

  create_table "plan_sections", force: :cascade do |t|
    t.string "name"
    t.integer "position"
    t.integer "habit_plan_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["habit_plan_id", "position"], name: "index_plan_sections_on_habit_plan_id_and_position"
    t.index ["habit_plan_id"], name: "index_plan_sections_on_habit_plan_id"
  end

  create_table "sessions", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "ip_address"
    t.string "user_agent"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_sessions_on_user_id"
  end

  create_table "solid_queue_blocked_executions", force: :cascade do |t|
    t.integer "job_id", null: false
    t.string "concurrency_key", null: false
    t.datetime "expires_at", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["expires_at", "concurrency_key"], name: "idx_sq_blocked_exec_expires_concurrency"
    t.index ["job_id"], name: "index_solid_queue_blocked_executions_on_job_id", unique: true
  end

  create_table "solid_queue_claimed_executions", force: :cascade do |t|
    t.integer "job_id", null: false
    t.bigint "process_id", null: false
    t.datetime "expires_at", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["job_id"], name: "index_solid_queue_claimed_executions_on_job_id", unique: true
    t.index ["process_id", "expires_at"], name: "idx_sq_claimed_exec_proc_exp"
  end

  create_table "solid_queue_failed_executions", force: :cascade do |t|
    t.integer "job_id", null: false
    t.text "error"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["job_id"], name: "index_solid_queue_failed_executions_on_job_id", unique: true
  end

  create_table "solid_queue_jobs", force: :cascade do |t|
    t.string "queue_name", null: false
    t.string "class_name", null: false
    t.text "arguments"
    t.integer "priority", default: 0, null: false
    t.datetime "scheduled_at"
    t.datetime "finished_at"
    t.string "concurrency_key"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "active_job_id"
    t.index ["active_job_id"], name: "index_solid_queue_jobs_on_active_job_id"
    t.index ["concurrency_key"], name: "idx_sq_jobs_concurrency_key"
    t.index ["queue_name", "priority", "id"], name: "idx_sq_jobs_queue_prio_id"
    t.index ["scheduled_at", "priority", "id"], name: "idx_sq_jobs_sched_prio_id"
  end

  create_table "solid_queue_ready_executions", force: :cascade do |t|
    t.integer "job_id", null: false
    t.string "queue_name", null: false
    t.integer "priority", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["job_id"], name: "index_solid_queue_ready_executions_on_job_id", unique: true
    t.index ["queue_name", "priority", "job_id"], name: "idx_sq_ready_exec_queue_prio_job"
  end

  create_table "solid_queue_recurring_executions", force: :cascade do |t|
    t.integer "job_id", null: false
    t.string "task_key", null: false
    t.datetime "run_at", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["job_id"], name: "index_solid_queue_recurring_executions_on_job_id", unique: true
    t.index ["task_key", "run_at"], name: "idx_sq_recurring_exec_task_run"
  end

  create_table "solid_queue_scheduled_executions", force: :cascade do |t|
    t.integer "job_id", null: false
    t.string "queue_name", null: false
    t.integer "priority", default: 0, null: false
    t.datetime "scheduled_at", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["job_id"], name: "index_solid_queue_scheduled_executions_on_job_id", unique: true
    t.index ["scheduled_at", "priority", "job_id"], name: "idx_sq_scheduled_exec_sched_prio_job"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "password_digest", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "time_zone"
    t.boolean "admin"
    t.text "bio"
    t.string "location"
    t.string "handle"
    t.string "authentication_token", limit: 510
    t.string "email_address", limit: 510
    t.index ["authentication_token"], name: "index_users_on_authentication_token"
    t.index ["email_address"], name: "index_users_on_email_address", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "assessment_answers", "assessment_entries"
  add_foreign_key "assessment_answers", "assessment_options"
  add_foreign_key "assessment_options", "assessment_questions"
  add_foreign_key "assessment_questions", "health_assessments"
  add_foreign_key "bio_profile_aggravating_foods", "bio_profiles"
  add_foreign_key "bio_profile_healing_foods", "bio_profiles"
  add_foreign_key "bio_profile_supplements", "bio_profiles"
  add_foreign_key "habit_logs", "habit_plans"
  add_foreign_key "habit_logs", "habit_plans"
  add_foreign_key "habit_plans", "habit_plan_templates"
  add_foreign_key "habit_plans", "habit_plan_templates"
  add_foreign_key "habit_plans", "users"
  add_foreign_key "plan_item_logs", "habit_logs"
  add_foreign_key "plan_item_logs", "plan_items"
  add_foreign_key "plan_item_templates", "plan_section_templates"
  add_foreign_key "plan_items", "plan_sections"
  add_foreign_key "plan_section_templates", "habit_plan_templates"
  add_foreign_key "plan_section_templates", "habit_plan_templates"
  add_foreign_key "plan_sections", "habit_plans"
  add_foreign_key "plan_sections", "habit_plans"
  add_foreign_key "sessions", "users"
end
