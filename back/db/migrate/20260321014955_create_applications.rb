class CreateApplications < ActiveRecord::Migration[7.1]
  def change
    create_table :applications do |t|
      t.references :user, null: false, foreign_key: true
      t.string :status
      t.integer :progress

      t.timestamps
    end
  end
end
