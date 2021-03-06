module.exports = class Flight {

    constructor(from, to, delay, date, airline) {
        this._from = from;
        this._to = to;
        this._delay = parseInt(delay);
        let datef = date.split("-");
        this._month = parseInt(datef[1]);
        this._day = parseInt(datef[2]);
        this._airline = airline;
    }

    get from() {
        return this._from;
    }

    get to() {
        return this._to;
    }

    get delay() {
        return this._delay;
    }

    get month() {
        return this._month
    }

    get day() {
        return this._day;
    }

    get airline() {
        return this._airline;
    }

};
