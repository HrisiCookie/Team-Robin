# Books Requirements

##  Login form
* Register users
* Login users
* Log out users
* Each user has:
  * Username, Password

##  Home Page

### Newsfeed

* Updates about friends activity
  * Reading new books
  * Updating book status on a book progress
  * Reviews made
* Updates must have **like** and **comment**

### Currently reading

* List currently reading books
  * Top 5 books, ordered by newest progress updates

##  My books page

* List all my books
* List read books
* List currently-reading books
* List to-read books
* List recomended books
* List shelves

##  Book page

* Show info about a book
  * image, title, author, description, genre, rating
* A book can be in states:
  * _not-read_, _want-to-ready_, _currently-reading_, _read_
* In states _want-to-read_, _currently-reading__ and _read_ can be added to a **shelf**
* Book in state _not-read_ the user
  * Change state to any state
* Book in state _want-to-read_ the user
  * Change state to _currently-reading_ or _read_
* Book in state _currently-reading_ the user
  * Update progress
    * Saves the date of the update
    *
  * Add my review
    * A review  consists of **rating**, **text**
  * Can update status to _read_
* Book in state _read_ the user
  * Add my review
    * A review  consists of **rating**, **text**
  * Can update status to _read_
* Share book to Facebook, Twitter, etc...

##  User page

* Show books in different states

##  Add book to the database
* Each book must have:
  * Title, author, isbn, pages, genre, image

##  Friends
* Add friends
* Search for friends
  * By username



##Pages

* `#/books/add` -> Add book
* `#/books` -> list all books
* `#/books?author=XXXX` -> list all books of this author
* `#/books?genre=XXXX` -> list all books of this genre
* `#/books?author=XXXX&genre=YYYYY` -> list all books of this author and genre
* `#/books/:id` -> Show book info