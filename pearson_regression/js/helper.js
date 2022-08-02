const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const create = (tag) => document.createElement(tag);
const toggle = (selector, attr, bool) => $(selector)[attr] = bool;
const addClass = (element, className) => element.classList.add(className);
const removeClass = (element, className) => element.classList.remove(className);
const hasClass = (element, className) => element.classList.contains(className);
const css = (element, styleObject) => {
	let cssText = '';
	Object.keys(styleObject).forEach(key => cssText += `${key}: ${styleObject[key]}; `);
	element.style.cssText = cssText;
};

const on = (element, event, callback) => element.addEventListener(event, callback);

const print = (...args) => console.log(args.reduce((acc, cur) => `${acc} ${cur}`));

const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);