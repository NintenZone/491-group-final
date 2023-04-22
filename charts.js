const CHARTS_TO_GENERATE = [
    {
        exampleTitle: 'Ex 1: Line Chart',
        subtitle: 'Creating a simple 1 line chart with randomly generated data. Has a title, axis labels, and example styling.',
        functionToCall: example1
    },
    {
        exampleTitle: 'Ex 2: Sine & Cosine Waves',
        subtitle: 'Showing multiple lines + a legend.',
        functionToCall: example2
    },
    {
        exampleTitle: 'Ex 3: Map Of GDP By State',
        subtitle: 'Interactive map of GDP by US States. Data: <a href="https://www.bea.gov/data/gdp/gdp-state">www.bea.gov</a>',
        functionToCall: example3
    }
];

google.charts.load('current', {'packages':['corechart', 'line', 'geochart']});
google.setOnLoadCallback(onLoadCallback);

function generateRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

/*
    Example 1: Line Chart
    Creating a simple 1 line chart with randomly generated data. Has a title, axis labels, and example styling.
*/

function example1(divId) {
    let data = new google.visualization.DataTable();
    data.addColumn('number', 'X');
    data.addColumn('number', 'Y');

    for (let i = 0; i < 100; i++) {
        let min = i - 5;
        if (min < 0) min = 0;
        let max = min + 10;

        data.addRow([i + 1, generateRandomNumber(min, max)]);
    }

    let options = {
        title: 'Basic Line Chart',
        curveType: 'function',
        vAxis: { title: 'Y Axis Example Label', viewWindow: { min: 0 } },
        hAxis: { title: 'X Axis Example Label' },
        colors: ['#ff0000'],
        legend: { position: 'none' },
    }

    let chart = new google.visualization.LineChart(document.getElementById(divId));
    chart.draw(data, options);   
}

function example2(divId) {
    let data = new google.visualization.DataTable();
    data.addColumn('number', 'X');
    data.addColumn('number', 'Sine Wave')
    data.addColumn('number', 'Cosine Wave');

    for (let i = 0; i < 20; i++) {
        data.addRow([i + 1, Math.sin(i), Math.cos(i)]);
    }

    let options = {
        title: 'Sine Wave',
        curveType: 'function',
        vAxis: { title: 'Y', viewWindow: { min: -1, max: 1 } },
        hAxis: { title: 'X' },
    }

    let chart = new google.visualization.LineChart(document.getElementById(divId));
    chart.draw(data, options);
}

async function example3(divId) {
    let data = new google.visualization.DataTable();
    data.addColumn('string', 'State');
    data.addColumn('number', 'GDP');

    let state_id_res = await fetch('https://raw.githubusercontent.com/PitchInteractiveInc/tilegrams/master/data/us/fips-to-state.json');
    let state_id_json = await state_id_res.json();

    let state_gdp_res = await fetch('https://raw.githubusercontent.com/PitchInteractiveInc/tilegrams/master/data/us/gdp-by-state.csv');
    let state_gdp_csv = await state_gdp_res.text();

    let csv_rows = state_gdp_csv.split('\r');

    for (row of csv_rows) {
        let state_id = row.split(',')[0];
        let state_gdp = parseInt(row.split(',')[1]);
        let state_name = state_id_json[state_id].name;

        let newName = '';
        for (begin of state_name.split(' ')) {
            let length = begin.length;

            newName += begin[0].toUpperCase() + begin.slice(1).toLowerCase();
            if (length > 0) newName += ' ';
        }

        state_name = newName;

        data.addRow([state_name, state_gdp]);
    }

    let options = {
        title: 'GDP By State',
        region: 'US',
        resolution: 'provinces',
    }

    let chart = new google.visualization.GeoChart(document.getElementById(divId));
    chart.draw(data, options);
}

function initCharts() {
    let i = 0;
    for (chart of CHARTS_TO_GENERATE) {
        i++;

        let chartDiv = document.createElement('div');
        chartDiv.className = 'chart-item-container';

        let chartTitle = document.createElement('h2');
        chartTitle.innerText = chart.exampleTitle;

        let chartSubtitle = document.createElement('h3');
        chartSubtitle.innerHTML = chart.subtitle;

        let chartCanvas = document.createElement('div');
        chartCanvas.id = `chart-mount-${i}`;0
        chartCanvas.className = 'chart-mount';

        chartDiv.appendChild(chartTitle);
        chartDiv.appendChild(chartSubtitle);
        chartDiv.appendChild(chartCanvas);

        document.getElementById('charts-container').appendChild(chartDiv);

        chart.functionToCall(`chart-mount-${i}`);
    }
}

function onLoadCallback() {
    initCharts();
}
