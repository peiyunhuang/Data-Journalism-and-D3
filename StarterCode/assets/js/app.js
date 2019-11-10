//Create Parameters for Height and Width of SVG
let svgHeight = 500;
let svgWidth = 1000;

//Set Margins of SVG
let margin = {
 top: 40,
 bottom: 80,
 right: 40,
 left: 80
};

//Set the Height and Width with Reference to SVG Parameters and Margins
let height = svgHeight - margin.top - margin.bottom;
let width = svgWidth - margin.left - margin.right;

//Append the SVG to the Page and Attribute Parameters of the SVG
let svg = d3.select("#scatter")
 .append("svg")
 .attr("width", svgWidth)
 .attr("height", svgHeight);

 //Create a chartGroup to Append Data to the SVG
 //Transform and Translate
 let chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Create a Variable for the Path to the CSV File
let csvFile = "assets/data/data.csv"

//Import CSV File to Call a Function to Append Data
d3.csv(csvFile).then(appendData);

//Create a Function that Will Use the Data of the Table as an Argument
function appendData(dataTable) {

  //Create a Loop to Collect the Data and Return Values as Numbers
  dataTable.map(function (data) {
    data.healthcare = +data.healthcare;
    data.obesity = +data.obesity;
  });

  //Create the Linear Scale for X and Y Axes and Establish Domain and Range
  let xLinearScale = d3.scaleLinear()
    .domain([3, d3.max(dataTable, d => d.healthcare)])
    .range([0, width]);
  let yLinearScale = d3.scaleLinear()
    .domain([14, d3.max(dataTable, d => d.obesity)])
    .range([height, 0]);
    
  //Use the Linear Scale to Create Axes for the Bottom and Left of the Chart
  let bottomAxis = d3.axisBottom(xLinearScale);
  let leftAxis = d3.axisLeft(yLinearScale);

  //Append the Axes to the Chart
  //Adjust Axis for Bottom with Reference to Height
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  chartGroup.append("g")
    .call(leftAxis);

  //Create Circles for the Scatterplot
  var circlesGroup = chartGroup.selectAll("circle")
    .data(dataTable)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.healthcare))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "15")
    .attr("fill", "#9A12DE")
    .attr("opacity", ".50")

  //Append Text to the Circles
  var circlesGroup = chartGroup.selectAll()
    .data(dataTable)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.healthcare))
    .attr("y", d => yLinearScale(d.obesity))
    .style("font-size", "12px")
    .style("text-anchor", "middle")
    .style('fill', 'white')
    .text(d => (d.abbr));

  //Create the Tooltip
  let toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([0, -50])
    .html(function (d) {
      return (`${d.state}<br>Healthcare: ${d.healthcare}%<br>Obesty: ${d.obesity}% `);
    });

  //Call the Tooltip to the Chart
  chartGroup.call(toolTip);

  //Create the Event Listeners for the Tooltip
  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data, this);
  })
    .on("mouseout", function (data) {
      toolTip.hide(data);
    });

  //Create Text for the Axes
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 10)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Obesity (%)");
  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
    .attr("class", "axisText")
    .text("Healthcare (%)");
}