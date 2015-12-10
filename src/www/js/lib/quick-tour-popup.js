'use strict';

import {createElement, toArray} from './utils';

export default function(popup) {
	if (typeof popup === 'string') {
		popup = document.querySelector(popup);
	}

	var closeBtn = popup.querySelector('.quick-tour-popup__close');
	if (closeBtn) {
		closeBtn.addEventListener('click', evt => hide(popup));
	}

	popup.addEventListener('click', evt => {
		if (evt.target === popup) {
			hide(popup);
		}
	});

	return {
		show(url) {
			show(popup, url);
		},

		hide() {
			hide(popup);
		}
	};
}

function getContentElements() {
	return toArray(document.querySelectorAll('.layout-container'));
}

function hide(popup) {
	var iframe = popup.querySelector('.qt-popup__iframe');
	if (iframe) {
		iframe.parentNode.removeChild(iframe);
	}
	popup.classList.remove('quick-tour-popup_visible');
	getContentElements().forEach(elem => elem.classList.remove('layout-container_blurred'));
}

function show(popup, url) {
	var iframe = createElement('iframe', 'qt-popup__iframe');
	iframe.src = url;

	var target = popup.querySelector('.quick-tour-popup__content');
	target.appendChild(iframe);
	popup.classList.add('quick-tour-popup_visible');

	getContentElements().forEach(elem => elem.classList.add('layout-container_blurred'));
}