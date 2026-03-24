class Answer < ApplicationRecord
  belongs_to :application
  belongs_to :question

  validates :question_id, uniqueness: { scope: :application_id }
end
