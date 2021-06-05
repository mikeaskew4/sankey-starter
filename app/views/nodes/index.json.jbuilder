json.nodes do
  json.array! (@nodes.sort_by{|o| o[:enumerate]}), partial: "nodes/node", as: :node
end 
