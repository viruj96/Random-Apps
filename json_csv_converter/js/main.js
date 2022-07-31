import { clearContent, copyToClipboard, downloadFile, json2csv, readFile, uploadFile } from './converter';
import { addIcon, icons } from './icons';

window.onload = () => {
	icons.forEach(icon => addIcon(icon.icon, icon.button, icon.text));
	document.querySelector('input[type=file]').addEventListener('change', readFile);
	document.querySelector('#input').addEventListener('change', () => {
		document.querySelector('input[type=file]').value = '';
		document.querySelector('p').innerHTML = 'Upload File';
	});
	window.uploadFile = uploadFile;
	window.copyToClipboard = copyToClipboard;
	window.json2csv = json2csv;
	window.clearContent = clearContent;
	window.downloadFile = downloadFile;
};