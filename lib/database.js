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

// NOT RECOMMENDED FOR PERSONAL COMPUTERS
// Loads all documents at once and costs a lot of RAM
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

let streamAllRecords = (callback, done) => {
	MongoClient.connect(url, (err, db) => {
		assert.equal(null, err);
		let delays = db.collection('delays');
		let stream = delays.find().stream();
		stream.on('error', (err) => {
			console.error(err)
	  	});
		stream.on('data', (doc) => {
			callback(doc);
	  	});
		stream.on('end', () => {
			db.close();
			done();
	  	});
	});
};

let getRecordAmount = (callback) => {
	MongoClient.connect(url, (err, db) => {
		assert.equal(null, err);
		let delays = db.collection('delays');
		delays.count(function(err, count) {
	 		callback(count);
        });
	});
};

module.exports = {
	getRandomRecords: getRandomRecords,
	getAllRecords: getAllRecords,
	streamAllRecords: streamAllRecords,
	getRecordAmount: getRecordAmount
};
