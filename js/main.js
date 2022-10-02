/* Scala per i colori */
var cScale = d3.scaleOrdinal(d3.schemePastel2);

var nodes
var dataset;


const margin = { top: 25, right: 50, bottom: 25, left: 50 },
    width = 300
    height = 400

////////// Slider //////////

var moving = false;
var currentValue = 0;
var targetValue = width;

var playButton = d3.select("#play-button");

var timeX = d3.scaleTime()

var slider
var handle
var label

var svgSlider = d3.select("#vis")
    .append("svg")
    .attr("width", width + margin.left + margin.right);

/* Formatter per le date */
var formatDateIntoYear = d3.timeFormat("%b %Y");
var formatDate = d3.timeFormat("%d %b %Y");
var parseDate = d3.timeParse("%d-%m-%Y");

/* Selettori per le date */
var startDate, endDate
var startDatePicker = d3.select("#start-date").on("change", cambiaRange)
var endDatePicker = d3.select("#end-date").on("change", cambiaRange)

function cambiaRange() {
    startDate = startDatePicker.property("valueAsDate")
    endDate = endDatePicker.property("valueAsDate")

    slider.remove()
    currentValue = 0

    setSliderScale(dataset, startDate, endDate)
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

    tempRichiedenti = creaDatiRace(newData, true)
    tempPrestanti = creaDatiRace(newData, false)

    racePrestanti(tempPrestanti);
    raceRichiedenti(tempRichiedenti);
    drawGraph(nodes, newData);
}

function setSliderScale(data, startDate, endDate) {

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


function parseDateInput(parsed) {
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
////////// scales //////////



function initScale(data) {
    cScale.domain(d3.map(data, function (d) { return d.BibliotecaPrestante; }).keys()).range(d3.schemeSet2);
    startDate = d3.min(data, d => d.Data)
    endDate = d3.max(data, d => d.Data)
    parsedMin = parseDateInput(startDate)
    parsedMax = parseDateInput(endDate)
    startDatePicker.attr("min", parsedMin).attr("max", parsedMax).attr("value", parsedMin)
    endDatePicker.attr("min", parsedMin).attr("max", parsedMax).attr("value", parsedMax)
    setSliderScale(data, startDate, endDate)
}


function creaDatiRace(data, richiedente) {

    if (richiedente) {

        raceData = d3.nest().key(function (d) {
            return d.BibliotecaRichiedente
        })
            .rollup(function (d) {
                return d3.sum(d, function (d) {
                    return d.NumeroLibri;
                });
            }).entries(data)
    }
    else {
        raceData = d3.nest().key(function (d) {
            return d.BibliotecaPrestante
        })
            .rollup(function (d) {
                return d3.sum(d, function (d) {
                    return d.NumeroLibri;
                });
            }).entries(data)
    }

    return raceData
}


/* Leggi i dati e inizia a disegnare */
d3.csv("data/fake.csv", prepare, function (data) {

    var nodesByName = {}

    // Crea un nodo per ogni sorgente e destinazione unica.
    data.forEach(function (link) {
        link.source = nodeByName(link.BibliotecaRichiedente);
        link.target = nodeByName(link.BibliotecaPrestante);
    });

    nodes = d3.values(nodesByName) // Estrai l'array dei nodi
    dataset = data

    initScale(dataset) // Inizializza le scale 

    // Crea e plotta le race chart
    tempRichiedenti = creaDatiRace(dataset, true)
    tempPrestanti = creaDatiRace(dataset, false)
    racePrestanti(tempPrestanti);
    raceRichiedenti(tempRichiedenti);

    // plotta il grafo
    drawGraph(nodes, dataset);

    // abilita il play
    playButton
        .on("click", function () {
            var button = d3.select(this);
            if (button.text() == "Pause") {
                moving = false;
                clearInterval(timer);
                button.text("Play");
            } else {
                moving = true;
                timer = setInterval(step, 1000);    // un secondo per ogni step
                button.text("Pause");
            }
        })

    function nodeByName(name) {
        return nodesByName[name] || (nodesByName[name] = { name: name });
    }
})

function prepare(d) {
    d.Data = parseDate(d.Data);
    return d;
}