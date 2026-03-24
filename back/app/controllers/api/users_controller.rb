# app/controllers/api/users_controller.rb
class Api::UsersController < ApplicationController
  #before_action :authenticate_user!

  def me
    render json: current_user
  end
end