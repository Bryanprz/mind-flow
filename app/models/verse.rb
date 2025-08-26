class Verse < ApplicationRecord
  # TODO - add AI vector db stuff to make each verse searchable
  belongs_to :book
end
