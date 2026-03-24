# app/controllers/api/auth_controller.rb
class Api::AuthController < ApplicationController
 #skip_before_action :verify_authenticity_token
    skip_before_action :authenticate_user!, only: [:login]
  def login
    user = User.find_by(email: params[:email])

    if user&.authenticate(params[:password])
      token = JsonWebToken.encode(user_id: user.id)

      render json: {
        token: token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    else
      render json: { message: 'Email ou senha inválidos' }, status: :unauthorized
    end
  end
end