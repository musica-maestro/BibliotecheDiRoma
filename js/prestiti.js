var width = 800,
  height = 800;

// Define the div for the tooltip
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);


var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

var simulation = d3.forceSimulation()
  .force("link", d3.forceLink().id(function (d) { return d.id; }))
  .force("charge", d3.forceManyBody())
  .force("center", d3.forceCenter(width / 2, height / 2));


d3.csv("data/out.csv", function (error, links) {
  if (error) throw error;

  var nodesByName = {};

  // Create nodes for each unique source and target.
  links.forEach(function (link) {
    link.source = nodeByName(link.BibliotecaRichiedente);
    link.target = nodeByName(link.BibliotecaPrestante);
  });

  // Extract the array of nodes from the map by name.
  var nodes = d3.values(nodesByName);

  // Create the link lines.
  var link = svg.selectAll(".link")
    .data(links)
    .enter().append("line")
    .attr("class", "link")
    .attr("stroke-width", d => d.NumeroLibri);

    console.log(link)

  // Create the node circles.
  var node = svg.selectAll(".node")
    .data(nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", 4.5)
    .on("click", function(d){console.log(d)}) 
    .on("mouseover", function(d) {		
      div.transition()		
          .duration(200)		
          .style("opacity", .7);		
      div	.html(d.name)	
          .style("left", (d3.event.pageX) + "px")		
          .style("top", (d3.event.pageY - 28) + "px");	
      })					
  .on("mouseout", function(d) {		
      div.transition()		
          .duration(500)		
          .style("opacity", 0);	
  })
    .on("mouseenter", function(d){
      link
        .attr("display", "none")
        .filter(l => l.source.name === d.name || l.target.name === d.name)
        .attr("display", "block");
    })
    .on("mouseleave", function(d){
      link.attr("display", "block");
    });

  var drag_handler = d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);

  drag_handler(node);

  // Start the force layout.
  simulation
    .nodes(nodes)
    .on("tick", tick)

  simulation.force("link")
    .links(links)
    .strength(d => 0.01 * d.NumeroLibri);

    function tick() {
      link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
  
      node
          .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
          })
    }

  function nodeByName(name) {
    return nodesByName[name] || (nodesByName[name] = { name: name });
  }
});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

var tooltip = d3.select("body")
	.append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);
