class Application < ApplicationRecord
  belongs_to :user
  belongs_to :form
  has_many :answers, dependent: :destroy
  has_many :documents, class_name: 'Document', foreign_key: 'application_id', dependent: :destroy
  enum status: {
    in_progress: 'in_progress',
    completed: 'completed',
    submitted: 'submitted'
  }
end