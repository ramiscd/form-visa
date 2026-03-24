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