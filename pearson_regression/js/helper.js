// DOM manipulation
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const find = (element, selector) => element.querySelector(selector);
const findAll = (element, selector) => element.querySelectorAll(selector);
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
const removeChilds = (parent) => {
	while (parent.lastChild) {
		parent.removeChild(parent.lastChild);
	}
};

// JavaScript helpers
const print = (...args) => console.log(args.reduce((acc, cur) => `${acc} ${cur}`));
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Arrays
const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
const unique = (value, index, self) => self.indexOf(value) === index;

const csvToArray = (csv) => {
	var resultArray = [];
	csv.split("\n").forEach((row, i) => {
		var rowArray = [i + 1];
		row.split(",").forEach((cell) => {
			rowArray.push(cell);
		});
		resultArray.push(rowArray);
	});
	return resultArray;
};

// Statistics
const average = (array) => array.reduce((a, b) => a + b) / array.length;
const sd = (array) => { // standard deviation of array of numbers
	const mean = average(array);
	return Math.sqrt(array.map(val => Math.pow(val - mean, 2)).reduce((a, b) => a + b) / (array.length - 1));
};
const sem = (array) => sd(array) / Math.sqrt(array.length); // standard error of mean
const E = (array) => 1.96 * sem(array); // error margin with confidence interval 95%
const se = (array1, array2) => Math.sqrt((sd(array1) / array1.length) + (sd(array2) / array2.length)); // standard error
const t = (array1, array2) => (average(array1) - average(array2)) / se(array1, array2); // t-score
const dof = (array1, array2) => array1.length + array2.length - 2; // degrees of freedom