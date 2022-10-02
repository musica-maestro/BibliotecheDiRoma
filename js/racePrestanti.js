var svgRacePrestanti = d3.select("#prestanti").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var tickDuration = 500;

var top_n = 10;

let barPadding = (height - (margin.bottom + margin.top)) / (top_n * 5);

var raceXprestanti = d3.scaleLinear()
var raceYprestanti = d3.scaleLinear()
var xAxisPrestanti = d3.axisTop()

function setRaceScalePrestanti(data) {
    raceXprestanti.domain([0, d3.max(data, d => d.value)])
        .range([margin.left, width - margin.right - margin.left]);

    raceYprestanti.domain([top_n, 0])
        .range([height - margin.bottom, margin.top]);

    xAxisPrestanti.scale(raceXprestanti)
        .ticks(width > 500 ? 5 : 2)
        .tickSize(-(height - margin.top - margin.bottom))
        .tickFormat(d => d3.format(',')(d));

    svgRacePrestanti.append('g')
        .attr('class', 'axis xAxisPrestanti')
        .attr('transform', `translate(0, ${margin.top})`)
        .call(xAxisPrestanti)
        .selectAll('.tick line')
        .classed('origin', d => d == 0);
}

function initRacePrestanti(data) {
    sortedRange = [...data].sort((a, b) => b.value - a.value)
    setRaceScalePrestanti(data)

    bars = svgRacePrestanti.selectAll('rect.bar')
        .data(data, d => d.key)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', raceXprestanti(0) + 1)
        .attr('width', d => raceXprestanti(d.value) - raceXprestanti(0) - 1)
        .attr('y', d => raceYprestanti(sortedRange.findIndex(e => e.key === d.key)) + 5)
        .attr('height', raceYprestanti(1) - raceYprestanti(0) - barPadding)
        .style('fill', d => cScale(d.key)); //metti colore

    labels = svgRacePrestanti.selectAll('text.label')
        .data(data, d => d.key)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', d => raceXprestanti(d.value) - 8)
        .attr('y', (d, i) => raceYprestanti(sortedRange.findIndex(e => e.key === d.key)) + 5 + ((raceYprestanti(1) - raceYprestanti(0)) / 2) + 1)
        .style('text-anchor', 'end')
        .html(d => d.key);

    valueLabels = svgRacePrestanti.selectAll('text.valueLabel')
        .data(data, d => d.key)
        .enter()
        .append('text')
        .attr('class', 'valueLabel')
        .attr('x', d => raceXprestanti(d.value) + 5)
        .attr('y', d => raceYprestanti(sortedRange.findIndex(e => e.key === d.key)) + 5 + ((raceYprestanti(1) - raceYprestanti(0)) / 2) + 1)
        .text(d => d.value);
}

function updateRacePrestanti(data){
    sortedRange = [...data].sort((a, b) => b.value - a.value)
    setRaceScalePrestanti(data)
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
       .attr('class', d => `bar ${d.key.replace(/\s/g,'_')}`)
       .attr('x', raceXprestanti(0)+1)
       .attr( 'width', d => raceXprestanti(d.value)-raceXprestanti(0)-1)
       .attr('y', d => raceYprestanti(top_n+1)+5)
       .attr('height', raceYprestanti(1)-raceYprestanti(0)-barPadding)
       .style('fill', d => cScale(d.key))
       .transition()
         .duration(tickDuration)
         .ease(d3.easeLinear)
         .attr('y', d => raceYprestanti(sortedRange.findIndex(e => e.key === d.key))+5);
         
      bars
       .transition()
         .duration(tickDuration)
         .ease(d3.easeLinear)
         .attr('width', d => raceXprestanti(d.value)-raceXprestanti(0)-1)
         .attr('y', d => raceYprestanti(sortedRange.findIndex(e => e.key === d.key))+5);
           
      bars
       .exit()
       .transition()
         .duration(tickDuration)
         .ease(d3.easeLinear)
         .attr('width', d => raceXprestanti(d.value)-raceXprestanti(0)-1)
         .attr('y', d => raceYprestanti(top_n+1)+5)
         .remove();

      let labels = svgRacePrestanti.selectAll('.label')
         .data(data, d => d.key);
    
      labels
       .enter()
       .append('text')
       .attr('class', 'label')
       .attr('x', d => raceXprestanti(d.value)-8)
       .attr('y', d => raceYprestanti(top_n+1)+5+((raceYprestanti(1)-raceYprestanti(0))/2))
       .style('text-anchor', 'end')
       .html(d => d.key)    
       .transition()
         .duration(tickDuration)
         .ease(d3.easeLinear)
         .attr('y', d => raceYprestanti(sortedRange.findIndex(e => e.key === d.key))+5+((raceYprestanti(1)-raceYprestanti(0))/2)+1);
            
   
         labels
         .transition()
         .duration(tickDuration)
           .ease(d3.easeLinear)
           .attr('x', d => raceXprestanti(d.value)-8)
           .attr('y', d => raceYprestanti(sortedRange.findIndex(e => e.key === d.key))+5+((raceYprestanti(1)-raceYprestanti(0))/2)+1);
    
      labels
         .exit()
         .transition()
           .duration(tickDuration)
           .ease(d3.easeLinear)
           .attr('x', d => raceXprestanti(d.value)-8)
           .attr('y', d => raceYprestanti(top_n+1)+5)
           .remove();
        

    
      let valueLabels = svgRacePrestanti.selectAll('.valueLabel').data(data, d => d.key);
   
      valueLabels
         .enter()
         .append('text')
         .attr('class', 'valueLabel')
         .attr('x', d => raceXprestanti(d.value)+5)
         .attr('y', d => raceYprestanti(top_n+1)+5)
         .text(d => d.value)
         .transition()
           .duration(tickDuration)
           .ease(d3.easeLinear)
           .attr('y', d => raceYprestanti(sortedRange.findIndex(e => e.key === d.key))+5+((raceYprestanti(1)-raceYprestanti(0))/2)+1);
           
      valueLabels
         .transition()
           .duration(tickDuration)
           .ease(d3.easeLinear)
           .attr('x', d => raceXprestanti(d.value)+5)
           .attr('y', d => raceYprestanti(sortedRange.findIndex(e => e.key === d.key))+5+((raceYprestanti(1)-raceYprestanti(0))/2)+1)
           .tween("text", function(d) {d.value});
     
    
     valueLabels
       .exit()
       .transition()
         .duration(tickDuration)
         .ease(d3.easeLinear)
         .attr('x', d => raceXprestanti(d.value)+5)
         .attr('y', d => raceYprestanti(top_n+1)+5)
         .remove();
    }