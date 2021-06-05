class AddEnumerateToNode < ActiveRecord::Migration[5.2]
  def change
    add_column :nodes, :enumerate, :string
  end
end
