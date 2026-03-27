class UserMailer < ApplicationMailer
  default from: 'no-reply@yourapp.com'

  def send_form
    @form_link = params[:form_link]
    mail(to: params[:email], subject: 'Seu formulário está disponível')
  end
end