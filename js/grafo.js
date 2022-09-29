function drawGraph(data) {
    var nodesByName = {};

    // Create nodes for each unique source and target.
    data.forEach(function (link) {
        link.source = nodeByName(link.BibliotecaRichiedente);
        link.target = nodeByName(link.BibliotecaPrestante);
    });

    // Extract the array of nodes from the map by name.
    var nodes = d3.values(nodesByName);

    // Create the link lines.
    var link = svg.selectAll(".link")
        .data(data)
        .enter().append("line")
        .attr("class", "link")
        .attr("stroke-width", d => 0.1 * d.NumeroLibri);  // width scaled by number


    // Create the node circles.
    var node = svg.selectAll(".node")
        .data(nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 4.5)
        .on("click", function (d) {
            console.log(this)
            //gestisciTabelle(d, this)
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
        .links(data)
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
}


// Funzioni per lo spostamento dei nodi del grafo //

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


function enfatiseLink(link, d) {
    link
        .attr("display", "none")
        .filter(l => l.source.name === d.name)
        .attr("display", "block");
}

function showAllLinks(link, d) {
    link.attr("display", "block");
}


// Funzioni per mostrare il nome del nodo del grafo

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