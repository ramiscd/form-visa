class Application < ApplicationRecord
  belongs_to :user
  belongs_to :form

  has_many :answers, dependent: :destroy
  has_many :documents, dependent: :destroy

  enum status: {
    in_progress: 'in_progress',
    completed: 'completed',
    submitted: 'submitted'
  }
end