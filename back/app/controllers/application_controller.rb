# app/controllers/application_controller.rb
class ApplicationController < ActionController::API
    include Authenticatable
  def current_user
    header = request.headers['Authorization']
    token = header.split(' ').last if header

    decoded = JsonWebToken.decode(token)
    @current_user = User.find(decoded[:user_id]) if decoded
  rescue
    nil
  end

  def authenticate_user!
    render json: { error: 'Não autorizado' }, status: :unauthorized unless current_user
  end
end