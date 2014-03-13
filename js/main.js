/*
    This is a general function that plots a graph of a set of data given an 
    input for the type of graph. In the future perhaps expand to take an array
    of objects as the input as opposed to file I/O on data.tsv
*/

/*
Nil's sketches

var ca = function( ndata, d, i ) {
    alert( "a: " + i );
}

var cb = function( ndata, d, i ) {
    alert( "b: " + i );
}

config.callbacks = { item: ca, label: cb };

rect.on( 'click', function(d,i) { ca( ndata, d, i ); } );
*/

function itemCallback(nData, d, i) {
    console.log("called itemCallback with nData, d, i: ");
    console.log(nData);
    console.log(d);
    console.log(i);
}


function categoryCallback(nData, d, i) {
    console.log("called categoryCallback with nData, d, i: ");
    console.log(nData);
    console.log(d);
    console.log(i);
}


function axisCallback(nData, d, i) {
    console.log("called axisCallback with nData, d, i: ");
    console.log(nData);
    console.log(d);
    console.log(i);
}

function draw(chartType, userConfig, data) {

    // perform deep copy to preserve original data objects
    var modifiedData = jQuery.extend(true, {}, data);

    modifiedData.nData = new Array();
    for (var i = 0; i < data.items.length; i++) {
        modifiedData.nData.push({});
        modifiedData.nData[i]["item"] = data.items[i];
        for (var j = 0; j < data.categories.length; j++) {
            modifiedData.nData[i][data.categories[j]] = data.matrix[i][j];
        }
    }

    // delete old svg so graphs aren't cluttered
    d3.select("#" + userConfig.targetArea).html("");

    var config = {
        margin: {
            top: 20,
            right: 20,
            bottom: 30,
            left: 100
        },
        colors: d3.scale.category10().range(),
        hoverOpacity: 0.6,
        callbacks: { item: itemCallback, category: categoryCallback, axis: axisCallback }
    }

    config.dimension = {
            width: 640 - config.margin.left - config.margin.right,
            height: 500 - config.margin.top - config.margin.bottom
    }
    
    // override default configurations with user defined ones
    for (i in userConfig) {
        if (i != undefined) {
            config[i] = userConfig[i];
        }
    }
    
    // general functions depending on graph rendered

    if (chartType == "plain") {
        plain(modifiedData, config);
    } else if (chartType == "stack") {
        stack(modifiedData, config);
    } else if (chartType == "layer") {
        layer(modifiedData, config);
    } else if (chartType == "group") {
        group(modifiedData, config);
    } else if (chartType == "pie") {
        pie(modifiedData, config);
    } else {
        alert("Invalid chart type");
    }
    
}
