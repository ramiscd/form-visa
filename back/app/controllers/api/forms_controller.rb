# app/controllers/api/forms_controller.rb
class Api::FormsController < ApplicationController
  def show
    form = Form.includes(sections: :questions).first

    render json: {
    sections: form.sections.map do |section|
        {
        id: section.id,
        title: section.title,
        description: section.description,
        questions: section.questions.map do |q|
            {
            id: q.id,
            type: q.field_type,
            label: q.label,
            required: q.required,
            placeholder: q.placeholder,
            options: q.options,
            condition: q.condition
            }
        end
        }
    end
    }
  end
end