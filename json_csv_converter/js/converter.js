import { modalIcons, addIcon } from './icons';

export const uploadFile = () => {
	document.querySelector('input[type=file]').click();
};

export const readFile = (e) => {
	const file = e.target.files[0];

	document.querySelector('p').innerHTML = file.name;

	const reader = new FileReader();
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
		document.querySelectorAll('.output-btn:not(:last-child)').forEach(btn => btn.disabled = true);
	} else if (fileType === 'valid') {
		document.querySelectorAll('.output-btn').forEach(btn => btn.disabled = false);
	} else {
		document.querySelector('#json2csv').disabled = false;
		document.querySelector('#csv2json').disabled = false;
		document.querySelectorAll('.output-btn').forEach(btn => btn.disabled = false);
	}
};

export const json2csv = () => {
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
				const values = Object.values(o);
				values[values.length - 1] = values[values.length - 1] + '\n';
				csvValue.push(...values);
			}
		}
		csvHeader[csvHeader.length - 1] = csvHeader[csvHeader.length - 1] + '\n';
		const csv = csvHeader.join() + csvValue.join();
		document.querySelector('#output').value = csv;
		toggleButtons('valid');
	} catch {
		document.querySelector('#output').value = 'Invalid JSON';
		toggleButtons('invalid');
		displayModalMessage('warning', 'Invalid JSON');
	}
};

export const copyToClipboard = () => {
	const copyText = document.querySelector('#output');
	copyText.select();
	navigator.clipboard.writeText(copyText.value);
	displayModalMessage('success', 'Output copied to clipboard');
};

export const clearContent = () => {
	const textareas = document.querySelectorAll('textarea');
	textareas.forEach(area => area.value = '');
	toggleButtons();
}

export const downloadFile = () => {
	let fileType = 'text/plain';
	if (document.querySelector('#csv2json').disabled)
		fileType = 'text/csv';
	else if (document.querySelector('#json2csv').disabled)
		fileType = 'application/json';
	const output = document.querySelector('#output').value;
	const blob = new Blob([output], { type: fileType });
	const downloadUrl = window.URL.createObjectURL(blob);

	const downloadLink = document.createElement('a');
	downloadLink.download = 'converted_file';
	downloadLink.innerHTML = 'Download File';
	downloadLink.href = downloadUrl;
	downloadLink.onclick = destroyClickedElement;
	downloadLink.style.display = 'none';
	document.body.appendChild(downloadLink);

	downloadLink.click();
};

const destroyClickedElement = (e) => {
	document.body.removeChild(e.target);
};

const displayModalMessage = (type, message) => {
	const modal = document.getElementById(document.querySelector('[data-modal]').dataset.modal);
	modal.classList.add('open');
	const content = document.createElement('div');
	content.className = 'modal-container';
	modal.appendChild(content);
	addIcon(modalIcons[type].icon, '.modal-container', message);
	document.querySelector('.modal-bg').style.backgroundColor = modalIcons[type].colour;
	setTimeout(() => {
		modal.removeChild(content);
		modal.classList.remove('open');
		clearTimeout();
	}, 1000);
};

const isIterable = (obj) => {
	if (!obj) return false;
	return typeof obj[Symbol.iterator] === 'function';
};