# app/controllers/api/applications_controller.rb
class Api::ApplicationsController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_admin!, only: [:admin_index]

  def current
    application = current_user.applications.first_or_create!(
      status: 'in_progress'
    )

    render json: application_response(application)
  end

  # Método mínimo para admin
  def admin_index
    applications = Application.all.includes(:answers)
    render json: applications.map { |app| application_response(app) }
  end

  def show
    application = Application.includes(:answers, :documents, form: { sections: :questions }).find(params[:id])
    render json: application_response(application)
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Aplicação não encontrada' }, status: :not_found
  end

  private

  def authorize_admin!
    render json: { error: "Forbidden" }, status: :forbidden unless current_user.role == 'admin'
  end

 def application_response(application)
  {
    id: application.id,
    user: {
      id: application.user.id,
      name: application.user.name,
      email: application.user.email
    },
    userId: application.user.id,
    progress: calculate_progress(application),
    status: calculate_status(application),
    createdAt: application.created_at,
    updatedAt: application.updated_at,
    sections: (application.form&.sections || []).map do |section|
      {
        id: section.id,
        title: section.title,
        answers: section.questions.map do |q|
          answer = application.answers.find { |a| a.question_id == q.id }
          {
            question: q.label, # <== CORRIGIDO
            value: answer&.value
          }
        end
      }
    end,
    documents: (application.documents || []).map do |doc|
      {
        id: doc.id,
        type: doc.doc_type,
        fileName: doc.file_name,
        fileUrl: doc.file_url,
        uploadedAt: doc.created_at,
        status: doc.status
      }
    end
  }
end

  def calculate_progress(application)
    total_questions = Question.where(required: true).count
    answered = application.answers.where.not(value: [nil, ""]).count

    return 0 if total_questions == 0

    ((answered.to_f / total_questions) * 100).round
  end

  def calculate_status(application)
    progress = calculate_progress(application)
    progress >= 100 ? 'completed' : 'in_progress'
  end
end