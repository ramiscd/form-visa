module Authenticatable
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_user!
  end

  private

  def authenticate_user!
    header = request.headers['Authorization']
    token = header.split(' ').last if header

    decoded = JsonWebToken.decode(token)
    @current_user = User.find(decoded[:user_id])
  rescue
    render json: { message: 'Não autorizado' }, status: :unauthorized
  end

  def current_user
    @current_user
  end
end