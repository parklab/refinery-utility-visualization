function pie(data, config) {

    console.log(data);

    var margin = config.margin,
        width = config.dimension.width,
        height = config.dimension.height,
        color = d3.scale.ordinal()
            .domain(data.items)
            .range(config.colors);

    var radius = Math.min(width, height) / 2,
        arc = d3.svg.arc()
            .outerRadius(radius - 10)
            .innerRadius(0),
        pie = d3.layout.pie()
            .sort(null)
            .value(function(d) { return d.total; });

    var nData = data.nData;

    for (var i = 0; i < data.items.length; i++) {
        nData[i].total = data.matrix[i].sum();
    }

    // set up svg area
    var svg = d3.select("#" + config.targetArea).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + width / 2 + ", " + height / 2 + ")");

    // do the pie
    var g = svg.selectAll(".arc")
        .data(pie(nData))
        .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function(d, i) { return color(data.items[i]); });

    g.append("text")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", "0.35em")
        .style("text-anchor", "middle")
        .text(function(d, i) { return data.items[i]; })
        .attr("fill", "white");

    // add a legend
    var legend = svg.selectAll(".legend")
        .data(color.domain().slice())
        .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0, " + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", radius + 64)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    // add text to the legend
    legend.append("text")
        .attr("x", radius + 54)
        .attr("y", 9)
        .attr("dy", "0.35em")
        .style("text-anchor", "end")
        .text(function(d, i) { return nData[i].item; });    
}

