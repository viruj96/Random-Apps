import { clearContent, copyToClipboard, csv2json, downloadFile, json2csv, readFile, toggleButtons, uploadFile } from './converter';
import { addIcon, icons } from './icons';

window.onload = () => {
	icons.forEach(icon => addIcon(icon.icon, icon.button, icon.text));
	document.querySelector('input[type=file]').addEventListener('change', readFile);
	document.querySelector('#input').addEventListener('change', toggleButtons);
	window.json2csv = json2csv;
	window.csv2json = csv2json;
	window.uploadFile = uploadFile;
	window.copyToClipboard = copyToClipboard;
	window.clearContent = clearContent;
	window.downloadFile = downloadFile;
};