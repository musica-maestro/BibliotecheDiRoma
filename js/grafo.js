const marginGraph = { top: 25, right: 25, bottom: 25, left: 25 },
    widthGraph = 720 - marginGraph.left - marginGraph.right,
    heightGraph = 400 - marginGraph.top - marginGraph.bottom;

var svgGraph = d3.select("#graph")
    .append("svg")
    .attr("width", widthGraph + marginGraph.left + marginGraph.right)
    .attr("height", heightGraph + marginGraph.top + marginGraph.bottom);

    var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function (d) { return d; }))
    .force("x", d3.forceX(150).strength(0.05))
    .force("y", d3.forceY(75).strength(0.05))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

    var tooltip = d3.select("#graph").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

linkGroup = svgGraph.append("g")
    .attr("class", "links")

nodeGroup = svgGraph.append("g")
    .attr("class", "nodes")

function drawGraph(graphNodes, graphLinks) {
    

    simulation.alpha(0.3).restart();

    // Redefine and restart simulation
    simulation.nodes(graphNodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graphLinks);

    // Update links
    link = linkGroup
        .selectAll("line")
        .data(graphLinks);

    console.log(link)

    link.exit().remove();

    // Enter links
    linkEnter = link
        .enter().append("line");

    link = linkEnter
        .merge(link);


    // Update the nodes
    node = nodeGroup.selectAll("circle").data(graphNodes);

    // Enter any new nodes
    nodeEnter = node.enter().append("circle")
        .attr("r", 5)
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
        })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    node = nodeEnter.merge(node);

    // Exit any old nodes
    node.exit().remove();



    function ticked() {
        link
            .attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });

        node
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; });
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