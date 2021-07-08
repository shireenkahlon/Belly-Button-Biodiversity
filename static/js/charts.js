function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    PANEL.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // Create a variable that holds the samples array. 
    var sampleDataset = data.samples;
    console.log(sampleDataset);
    // Create a variable that filters the samples for the object with the desired sample number.
    var firstSample = sampleDataset.filter(sampleObj => sampleObj.id== sample)[0];
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIdsArray = firstSample.otu_ids;
    var otuLabelsArray = firstSample.otu_labels;
    var sampleValuesArray = firstSample.sample_values;
    // Create the yticks for the bar chart.
    var yticks = otuIdsArray.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    // Create the trace for the bar chart. 
    var barData = [
      {
        y: yticks,
        x: sampleValuesArray.slice(0, 10).reverse(),
        text: otuLabelsArray.slice(0, 10).reverse(),
        type: 'bar',
        orientation: 'h',
      }
    ];
    // Create the layout for the bar chart. 
    var barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      margin: { t: 50, l: 150 },
      colorway : ['rgb(52, 208, 235)', 'rgb(52, 76, 235)'],
      plot_bgcolor: "rgba(0,0,0,0)",
      paper_bgcolor: "rgba(0,0,0,0)",
      font: {
        family: 'Monaco',
        size: 18,
        color: '#8c564b'
      }

      };
      
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
        // Create the trace for the bubble chart.
    // bubble = d3.select('#seldataset').property('value')
    var bubbleData = [{
      x: otuIdsArray,
      y: sampleValuesArray,
      text: otuLabelsArray,
      mode: "markers",
      marker: {
        size: sampleValuesArray,
        sizeref: 1.4,
        color: otuIdsArray,
        colorscale: 'Bluered'
      }
    }];
    
        // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures per Sample',
      xaxis: {title: 'OTU ID'},
      yaxis: {title: ''},
      hovermode: 'closest',
      plot_bgcolor: "rgba(0,0,0,0)",
      paper_bgcolor: "rgba(0,0,0,0)",
      font: {
        family: 'Monaco',
        size: 18,
        color: '#8c564b'
      }
    };
    
        // Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
     // Create the trace for the gauge chart.
     var metadata = data.metadata;
     var firstMetadata = metadata.filter(sampleObj => sampleObj.id == sample)[0];
     console.log(firstMetadata);
     wfreqFloat = parseFloat(firstMetadata.wfreq);
     console.log(wfreqFloat);
     var sampleMetadata = d3.select('#sample-metadata')
     var firstMetadata = sampleMetadata.property('value');
    
     var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
       value: wfreqFloat,
       type: 'indicator',
       mode: 'gauge+number',
       title: {text: 'Belly Button Washing Frequency'},
       gauge: {
        axis: { range: [null, 10], tickwidth: 1, tickcolor: 'RGB(23, 23, 23)'},
        steps: [
          { range: [0, 2], color: "RGB(7, 120, 122)" },
          { range: [2, 4], color: "RGB(7, 110, 122)" },
          {range: [4,6], color: 'RGB(7, 72, 122)'},
          {range: [6,8], color: 'RGB(7, 59, 122)'},
          {range: [8,10], color: 'RGB(26, 7, 122)'}
        ]
     
  }}];
    
    // Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600,
      height: 500,
      plot_bgcolor: "rgba(0,0,0,0)",
      paper_bgcolor: "rgba(0,0,0,0)",
      font: {
        family: 'Monaco',
        size: 18,
        color: '#8c564b'
      }      
    };

    // Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
    });
  };





