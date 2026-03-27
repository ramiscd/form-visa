class WebhooksController < ApplicationController
  skip_before_action :authenticate_user!

  # Recebe POST do Asaas
  def asaas
    # Validar token para segurança
    token = request.headers['Authorization']
    unless ActiveSupport::SecurityUtils.secure_compare(token.to_s, ENV['ASAAS_WEBHOOK_TOKEN'])
      return head :unauthorized
    end

    event = params[:event] # Ex: "PAYMENT_CONFIRMED" ou "PAYMENT_RECEIVED"
    payment_data = params[:payment] || {}

    # Só processa se pagamento confirmado
    if %w[PAYMENT_CONFIRMED PAYMENT_RECEIVED].include?(event)
      user_email = payment_data[:customer][:email] || payment_data['customer']['email']
      send_form_email(user_email) if user_email.present?
    end

    head :ok
  end

  private

  def send_form_email(email)
    UserMailer.with(email: email, form_link: ENV['FRONTEND_FORM_URL']).send_form.deliver_later
  end
end