import { icon, library } from '@fortawesome/fontawesome-svg-core';
import { faCopy, faDownload, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';

library.add(faUpload, faDownload, faCopy, faTrash);

const icons = [
	{
		icon: icon({ prefix: 'fas', iconName: 'upload' }),
		button: 'upload',
		text: 'Upload File'
	},
	{
		icon: icon({ prefix: 'fas', iconName: 'download' }),
		button: 'download'
	},
	{
		icon: icon({ prefix: 'fas', iconName: 'copy' }),
		button: 'copy'
	},
	{
		icon: icon({ prefix: 'fas', iconName: 'trash' }),
		button: 'clear'
	}
];

const addIcon = (icon, button, text) => {
	Array.from(icon.node).map(n => {
		document.getElementById(button).appendChild(n);
		if (text) {
			let p = document.createElement('p');
			p.innerText = text;
			document.getElementById(button).appendChild(p);
		}
	});
};

icons.forEach(icon => addIcon(icon.icon, icon.button, icon.text));
