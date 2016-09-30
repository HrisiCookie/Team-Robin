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
	rating: {
		type: Number
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
	}
});

module.exports = mongoose.model('Book', bookModel);
