class User < ApplicationRecord
  has_many :applications, dependent: :destroy

  has_secure_password

  validates :email, presence: true, uniqueness: true
  validates :name, presence: true
  validates :password, length: { minimum: 6 }, if: -> { password.present? }
end