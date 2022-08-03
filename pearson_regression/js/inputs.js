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
	const thCount = $$('th').length;
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
	const textarea = $('#textarea');
	const rows = $$('#data-table tbody tr');
	const invalidRows = [];
	let invalidData = false;
	const p = create('p');
	const span = create('span');
	const text = document.createTextNode('');
	const styles = {
		color: 'black',
		margin: '0 2%'
	};
	let color;
	if (!rows || rows.length === 0) {
		span.innerHTML = 'ERROR: ';
		text.data = 'Add data before processing.';
		color = 'red';
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
				span.innerHTML = 'WARN: ';
				text.data = `Delete empty rows before processing. Missing data in rows: ${invalidRows.filter(unique)}`;
				color = 'darkorange';
			} else {
				span.innerHTML = 'INFO: ';
				text.data = 'Processing data...';
				color = 'blue';
				let x = inputs[0].value;
				let y = inputs[1].value
				if (inputs[0].type === 'number')
					x = parseInt(x);
				if (inputs[1].type === 'number')
					y = parseInt(y);
				data.push({ x, y });
			}
		});
	}
	css(span, { color });
	css(p, styles);
	p.appendChild(span);
	p.appendChild(text);
	textarea.appendChild(p);

	if (invalidData) data.length = 0;
	else {
		toggle('#calc', 'disabled', false);
		toggle('#add', 'disabled', true);
		toggle('#delete', 'disabled', true);
		toggle('#validate', 'disabled', true);
		sleep(1000).then(() => {
			const doneMessage = p.cloneNode(true);
			doneMessage.childNodes[1].data = 'Done processing data';
			textarea.appendChild(doneMessage);
		});
	}
}

function calculate() {
	const textarea = $('#textarea');
	const rows = $$('#data-table tbody tr');
	const p = create('p');
	const span = create('span');
	const text = document.createTextNode('');
	const styles = {
		color: 'black',
		margin: '0 2%'
	};
	let color;
	if (rows.length === 1) {
		span.innerHTML = 'WARN: ';
		text.data = 'Not enough data. Must have at least 2 records to calculate coefficient';
		color = 'darkorange';
	}
	css(span, { color });
	css(p, styles);
	p.appendChild(span);
	p.appendChild(text);
	textarea.appendChild(p);

	toggle('#calc', 'disabled', true);
	toggle('#add', 'disabled', false);
	toggle('#delete', 'disabled', false);
	toggle('#validate', 'disabled', false);
}