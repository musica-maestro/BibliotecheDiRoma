var width = 400,
  height = 400;

var data;

// Define the div for the tooltip
var tooltip = d3.select("#graph").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// Define the graph
var svg = d3.select("#graph").append("svg")
  .attr("width", width)
  .attr("height", height);

// Define the simulation
var simulation = d3.forceSimulation()
  .force("link", d3.forceLink().id(function (d) { return d.id; }))
  .force("charge", d3.forceManyBody())
  .force("center", d3.forceCenter(width / 2, height / 2));


var caption1 = d3.select('#caption1')
var caption2 = d3.select('#caption2')


// Load data
d3.csv("data/fake.csv", function (error, links) {
  if (error) throw error;

  data = links

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
    .attr("stroke-width", d => 0.1 * d.NumeroLibri);  // width scaled by number

  console.log(nodes)

  // Create the node circles.
  var node = svg.selectAll(".node")
    .data(nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", 4.5)
    .on("click", function (d) {
      gestisciTabelle(d)
    })
    .on("mouseenter", function (d) {
      enfatiseLink(link, d)
      showTooltip(d)
    })
    .on("mouseleave", function (d) {
      showAllLinks(link, d)
      deshowTooltip(d)
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
    .strength(d => 0.005);

  function tick() {
    link
      .attr("x1", function (d) { return d.source.x; })
      .attr("y1", function (d) { return d.source.y; })
      .attr("x2", function (d) { return d.target.x; })
      .attr("y2", function (d) { return d.target.y; });

    node
      .attr("transform", function (d) {
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

function showTooltip(d) {
  tooltip.transition()
    .duration(200)
    .style("opacity", .7);
  tooltip.html(d.name)
    .style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY - 28) + "px");
}

function deshowTooltip(d) {
  tooltip.transition()
    .duration(500)
    .style("opacity", 0);
}

function enfatiseLink(link, d) {
  link
    .attr("display", "none")
    .filter(l => l.source.name === d.name)
    .attr("display", "block");
}

function showAllLinks(link, d) {
  link.attr("display", "block");
}

function gestisciTabelle(d) {

  switch (true) {

    case (caption1.html() == d.name):
      caption1.html("Seleziona Biblioteca 1")
      //rimuoviTabella()
      break

    case (caption2.html() == d.name):
      caption2.html("Seleziona Biblioteca 2")
      //rimuoviTabella()
      break

    case (caption1.html() == "Seleziona Biblioteca 1"):
      caption1.html(d.name)
      creaTabella(d.name, 'table1')
      break

    case (caption2.html() == "Seleziona Biblioteca 2"):
      caption2.html(d.name)
      creaTabella(d.name, 'table2')
      break
  }
}

function creaTabella(BibliotecaRichiedente, selection) {
  var filtered = data.filter(function (d) {
    if (d["BibliotecaRichiedente"] == BibliotecaRichiedente)
      return d;
  })
  creaTabellaHtml(filtered, ['BibliotecaPrestante', 'NumeroLibri', 'Tipologia'], selection)
}

function creaTabellaHtml(data, columns, selection) {
  var table = d3.select('#' + selection)
  var thead = d3.select('#' + selection + '_head')
  var tbody = d3.select('#' + selection + '_body')

  console.log(selection)

  // append the header row
  thead.append('tr')
    .selectAll('th')
    .data(columns).enter()
    .append('th')
    .text(function (column) { return column; });

  // create a row for each object in the data
  var rows = tbody.selectAll('tr')
    .data(data)
    .enter()
    .append('tr');

  // create a cell in each row for each column
  var cells = rows.selectAll('td')
    .data(function (row) {
      return columns.map(function (column) {
        return { column: column, value: row[column] };
      });
    })
    .enter()
    .append('td')
    .text(function (d) { return d.value; });

  return table;
}