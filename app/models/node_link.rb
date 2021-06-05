class NodeLink < ApplicationRecord
	belongs_to :source_id, :class_name => 'Node'
	belongs_to :target_id, :class_name => 'Node'
end
