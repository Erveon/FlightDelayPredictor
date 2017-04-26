module.exports = class Delay {

    constructor(minutes) {
        this._avg = minutes;
        this._count = 1;
    }

    add(minutes) {
        this._avg = (this._count * this.avg + minutes) / (this._count + 1);
        this._count++;
    }

    get avg() {
        return this._avg;
    }

};
