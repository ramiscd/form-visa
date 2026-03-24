class Application < ApplicationRecord
  belongs_to :user
  has_many :answers, dependent: :destroy

  enum status: {
    in_progress: 'in_progress',
    completed: 'completed',
    submitted: 'submitted'
  }
end