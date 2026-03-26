# db/seeds.rb

puts "Iniciando seed..."

# 1. Cria usuários
admin = User.find_or_create_by!(email: "admin@teste.com") do |u|
  u.name = "Admin Teste"
  u.password = "123456"
  u.role = "admin"
end

client = User.find_or_create_by!(email: "client@teste.com") do |u|
  u.name = "Ramis Teste client"
  u.password = "123456"
  u.role = "user"
end

puts "Usuários criados."

# 2. Cria formulário
form = Form.find_or_create_by!(name: "Visa Form") do |f|
  f.description = "Formulário de solicitação de visto"
end

# 3. Seções e perguntas
personal = form.sections.find_or_create_by!(title: "Dados Pessoais", position: 1) do |s|
  s.description = "Informações básicas"
end

personal.questions.find_or_create_by!(label: "Nome completo", position: 1) do |q|
  q.field_type = "text"
  q.required = true
  q.placeholder = "Digite seu nome"
end

personal.questions.find_or_create_by!(label: "Data de nascimento", position: 2) do |q|
  q.field_type = "date"
  q.required = true
end

travel = form.sections.find_or_create_by!(title: "Viagens", position: 2) do |s|
  s.description = "Histórico"
end

travel.questions.find_or_create_by!(label: "Já foi para os EUA?", position: 1) do |q|
  q.field_type = "boolean"
  q.required = true
end

travel.questions.find_or_create_by!(label: "Quando foi?", position: 2) do |q|
  q.field_type = "text"
  q.required = true
  # Dependência condicional (se quiser implementar lógica condicional no front)
  q.condition = { question_id: travel.questions.find_by(label: "Já foi para os EUA?")&.id, value: true }
end

puts "Formulário, seções e perguntas criadas."

# 4. Aplicações
application = Application.find_or_create_by!(user: client) do |a|
  a.status = "in_progress"
  a.form = form
end

puts "Aplicação criada."

# 5. Respostas
form.sections.each do |section|
  section.questions.each do |q|
    Answer.find_or_create_by!(application: application, question: q) do |a|
      a.value = case q.field_type
                when "text" then "Teste #{q.label}"
                when "date" then Date.new(1990,1,1)
                when "boolean" then true
                else nil
                end
    end
  end
end

puts "Respostas adicionadas."

# 6. Documentos de teste
Document.find_or_create_by!(application: application, doc_type: "passport") do |d|
  d.file_name = "passaporte.pdf"
  d.file_url = "http://localhost/passaporte.pdf"
  d.status = "approved"
end
form = Form.create!(name: "Visa Form")

personal = form.sections.create!(
  title: "Dados Pessoais",
  description: "Informações básicas",
  position: 1
)

personal.questions.create!(
  label: "Nome completo",
  field_type: "text",
  required: true,
  position: 1,
  placeholder: "Digite seu nome"
)

personal.questions.create!(
  label: "Data de nascimento",
  field_type: "date",
  required: true,
  position: 2
)

travel = form.sections.create!(
  title: "Viagens",
  description: "Histórico",
  position: 2
)

travel.questions.create!(
  label: "Já foi para os EUA?",
  field_type: "boolean",
  required: true,
  position: 1
)

travel.questions.create!(
  label: "Quando foi?",
  field_type: "text",
  required: true,
  position: 2,
  condition: { question_id: 3, value: true }
)
Document.find_or_create_by!(application: application, doc_type: "photo") do |d|
  d.file_name = "foto.jpg"
  d.file_url = "http://localhost/foto.jpg"
  d.status = "pending"
end

puts "Documentos adicionados."
puts "Seed finalizado!"