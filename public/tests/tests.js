mocha.setup('bdd');

const {
	expect,
	assert
} = chai;

const AUTH_KEY = "SOME_AUTH_KEY";
const user = {
	username: 'SOME_USERNAME',
	passHash: 'SOME_PASSHASH'
};
const book = {
	"_id": "678798797",
	"title": "Birdy",
	"rating": 4,
	"author": "William Warthon",
	"genres": ["drama", "war"],
	"description": "Tatatat",
	"reviews": [{
		"userId": "5673f4f1573922b8014dbc28",
		"review": "Very interesting book"
	}],
	"coverUrl": "http://d.gr-assets.com/books/1328833164l/7003902.jpg",
	"pages": 258
};

describe('Tests - myBooks', function () {
	describe('getBooks tests', function () {
		it('expect booksModel.getBooks() to make exactly one get call', function () {
		})
	});

	describe('Register tests', function () {
		it('expect post to be called once', function () {
		});
	});

	describe('Login tests', function () {
		it('expect put to be called once', function () {
		});
	});

	describe('Is loggedIn tests', function () {
		it('expect not to be logged in when have not logged in', function () {
		});
		it('expect to be logged in when we have logged in', function () {
		});
	});

	describe('Logout tests', function () {
		it('expect db to have no username after logout', function () {
		});

		it('expect db to have no authKey after logout', function () {
		});
	});

	describe('Add book tests', function () {
		it('expect post to be called for book', function () {
		});
	});

	describe('Rate book tests', function () {
		it('expect put to be called for rating', function () {
		});
	});
});

mocha.run();