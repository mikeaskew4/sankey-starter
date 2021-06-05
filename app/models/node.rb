class Node < ApplicationRecord
  # attr_accessor :links	
  # has_many :node_links, dependent: :destroy
  # has_many :links, :through => :node_links
  has_many :links, foreign_key: "source", dependent: :destroy, autosave: true
  has_many :nodes, through: :links

  accepts_nested_attributes_for :links, allow_destroy: true
end
