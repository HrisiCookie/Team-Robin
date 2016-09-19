var express = require('express');

var routes = function (Book) {
	var searchRouter = express.Router();

	var searchController = require('../Controllers/searchController')(Book);

	searchRouter.route('/')
		.get(searchController.get);

	return searchRouter;

};

module.exports = routes;