var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var userModel = new Schema({
	username: {
		type: String
	},
	nickname: {
		type: String
	},
	passHash: {
		type: String
	},
	authKey: {
		type: String
	},
	booksToRead: {
		type: [Schema.Types.Mixed]
	},
	booksCurrentlyReading: {
		type: [Schema.Types.Mixed]
	},
	booksRead: {
		type: [Schema.Types.Mixed]
	}

});

module.exports = mongoose.model('User', userModel);