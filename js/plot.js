
 function plotChart(data) {
    const svg = d3.select("#chart")
    const width = svg.node().clientWidth;
    const height = svg.node().clientHeight;
    const ticker = 500;

    const dateList = data.Data.keys
    const fontSize = 16;
    const rectProperties = {height: 20, padding: 10}
    const container = svg.append("g")
                            .classed("container", true)
                            .style("transform", "translateY(25px)")


    const widthScale = d3.scaleLinear()
    const axisTop = svg
                    .append('g')
                    .classed('axis', true)
                    .style("transform", "translate(10px, 20px)")
                    .call(d3.axisTop(widthScale))

    const update = (date) =>  {

        const presentData = processEachDateData(data.get(date).get("Confirmed")[0]) //da modifica
        widthScale.domain([0, d3.max(Object.values(presentData), d => d.value)])
                  .range([0, width - fontSize - 50])

        axisTop                
            .transition()
            .duration(ticker / 1.2)
            .ease(d3.easeLinear)
            .call(d3.axisTop(widthScale))

        const sortedRange = [...presentData].sort((a,b) => b.value - a.value)

        container
            .selectAll("text")
            .data(presentData)
            .enter()
            .append("text")

        container
            .selectAll("text")
            .text(d => d.key + " "+ d.value)
            .transition()
            .delay(500)
            .attr("x", d => widthScale(d.value) + fontSize)
            .attr("y", (d,i) => sortedRange.findIndex(e => e.key === d.key) * (rectProperties.height + rectProperties.padding) + fontSize) 

        container
            .selectAll("rect")
            .data(presentData)
            .enter()
            .append("rect")

        container
            .selectAll("rect")
            .attr("x", 10)
            .transition()
            .delay(500)
            .attr("y", (d,i) => sortedRange.findIndex(e => e.key === d.key) * (rectProperties.height + rectProperties.padding))
            .attr("width", d => d.value <= 0? 0 : widthScale(d.value))
            .attr("height", 20)

    }
}

function processData(data) { 
    return d3.group(data, d => d.date, e => e.status);
}

function processEachDateData(data) {
    //remove status and date
    delete data.date
    delete data.status
    delete data.tt // tt is total 

    return Object.keys(data)
            .map(key => ({key, value: parseInt(data[key])}))
            // .sort((a,b) => b.value-a.value) 
}