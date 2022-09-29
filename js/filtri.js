function popolaFiltroTipologia(data) {
  form = d3.select("#filtroTipologia")
  tipologie = d3.map(data, function (d) { return d.Tipologia; }).keys().sort(d3.ascending)

  form
    .data(tipologie)
    .enter()
    .append("div")
    .attr("class", "form-check")
    .append("label")
    .attr("class", "form-check-label")
    .text(function (d) { return d; })
    .append("input")
    .attr("class", "form-check-input")
    .attr("checked", true)
    .attr("type", "checkbox")
    .attr("id", function (d) { return d; })
    .on("click", function (d) {
      updateTipologia()
    })

}

function updateTipologia() {
  checkedBoxes = d3.selectAll("input.form-check-input:checked").nodes().map(box => box.__data__);
  console.log(checkedBoxes)
}