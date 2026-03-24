class Form < ApplicationRecord
  has_many :sections, -> { order(position: :asc) }, dependent: :destroy
end