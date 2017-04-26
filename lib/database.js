const MongoClient = require('mongodb').MongoClient, assert = require('assert');
const url = 'mongodb://localhost:27017/datatonic';

let getRandomRecords = (amount, callback) => {
	MongoClient.connect(url, (err, db) => {
		assert.equal(null, err);
		let delays = db.collection('delays');
		delays.aggregate(
			[{ $sample: { size: amount } }]
		, {allowDiskUse: true}).toArray(function(err, docs) {
			assert.equal(err, null);
			callback(docs);
			db.close();
		});
	});
};

let getAllRecords = (callback) => {
	MongoClient.connect(url, (err, db) => {
		assert.equal(null, err);
		let delays = db.collection('delays');
		delays.find({}).toArray(function(err, docs) {
			assert.equal(err, null);
			callback(docs);
			db.close();
		});
	});
};

module.exports = {
	getRandomRecords: getRandomRecords,
	getAllRecords: getAllRecords
};
