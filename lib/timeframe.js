const Delay = require('./delay');

module.exports = class Timeframe {

    constructor() {
        this._timeframe = [];
    }

    get timeframe() {
        return this._timeframe;
    }

    add(flight) {
        if(this.timeframe[flight.month] === undefined)
            this.timeframe[flight.month] = [];
        if(this.timeframe[flight.month][flight.day] === undefined) {
            this.timeframe[flight.month][flight.day] = new Delay(flight.delay);
        } else {
            this.timeframe[flight.month][flight.day].add(flight.delay);
        }
    }

    getAccuracy(month, day) {
        if(this.timeframe[month] === undefined) return 1;
        else if(this.timeframe[month][day] === undefined) return 2;
        else return 3;
    }

    getDelay(month, day) {
        if(this.timeframe[month] === undefined) return getYearDelay();
        else if(this.timeframe[month][day] === undefined) return getMonthDelay(month);
        else return this.timeframe[month][day].avg;
    }

    getYearDelay() {
        let size = Object.keys(this.timeframe).length;
        let total = 0;
        for(let month in this.timeframe)
            total += getMonthDelay(month);
        return total / size;
    }

    getMonthDelay(month) {
        let size = Object.keys(this.timeframe[month]).length;
        let total = 0;
        for(let daynum in this.timeframe[month]) {
            let day = this.timeframe[month][daynum];
            total += day.avg;
        }
        return total / size;
    }

};
