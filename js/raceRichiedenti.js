var svgRaceRichiedenti = d3.select("#richiedenti").append("svg")
    .attr("width", width + margin.left + margin.right + 50)
    .attr("height", height + margin.top + margin.bottom);

var raceXrichiedenti = d3.scaleLinear()
var raceYrichiedenti = d3.scaleLinear()
var xAxisRichiedenti = d3.axisTop()

function setRaceScaleRichiedenti(data) {
    raceXrichiedenti.domain([0, d3.max(data, d => d.value)])
        .range([margin.left, width - margin.right - 100]);

    raceYrichiedenti.domain([top_n, 0])
        .range([height - margin.bottom, margin.top]);

    xAxisRichiedenti.scale(raceXrichiedenti)
        .ticks(width > 500 ? 5 : 2)
        .tickSize(-(height - margin.top - margin.bottom))
        .tickFormat(d => d3.format(',')(d));

    svgRaceRichiedenti.append('g')
        .attr('class', 'axis xAxisRichiedenti')
        .attr('transform', `translate(0, ${margin.top})`)
        .call(xAxisRichiedenti)
        .selectAll('.tick line')
        .classed('origin', d => d == 0);
}

function initRaceRichiedenti(data) {
    sortedRange = [...data].sort((a, b) => b.value - a.value)
    setRaceScaleRichiedenti(data)

    bars = svgRaceRichiedenti.selectAll('rect.bar')
        .data(data, d => d.key)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', raceXrichiedenti(0) + 1)
        .attr('width', d => raceXrichiedenti(d.value) - raceXrichiedenti(0) - 1)
        .attr('y', d => raceYrichiedenti(sortedRange.findIndex(e => e.key === d.key)) + 5)
        .attr('height', raceYrichiedenti(1) - raceYrichiedenti(0) - barPadding)
        .style('fill', d => cScale(d.key)); //metti colore

    labels = svgRaceRichiedenti.selectAll('text.label')
        .data(data, d => d.key)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', d => raceXrichiedenti(d.value) - 8)
        .attr('y', (d, i) => raceYrichiedenti(sortedRange.findIndex(e => e.key === d.key)) + 5 + ((raceYrichiedenti(1) - raceYrichiedenti(0)) / 2) + 1)
        .style('text-anchor', 'end')
        .html(d => d.key);

    valueLabels = svgRaceRichiedenti.selectAll('text.valueLabel')
        .data(data, d => d.key)
        .enter()
        .append('text')
        .attr('class', 'valueLabel')
        .attr('x', d => raceXrichiedenti(d.value) + 5)
        .attr('y', d => raceYrichiedenti(sortedRange.findIndex(e => e.key === d.key)) + 5 + ((raceYrichiedenti(1) - raceYrichiedenti(0)) / 2) + 1)
        .text(d => d.value);
}

function updateRaceRichiedenti(data){
    sortedRange = [...data].sort((a, b) => b.value - a.value)
    raceXrichiedenti.domain([0, d3.max(data, d => d.value)]); 
     
    svgRaceRichiedenti.select('.xAxisRichiedenti')
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .call(xAxisRichiedenti);
    
       let bars = svgRaceRichiedenti.selectAll('.bar').data(data, d => d.key);

       bars
       .enter()
       .append('rect')
       .attr('class', d => `bar ${d.key.replace(/\s/g,'_')}`)
       .attr('x', raceXrichiedenti(0)+1)
       .attr( 'width', d => raceXrichiedenti(d.value)-raceXrichiedenti(0)-1)
       .attr('y', d => raceYrichiedenti(top_n+1)+5)
       .attr('height', raceYrichiedenti(1)-raceYrichiedenti(0)-barPadding)
       .style('fill', d => cScale(d.key))
       .transition()
         .duration(tickDuration)
         .ease(d3.easeLinear)
         .attr('y', d => raceYrichiedenti(sortedRange.findIndex(e => e.key === d.key))+5);
         
      bars
       .transition()
         .duration(tickDuration)
         .ease(d3.easeLinear)
         .attr('width', d => raceXrichiedenti(d.value)-raceXrichiedenti(0)-1)
         .attr('y', d => raceYrichiedenti(sortedRange.findIndex(e => e.key === d.key))+5);
           
      bars
       .exit()
       .transition()
         .duration(tickDuration)
         .ease(d3.easeLinear)
         .attr('width', d => raceXrichiedenti(d.value)-raceXrichiedenti(0)-1)
         .attr('y', d => raceYrichiedenti(top_n+1)+5)
         .remove();

      let labels = svgRaceRichiedenti.selectAll('.label')
         .data(data, d => d.key);
    
      labels
       .enter()
       .append('text')
       .attr('class', 'label')
       .attr('x', d => raceXrichiedenti(d.value)-8)
       .attr('y', d => raceYrichiedenti(top_n+1)+5+((raceYrichiedenti(1)-raceYrichiedenti(0))/2))
       .style('text-anchor', 'end')
       .html(d => d.key)    
       .transition()
         .duration(tickDuration)
         .ease(d3.easeLinear)
         .attr('y', d => raceYrichiedenti(sortedRange.findIndex(e => e.key === d.key))+5+((raceYrichiedenti(1)-raceYrichiedenti(0))/2)+1);
            
   
         labels
         .transition()
         .duration(tickDuration)
           .ease(d3.easeLinear)
           .attr('x', d => raceXrichiedenti(d.value)-8)
           .attr('y', d => raceYrichiedenti(sortedRange.findIndex(e => e.key === d.key))+5+((raceYrichiedenti(1)-raceYrichiedenti(0))/2)+1);
    
      labels
         .exit()
         .transition()
           .duration(tickDuration)
           .ease(d3.easeLinear)
           .attr('x', d => raceXrichiedenti(d.value)-8)
           .attr('y', d => raceYrichiedenti(top_n+1)+5)
           .remove();
        

    
      let valueLabels = svgRaceRichiedenti.selectAll('.valueLabel').data(data, d => d.key);
   
      valueLabels
         .enter()
         .append('text')
         .attr('class', 'valueLabel')
         .attr('x', d => raceXrichiedenti(d.value)+5)
         .attr('y', d => raceYrichiedenti(top_n+1)+5)
         .text(d => d.value)
         .transition()
           .duration(tickDuration)
           .ease(d3.easeLinear)
           .attr('y', d => raceYrichiedenti(sortedRange.findIndex(e => e.key === d.key))+5+((raceYrichiedenti(1)-raceYrichiedenti(0))/2)+1);
           
      valueLabels
         .transition()
           .duration(tickDuration)
           .ease(d3.easeLinear)
           .attr('x', d => raceXrichiedenti(d.value)+5)
           .attr('y', d => raceYrichiedenti(sortedRange.findIndex(e => e.key === d.key))+5+((raceYrichiedenti(1)-raceYrichiedenti(0))/2)+1)
           .tween("text", function(d) {d.value});
     
    
     valueLabels
       .exit()
       .transition()
         .duration(tickDuration)
         .ease(d3.easeLinear)
         .attr('x', d => raceXrichiedenti(d.value)+5)
         .attr('y', d => raceYrichiedenti(top_n+1)+5)
         .remove();
    }