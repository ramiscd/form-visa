class Api::AuthController < ApplicationController
  skip_before_action :authenticate_user!, only: [:login, :register]

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

  def register
  user = User.new(user_params)
  user.role ||= 'client'

  if user.save
    form = Form.first

    user.applications.create!(
      status: 'in_progress',
      form: form
    )

    token = JsonWebToken.encode(user_id: user.id)

    render json: {
      token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    }, status: :created
  else
    render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
  end
end

  private

  def user_params
    params.permit(:name, :email, :password, :password_confirmation)
  end
end