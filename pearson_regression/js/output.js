// Calculate coefficients
function getSampleCorrelationCoefficient(data) {
	const x = data.map(val => val.x);
	const y = data.map(val => val.y);
	const xy = data.map(val => val.x * val.y).reduce((a, b) => a + b);
	const meanX = average(x);
	const meanY = average(y);
	const sdX = sd(x);
	const sdY = sd(y);
	return (xy - data.length * meanX * meanY) / ((data.length - 1) * sdX * sdY);
}

function getDegreeOfCorrelation(correlation) {
	let degree = '';
	if (correlation === 0)
		degree = 'No ';
	else if (Math.abs(correlation) < 0.3)
		degree = 'Low degree ';
	else if (Math.abs(correlation) < 0.5)
		degree = 'Moderate degree ';
	else if (Math.abs(correlation) < 1)
		degree = 'High degree ';
	else
		degree = 'Perfect ';

	if (correlation > 0)
		degree += 'positive ';
	else if (correlation < 0)
		degree += 'negative ';

	degree += 'correlation';

	return degree;
}

// Statistics
function populateResultsTable(data, r) {
	let x = data.map(d => d.x);
	let y = data.map(d => d.y);

	$('#nx').innerText = x.length;
	$('#ny').innerText = y.length;

	$('#mux').innerText = average(x).toFixed(2);
	$('#muy').innerText = average(y).toFixed(2);

	$('#sdx').innerText = sd(x).toFixed(2);
	$('#sdy').innerText = sd(y).toFixed(2);

	$('#semx').innerText = sem(x).toFixed(2);
	$('#semy').innerText = sem(y).toFixed(2);

	$('#Ex').innerText = E(x).toFixed(2);
	$('#Ey').innerText = E(y).toFixed(2);

	$('#se').innerText = se(x, y).toFixed(2);
	$('#tc').innerText = t(x, y).toFixed(2);
	$('#dof').innerText = dof(x, y);

	$('#r').innerText = r.toFixed(2);
}

function correlation(slope, c, r) {
	const fieldset = $('#best-fit');
	fieldset.appendChild(document.createTextNode(`Coefficient: ${r.toFixed(4)}`));
	fieldset.appendChild(create('br'));
	fieldset.appendChild(document.createTextNode(`Slope: ${slope.toFixed(4)}`));
	fieldset.appendChild(create('br'));
	fieldset.appendChild(document.createTextNode(`y-intercept: ${c.toFixed(4)}`));
	fieldset.appendChild(create('br'));
	fieldset.appendChild(create('br'));
	fieldset.appendChild(document.createTextNode('Line of best fit equation:'))
	fieldset.appendChild(create('br'));
	fieldset.appendChild(document.createTextNode(`Y = ${slope.toFixed(2)}X + ${c.toFixed(2)}`));
}

function lineOfBestFit(data, r) {
	const meanX = average(data.map(d => d.x));
	const meanY = average(data.map(d => d.y));

	const slope = data.map(d => (d.x - meanX) * (d.y - meanY)).reduce((a, b) => a + b) / data.map(d => Math.pow(d.x - meanX, 2)).reduce((a, b) => a + b);
	const c = meanY - slope * meanX;

	correlation(slope, c, r);

	const bestFit = data.map(d => slope * d.x + c);
	return bestFit;
}

// Plots
function plotGraph(dataPoints, selector, r) {
	const data1 = {
		x: dataPoints.map(d => d.x),
		y: dataPoints.map(d => d.y),
		mode: 'markers',
		type: 'scatter',
		name: 'Data',
		marker: {
			color: 'green',
			size: 10
		}
	};
	const data2 = {
		x: dataPoints.map(d => d.x),
		y: lineOfBestFit(dataPoints, r),
		mode: 'lines+markers',
		type: 'lines',
		name: 'Best fit',
		marker: {
			size: 10
		}
	};
	const data = [data1, data2];
	const layout = {
		width: '100%',
		plot_bgcolor: "black",
		paper_bgcolor: "#FFF3",
		xaxis: {
			title: {
				text: 'x',
				font: {
					family: 'Courier New, monospace',
					size: 18,
					color: '#ffffff'
				}
			},
			showgrid: true,
			zeroline: true,
			showline: true,
			mirror: 'ticks',
			gridcolor: '#bdbdbd',
			gridwidth: 1,
			zerolinecolor: '#969696',
			zerolinewidth: 2,
			linecolor: '#636363',
			linewidth: 1
		},
		yaxis: {
			title: {
				text: 'y',
				font: {
					family: 'Courier New, monospace',
					size: 18,
					color: '#ffffff'
				}
			},
			showgrid: true,
			zeroline: true,
			showline: true,
			mirror: 'ticks',
			gridcolor: '#bdbdbd',
			gridwidth: 1,
			zerolinecolor: '#969696',
			zerolinewidth: 2,
			linecolor: '#636363',
			linewidth: 1
		}
	};
	Plotly.newPlot(selector, data, layout);
}