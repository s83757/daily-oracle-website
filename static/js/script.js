const url1 = `https://s83757.github.io/daily-oracle-website/website_output.csv`;
fetch(url1)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(csvText => {
        // window.alert('CSV Data:' + csvText);
        // You can now parse csvText if needed
    })
    .catch(error => {
        window.alert('There was a problem fetching the CSV file:' + error);
    });

const knowledge_cutoffs = {
    "gpt-4": "2023-04-01",
    "gpt-35": "2021-09-01",
    "gpt-4o": "2024-06-01",
    "gpt-4o-mini": "2023-10-01"
}

async function loadCSV(url, target_model, target_question_type) {

    csvFile = await d3.csv(url)
    const filteredData = csvFile.filter(row =>
        row.model === target_model && row.question_type === target_question_type
    );
    return filteredData;

    // d3.csv(url, function(d) { // async
    //     return {
    //         year: new Date(+d.Year, 0, 1), // convert "Year" column to Date
    //         make: d.Make,
    //         model: d.Model,
    //         length: +d.Length // convert "Length" column to number
    //     };
    // }, function(error, rows) {
    // console.log(rows);
    // });
}

async function createGraph(plotDivID, url, target_model, target_question_type, target_y) {
    csvFile = await loadCSV(url, target_model, target_question_type);
    
    // process the data
    console.log(csvFile);
    console.log(csvFile.length)
    var x = [], y = [], standard_deviation = [];

    for (var i=0; i<csvFile.length; i++) {
        row = csvFile[i];
        x.push( row['date'] );
        y.push( row[target_y] );
    }
    console.log( 'X',x, 'Y',y, 'SD',standard_deviation );

    // make plotly graph
    var traces = [{
        x: x,
        y: y,
        mode: 'lines',
        connectgaps: true
    }];
    
    
    var layout = {
        xaxis: {
            type: 'date',  // 👈 This makes Plotly parse strings as dates
            title: {text: 'Date'}
        },
        yaxis: {
            title: {text: '5 month moving average'}
        },
        title: {
            text: "Accuracy for " + target_model + " " + target_question_type
        },
        shapes: [{
            type: 'line',
            x0: knowledge_cutoffs[target_model],
            y0: 0,
            x1: knowledge_cutoffs[target_model],
            y1: 1,
            yref: "paper",
            line: {
                color: 'red',
                width: 2,
                dash: 'dot'
            }
        }]
    };

    Plotly.newPlot(plotDivID, traces, layout);
}

// createGraph("plot-overall", url1, "gpt-4", "mc", "all_acc_ma")
createGraph("plot-gpt35-tf", url1, "gpt-35", "tf", "all_acc_ma")
createGraph("plot-gpt35-mc", url1, "gpt-35", "mc", "all_acc_ma")
createGraph("plot-gpt4-tf", url1, "gpt-4", "tf", "all_acc_ma")
createGraph("plot-gpt4-mc", url1, "gpt-4", "mc", "all_acc_ma")



//   window.alert("hi")
document.getElementById("output").innerText = "raaaaah!";
