var formatDateIntoYear = d3.timeFormat("%b %Y");
var formatDate = d3.timeFormat("%d %b %Y");
var parseDate = d3.timeParse("%d-%m-%Y");

var cScale = d3.scaleOrdinal(d3.schemePastel2);

var startDate, endDate

var startDatePicker = d3.select("#start-date").on("change", cambiaRange)
var endDatePicker = d3.select("#end-date").on("change", cambiaRange)

const margin = { top: 25, right: 25, bottom: 25, left: 25 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svgSlider = d3.select("#vis")
    .append("svg")
    .attr("width", width + margin.left + margin.right);

var tooltip = d3.select("#graph").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function (d) { return d; }))
    .force("x", d3.forceX(150).strength(0.05))
    .force("y", d3.forceY(75).strength(0.05))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

////////// slider //////////

var moving = false;
var currentValue = 0;
var targetValue = width;

var playButton = d3.select("#play-button");

var timeX = d3.scaleTime()

var slider
var handle
var label

var nodes
var dataset;

////////// plot //////////



d3.csv("data/fake.csv", prepare, function (data) {

    var nodesByName = {};

    // Create nodes for each unique source and target.
    data.forEach(function (link) {
        link.source = nodeByName(link.BibliotecaRichiedente);
        link.target = nodeByName(link.BibliotecaPrestante);
    });

    // Extract the array of nodes from the map by name.
    nodes = d3.values(nodesByName);
    dataset = data
    
    console.log(nodes)
    initScale(dataset)

    temp = creaDatiRace(dataset)
    initRace(temp);

    drawGraph(nodes, dataset);

    playButton
        .on("click", function () {
            var button = d3.select(this);
            if (button.text() == "Pause") {
                moving = false;
                clearInterval(timer);
                timer = 100;
                button.text("Play");
            } else {
                moving = true;
                timer = setInterval(step, 1000);
                button.text("Pause");
            }
            console.log("Slider moving: " + currentValue);
        })

    function nodeByName(name) {
        return nodesByName[name] || (nodesByName[name] = { name: name });
    }
})

function prepare(d) {
    d.Data = parseDate(d.Data);
    return d;
}

function step() {
    update(timeX.invert(currentValue));
    currentValue = currentValue + (targetValue / 151);
    if (currentValue > targetValue) {
        moving = false;
        currentValue = 0;
        clearInterval(timer);
        // timer = 0;
        playButton.text("Play");
        console.log("Slider moving: " + currentValue);
    }
}

function update(h) {
    // update position and text of label according to slider scale
    handle.attr("cx", timeX(h));

    label
        .attr("x", timeX(h))
        .text(formatDate(h));

    // filter data set and redraw plot
    var newData = dataset.filter(function (d) {
        return d.Data <= h;
    })

    temp = creaDatiRace(newData)
    updateRace(temp);
    drawGraph(nodes, newData);
}


function initScale(data){
    cScale.domain(d3.map(data, function(d) {return d.BibliotecaPrestante;}).keys()).range(d3.schemeSet2);
    startDate = d3.min(data, d => d.Data)
    endDate = d3.max(data, d => d.Data)
    parsedMin = parseForDateInput(startDate)
    parsedMax = parseForDateInput(endDate)
    startDatePicker.attr("min", parsedMin).attr("max", parsedMax).attr("value", parsedMin)
    endDatePicker.attr("min", parsedMin).attr("max", parsedMax).attr("value", parsedMax)
    setScale(data, startDate, endDate)
}


function setScale(data, startDate, endDate) {


    timeX.domain([startDate, endDate])
        .range([0, targetValue])
        .clamp(true);


    slider = svgSlider.append("g")
        .attr("class", "slider")
        .attr("transform", "translate(" + margin.left + "," + height / 5 + ")");

        
    slider.append("line")
        .attr("class", "track")
        .attr("x1", timeX.range()[0])
        .attr("x2", timeX.range()[1])
        .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-inset")
        .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-overlay")
        .call(d3.drag()
            .on("start.interrupt", function () { slider.interrupt(); })
            .on("start drag", function () {
                currentValue = d3.event.x;
                update(timeX.invert(currentValue));
            })
        );

    slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 18 + ")")
        .selectAll("text")
        .data(timeX.ticks(10))
        .enter()
        .append("text")
        .attr("x", timeX)
        .attr("y", 10)
        .attr("text-anchor", "middle")
        .text(function (d) { return formatDateIntoYear(d); });

    handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9)


    label = slider.append("text")
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .text(formatDate(startDate))
        .attr("transform", "translate(0," + (-20) + ")")


}



function parseForDateInput(parsed) {
    day = parsed.getDate()
    month = (parsed.getMonth() + 1)
    year = parsed.getFullYear()
    if (day < 10) {
        day = '0' + day
    }
    if (month < 10) {
        month = '0' + month
    }
    finalString = year + '-' + month + '-' + day
    return finalString
}

function cambiaRange(){
    startDate = startDatePicker.property("valueAsDate")
    endDate = endDatePicker.property("valueAsDate")

    slider.remove()
    currentValue = 0

    setScale(dataset, startDate, endDate)
}

function creaDatiRace(data){

    raceData = d3.nest().key(function(d){
        return d.BibliotecaRichiedente })
    .rollup(function(d){
        return d3.sum(d, function(d){
            return d.NumeroLibri;
        });
    }).entries(data)

    return raceData
}