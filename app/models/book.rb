class Book < ApplicationRecord
  enum :category, { classical: 0, modern: 1 }
  has_many :verses

  before_save :set_slug

  def to_param
    slug
  end

  private

  def set_slug
    self.slug = title.parameterize
  end
end

