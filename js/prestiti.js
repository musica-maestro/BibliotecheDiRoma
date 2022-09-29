var margin = {top:50, right:50, bottom:0, left:50},
  width = 500 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var data;
var dateMin;
var dateMax;

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

var colorScale = d3.scaleOrdinal(d3.schemePastel2);
var timeScale = d3.scaleTime()

var startDate = d3.select("#start-date")
var endDate = d3.select("#end-date")

var parseDate = d3.timeParse("%d-%m-%Y");

function setScale(data) {

  dateMin = d3.min(data, d => parseDate(d.Data))
  dateMax = d3.max(data, d => parseDate(d.Data))

  parsedMin = parseForDateInput(dateMin)
  parsedMax = parseForDateInput(dateMax)


  startDate.attr("min", parsedMin).attr("max", parsedMax).attr("value", parsedMin)
  endDate.attr("min", parsedMin).attr("max", parsedMax).attr("value", parsedMax)


  timeScale.domain([dateMin, dateMax])
    .ticks(1000)


}



// Load data
d3.csv("data/fake.csv", function (error, links) {
  if (error) throw error;
  data = links

  setScale(data)

  var filtered = data.filter(function (d) {
    if (parseDate(d["Data"]) <= dateMax)
      return d;
  })

  drawGraph(filtered)

  playButton
    .on("click", function() {
    var button = d3.select(this);
    if (button.text() == "Pause") {
      moving = false;
      clearInterval(timer);
      // timer = 0;
      button.text("Play");
    } else {
      moving = true;
      timer = setInterval(step, 100);
      button.text("Pause");
    }
    console.log("Slider moving: " + moving);
  })
});


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