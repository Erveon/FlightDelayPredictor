const database = require('./database');
const Airport = require('./airport');
const Timeframe = require('./timeframe');
const Flight = require('./flight');
const Delay = require('./delay');

let airports = [];
let airlines = [];
let timeframe = new Timeframe();

function loadData(done) {
	database.getRecordAmount(amount => {
		let processed = 0;
        let progress = 0;
		database.streamAllRecords(doc => {
			// ignore header cells. I'm not going to reimport..
			if(doc.airline !== 'airline') {
				let flight = convertFlight(doc);
				processFlight(flight);
				processed++;
				newProgress = Math.floor(processed / amount * 100);
	            if(newProgress > progress) {
	                progress = newProgress;
	                console.log(progress + "%");
	            }
			}
		}, () => {
			done();
		});
	});
}

function getAirports() {
	return Object.keys(airports);
}

function getAirlines() {
	return Object.keys(airlines);
}

function convertFlight(flight) {
    return new Flight(flight.departure_airport, flight.arrival_airport,
                            flight.arrival_delay, flight.date, flight.airline);
}

function test(amount, offset) {
	database.getRandomRecords(amount, data => {
		let correct = 0;
		let correctness = new Delay();
		for(let i = 0; i < data.length; i++) {
            let flight = convertFlight(data[i]);
			if(Math.abs(flight.delay < 40)) {
				let delay = getDelay(flight.from, flight.to, flight.month, flight.day, flight.airline);
				console.log("Delay from " + flight.from + " to " + flight.to + " on " + flight.day + "/" + flight.month + " with " + flight.airline
				+ ": about " + (Math.round(delay * 100) / 100) + " minutes."
				+ " Actual: " + flight.delay + " minutes");
				let miss = Math.abs(delay - flight.delay);
				correctness.add(miss);
				if(miss <= offset) {
					correct++;
				}
			}
		}
		console.log("Correctness: " + (Math.round((correct / correctness.count) * 10000) / 100) + "% ("+correct+"/"+amount+")");
		console.log("Average incorrectness: " + (Math.round(correctness.avg * 100) / 100)  + " minutes")
	});
}

function getDelay(from, to, month, day, airline) {
	let delay = new Delay();
    let activetimeframe = timeframe;
    // Pick a timeframe based on accuracy of the airport and general data
	if(airports[from] === undefined) console.log("Airport " + from + " doesn't exist");
    if(airports[from] !== undefined && (airports[from].timeframe.getAccuracy(month, day) > activetimeframe.getAccuracy(month, day))) {
        activetimeframe = airports[from].timeframe;
    }
    delay.add(timeframe.getDelay(month, day)); // delay on date
    if(airports[from] !== undefined) {
		delay.add(airports[from].getDelayTo(to)); // delay for airport to airport
	}
	let airlineDelay = getAirlineDelay(airline);
	if(airlineDelay !== undefined) delay.add(airlineDelay); // delay for airline
	console.log(delay);
	return delay.avg;
}

function getAirlineDelay(airline) {
	if(airlines[airline] !== undefined)
		return airlines[airline].avg;
	return undefined;
}

function processFlight(flight) {
	if(Math.abs(flight.delay) > 60) return;
    addToAirport(flight);
	addToAirline(flight);
    timeframe.add(flight);
}

function addToAirline(flight) {
    if(airlines[flight.airline] === undefined)
        airlines[flight.airline] = new Delay();
    airlines[flight.airline].add(flight.delay);
}

function addToAirport(flight) {
    if(airports[flight.from] === undefined)
        airports[flight.from] = new Airport(flight.from);
    airports[flight.from].addFlight(flight);
}

function printData() {
    console.log("Printing data from " + Object.keys(airports).length + " airports");
    for(let name in airports) {
        let airport = airports[name];
        console.log(airport.toString);
    }
}

module.exports = {
    loadData: loadData,
    printData: printData,
	getDelay: getDelay,
	test: test,
	getAirports: getAirports,
	getAirlines: getAirlines
}
