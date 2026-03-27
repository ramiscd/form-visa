puts "Iniciando seed..."

# 1. Usuários
admin = User.find_or_create_by!(email: "admin@teste.com") do |u|
  u.name = "Admin"
  u.password = "123456"
  u.role = "admin"
end

client = User.find_or_create_by!(email: "client@teste.com") do |u|
  u.name = "Cliente Teste"
  u.password = "123456"
  u.role = "user"
end

# 2. Formulário DS-160
form = Form.find_or_create_by!(name: "Visa DS-160")

# 3. Seções e perguntas

dados_pessoais = form.sections.find_or_create_by!(title: "Dados Pessoais", position: 1) do |s|
  s.description = "Informações de identificação pessoal"
end
dados_pessoais.questions.find_or_create_by!(label: "Nome completo", position: 1) do |q|
  q.field_type = "text"
  q.required = true
end
dados_pessoais.questions.find_or_create_by!(label: "Sobrenome", position: 2) do |q|
  q.field_type = "text"
  q.required = true
end
dados_pessoais.questions.find_or_create_by!(label: "Data de nascimento", position: 3) do |q|
  q.field_type = "date"
  q.required = true
end
dados_pessoais.questions.find_or_create_by!(label: "País de nascimento", position: 4) do |q|
  q.field_type = "text"
  q.required = true
end
dados_pessoais.questions.find_or_create_by!(label: "Nacionalidade atual", position: 5) do |q|
  q.field_type = "text"
  q.required = true
end
dados_pessoais.questions.find_or_create_by!(label: "Você usou outro nome?", position: 6) do |q|
  q.field_type = "boolean"
  q.required = true
end
outro_nome = dados_pessoais.questions.find_or_create_by!(label: "Se sim, qual?", position: 7) do |q|
  q.field_type = "text"
  q.required = true
end
outro_nome.condition = {
  question_id: dados_pessoais.questions.find_by(label: "Você usou outro nome?")&.id,
  value: true
}

viagem = form.sections.find_or_create_by!(title: "Informações da Viagem", position: 2) do |s|
  s.description = "Detalhes da viagem e estadia planejada"
end
viagem.questions.find_or_create_by!(label: "Qual o propósito da viagem?", position: 1) do |q|
  q.field_type = "text"
  q.required = true
  q.placeholder = "Ex: Turismo, Negócios ou Estudos"
end
viagem.questions.find_or_create_by!(label: "Você possui planos específicos?", position: 2) do |q|
  q.field_type = "boolean"
  q.required = true
end
endereco = viagem.questions.find_or_create_by!(label: "Endereço nos EUA", position: 3) do |q|
  q.field_type = "text"
  q.required = true
end
endereco.condition = {
  question_id: viagem.questions.find_by(label: "Você possui planos específicos?")&.id,
  value: true
}
endereco_estimado = viagem.questions.find_or_create_by!(label: "Endereço nos EUA (estimado)", position: 4) do |q|
  q.field_type = "text"
  q.required = true
end
endereco_estimado.condition = {
  question_id: viagem.questions.find_by(label: "Você possui planos específicos?")&.id,
  value: false
}

acompanha = form.sections.find_or_create_by!(title: "Acompanhantes de Viagem", position: 3) do |s|
  s.description = "Informações sobre pessoas que viajam com você"
end
acompanha.questions.find_or_create_by!(label: "Você viajará acompanhado?", position: 1) do |q|
  q.field_type = "boolean"
  q.required = true
end
quem_acompanha = acompanha.questions.find_or_create_by!(label: "Quem irá com você?", position: 2) do |q|
  q.field_type = "text"
  q.required = true
end
quem_acompanha.condition = {
  question_id: acompanha.questions.find_by(label: "Você viajará acompanhado?")&.id,
  value: true
}

familia = form.sections.find_or_create_by!(title: "Informações Familiares", position: 4) do |s|
  s.description = "Informações sobre seus parentes próximos"
end
familia.questions.find_or_create_by!(label: "Nome do pai", position: 1) do |q|
  q.field_type = "text"
  q.required = true
end
familia.questions.find_or_create_by!(label: "Seu pai está nos EUA?", position: 2) do |q|
  q.field_type = "boolean"
  q.required = true
end
familia.questions.find_or_create_by!(label: "Nome da mãe", position: 3) do |q|
  q.field_type = "text"
  q.required = true
end
familia.questions.find_or_create_by!(label: "Sua mãe está nos EUA?", position: 4) do |q|
  q.field_type = "boolean"
  q.required = true
end
familia.questions.find_or_create_by!(label: "Tem outros parentes próximos nos EUA?", position: 5) do |q|
  q.field_type = "boolean"
  q.required = true
end

trabalho = form.sections.find_or_create_by!(title: "Atuação Profissional/Educação", position: 5) do |s|
  s.description = "Informações sobre emprego ou estudos atuais e anteriores"
end
trabalho.questions.find_or_create_by!(label: "Você trabalha atualmente?", position: 1) do |q|
  q.field_type = "boolean"
  q.required = true
end
detalhes_emprego = trabalho.questions.find_or_create_by!(label: "Detalhes do emprego atual (empresa, cargo, renda)", position: 2) do |q|
  q.field_type = "text"
  q.required = true
end
detalhes_emprego.condition = {
  question_id: trabalho.questions.find_by(label: "Você trabalha atualmente?")&.id,
  value: true
}
trabalho.questions.find_or_create_by!(label: "Você estudou nos últimos 5 anos?", position: 3) do |q|
  q.field_type = "boolean"
  q.required = true
end
detalhes_educacao = trabalho.questions.find_or_create_by!(label: "Detalhes de educação recente (instituição, curso)", position: 4) do |q|
  q.field_type = "text"
  q.required = true
end
detalhes_educacao.condition = {
  question_id: trabalho.questions.find_by(label: "Você estudou nos últimos 5 anos?")&.id,
  value: true
}

adicional = form.sections.find_or_create_by!(title: "Informações Adicionais", position: 6) do |s|
  s.description = "Perguntas diversas sobre qualificações e viagens anteriores"
end
adicional.questions.find_or_create_by!(label: "Você fala outros idiomas além do português?", position: 1) do |q|
  q.field_type = "boolean"
  q.required = true
end
idiomas = adicional.questions.find_or_create_by!(label: "Liste os idiomas que fala", position: 2) do |q|
  q.field_type = "text"
  q.required = true
end

idiomas.condition = {
  question_id: adicional.questions.find_by(label: "Você fala outros idiomas além do português?")&.id,
  value: true
}
idiomas.save!
adicional.questions.find_or_create_by!(label: "Viajou para outro país nos últimos 5 anos?", position: 3) do |q|
  q.field_type = "boolean"
  q.required = true
end
paises = adicional.questions.find_or_create_by!(label: "Quais países visitou nos últimos 5 anos?", position: 4) do |q|
  q.field_type = "text"
  q.required = true
end
paises.condition = {
  question_id: adicional.questions.find_by(label: "Viajou para outro país nos últimos 5 anos?")&.id,
  value: true
}

seguranca = form.sections.find_or_create_by!(title: "Segurança e Antecedentes", position: 7) do |s|
  s.description = "Perguntas sobre saúde, antecedentes criminais e segurança"
end
seguranca.questions.find_or_create_by!(label: "Você tem doença transmissível?", position: 1) do |q|
  q.field_type = "boolean"
  q.required = true
end
seguranca.questions.find_or_create_by!(label: "Você tem distúrbio físico ou mental grave?", position: 2) do |q|
  q.field_type = "boolean"
  q.required = true
end
seguranca.questions.find_or_create_by!(label: "Você já foi preso ou condenado?", position: 3) do |q|
  q.field_type = "boolean"
  q.required = true
end
seguranca.questions.find_or_create_by!(label: "Possui histórico de uso de drogas?", position: 4) do |q|
  q.field_type = "boolean"
  q.required = true
end
seguranca.questions.find_or_create_by!(label: "Já esteve envolvido em terrorismo ou espionagem?", position: 5) do |q|
  q.field_type = "boolean"
  q.required = true
end

# 4. Aplicação de exemplo e respostas fictícias
application = Application.find_or_create_by!(user: client, form: form) do |a|
  a.status = "in_progress"
end

form.sections.each do |section|
  section.questions.each do |q|
    Answer.find_or_create_by!(application: application, question: q) do |a|
      a.value = case q.field_type
                when "text" then "Teste #{q.label}"
                when "date" then Date.new(1990,1,1).to_s
                when "boolean" then [true, false].sample
                else nil
                end
    end
  end
end

puts "Seed concluído!"
