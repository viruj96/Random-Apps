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

// Plots
