const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const makeTag = (tag) => document.createElement(tag);

const print = (...args) =>  console.log(args.reduce((acc, cur) => `${acc} ${cur}`));