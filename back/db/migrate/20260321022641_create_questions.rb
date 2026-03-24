class CreateQuestions < ActiveRecord::Migration[7.1]
  def change
    create_table :questions do |t|
      t.references :section, null: false, foreign_key: true
      t.string :label
      t.string :field_type
      t.boolean :required
      t.integer :position
      t.string :placeholder

      t.timestamps
    end
  end
end
