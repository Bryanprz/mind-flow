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

ActiveRecord::Schema[8.0].define(version: 2025_10_01_025649) do
  create_table "solid_cable_broadcasts", force: :cascade do |t|
    t.string "channel", null: false
    t.text "payload", null: false
    t.datetime "created_at", null: false
    t.index ["channel", "created_at"], name: "index_solid_cable_broadcasts_on_channel_and_created_at"
    t.index ["id"], name: "index_solid_cable_broadcasts_on_id_unique", unique: true
  end
end
