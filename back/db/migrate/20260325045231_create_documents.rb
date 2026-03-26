class CreateDocuments < ActiveRecord::Migration[7.1]
  def change
    create_table :documents do |t|
      t.references :application, null: false, foreign_key: true
      t.string :doc_type
      t.string :file_name
      t.string :file_url
      t.string :status

      t.timestamps
    end
  end
end
