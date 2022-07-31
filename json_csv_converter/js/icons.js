import { icon, library } from '@fortawesome/fontawesome-svg-core';
import { faCircleCheck, faCircleExclamation, faCopy, faDownload, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';

library.add(faUpload, faDownload, faCopy, faTrash, faCircleCheck, faCircleExclamation);

export const icons = [
	{
		icon: icon({ prefix: 'fas', iconName: 'upload' }),
		button: '#upload',
		text: 'Upload File'
	},
	{
		icon: icon({ prefix: 'fas', iconName: 'download' }),
		button: '#download'
	},
	{
		icon: icon({ prefix: 'fas', iconName: 'copy' }),
		button: '#copy'
	},
	{
		icon: icon({ prefix: 'fas', iconName: 'trash' }),
		button: '#clear'
	}
];

export const modalIcons = {
	success: {
		icon: icon({ prefix: 'fas', iconName: 'circle-check' }),
		colour: 'green'
	},
	warning: {
		icon: icon({ prefix: 'fas', iconName: 'circle-exclamation' }),
		colour: 'orange'
	}
}

export const addIcon = (icon, button, text) => {
	const elem = document.querySelector(button);
	Array.from(icon.node).map(n => {
		elem.appendChild(n);
		if (text) {
			let p = document.createElement('p');
			p.innerText = text;
			elem.appendChild(p);
		}
	});
};
