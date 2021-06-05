class AddTypeToNode < ActiveRecord::Migration[5.2]
  def change
    add_column :nodes, :node_type, :integer
  end
end
