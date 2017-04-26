const database = require('./database');
const Airport = require('./airport');
const Timeframe = require('./timeframe');
const Flight = require('./flight');

let airports = [];
let airline = [];
let timeframe = new Timeframe();

function loadData(done) {
    database.getRandomRecords(500, data => {
        let size = data.length;
        let processed = 0;
        let progress = 0;
        for(let i = 0; i < data.length; i++) {
            let flight = convertFlight(data[i]);
            processFlight(flight);
            processed++;
            newProgress = Math.floor(processed / size * 100);
            if(newProgress > progress) {
                progress = newProgress;
                console.log(progress + "%");
            }
        }
        done();
    });
}

function convertFlight(flight) {
    return new Flight(flight.departure_airport, flight.arrival_airport,
                            flight.arrival_delay, flight.date, flight.airline);
}

function getDelay(from, to, month, day) {
    let timeframe = timeframe;
    // Pick a timeframe based on accuracy of the airport and general data
    if(airports[from].timeframe.accuracy() > timeframe.accuracy(month, day)) {
        timeframe = airports[from].timeframe;
    }
    let delayOnDay = timeframe.getDelay(month, day);
    let airportDelay = airports[from].getDelayTo(to);
}

function processFlight(flight) {
    addToAirport(flight);
    timeframe.add(flight);
}

function addToAirport(flight) {
    if(airports[flight.from] === undefined)
        airports[flight.from] = new Airport(flight.from);
    airports[flight.from].addFlight(flight.to, flight.delay, flight.month, flight.day);
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
    printData: printData
}
