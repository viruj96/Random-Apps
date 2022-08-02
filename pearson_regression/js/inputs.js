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
	const attr = [$('input[name=x-data]:checked').value, $('input[name=y-data]:checked').value];
	for (let i = 0; i < thCount; i++) {
		const td = tr.insertCell(i);
		if (i === 0) {
			tr.id = rowNumber;
			td.innerHTML = rowNumber; // Set row number
		} else {
			const input = create('input');
			css(input, { 'background': 'transparent' });
			input.setAttribute('type', attr[i - 1]);
			if (attr[i - 1] === 'number')
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
	const textarea = $('#textarea');
	const rows = $('#data-table tbody tr');
	if (!rows || rows.length === 0) {
		const p = create('p');
		p.innerHTML = 'Add data before processing';
		css(p, { 'color': 'red', 'margin': 0, 'margin-left': '2%' });
		textarea.appendChild(p);
	}
}

function calculate() {

}