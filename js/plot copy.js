
var fontSize = 13;

var svgRace = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right + fontSize)
    .attr("height", height + margin.top + margin.bottom);

var widthScale = d3.scaleLinear()

var rectProperties = { height: 5, padding: 20}
var container = svgRace.append("g")
    .classed("container", true)
    .style("transform", "translateY(25px)")

var axisTop = svgRace
    .append('g')
    .classed('axis', true)
    .style("transform", "translate(10px, 20px)")
    .call(d3.axisTop(widthScale))


function drawRace(data) {

    widthScale.domain([0, d3.max(data, d => d.value)])
        .range([0, width - fontSize - 100])

    axisTop.call(d3.axisTop(widthScale))

    sortedRange = [...data].sort((a, b) => b.value - a.value)

    nomi = container
        .selectAll("text")
        .data(data)

    nomi.exit().remove();

    nomi.enter()
        .append("text")
        .text(d => d.key + " " + d.value)
        .transition()
        .delay(500)
        .attr("x", d => widthScale(d.value) + fontSize)
        .attr("y", (d, i) => sortedRange.findIndex(e => e.key === d.key) * (rectProperties.height + rectProperties.padding) + fontSize)

    rettangoli = container
        .selectAll("rect")
        .data(data)

    rettangoli.exit().remove();

    rettangoli.enter()
        .append("rect")
        .attr("x", 10)
        .transition()
        .delay(500)
        .attr("y", (d, i) => sortedRange.findIndex(e => e.key === d.key) * (rectProperties.height + rectProperties.padding))
        .attr("width", d => d.value <= 0 ? 0 : widthScale(d.value))
        .attr("height", 20)

}