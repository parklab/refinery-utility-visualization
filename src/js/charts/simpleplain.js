/**
 *  Plots a simple bar chart
 *  @param {object} data - the data set to work with
 *  @param {object} config - various configurations for the chart
 *  @param {object} barEvents - set of barEvents to be attached to the chart
 */
function simpleplain(data, config, barEvents, labelEvents) {
    var isVert = (config.orientation === "vertical")? true : false,
        color = config.color || d3.scale.category10().range(),
        hLeft = 0.1, hMid = 0.8, vMid = 0.8,
        mainWidth = config.width * hMid,
        mainHeight = config.height * vMid,  
        partitions = genericsvg({width: config.width, height: config.height, drawTarget: config.drawTarget}),
        fData = [];

    for (var i = 0; i < data.items.length; i++) {
        fData.push({ id: data.items[i], value: data.matrix[i].sum() });
    }

    var globalMax = fData.map(function(d) { return d.value; }).max(),
        xGraphScale,
        yGraphScale;

    if (config.applyLog) {
        if (isVert) {
            xGraphScale = d3.scale.ordinal().domain(data.items).rangeRoundBands([0, mainWidth], 0);
            yGraphScale = d3.scale.log().domain([1, globalMax]).range([mainHeight, 0]);
        } else {
            xGraphScale = d3.scale.log().domain([1, globalMax]).range([0, mainWidth]);
            yGraphScale = d3.scale.ordinal().domain(data.items).rangeRoundBands([0, mainHeight], 0);
        }
    } 

    function tmpGetId(d) { return d.id; }
    // plot
    genericplain(fData, {
        globalMax: globalMax,
        orientation: config.orientation,
        width: mainWidth,
        height: mainHeight,
        drawTarget: partitions[1][1][0][0],
        xScale: xGraphScale,
        yScale: yGraphScale,
        color: d3.scale.ordinal().domain(fData.map(tmpGetId)).range(color),
        barCallbacks: config.barCallbacks
    }, barEvents);

    var xAxisScale,
        yAxisScale;

    if (config.applyLog) {
        if (isVert) {
            xAxisScale = d3.scale.ordinal().domain(data.items).rangeRoundBands([0, mainWidth], 0.05);
            yAxisScale = d3.scale.log().domain([1, globalMax]).range([mainHeight, 0]);
        } else {
            xAxisScale = d3.scale.log().domain([1, globalMax]).range([0, mainWidth]);
            yAxisScale = d3.scale.ordinal().domain(data.items).rangeRoundBands([0, mainHeight], 0.05);
        }
    } else {
        if (isVert) {
            xAxisScale = d3.scale.ordinal().domain(data.items).rangeRoundBands([0, mainWidth], 0.05);
            yAxisScale = d3.scale.linear().domain([0, globalMax]).range([mainHeight, 0]);
        } else {
            xAxisScale = d3.scale.linear().domain([0, globalMax]).range([0, mainWidth]);
            yAxisScale = d3.scale.ordinal().domain(data.items).rangeRoundBands([0, mainHeight], 0.05);
        }
    }

    // x-axis
    genericaxis({
        orientation: "bottom",
        drawTarget: partitions[1][2][0][0],
        tickSize: (isVert)? 0 : 6,
        scale: xAxisScale,
        maxLabelSize: (isVert)? (mainWidth / fData.length) * 0.9 : 1000,
        labelCallbacks: config.labelCallbacks
    }, labelEvents);

    // y-axis
    genericaxis({
        orientation: "left",
        drawTarget: partitions[0][1][0][0],
        tickSize: (isVert)? 6 : 0,
        scale: yAxisScale,
        maxLabelSize: config.width * 0.1 * 0.9,
        xShift: hLeft * config.width,
        labelCallbacks: config.labelCallbacks
    }, labelEvents);
}