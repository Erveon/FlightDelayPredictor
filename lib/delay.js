module.exports = class Delay {

    constructor(minutes) {
		if(minutes === undefined) {
			this._avg = 0;
			this._count = 0;
		} else {
	        this._avg = minutes;
	        this._count = 1;
		}
    }

    add(minutes) {
        this._avg = (this._count * this._avg + minutes) / (this._count + 1);
        this._count++;
    }

    get avg() {
        return this._avg;
    }

	get count() {
		return this._count;
	}

};
