class Api::DocumentsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_application

  def index
    render json: @application.documents.order(created_at: :desc).map { |doc| document_response(doc) }
  end

  def create
    file = params.require(:file)
    doc_type = params.require(:type)

    document = @application.documents.new(
      doc_type: doc_type,
      file_name: file.original_filename,
      status: 'pending'
    )

    document.file.attach(file)

    if document.save
      render json: document_response(document), status: :created
    else
      render json: { errors: document.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    document = @application.documents.find(params[:id])
    document.destroy

    render json: { success: true }
  end

  private

  def set_application
    @application = current_user.applications.first_or_create!(status: 'in_progress')
  end

  def document_response(doc)
    {
      id: doc.id,
      type: doc.doc_type,
      fileName: doc.file_name,
      fileUrl: file_url_for(doc),
      uploadedAt: doc.created_at,
      status: doc.status
    }
  end

  def file_url_for(doc)
    return url_for(doc.file) if doc.file.attached?

    doc.file_url
  end
end