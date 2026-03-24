# app/controllers/api/answers_controller.rb
class Api::AnswersController < ApplicationController
    def index
    application = current_user.applications.first

    answers = application.answers.pluck(:question_id, :value).to_h

    render json: answers
    end

  def create
    application = current_user.applications.first

    answer = application.answers.find_or_initialize_by(
      question_id: params[:question_id]
    )

    answer.value = params[:value]
    answer.save!

    update_progress(application)

    render json: { success: true }
  end

  private

    def update_progress(application)
        required_questions_ids = Question.where(required: true).pluck(:id)

        answered_required = application.answers
            .where(question_id: required_questions_ids)
            .where.not(value: [nil, ''])
            .count

        total_required = required_questions_ids.count

        progress = ((answered_required.to_f / total_required) * 100).round

        application.update!(progress: progress)
    end
end