# http://localhost:3000
- api/users - **POST** - ``{ username, passHash }`` - Register user  and get response:  ``{username, authKey}``

- api/users/auth - **PUT** - ``{username, passHash}`` - Login User and get response:  ``{username, authKey}``

- api/users/:id - **GET** -> Get user by id  
Response:
```JavaScript
{
     "_id": "Example",
     "username": "Example",
     "nickname": "Example",
     "passHash": "Example",
     "authKey": "Example",
     "__v": 0,
     "booksRead": [Example],
     "booksCurrentlyReading": [Example],
     "booksToRead": [
         {
         "status": "Example",
         "updateDate": "Example",
         "_id": "Example"
         },
         {
         "status": "Example",
         "updateDate": "Example",
         "_id": "Example"
         }
     ],
     "links": {}
}  
```
   
- !!!api/books - **POST** -> Should add new book BUT SERVER ERROR (mongooose promise library depricated)
Body of Post:
```JavaScript
  {
      "title": "Example",
      "author": "Example",
      "genres": [],
      "description": "Example",
      "coverUrl": "Example",
      "pages": 123
  }        
```

- api/books - **GET** -> [ first 10 books ] -> Return array of first 10 books

- api/books?page=PAGE&size=SIZE - **GET** -> [ books from (**page** * **size**) to (**page** * **size**) + **size** ]  
    -> Return array in range by passed page and size, example: **if page = 2, size = 5 result will be from 5-th to 10-th book**.

- api/books?genre=example&author=example&.... - **GET** -> [ first 10*(if no page and size passed)* books which meet criterias ]
    -> Return array of books filtered by passed query params 

- !!!api/search?PARAMS - **GET** ->  Should return filtered books by query params 
    BUT SERVER ERROR (maybe again because - mongooose promise library depricated)

- api/books/:id -**GET**GET ->Return book by Id
Body: 
```JavaScript
 {
    "_id": "Example",
    "title": "Example",
    "rating": Example,
    "author": "Example",
    "genres": [Example],
    "description": "Example",
    "reviews": [Example],
    "coverUrl": "Example",
    "pages": Example
 }   
```
- api/genres - **GET** -> [ All genres in DB ] -> Return All genres in Database

- !!!api/books/id - **PUT** - **must add header x-auth-key: authkey**, but I cant figure it out what body and why doesn't work 
    -> response message: Invalid book -> Should edit the book with passed id

- api/mybooks - **PUT** - **must add header x-auth-key: authkey**, and body: ``{ bookId, bookstatus }`` -> Change book status of book
Response: 
```JavaScript
    {
    "__v": 0,
    "text": "UserName changed BookName 's status to booksToRead",
    "date": "CurrentDate",
    "user": {
        "id": "UserId",
        "username": "UserName"
    },
    "book": {
        "status": "bookStatus",
        "title": "BookTitle",
        "_id": "BookId"
    },
    "_id"
    }  
```

- api/mybooks/all - **GET** - **must add header x-auth-key: authkey** -> [ All books linked to the User] 
    -> Return User's reading books and books who want to read
    





