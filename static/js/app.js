// function init(){
//     optionChanged("BB_560");
// }
// counter=1;


function optionChanged(dataset){
    var select_sample=document.getElementById("selDataset");
    //console.log(dataset);
    var names_url="/names";
    var otu_url="/otu";
    var metadata_url="/metadata/"+dataset;
    var wfreq_url="/wfreq/"+dataset;
    var samples_url="/samples/"+dataset;
    otuDesc = []; 
    Plotly.d3.json(otu_url, function(err1, response1) 
     {
        if (err1) return console.warn(err1);
        //console.log("response1");
        //console.log(response1);
        Plotly.d3.json(samples_url, function(err2, response2) 
        {
            if (err2) return console.warn(err2);
            
            otu_ids=[response2[0].otu_ids][0].slice(0,10);
            sample_values=[response2[0].sample_values][0].slice(0,10);
            
            for (var i=0;i<otu_ids.length;i++){
                //console.log(otu_ids);

                otuDesc.push(response1[otu_ids[i]]);
                }
            var data = [{
                values:sample_values,
                labels:otu_ids,
                type: "pie",
                text:otuDesc,
                hoverinfo:"label + value+ text + percent ",
                 textinfo: "percent"
            }];
            var layout={
                width:500,
                height:"100%"
            };
            //console.log(data)
            pies=document.getElementById("pie");
            //updatePlotly(pies,data,layout,flag);
            Plotly.newPlot(pies, data,layout);
        //updatePlotly(data);

            b_otu_ids=[response2[0].otu_ids][0];
            b_sample_values=[response2[0].sample_values][0];

            var trace1 = {
                type: "scatter",
                mode: "markers",
                name: "test",
                x: b_otu_ids,
                y: b_sample_values,
                line: {
                    color: "#17BECF"
                },
                text:otuDesc,
                marker:{
                    size: b_sample_values,
                    //setting 'sizeref' to less than 1, increases the rendered marker sizes
                    color: b_otu_ids.map(d=>(d*20)%255),
                    colorscale: 'Earth',
                    sizeref: 0.2,
                    sizemode: 'area'
                  },
                  hoverinfo:"x + y+ text ",
            };
            var layout = {
                xaxis:{title:"OTU ID",zeroline:true, hoverformat: '.2r'},
                yaxis:{title: "No: of germs in Sample",zeroline:true, hoverformat: '.2r'},
                height: 500,
                width:1200,
                margin: {
                    l: 100,
                    r: 10,
                    b: 70,
                    t: 10,
                    pad: 5
                  },
                hovermode: 'closest',
            };

            var bubb_data = [trace1];
            //updatePlotly(data,layout);
                Plotly.newPlot("bubble", bubb_data,layout);

        });
    });

    Plotly.d3.json(metadata_url, function(err1, response) 
    {

        if (err1) return console.warn(err1);
        //console.log(metadata_url);
        var meta=document.getElementById("meta");
        
        //document.createElement("p")
        Plotly.d3.select("#meta").selectAll("p").remove();
    
        // Add new metadata for this sample into html id #table
        for (var key in response) 
        {
          if (response.hasOwnProperty(key)) 
          {
            Plotly.d3.select("#meta").append("p")
              .text(key + " : " + response[key]);
          }
        }
       
    });

    Plotly.d3.json(wfreq_url, function(err1, response) 
    {

        if (err1) return console.warn(err1);

    // Enter a speed between 0 and 180
        console.log(response);
            var level =parseInt(response);

            // Trig to calc meter point
            var degrees = 180 - level*20,
                radius = .5;
            var radians = degrees * Math.PI / 180;
            var x = radius * Math.cos(radians);
            var y = radius * Math.sin(radians);

            // Path: may have to change to create a better triangle
            var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
                pathX = String(x),
                space = ' ',
                pathY = String(y),
                pathEnd = ' Z';
            var path = mainPath.concat(pathX,space,pathY,pathEnd);

            var data = [{ type: 'scatter',
            x: [0], y:[0],
                marker: {size: 28, color:'850000'},
                showlegend: false,
                name: 'speed',
                text: level,
                hoverinfo: 'text+name'},
            { values: [90/9, 90/9, 90/9, 90/9, 90/9, 90/9, 90/9,90/9,90/9,90],
            rotation: 90,
            text: ['8-9', '7-8', '6-7', '5-6',
                        '4-5', '3-4 ', '2-3','1-2','0-1',''],
            textinfo: 'text',
            textposition:'inside',
            marker: {colors:['rgba(34, 116, 73, .5)', 'rgba(56, 129, 91, .5)',
            'rgba(78, 143, 109, .5)', 'rgba(100, 157, 127, .5)',
            'rgba(122, 171, 145, .5)', 'rgba(144, 185, 164, .5)',
            'rgba(166, 199, 182, .5)', 'rgba(188, 213, 200, .5)',
            'rgba(210, 227, 218, .5)','rgba(255, 255, 255, 0)'
            ]
    },
            labels: ['8-9', '7-8', '6-7', '5-6','4-5', '3-4 ', '2-3','1-2','0-1',''],
            hoverinfo: 'label',
            hole: .5,
            type: 'pie',
            showlegend: false
            }];

            var layout = {
            shapes:[{
                type: 'path',
                path: path,
                fillcolor: '850000',
                line: {
                    color: '850000'
                }
                }],
            title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
            height: "100%",
            width: 500,
            xaxis: {zeroline:false, showticklabels:false,
                        showgrid: false, range: [-1, 1]},
            yaxis: {zeroline:false, showticklabels:false,
                        showgrid: false, range: [-1, 1]}
            };

            Plotly.newPlot('wash', data, layout);

        });

   
}

//init();
