const data = [];

function addRow() {
	const tbody = $('#data-table tbody');
	const nRows = tbody.rows.length;
	let rowNumber = 1;
	if (nRows > 0) {
		const rows = tbody.children;
		const lastRow = rows.item(rows.length - 1);
		rowNumber = parseInt(lastRow.id) + 1;
	}
	const tr = tbody.insertRow(nRows);
	const thCount = $$('#data-table th').length;
	for (let i = 0; i < thCount; i++) {
		const td = tr.insertCell(i);
		if (i === 0) {
			tr.id = rowNumber;
			td.innerHTML = rowNumber; // Set row number
		} else {
			const input = create('input');
			css(input, { 'background': 'transparent' });
			input.setAttribute('type', 'number');
			input.setAttribute('step', '0.01');
			td.appendChild(input);
		}
	}
	on(tr, 'click', handleRowClick)
}

function deleteRow() {
	$$('.highlighted').forEach(row => {
		row.parentNode.removeChild(row);
	});
}

function importData() {
	const path = $('#file-path').value;
	if (!path) {
		$('input[type=file]').click();
	}
}

function parseData() {
	data.length = 0;
	const rows = $$('#data-table tbody tr');
	const invalidRows = [];
	let invalidData = false;
	let logLevel;
	let logText;
	if (!rows || rows.length === 0) {
		logLevel = 'ERROR: ';
		logText = 'Add data before processing.';
		invalidData = true;
	} else {
		rows.forEach(row => {
			const inputs = findAll(row, 'input');
			inputs.forEach(input => {
				if (!input.value) {
					invalidData = true;
					invalidRows.push(row.id);
				}
			});
			if (invalidData) {
				logLevel = 'WARN: ';
				logText = `Delete empty rows before processing. Missing data in rows: ${invalidRows.filter(unique)}`;
			} else {
				logLevel = 'INFO: ';
				logText = 'Processing data...';
				let x = parseInt(inputs[0].value);
				let y = parseInt(inputs[1].value);
				data.push({ x, y });
			}
		});
	}
	logger(logLevel, logText);

	if (invalidData) data.length = 0;
	else {
		data.sort((a, b) => {
			if (a.x > b.x) return 1;
			if (a.x < b.x) return -1;
			else return 0;
		});
		sleep(1000).then(() => {
			logger('INFO: ', 'Done processing data')
			toggle('#calc', 'disabled', false);
			toggle('#add', 'disabled', true);
			toggle('#delete', 'disabled', true);
			toggle('#validate', 'disabled', true);
		});
	}
}

function calculate() {
	const rows = $$('#data-table tbody tr');
	let logLevel;
	let logText;
	if (rows.length === 1) {
		logLevel = 'WARN: ';
		logText = 'Not enough data. Must have at least 2 records to calculate coefficient';
	} else {
		logLevel = 'INFO: ';
		logText = 'Measuring correlation between data sets';
		const r = getSampleCorrelationCoefficient(data);
		const degree = getDegreeOfCorrelation(r);
		$('#findings').innerText = degree;
		populateResultsTable(data, r);
		css($('#results'), { display: 'block' });
		plotGraph(data, 'chart', r);
	}
	logger(logLevel, logText);

	toggle('#calc', 'disabled', true);
	toggle('#add', 'disabled', false);
	toggle('#delete', 'disabled', false);
	toggle('#validate', 'disabled', false);
}

function logger(logLevel, logText) {
	const textarea = $('#textarea');
	const p = create('p');
	const span = create('span');
	const text = document.createTextNode('');
	const styles = {
		color: 'black',
		margin: '0 2%'
	};
	let color;
	switch (logLevel) {
		case 'INFO: ':
			color = 'blue';
			break;
		case 'WARN: ':
			color = 'darkorange';
			break;
		case 'ERROR: ':
			color = 'red';
			break;
	}
	span.innerHTML = logLevel;
	text.data = logText;
	css(span, { color });
	css(p, styles);
	p.appendChild(span);
	p.appendChild(text);
	textarea.appendChild(p);
}