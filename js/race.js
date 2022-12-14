const marginRace = { top: 25, right: 30, bottom: 0, left: 10 },
  widthRace = 550
heightRace = 400

var richiedentiTooltip = d3.select("#richiedenti")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px")

var prestantiTooltip = d3.select("#prestanti")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px")

var tickDuration = 500;
var top_n = 10;
let barPadding = (heightRace - (marginRace.bottom + marginRace.top)) / (top_n * 5);

var svgRaceRichiedenti = d3.select("#richiedenti").append("svg")
  .attr("width", widthRace)
  .attr("height", heightRace);

var svgRacePrestanti = d3.select("#prestanti").append("svg")
  .attr("width", widthRace)
  .attr("height", heightRace);

var raceXrichiedenti = d3.scaleLinear()
var raceYrichiedenti = d3.scaleLinear()
var xAxisRichiedenti = d3.axisTop()

var raceXprestanti = d3.scaleLinear()
var raceYprestanti = d3.scaleLinear()
var xAxisPrestanti = d3.axisTop()

var setRichiedenti = false
var setPrestanti = false

function setRaceScaleRichiedenti(data) {
  raceXrichiedenti.domain([0, d3.max(data, d => d.value)])
    .range([marginRace.left, widthRace - marginRace.right]);

  raceYrichiedenti.domain([top_n, 0])
    .range([heightRace - marginRace.bottom, marginRace.top]);

  xAxisRichiedenti.scale(raceXrichiedenti)
    .ticks(width > 500 ? 5 : 2)
    .tickSize(-(heightRace - marginRace.top - marginRace.bottom))
    .tickFormat(d => d3.format(',')(d));

  svgRaceRichiedenti.append('g')
    .attr('class', 'axis xAxisRichiedenti')
    .attr('transform', `translate(0, ${marginRace.top})`)
    .call(xAxisRichiedenti)
    .selectAll('.tick line')
    .classed('origin', d => d == 0);
}

function setRaceScalePrestanti(data) {
  raceXprestanti.domain([0, d3.max(data, d => d.value)])
    .range([marginRace.left, widthRace - marginRace.right - marginRace.left]);

  raceYprestanti.domain([top_n, 0])
    .range([heightRace - marginRace.bottom, marginRace.top]);

  xAxisPrestanti.scale(raceXprestanti)
    .ticks(width > 500 ? 5 : 2)
    .tickSize(-(heightRace - marginRace.top - marginRace.bottom))
    .tickFormat(d => d3.format(',')(d));

  svgRacePrestanti.append('g')
    .attr('class', 'axis xAxisPrestanti')
    .attr('transform', `translate(0, ${marginRace.top})`)
    .call(xAxisPrestanti)
    .selectAll('.tick line')
    .classed('origin', d => d == 0);
}



function raceRichiedenti(data, invertire) {

  // se non ho disegnato nulla inizializzo gli assi
  if (!setRichiedenti) {
    setRichiedenti = true
    setRaceScaleRichiedenti(data)
  }

  if (invertire) {
    sortedRange = [...data].sort((a, b) => a.value - b.value)
    if (sortedRange.length > 10)
      raceXrichiedenti.domain([0, sortedRange[top_n - 1].value]);
    else {
      raceXrichiedenti.domain([0, sortedRange[sortedRange.length - 1].value]);
    }
  }
  else {
    sortedRange = [...data].sort((a, b) => b.value - a.value)
    raceXrichiedenti.domain([0, d3.max(data, d => d.value)]);
  }

  svgRaceRichiedenti.select('.xAxisRichiedenti')
    .transition()
    .duration(tickDuration)
    .ease(d3.easeLinear)
    .call(xAxisRichiedenti);

  bars = svgRaceRichiedenti.selectAll('.bar').data(data, d => d.key);

  bars
    .enter()
    .append('rect')
    .attr('class', d => `bar ${d.key.replace(/\s/g, '_')}`)
    .attr('x', raceXrichiedenti(0) + 1)
    .attr('width', d => raceXrichiedenti(d.value) - raceXrichiedenti(0) - 1)
    .attr('y', d => raceYrichiedenti(top_n + 1) + 5)
    .attr('height', raceYrichiedenti(1) - raceYrichiedenti(0) - barPadding)
    .on("click", function (d) {
      evidenzia(d.key)
    })
    .on("mouseover", mouseoverRichiedenti)
    .on("mousemove", mousemoveRichiedenti)
    .on("mouseleave", mouseleaveRichiedenti)
    .style('fill', d => cScale(d.key))
    .transition()
    .duration(tickDuration)
    .ease(d3.easeLinear)
    .attr('y', d => raceYrichiedenti(sortedRange.findIndex(e => e.key === d.key)) + 5);

  bars
    .transition()
    .duration(tickDuration)
    .ease(d3.easeLinear)
    .attr('width', d => raceXrichiedenti(d.value) - raceXrichiedenti(0) - 1)
    .attr('y', d => raceYrichiedenti(sortedRange.findIndex(e => e.key === d.key)) + 5);

  bars
    .exit()
    .transition()
    .duration(tickDuration)
    .ease(d3.easeLinear)
    .attr('width', d => raceXrichiedenti(d.value) - raceXrichiedenti(0) - 1)
    .attr('y', d => raceYrichiedenti(top_n + 1) + 5)
    .remove();

  labels = svgRaceRichiedenti.selectAll('.label')
    .data(data, d => d.key);

  labels
    .enter()
    .append('text')
    .attr('class', 'label')
    .attr('font-weight', 'bold')
    .attr('x', d => raceXrichiedenti(d.value) - 8)
    .attr('y', d => raceYrichiedenti(top_n + 1) + 5 + ((raceYrichiedenti(1) - raceYrichiedenti(0)) / 2))
    .on("click", function (d) {
      evidenzia(d.key)
    })
    .style('text-anchor', 'end')
    .html(d => (d.key).split(' ')[0])
    .transition()
    .duration(tickDuration)
    .ease(d3.easeLinear)
    .attr('y', d => raceYrichiedenti(sortedRange.findIndex(e => e.key === d.key)) + 5 + ((raceYrichiedenti(1) - raceYrichiedenti(0)) / 2) + 1);


  labels
    .transition()
    .duration(tickDuration)
    .ease(d3.easeLinear)
    .attr('x', d => raceXrichiedenti(d.value) - 8)
    .attr('y', d => raceYrichiedenti(sortedRange.findIndex(e => e.key === d.key)) + 5 + ((raceYrichiedenti(1) - raceYrichiedenti(0)) / 2) + 1);

  labels
    .exit()
    .transition()
    .duration(tickDuration)
    .ease(d3.easeLinear)
    .attr('x', d => raceXrichiedenti(d.value) - 8)
    .attr('y', d => raceYrichiedenti(top_n + 1) + 5)
    .remove();

  valueLabels = svgRaceRichiedenti.selectAll('.valueLabel').data(data, d => d.key + d.value);

  valueLabels
    .exit()
    .transition()
    .duration(tickDuration)
    .ease(d3.easeLinear)
    .attr('x', d => raceXrichiedenti(d.value) + 5)
    .attr('y', d => raceYrichiedenti(top_n + 1) + 5)
    .remove();

  valueLabels
    .enter()
    .append('text')
    .attr('class', 'valueLabel')
    .attr('x', d => raceXrichiedenti(d.value) + 5)
    .attr('y', d => raceYrichiedenti(top_n + 1) + 5)
    .on("click", function (d) {
      evidenzia(d.key)
    })
    .text(d => d.value)
    .transition()
    .duration(tickDuration)
    .ease(d3.easeLinear)
    .attr('y', d => raceYrichiedenti(sortedRange.findIndex(e => e.key === d.key)) + 5 + ((raceYrichiedenti(1) - raceYrichiedenti(0)) / 2) + 1);

  valueLabels
    .transition()
    .duration(tickDuration)
    .ease(d3.easeLinear)
    .attr('x', d => raceXrichiedenti(d.value) + 5)
    .attr('y', d => raceYrichiedenti(sortedRange.findIndex(e => e.key === d.key)) + 5 + ((raceYrichiedenti(1) - raceYrichiedenti(0)) / 2) + 1)
    .tween("text", function (d) { d.value })
}

function racePrestanti(data, invertire) {
  if (!setPrestanti) {
    setPrestanti = true
    setRaceScalePrestanti(data)
  }

  if (invertire) {
    sortedRange = [...data].sort((a, b) => a.value - b.value)
    if (sortedRange.length > 10)
      raceXprestanti.domain([0, sortedRange[top_n - 1].value]);
    else {
      raceXprestanti.domain([0, sortedRange[sortedRange.length - 1].value]);
    }
  }
  else {
    sortedRange = [...data].sort((a, b) => b.value - a.value)
    raceXprestanti.domain([0, d3.max(data, d => d.value)]);
  }

  svgRacePrestanti.select('.xAxisPrestanti')
    .transition()
    .duration(tickDuration)
    .ease(d3.easeLinear)
    .call(xAxisPrestanti);

  let bars = svgRacePrestanti.selectAll('.bar').data(data, d => d.key);

  bars
    .enter()
    .append('rect')
    .attr('class', d => `bar ${d.key.replace(/\s/g, '_')}`)
    .attr('x', raceXprestanti(0) + 1)
    .attr('width', d => raceXprestanti(d.value) - raceXprestanti(0) - 1)
    .attr('y', d => raceYprestanti(top_n + 1) + 5)
    .attr('height', raceYprestanti(1) - raceYprestanti(0) - barPadding)
    .on("click", function (d) {
      evidenzia(d.key)
    })
    .on("mouseover", mouseoverPrestanti)
    .on("mousemove", mousemovePrestanti)
    .on("mouseleave", mouseleavePrestanti)
    .style('fill', d => cScale(d.key))
    .transition()
    .duration(tickDuration)
    .ease(d3.easeLinear)
    .attr('y', d => raceYprestanti(sortedRange.findIndex(e => e.key === d.key)) + 5);

  bars
    .transition()
    .duration(tickDuration)
    .ease(d3.easeLinear)
    .attr('width', d => raceXprestanti(d.value) - raceXprestanti(0) - 1)
    .attr('y', d => raceYprestanti(sortedRange.findIndex(e => e.key === d.key)) + 5);

  bars
    .exit()
    .transition()
    .duration(tickDuration)
    .ease(d3.easeLinear)
    .attr('width', d => raceXprestanti(d.value) - raceXprestanti(0) - 1)
    .attr('y', d => raceYprestanti(top_n + 1) + 5)
    .remove();

  let labels = svgRacePrestanti.selectAll('.label')
    .data(data, d => d.key);

  labels
    .enter()
    .append('text')
    .attr('class', 'label')
    .attr('x', d => raceXprestanti(d.value) - 8)
    .attr('y', d => raceYprestanti(top_n + 1) + 5 + ((raceYprestanti(1) - raceYprestanti(0)) / 2))
    .on("click", function (d) {
      evidenzia(d.key)
    })
    .style('text-anchor', 'end')
    .html(d => (d.key).split(' ')[0])
    .transition()
    .duration(tickDuration)
    .ease(d3.easeLinear)
    .attr('y', d => raceYprestanti(sortedRange.findIndex(e => e.key === d.key)) + 5 + ((raceYprestanti(1) - raceYprestanti(0)) / 2) + 1);


  labels
    .transition()
    .duration(tickDuration)
    .ease(d3.easeLinear)
    .attr('x', d => raceXprestanti(d.value) - 8)
    .attr('y', d => raceYprestanti(sortedRange.findIndex(e => e.key === d.key)) + 5 + ((raceYprestanti(1) - raceYprestanti(0)) / 2) + 1);

  labels
    .exit()
    .transition()
    .duration(tickDuration)
    .ease(d3.easeLinear)
    .attr('x', d => raceXprestanti(d.value) - 8)
    .attr('y', d => raceYprestanti(top_n + 1) + 5)
    .remove();



  let valueLabels = svgRacePrestanti.selectAll('.valueLabel').data(data, d => d.key + d.value);

  valueLabels
    .exit()
    .transition()
    .duration(tickDuration)
    .ease(d3.easeLinear)
    .attr('x', d => raceXprestanti(d.value) + 5)
    .attr('y', d => raceYprestanti(top_n + 1) + 5)
    .remove();

  valueLabels
    .enter()
    .append('text')
    .attr('class', 'valueLabel')
    .attr('x', d => raceXprestanti(d.value) + 5)
    .attr('y', d => raceYprestanti(top_n + 1) + 5)
    .on("click", function (d) {
      evidenzia(d.key)
    })
    .text(d => d.value)
    .transition()
    .duration(tickDuration)
    .ease(d3.easeLinear)
    .attr('y', d => raceYprestanti(sortedRange.findIndex(e => e.key === d.key)) + 5 + ((raceYprestanti(1) - raceYprestanti(0)) / 2) + 1);

  valueLabels
    .transition()
    .duration(tickDuration)
    .ease(d3.easeLinear)
    .attr('x', d => raceXprestanti(d.value) + 5)
    .attr('y', d => raceYprestanti(sortedRange.findIndex(e => e.key === d.key)) + 5 + ((raceYprestanti(1) - raceYprestanti(0)) / 2) + 1)
    .tween("text", function (d) { d.value });
}

var mouseoverRichiedenti = function (d) {
  richiedentiTooltip
    .style("opacity", 1)
}
var mousemoveRichiedenti = function (d) {
  richiedentiTooltip
    .html(d.key)
    .style("left", (d3.mouse(this)[0] + 70) + "px")
    .style("top", (d3.mouse(this)[1]) + "px")
}
var mouseleaveRichiedenti = function (d) {
  richiedentiTooltip
    .style("opacity", 0)
}

var mouseoverPrestanti = function (d) {
  prestantiTooltip
    .style("opacity", 1)
}
var mousemovePrestanti = function (d) {
  prestantiTooltip
    .html(d.key)
    .style("left", (d3.mouse(this)[0] + 70) + "px")
    .style("top", (d3.mouse(this)[1]) + "px")
}
var mouseleavePrestanti = function (d) {
  prestantiTooltip
    .style("opacity", 0)
}
