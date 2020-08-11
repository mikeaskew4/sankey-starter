class CreateLinks < ActiveRecord::Migration[5.2]
  def change
    create_table :links do |t|
      t.integer :value
      t.integer :source
      t.integer :target

      t.timestamps
    end
  end
end
