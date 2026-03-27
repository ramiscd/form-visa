class Document < ApplicationRecord
  belongs_to :application

  has_one_attached :file

  validates :doc_type, presence: true
  validates :status, presence: true, inclusion: { in: %w[pending approved rejected] }

  validate :file_presence

  private

  def file_presence
    errors.add(:file, "precisa ser enviado") unless file.attached?
  end
end