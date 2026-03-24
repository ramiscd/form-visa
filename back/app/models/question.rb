class Question < ApplicationRecord
  belongs_to :section
  has_many :answers, dependent: :destroy

  enum field_type: {
    text: 'text',
    textarea: 'textarea',
    select: 'select',
    boolean: 'boolean',
    date: 'date'
  }, _prefix: true
end