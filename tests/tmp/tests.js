import data from './tmp/public/app/data/data.js';

mocha.setup('bdd');
var expect = chai.expect;


describe('getBooks', function() {
    it('expect to have at least one book in database', function(done){
        data.books.get()
            .then(function (books) {
                expect(books).not.to.be.empty;
                done();
            });
    });
    it('expect first book to has all correct properties for object Book', function(done){
        data.books.get()
            .then(function (books) {
                console.log(books[0]);
                expect(books[0]).to.has.property('title');
                //expect(books[0]).to.has.property('author');
                expect(books[0]).to.has.property('reviews');
                expect(books[0]).to.has.property('genres');

                done();
            });
    });
});

describe('getUsers', function() {
    it('expect to have at least one user in database', function(done){
        data.users.get()
            .then(function (users) {
                expect(users).to.not.be.empty;
                done();
            });
    });
    it('expect first user to has all correct properties for object User', function(done){
        data.users.get()
            .then(function (users) {
                console.log(users[0]);
                expect(users[0]).to.has.property('_id');
                expect(users[0]).to.has.property('username');
                expect(users[0]).to.has.property('nickname');
                expect(users[0]).to.has.property('passHash');
                expect(users[0]).to.has.property('authKey');
                done();
            });
    });
});
