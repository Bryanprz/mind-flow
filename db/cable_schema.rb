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

ActiveRecord::Schema[8.0].define(version: 2025_10_01_044158) do
  create_table "solid_cable_messages", force: :cascade do |t|
    t.string "channel_class", null: false
    t.text "channel_parameters"
    t.text "channel_identifier", null: false
    t.text "data", null: false
    t.bigint "stream_id", null: false
    t.string "stream_name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["channel_identifier", "stream_name"], name: "solid_cable_message_compound_primary_key", unique: true
    t.index ["stream_name"], name: "index_solid_cable_messages_on_stream_name"
  end

  create_table "solid_cable_processes", force: :cascade do |t|
    t.string "process_id", null: false
    t.datetime "last_heartbeat_at", null: false
    t.datetime "created_at", null: false
    t.index ["process_id"], name: "index_solid_cable_processes_on_process_id", unique: true
  end
end
