const Timeframe = require("./timeframe");
const Delay = require('./delay');

module.exports = class Airport {

    constructor(name) {
        this._name = name;
        this._timeframe = new Timeframe();
        this._delay = new Delay();
        this._delayTo = [];
    }

    get name() {
        return this._name;
    }

    get delayTo() {
        return this._delayTo;
    }

    get delay() {
        return this._delay;
    }

    set delay(delay) {
        this._delay = delay;
    }

    get timeframe() {
        return this._timeframe;
    }

    get toString() {
        return this.name + ": avg delay => " + this.delay.avg + ". Connects to " + Object.keys(this.delayTo).length + " airports.";
    }

    getDelayTo(airport) {
        if(this.delaysTo[airport] === undefined)
            return undefined;
        return this.delaysTo[airport].avg;
    }

    getDelayOn(month, day) {
        return this.timeframe.getDelay(month, day);
    }

    addFlight(flight) {
        this.calculateFlightTo(flight.to, flight.delay);
        this.calculateFlight(flight.delay);
        this.timeframe.add(flight);
    }

    calculateFlight(minutes) {
        this.delay.add(minutes);
    }

    calculateFlightTo(airport, minutes) {
        if(this.delayTo[airport] === undefined) {
            this.delayTo[airport] = new Delay(minutes);
        } else {
            this.delayTo[airport].add(minutes);
        }
    }

}
