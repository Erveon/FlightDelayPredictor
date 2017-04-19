const nn = require('nn');
const DecisionTree = require('decision-tree');
const database = require("./database");

let net = nn();
let doneFuncs = [];

database.getRandomRecords(20, (docs) => {
	let material = [];
	docs.forEach(doc => {
		material.push({
			input: convert(doc),
			output: [ doc.departure_delay ]
		});
	});
	net.train(material, { log: 10 });
	doneFuncs.forEach(func => func());
});

let convert = (doc) => {
	return [
			parseInt(doc.date.split("-")[1]), // month
			doc.airline, // airline
			doc.departure_airport, // dep. airport
			doc.arrival_airport, // arr. airport
			doc.departure_schedule, // dep. schedule
			doc.departure_state, // dep. state
			doc.arrival_state // arr. state
		];
};

let onDone = (func) => {
	doneFuncs.push(func);
};

let getBrain = () => {
	return net;
};

module.exports = {
	getBrain: getBrain,
	onDone: onDone,
	convert: convert
};
