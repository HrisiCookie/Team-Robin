var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var updateModel = new Schema({
	text: String,
	date: Date,
	user: Schema.Types.Mixed,
	book: Schema.Types.Mixed,
	comments: Schema.Types.Mixed,
	likes: Schema.Types.Mixed,
	review: String,
	rating: Number,
	progress: Number
});

module.exports = mongoose.model('Update', updateModel);