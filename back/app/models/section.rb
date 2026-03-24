class Section < ApplicationRecord
  belongs_to :form
  has_many :questions, -> { order(position: :asc) }, dependent: :destroy
end