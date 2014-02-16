/*
    This is a general function that plots a graph of a set of data given an 
    input for the type of graph. In the future perhaps expand to take an array
    of objects as the input as opposed to file I/O on data.tsv
*/

function draw(chartType) {
    // delete old svg so graphs aren't cluttered
    d3.select("svg").remove();

    // TODO: give width and maybe height dynamic scaling based on data size
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 640 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // general color scale
    var color = d3.scale.ordinal()
        .range(["#0B609C", "#C64927", "#128F64", "#BE6293", "#DE8A34"]);

    // new svg area
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    // general functions depending on graph rendered
    d3.tsv("data.tsv", function(error, data) {
        if (chartType == "plain") {
            plain(data);
        } else if (chartType == "stack") {
            stack(data);
        } else if (chartType == "group") {
            group(data);
        } else if (chartType == "pie") {
            pie(data);
        } else {
            alert("Invalid chart type");
        }
    });


    // specific chart functions to be called
    function plain(data) {
        // a few things unique to this chart
        var padding = 30;
        var barPadding = 1;

        data.forEach(function(d) {
            d.total = (+d.d1) + (+d.d2) + (+d.d3) + (+d.d4) + (+d.d5);
        });

        color.domain(data.map(function(d) { return d.set; }));


        // scales
        var scale = d3.scale.linear()
            .range([0, height - 20])
            .domain([0, d3.max(data, function(d) { return d.total; })]);

        // draw the rectangles
        svg.selectAll("rect")
            .data(data)
            .enter().append("rect")
                .attr("x", function(d, i) { return i * ((width - padding) / data.length) + padding; })
                .attr("y", function(d) { return height - scale(d.total); })
                .attr("width", (width - padding) / data.length - barPadding)
                .attr("height", function(d) { return scale(d.total); })
                .attr("fill", function(d) { return color(d.set); });

        svg.selectAll("text")
            .data(data)
            .enter().append("text")
            .text(function(d) { return d.total; })
                .attr("text-anchor", "middle")
                .attr("x", function(d, i) { return i * ((width - padding) / data.length) + (width / data.length - barPadding) / 2 + padding; })
                .attr("y", function(d) { return height - scale(d.total) + 14; })
                .attr("font-family", "sans-serif")
                .attr("font-size", "11px")
                .attr("fill", "white");

        var axisScale = d3.scale.linear()
            .domain([0, d3.max(data, function(d) { return d.total; })])
            .range([height - 20, 0]);

        var yAxis = d3.svg.axis()
            .scale(axisScale)
            .orient("left");

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + padding + ", 20)")
            .call(yAxis);

        // add the legends        
        var legend = svg.selectAll(".legend")
            .data(data.map(function(d) { return d.set; }))
            .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0, " + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", "0.35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });
    }

    function stack(data) {
        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], 0.1);

        var y = d3.scale.linear()
            .rangeRound([height, 0]);


        var xAxis = d3.svg.axis()
           .scale(x)
           .orient("bottom");

        var yAxis = d3.svg.axis()
           .scale(y)
           .orient("left");

        color.domain(d3.keys(data[0]).filter(function(key) { return key !== "set"; }));

        data.forEach(function(d) {
            var y0 = 0;
            d.nums = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}});
            d.total = d.nums[d.nums.length - 1].y1;
        });

        data.sort(function(a, b) { return b.total - a.total; }); 

        x.domain(data.map(function(d) { return d.set; }));
        y.domain([0, d3.max(data, function(d) { return d.total; })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, " + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)

        var set = svg.selectAll(".set")
            .data(data)
            .enter().append("g")
                .attr("class", "g")
                .attr("transform", function(d) { return "translate(" + x(d.set) + ", 0)"; });

        set.selectAll("rect")
            .data(function(d) { return d.nums; })
            .enter().append("rect")
                .attr("width", x.rangeBand())
                .attr("y", function(d) { return y(d.y1); })
                .attr("height", function(d) { return y(d.y0) - y(d.y1); })
                .style("fill", function(d) { return color(d.name)});

        var legend = svg.selectAll(".legend")
            .data(color.domain().slice().reverse())
            .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0, " + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", "0.35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });
    }

    function group(data) {

    }

    function pie(data) {

    }

    // generic legend function to be implemented later
    function legend(data) {

    }
}