const input = 'take me to 3423 avenue henri beau by metro from 32423 concordia'; // req.body.Body.str.toLowerCase();

const from = input.indexOf('from ');
const to = input.indexOf('to ');
const by = input.indexOf('by ');

const location = (from != -1) ? input.substring(from + 5, Math.min((to < from) ? input.length : to, (by < from) ? input.length : by)) : '';
const destination = (to != -1) ? input.substring(to + 3, Math.min((from < to) ? input.length : from, (by < to) ? input.length : by)) : '';
const method = (by != -1) ? input.substring(by + 3, Math.min((from < by) ? input.length : from, (to < by) ? input.length : to)) : '';

console.log(`location : ${location}`);
console.log(`destination : ${destination}`);
console.log(`method : ${method}`);
