const marginRace = { top: 10, right: 30, bottom: 0, left: 10 },
    widthRace = 500
    heightRace = 500

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



function raceRichiedenti(data) {
  sortedRange = [...data].sort((a, b) => b.value - a.value)

  // se non ho disegnato nulla inizializzo gli assi
  if (!setRichiedenti) {
    setRichiedenti = true
    setRaceScaleRichiedenti(data)
  }

  raceXrichiedenti.domain([0, d3.max(data, d => d.value)]);

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
    .attr('x', d => raceXrichiedenti(d.value) - 8)
    .attr('y', d => raceYrichiedenti(top_n + 1) + 5 + ((raceYrichiedenti(1) - raceYrichiedenti(0)) / 2))
    .style('text-anchor', 'end')
    .html(d => d.key)
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

  console.log(valueLabels)

  valueLabels
    .enter()
    .append('text')
    .attr('class', 'valueLabel')
    .attr('x', d => raceXrichiedenti(d.value) + 5)
    .attr('y', d => raceYrichiedenti(top_n + 1) + 5)
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

function racePrestanti(data) {
  sortedRange = [...data].sort((a, b) => b.value - a.value)

  if (!setPrestanti) {
    setPrestanti = true
    setRaceScalePrestanti(data)
  }

  raceXprestanti.domain([0, d3.max(data, d => d.value)]);

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
    .style('text-anchor', 'end')
    .html(d => d.key)
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
