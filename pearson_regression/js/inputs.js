function addRow() {
	const table = $('tbody');
	const nRows = table.rows.length;
	const tr = table.insertRow(nRows);
	const thCount = $$('th').length;
	const attr = [$('input[name=x-data]:checked').value, $('input[name=y-data]:checked').value];
	const bg = nRows % 2 !== 0 ? 'lightblue' : 'lightgrey';
	for (let i = 0; i < thCount; i++) {
		const td = tr.insertCell(i);
		if (i === 0) {
			td.innerHTML = i + 1 + nRows;
		} else {
			const input = makeTag('input');
			input.style.backgroundColor = bg;
			input.setAttribute('type', attr[i - 1]);
			if (attr[i - 1] === 'number')
				input.setAttribute('step', '0.01');
			td.appendChild(input);
		}
	}
}

function importData() {
	const path = $('#file-path').value;
	if (!path) {
		$('input[type=file]').click();
	}
}

function calculate() {

}