# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20111225142902) do

  create_table "clients", :force => true do |t|
    t.string   "name"
    t.string   "name_kana"
    t.string   "tel_number"
    t.string   "fax_number"
    t.string   "web_site"
    t.string   "leadsource"
    t.string   "status"
    t.string   "priority"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "customers", :force => true do |t|
    t.string   "name"
    t.string   "kana"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "tel_number"
    t.string   "fax_number"
    t.string   "website"
    t.string   "leadsource"
    t.string   "status"
    t.string   "priority"
    t.text     "memo"
  end

  create_table "products", :force => true do |t|
    t.string   "title"
    t.string   "content"
    t.text     "description"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", :force => true do |t|
    t.string   "name",       :limit => 100, :null => false
    t.string   "password"
    t.boolean  "del_flg"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
