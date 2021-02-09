var svgWidth=750
var svgHeight=500

// SVG  Dimensions
var margin = {
    top: 10,
    right: 30,
    bottom: 80,
    left: 60}

// Plot Dimensions
 var plotWidth = svgWidth - margin.left - margin.right;
 var plotHeight = svgHeight - margin.top - margin.bottom;

// Create SVG wrapper
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", plotWidth + margin.left + margin.right)
    .attr("height", plotHeight + margin.top + margin.bottom)

// Append svg group that contains our chart
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.right})`);

// CSV file path
var censusData = "assets/data/data.csv"

d3.csv(censusData).then(data=> {
   //Convert string data into numerical values for plot
    data.forEach(function(dataset) {
        console.log(dataset);
        dataset.healthcare = +dataset.healthcare;
        dataset.poverty = +dataset.poverty;
        console.log(dataset.healthcare);
        console.log(dataset.poverty);
    });
    // Add X axis
    var xScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.poverty) - 2, d3.max(data, d => d.poverty) + 2])
            .range([0, plotWidth]);
    var xAxis = chartGroup.append("g")
        .attr("transform", "translate(0," + plotHeight + ")")
        .call(d3.axisBottom(xScale));   
        
    // Create Scale for Y Coordinate
    var yScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.healthcare) - 2, d3.max(data, d => d.healthcare) + 2])
        .range([plotHeight, 0]);

    // Create Axis Functions
    // var xAxis = d3.axisBottom(xScale);
    var yAxis = chartGroup.append('g').call(d3.axisLeft(yScale));

    // Add the data points to the chart
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "stateCircle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", 15)
        .attr("opacity", 0.75);
    
    // Add State Abbreviations to the circles
    var stateText = chartGroup.selectAll("label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "stateText")
        .attr("x", d => xScale(d.poverty))
        .attr("y", d => yScale(d.healthcare))
        .attr("font-size", 10)
        .attr("dy", 4)
        .text(d => d.abbr);
    
    // Label both of the Axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (plotHeight / 2))
        .attr("dy", "1em")
        .attr("class", "aText")
        .attr("class", "active")
        .text('Lacks Health Care (%)')

    chartGroup.append("text")
        .attr("transform", `translate(${plotWidth / 2}, ${plotHeight + margin.top + 30})`)
        .attr("class", "aText")
        .attr("class", "active")
        .text('In Poverty (%)')
//        .text("Age (Median)");

    // Initialize tooltip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .html(function(d) {
            return (`State: ${d.state}<br>In Poverty (Median): ${d.poverty}<br>Lacks Healthcare: ${d.healthcare}%`)
        })

    // Create the tooltip in chartGroup
    chartGroup.call(toolTip);
    
    // Mouseover event for circle objects
    circlesGroup.on("mouseover", function(d) {
        toolTip.show(d, this);
    })
    // Mouseout event for circle objects
    .on("mouseout", function(d) {
        toolTip.hide(d);
    });

    // Had to add handlers for text as the previous mouseout event triggers on going on text
    // Mouseover event for text
    stateText.on("mouseover", function(d) {
        toolTip.show(d, this);
    })
    // Mouseout event for text
    .on("mouseout", function(d) {
        toolTip.hide(d);
    });

});