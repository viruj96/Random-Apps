window.onload = () => {
	document.querySelector('input[type=file]').addEventListener('change', readFile);
	document.querySelector('#input').addEventListener('change', () => {
		document.querySelector('input[type=file]').value = '';
		document.querySelector('p').innerHTML = 'Upload File';
	});
};

const uploadFile = () => {
	document.querySelector('input[type=file]').click();
};

const readFile = (e) => {
	let file = e.target.files[0];

	document.querySelector('p').innerHTML = file.name;

	let reader = new FileReader();
	reader.onload = (() => {
		return (e) => {
			document.querySelector('#input').value = e.target.result;
		}
	})(file);
	reader.readAsText(file);

	toggleButtons((file.type).split('/')[1]);
};

const toggleButtons = (fileType) => {
	if (fileType === 'csv') {
		document.querySelector('#json2csv').disabled = true;
		document.querySelector('#csv2json').disabled = false;
	} else if (fileType === 'json') {
		document.querySelector('#json2csv').disabled = false;
		document.querySelector('#csv2json').disabled = true;
	} else if (fileType === 'invalid') {
		document.querySelectorAll('.handleOutputBtn').forEach(btn => btn.disabled = true);
	} else if (fileType === 'valid') {
		document.querySelectorAll('.handleOutputBtn').forEach(btn => btn.disabled = false);
	}
};

const json2csv = () => {
	let json = document.querySelector('#input').value;
	try {
		json = JSON.parse(json);
		let csvHeader = [];
		let csvValue = [];
		if (!isIterable(json)) {
			csvHeader = Object.keys(json);
			csvValue = Object.values(json);
			csvValue[csvValue.length - 1] = csvValue[csvValue.length - 1] + '\n';
		} else {
			csvHeader = Object.keys(json[0]);
			for (let o of json) {
				let values = Object.values(o);
				values[values.length - 1] = values[values.length - 1] + '\n';
				csvValue.push(...values);
			}
		}
		csvHeader[csvHeader.length - 1] = csvHeader[csvHeader.length - 1] + '\n';
		let csv = csvHeader.join() + csvValue.join();
		document.querySelector('#output').value = csv;
		toggleButtons('valid');
	} catch {
		document.querySelector('#output').value = 'Invalid JSON';
		toggleButtons('invalid');
	}
};

const isIterable = (obj) => {
	if (!obj) return false;
	return typeof obj[Symbol.iterator] === 'function';
};