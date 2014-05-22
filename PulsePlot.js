//Area Chart
//This is the first simple chart from Michael Hilton
//This chart is inspired by the example from the d3 site: http://bl.ocks.org/mbostock/3883195#data.tsv
//It is also borows extensivly from the example here: http://bost.ocks.org/mike/chart/time-series-chart.js
//This chart expects the selection to have two fields, x and y.  
//x should be time data, already parsed for d3
//y should be numerical values.

function pulsePlot() {

 // //Width and height of the svg element
 // var margin = {top: 20, right: 20, bottom: 30, left: 50},
 // xValue = function(d) { return d[0]; },
 // yValue = function(d) { return d[1]; },
 // xScale = d3.time.scale(),
 // yScale = d3.scale.linear(),
 // xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(6, 0),
 // yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(6, 0),
 // area = d3.svg.area().x(X).y1(Y),
 // width = 400,
 // height = 400;

var margin = {top: 20, right: 20, bottom: 30, left: 50},
 	width = 200,
    height = 200,
    innerRadius = 40,
    outerRadius = 240;




	 var chart = function(selection){
	 	//draw the chart
	 	selection.each(function(data) {

	 			var angle = d3.scale.ordinal().domain(d3.range(4)).rangePoints([0, 2 * Math.PI]),
	    radius = d3.scale.linear().range([innerRadius, outerRadius]),
	    color = d3.scale.category20c().domain(d3.range(20));

	 // Select the svg element, if it exists.
      var svg = d3.select(this).selectAll("svg").data([data]);

      // Otherwise, create the skeletal chart.
      var gEnter = svg.enter().append("svg").append("g");
      // gEnter.append("path").attr("class", "area");
      // gEnter.append("path").attr("class", "line");
      // gEnter.append("g").attr("class", "x axis");

      // Update the outer dimensions.
      svg .attr("width", width)
          .attr("height", height);

      // Update the inner dimensions.
      var g = svg.select("g")
          // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  
	 
	// var svg = d3.select("body").append("svg")
	//     .attr("width", width)
	//     .attr("height", height)
	//   .append("g")
	//     .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	g.selectAll(".link")
	    .data(data)
	  .enter().append("path")
	    .attr("class", "link")
	    .attr("d", d3.hive.link()
	    .angle(function(d) { 
	    	return angle(d.x);
	    	 })
	    .startRadius(function(d) { return radius(d.y0); })
	    .endRadius(function(d) { return radius(d.y1); }))
	    .style("fill", function(d) { return color(d.group); });

	g.selectAll(".axis")
	    .data(d3.range(3))
	  .enter().append("g")
	    .attr("class", "axis")
	    .attr("transform", function(d) { return "rotate(" + degrees(angle(d)) + ")"; })
	  // .selectAll("line")
	  //   .data(["stroke", "fill"])
	  // .enter().append("line")
	  //   .attr("class", function(d) { return d; })
	  //   .attr("x1", radius.range()[0])
	  //   .attr("x2", radius.range()[1]);

	function degrees(radians) {
	  return radians / Math.PI * 180 - 90;
	}


 //    // Select the svg element, if it exists.
 //    var svg = d3.select(this).selectAll("svg").data([data]);

 //    // Otherwise, create the skeletal chart.
 //    var gEnter = svg.enter().append("svg").append("g");
 //    gEnter.append("path").attr("class", "area");
 //    gEnter.append("path").attr("class", "line");
 //    gEnter.append("g").attr("class", "x axis");
 //    gEnter.append("g").attr("class", "y axis");

	// // Update the outer dimensions.
	// svg .attr("width", width + margin.left + margin.right)
	// .attr("height", height + margin.top + margin.bottom);


	// // Update the inner dimensions.
 //    var g = svg.select("g")
 //    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 //    // Update the area path.
 //    g.select(".area")
 //    .attr("d", area.y0(yScale.range()[0]));

 //    // Update the x-axis.
 //    g.select(".x.axis")
 //    .attr("transform", "translate(0," + yScale.range()[0] + ")")
 //    .call(xAxis);

 //    // Update the y-axis.
 //    g.select(".y.axis")
 //      //.attr("transform", "translate(0," + xScale.range()[0] + ")")
 //      .call(yAxis);
































































 	// var svg = d3.select(this).selectAll("svg")
  //   .attr("width", width)
  //   .attr("height", height)
  // .append("g")
  //   .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// svg.selectAll(".link")
//     .data(data)
//   .enter().append("path")
//     .attr("class", "link")
//     .attr("d", d3.hive.link()
//     .angle(function(d) { return angle(d.x); })
//     .startRadius(function(d) { return radius(d.y0); })
//     .endRadius(function(d) { return radius(d.y1); }))
//     .style("fill", function(d) { return color(d.group); });

// svg.selectAll(".axis")
//     .data(d3.range(3))
//   .enter().append("g")
//     .attr("class", "axis")
//     .attr("transform", function(d) { return "rotate(" + degrees(angle(d)) + ")"; })
//   .selectAll("line")
//     .data(["stroke", "fill"])
//   .enter().append("line")
//     .attr("class", function(d) { return d; })
//     .attr("x1", radius.range()[0])
//     .attr("x2", radius.range()[1]);


 		// // Convert data to standard representation greedily;
   //    // this is needed for nondeterministic accessors.
   //    data = data.map(function(d, i) {
   //    	return [xValue.call(data, d, i), yValue.call(data, d, i)];
   //    });

   //    // Update the x-scale.
   //    xScale
   //    .domain(d3.extent(data, function(d) { return d[0]; }))
   //    .range([0, width - margin.left - margin.right]);

   //    // Update the y-scale.
   //    yScale
   //    .domain([0, d3.max(data, function(d) { return d[1]; })])
   //    .range([height - margin.top - margin.bottom, 0]);

   //    // Select the svg element, if it exists.
   //    var svg = d3.select(this).selectAll("svg").data([data]);

   //    // Otherwise, create the skeletal chart.
   //    var gEnter = svg.enter().append("svg").append("g");
   //    gEnter.append("path").attr("class", "area");
   //    gEnter.append("path").attr("class", "line");
   //    gEnter.append("g").attr("class", "x axis");
   //    gEnter.append("g").attr("class", "y axis");

   //    // Update the outer dimensions.
   //    svg .attr("width", width + margin.left + margin.right)
   //    .attr("height", height + margin.top + margin.bottom);

   //    // Update the inner dimensions.
   //    var g = svg.select("g")
   //    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   //    // Update the area path.
   //    g.select(".area")
   //    .attr("d", area.y0(yScale.range()[0]));

   //    // Update the x-axis.
   //    g.select(".x.axis")
   //    .attr("transform", "translate(0," + yScale.range()[0] + ")")
   //    .call(xAxis);

   //    // Update the y-axis.
   //    g.select(".y.axis")
   //        //.attr("transform", "translate(0," + xScale.range()[0] + ")")
   //        .call(yAxis);

      });

}

function degrees(radians) {
  return radians / Math.PI * 180 - 90;
}

// getter and setter method
chart.width = function(value) {
	if (!arguments.length) return width; //if no args, getter
	width = value;                       // else setter!
	return chart;  // return the function.
	// this allows us to chain calls!
};

chart.height = function(value) {
	if (!arguments.length) return height;
	height = value;
	return chart;
};

// The x-accessor for the path generator; xScale âˆ˜ xValue.
function X(d) {
	return xScale(d[0]);
}

  // The x-accessor for the path generator; yScale âˆ˜ yValue.
  function Y(d) {
  	return yScale(d[1]);
  }

  //getter/setter for margin
  chart.margin = function(_) {
  	if (!arguments.length) return margin;
  	margin = _;
  	return chart;
  };

  //getter/setter for x data
  chart.x = function(_) {
  	if (!arguments.length) return xValue;
  	xValue = _;
  	return chart;
  };
  //getter/setter for y data
  chart.y = function(_) {
  	if (!arguments.length) return yValue;
  	yValue = _;
  	return chart;
  };

  return chart;
}

