var units = "Nodes";

var margin = {top: 1, right: 240, bottom: 6, left: 400},
    width = 1440 - margin.left - margin.right,
    height = 3000 - margin.top - margin.bottom;

var formatNumber = d3.format(",.0f"),
    format = function(d) { return formatNumber(d) + " TWh"; },
    color = d3.scale.category20();

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(36)
    .nodePadding(40)
    .align('center') 
    .size([width, height]);



var path = sankey.link();

// load the data
d3.json("/links.json", function(error, graph) {
// create hash of nodes
    var nodeHash = {};
    graph.nodes.forEach(function(d){
        nodeHash[d.id] = d;
        d.order = d.enumerate ? parseFloat(d.enumerate) : 100;
    });
    // loop links and swap out string for object
    graph.links.forEach(function(d){
        d.source = nodeHash[d.source];
        d.target = nodeHash[d.target];
        d.value = d.value ? d.value : 2;
    });
    graph.nodes = graph.nodes.sort(function(a, b){return a.order - b.order});

    sankey
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(32);

    strip_intermediate(graph.nodes, graph.links);

    console.log(graph);
    console.log(sankey);

    var link = svg.append("g").selectAll(".link")
        .data(graph.links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", path)
        .attr("id", function(d,i){
            d.id = i;
            return "link-"+i;
        })
        .style("stroke-width", function(d) { return Math.max(1, d.dy); })
        .sort(function(a, b) { return b.dy - a.dy; });

    link.append("title")
        .text(function(d) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });

    var node = svg.append("g").selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("data-color", "red")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .on("click",highlight_node_links)
        .call(d3.behavior.drag()
            .origin(function(d) { return d; })
            // interfering with click .on("dragstart", function() { this.parentNode.appendChild(this); })
            .on("drag", dragmove));

    node.append("rect")
        .attr("height", function(d) { return d.dy; })
        .attr("width", sankey.nodeWidth())
        // d.color
        // .style("fill", function(d) { return d.color = color(d.name.replace(/ .*/, "")); })
        // .style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
        // .style("fill", function(d) { return d.color })
        // .style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
        .style("fill", function(d) { if (d.color !== '#ffc107') { return d.color } else { return '#333'} })
        .style("stroke", '#ddd')

        .append("title")
        .text(function(d) { return (d.enumerate ? d.enumerate + ' ' : '') + d.name + "\n" + format(d.value); });

    node.append("text")
        .attr("x", 48)
        .attr("y", function(d) { return d.dy / 2; })
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .attr("transform", null)
        .text(function(d) { 
            if(d.sourceLinks.length + d.targetLinks.length > 0) {
                return (d.node_type == 1 ? 'T' : 'C') + (d.enumerate ? d.enumerate + ' ' : '') + d.name; 
            }
        })
        .filter(function(d) { return d.x < width / 2; })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");

    function dragmove(d) {
        d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
        sankey.relayout();
        link.attr("d", path);
    }

    function highlight_node_links(node,i){
        d3.selectAll('path').style("stroke-opacity", 0.2);
        var remainingNodes=[],
            nextNodes=[];

        var stroke_opacity = 0;
        if( d3.select(this).attr("data-clicked") == "1" ){
            d3.select(this).attr("data-clicked","0");
            stroke_opacity = 0.2;
        }else{
            d3.select(this).attr("data-clicked","1");
            stroke_opacity = 0.5;
        }

        var traverse = [{
            linkType : "sourceLinks",
            nodeType : "target"
        },{
            linkType : "targetLinks",
            nodeType : "source"
        }];

        traverse.forEach(function(step){
            node[step.linkType].forEach(function(link) {
                remainingNodes.push(link[step.nodeType]);
                highlight_link(link.id, stroke_opacity);
            });

            while (remainingNodes.length && x < nodes.length) {
                nextNodes = [];
                remainingNodes.forEach(function(node) {
                    node[step.linkType].forEach(function(link) {
                        nextNodes.push(link[step.nodeType]);
                        highlight_link(link.id, stroke_opacity);
                    });
                });
                remainingNodes = nextNodes;
            }
        });
    }

    function highlight_link(id,opacity){

        d3.select("#link-"+id).style("stroke-opacity", opacity);
    }

    var node = svg.append("g").selectAll(".node")
        .data(graph)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .call(d3.behavior.drag()
            .origin(function(d) { return d; })
            .on("dragstart", function() { this.parentNode.appendChild(this); })
            .on("drag", dragmove));

    node.append("rect")
        .attr("height", function(d) { return d.dy; })
        .attr("width", sankey.nodeWidth())
        // .style("fill", function(d) { return d.color = color(d.name.replace(/ .*/, "")); })
        .style("fill", function(d) { return d.color })
        .style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
        .append("title")
        .text(function(d) { return d.name + "\n" + format(d.value); });

    node.append("text")
        .attr("x", -6)
        .attr("y", function(d) { return d.dy / 2; })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function(d) { return d.name; })
        .filter(function(d) { return d.x < width / 2; })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");

    svg.selectAll(".link")
        .style('stroke', function(d){
            return d.source.color;
        })

    function dragmove(d) {
        d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
        sankey.relayout();
        link.attr("d", path);
    }
});

// $('#sort').on('click', function() {
//     console.log('foo');
//     d3.select("#chart")
//         .selectAll("node")
//         .datum((d,i,nodes) => +nodes[i].getAttribute("r"))
//         .sort((a,b) => b - a)
//         .attr("y", (d, i) => i * 20);
// })

// d3.select("#sort")
//     .on("click", function(){
//         console.log('bar');
//     })

function sortJSON(arr, key, way) {
    return arr.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        if (way === '123') { return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
        if (way === '321') { return ((x > y) ? -1 : ((x < y) ? 1 : 0)); }
    });
}

$(document).ready(function () {

    $.ajax({
        type: 'GET',
        url: '/links.json',
        success: function (data) {

            $.each(data.nodes, function (d) {
                if (data.nodes[d].node_type == 1) {
                    console.log(data.nodes[d]);
                    var name = 'T' + data.nodes[d].enumerate + ' ' + data.nodes[d].name,
                        color = data.nodes[d].color;
                    $('#key').append('<div class="col" style="background: ' + color + ' ">'  + name + '</div>');
                }
            })
            // var names = data
            // $('#key').html(data);

        }
    });
});