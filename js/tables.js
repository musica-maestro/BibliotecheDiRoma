const transparentTime = 500;

function gestisciTabelle(d, circle) {

    switch (true) {
  
      case (caption1.html() == d.name):
        caption1.html("Seleziona Biblioteca 1")
        rimuoviTabella(d.name, 'table1')
        d3.select(circle).style("fill", "black");
        break
  
      case (caption2.html() == d.name):
        caption2.html("Seleziona Biblioteca 2")
        rimuoviTabella(d.name, 'table2')
        d3.select(circle).style("fill", "black");
        break
  
      case (caption1.html() == "Seleziona Biblioteca 1"):
        caption1.html(d.name)
        creaTabella(d.name, 'table1')
        d3.select(circle).style("fill", "yellow");
        break
  
      case (caption2.html() == "Seleziona Biblioteca 2"):
        caption2.html(d.name)
        creaTabella(d.name, 'table2')
        d3.select(circle).style("fill", "red");
        break
    }
  }
  
  function creaTabella(BibliotecaRichiedente, selection) {
    var filtered = data.filter(function (d) {
      if (d["BibliotecaRichiedente"] == BibliotecaRichiedente)
        return d;
    })
    creaTabellaHtml(filtered, ['BibliotecaPrestante', 'NumeroLibri', 'Tipologia'], selection)
  }
  
  function rimuoviTabella(BibliotecaRichiedente, selection) {
    var filtered = data.filter(function (d) {
      if (d["BibliotecaRichiedente"] == BibliotecaRichiedente)
        return d;
    })
    rimuoviTabellaHtml(filtered, ['BibliotecaPrestante', 'NumeroLibri', 'Tipologia'], selection)
  }
  
  function creaTabellaHtml(data, columns, selection) {
    var thead = d3.select('#' + selection + '_head')
    var tbody = d3.select('#' + selection + '_body')
  
    console.log(selection)
  
    // append the header row
    thead.append('tr')
      .selectAll('th')
      .data(columns).enter()
      .append('th')
      .text(function (column) { return column.replace(/([a-z0-9])([A-Z])/g, '$1 $2') });
  
    // create a row for each object in the data
    var rows = tbody.selectAll('tr')
      .data(data)
      .enter()
      .append('tr');
  
    // create a cell in each row for each column
    var cells = rows.selectAll('td')
      .data(function (row) {
        return columns.map(function (column) {
          return { column: column, value: row[column] };
        });
      })
      .enter()
      .append('td')
      .text(function (d) { return d.value; });
  }
  
  function rimuoviTabellaHtml(data, columns, selection) {
    console.log(selection)
    var thead = d3.select('#' + selection + '_head')
    var tbody = d3.select('#' + selection + '_body')
  
      thead
      .selectAll('th')
      .data(columns).remove();
  
    var rows = tbody.selectAll('tr')
      .data(data).remove();
  }