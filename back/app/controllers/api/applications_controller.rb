# app/controllers/api/applications_controller.rb
class Api::ApplicationsController < ApplicationController
  def current
    application = current_user.applications.first_or_create!(
        status: 'in_progress',
        progress: 0
    )

    unless application
      application = current_user.applications.create!(
        status: 'in_progress',
        progress: 0
      )
    end

    render json: application
  end
end