var svgRace = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right + 50)
    .attr("height", height + margin.top + margin.bottom);

var tickDuration = 500;

var top_n = 10;

let barPadding = (height - (margin.bottom + margin.top)) / (top_n * 5);

var raceX = d3.scaleLinear()
var raceY = d3.scaleLinear()
var xAxis = d3.axisTop()

function setRaceScale(data) {
    raceX.domain([0, d3.max(data, d => d.value)])
        .range([margin.left, width - margin.right - 100]);

    raceY.domain([top_n, 0])
        .range([height - margin.bottom, margin.top]);

    xAxis.scale(raceX)
        .ticks(width > 500 ? 5 : 2)
        .tickSize(-(height - margin.top - margin.bottom))
        .tickFormat(d => d3.format(',')(d));

    svgRace.append('g')
        .attr('class', 'axis xAxis')
        .attr('transform', `translate(0, ${margin.top})`)
        .call(xAxis)
        .selectAll('.tick line')
        .classed('origin', d => d == 0);
}

function initRace(data) {
    sortedRange = [...data].sort((a, b) => b.value - a.value)
    setRaceScale(data)

    bars = svgRace.selectAll('rect.bar')
        .data(data, d => d.key)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', raceX(0) + 1)
        .attr('width', d => raceX(d.value) - raceX(0) - 1)
        .attr('y', d => raceY(sortedRange.findIndex(e => e.key === d.key)) + 5)
        .attr('height', raceY(1) - raceY(0) - barPadding)
        .style('fill', d => cScale(d.key)); //metti colore

    labels = svgRace.selectAll('text.label')
        .data(data, d => d.key)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', d => raceX(d.value) - 8)
        .attr('y', (d, i) => raceY(sortedRange.findIndex(e => e.key === d.key)) + 5 + ((raceY(1) - raceY(0)) / 2) + 1)
        .style('text-anchor', 'end')
        .html(d => d.key);

    valueLabels = svgRace.selectAll('text.valueLabel')
        .data(data, d => d.key)
        .enter()
        .append('text')
        .attr('class', 'valueLabel')
        .attr('x', d => raceX(d.value) + 5)
        .attr('y', d => raceY(sortedRange.findIndex(e => e.key === d.key)) + 5 + ((raceY(1) - raceY(0)) / 2) + 1)
        .text(d => d.value);
}

function updateRace(data){
    sortedRange = [...data].sort((a, b) => b.value - a.value)
    raceX.domain([0, d3.max(data, d => d.value)]); 
     
    svgRace.select('.xAxis')
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .call(xAxis);
    
       let bars = svgRace.selectAll('.bar').data(data, d => d.key);

       bars
       .enter()
       .append('rect')
       .attr('class', d => `bar ${d.key.replace(/\s/g,'_')}`)
       .attr('x', raceX(0)+1)
       .attr( 'width', d => raceX(d.value)-raceX(0)-1)
       .attr('y', d => raceY(top_n+1)+5)
       .attr('height', raceY(1)-raceY(0)-barPadding)
       .style('fill', d => cScale(d.key))
       .transition()
         .duration(tickDuration)
         .ease(d3.easeLinear)
         .attr('y', d => raceY(sortedRange.findIndex(e => e.key === d.key))+5);
         
      bars
       .transition()
         .duration(tickDuration)
         .ease(d3.easeLinear)
         .attr('width', d => raceX(d.value)-raceX(0)-1)
         .attr('y', d => raceY(sortedRange.findIndex(e => e.key === d.key))+5);
           
      bars
       .exit()
       .transition()
         .duration(tickDuration)
         .ease(d3.easeLinear)
         .attr('width', d => raceX(d.value)-raceX(0)-1)
         .attr('y', d => raceY(top_n+1)+5)
         .remove();

      let labels = svgRace.selectAll('.label')
         .data(data, d => d.key);
    
      labels
       .enter()
       .append('text')
       .attr('class', 'label')
       .attr('x', d => raceX(d.value)-8)
       .attr('y', d => raceY(top_n+1)+5+((raceY(1)-raceY(0))/2))
       .style('text-anchor', 'end')
       .html(d => d.key)    
       .transition()
         .duration(tickDuration)
         .ease(d3.easeLinear)
         .attr('y', d => raceY(sortedRange.findIndex(e => e.key === d.key))+5+((raceY(1)-raceY(0))/2)+1);
            
   
         labels
         .transition()
         .duration(tickDuration)
           .ease(d3.easeLinear)
           .attr('x', d => raceX(d.value)-8)
           .attr('y', d => raceY(sortedRange.findIndex(e => e.key === d.key))+5+((raceY(1)-raceY(0))/2)+1);
    
      labels
         .exit()
         .transition()
           .duration(tickDuration)
           .ease(d3.easeLinear)
           .attr('x', d => raceX(d.value)-8)
           .attr('y', d => raceY(top_n+1)+5)
           .remove();
        

    
      let valueLabels = svgRace.selectAll('.valueLabel').data(data, d => d.key);
   
      valueLabels
         .enter()
         .append('text')
         .attr('class', 'valueLabel')
         .attr('x', d => raceX(d.value)+5)
         .attr('y', d => raceY(top_n+1)+5)
         .text(d => d.value)
         .transition()
           .duration(tickDuration)
           .ease(d3.easeLinear)
           .attr('y', d => raceY(sortedRange.findIndex(e => e.key === d.key))+5+((raceY(1)-raceY(0))/2)+1);
           
      valueLabels
         .transition()
           .duration(tickDuration)
           .ease(d3.easeLinear)
           .attr('x', d => raceX(d.value)+5)
           .attr('y', d => raceY(sortedRange.findIndex(e => e.key === d.key))+5+((raceY(1)-raceY(0))/2)+1)
           .tween("text", function(d) {d.value});
     
    
     valueLabels
       .exit()
       .transition()
         .duration(tickDuration)
         .ease(d3.easeLinear)
         .attr('x', d => raceX(d.value)+5)
         .attr('y', d => raceY(top_n+1)+5)
         .remove();
    }