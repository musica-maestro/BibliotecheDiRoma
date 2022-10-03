const marginGraph = { top: 25, right: 25, bottom: 25, left: 25 },
    widthGraph = 900 - marginGraph.left - marginGraph.right,
    heightGraph = 600 - marginGraph.top - marginGraph.bottom;

var svgGraph = d3.select("#graph")
    .append("svg")
    .attr("width", widthGraph)
    .attr("height", heightGraph)
    .attr("viewBox", [-widthGraph / 2, -heightGraph / 2, widthGraph, heightGraph]);

    var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(d => d.id).distance(50))
    .force("charge", d3.forceManyBody().strength(-200))
    .force("x", d3.forceX())
    .force("y", d3.forceY())


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
        .attr("r", 8)
        .attr("stroke", "black")
        .attr('class', d => `ball ${d.name.replace(/\s/g, '_')}`)
        .on("click", function (d) {
            evidenzia(d.name)
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
        .style("left", (d3.event.pageX - widthGraph + 100) + "px")
        .style("top", (d3.event.pageY - 160) + "px");
}

function deshowTooltip(d) {
    tooltip.transition()
        .duration(500)
        .style("opacity", 0);
}

function evidenzia(name){

    classNameBars = 'rect.bar.'+`${name.replace(/\s/g, '_')}`
    classNameBalls = 'circle.ball.'+`${name.replace(/\s/g, '_')}`
    barsEvidenziate = d3.selectAll(classNameBars)
    ballsEvidenziate = d3.selectAll(classNameBalls)

    if(ballsEvidenziate.attr("fill") == null){
        ballsEvidenziate.attr("fill", cScale(name))
        if( barsEvidenziate.size() != 0 && barsEvidenziate.attr("stroke") == null){
            barsEvidenziate.attr("stroke", "black").attr("stroke-width", 4)
        }
    }
    else{
        ballsEvidenziate.attr("fill", null)
        barsEvidenziate.attr("stroke", null)
    }
}

function checkEvidenziato(){
    ballsEvidenziate = d3.selectAll("circle")
    .filter(function() {
      return d3.select(this).attr("fill") != null; // filter by single attribute
    })

    if(ballsEvidenziate.size() != 0)
        ballsEvidenziate.each(function(d,i) {
            nome = d3.select(this).attr("class").split(' ')[1];
            classNameBars = 'rect.bar.'+`${nome.replace(/\s/g, '_')}`
            barsDaEvidenziare = d3.selectAll(classNameBars)
            barsDaEvidenziare.attr("stroke", "black").attr("stroke-width", 4)
        })
}