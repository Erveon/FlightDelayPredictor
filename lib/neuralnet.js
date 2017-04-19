const DecisionTree = require('decision-tree');
const database = require("./database");
const features = [ "month", "airline", "departure_airport", "arrival_airport", "departure_schedule" ];
const classname = "departure_delay";

let tree;
let doneFuncs = [];

database.getAllRecords(docs => {
	let material = [];
	docs.forEach(doc => {
		material.push(convertToMaterial(doc));
	});
	tree = new DecisionTree(material, classname, features);
	doneFuncs.forEach(func => func());
});

let convertToMaterial = (doc) => {
	return {
		month: parseInt(doc.date.split("-")[1]),
		airline: doc.airline,
		departure_airport: doc.departure_airport,
		arrival_airport: doc.arrival_airport,
		departure_schedule: doc.departure_schedule,
		departure_delay: doc.departure_delay
	};
};

let convert = (doc) => {
	return {
		month: parseInt(doc.date.split("-")[1]),
		airline: doc.airline,
		departure_airport: doc.departure_airport,
		arrival_airport: doc.arrival_airport,
		departure_schedule: doc.departure_schedule
	};
};

let onDone = (func) => {
	doneFuncs.push(func);
};

let getBrain = () => {
	return tree;
};

module.exports = {
	getBrain: getBrain,
	onDone: onDone,
	convert: convert
};
