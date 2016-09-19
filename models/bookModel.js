var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var bookModel = new Schema({
	title: {
		type: String
	},
	author: {
		type: String
	},
	genres: {
		type: [String]
	},
	ratings: {
		type: [Schema.Types.Mixed]
	},
	description: {
		type: String
	},
	reviews: {
		type: [Schema.Types.Mixed]
	},
	imageURL: {
		type: String
	},
	pages: {
		type: Number
	},
	coverUrl: {
		type: String
	},
	progresses: {
		type: [Schema.Types.Mixed]
	},
	comments: {
		type: [Schema.Types.Mixed]
	}

});

module.exports = mongoose.model('Book', bookModel);