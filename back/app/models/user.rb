# app/models/user.rb
class User < ApplicationRecord
    has_many :applications, dependent: :destroy
    has_secure_password
end