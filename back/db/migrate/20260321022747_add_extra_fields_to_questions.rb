rails db:migrateclass AddExtraFieldsToQuestions < ActiveRecord::Migration[7.1]
  def change
    add_column :questions, :options, :jsonb
    add_column :questions, :condition, :jsonb
  end
end
