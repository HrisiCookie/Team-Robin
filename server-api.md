 http://localhost:3000/
 ===
- **GET - api/users** -  *the response is (only for testing purposes):*
```Javascript
[
  {
    "_id":  user id,
    "username": username,
    "nickname": nickname,
    "passHash": hashed pass, (bad practice)
    "authKey": authentication key for log in and authorize access (bad practice),
    "__v": 0,
    "booksRead": [],
    "booksCurrentlyReading": [],
    "booksToRead": [
      {
        "status": "booksToRead",
        "updateDate": "2015-09-13T21:37:49.562Z",
        "_id": "55f5908d9d72061c143a07da"
      },
      {
        "status": "booksToRead",
        "updateDate": "2015-12-12T17:55:02.552Z",
        "_id": "55f573136c1174a825cc4bbe"
      }
    ]
  },
{
…. Other users
}
]
```
---

- **POST - api/users** - *Register new user*  
    Body of request must be formatted:
```Javascript
{
	"username":"unique username",
	"passHash":"encrypted password from the front-end"
}
```
    The success response when the user is created:
```Javascript
{
  "username": "hrisi1",
  "authKey": "hrisi1855445862175654608902543788968408876731838958065772870"
}
```
    The response if the user is registered with this username:
```Javascript
{
  "err": "Already such user"
}
```
    You have to save the authKey (in localStorage for example). The registration automatically logs in the user.

---

- **PUT - api/users/auth** - *Login user*  
    Body of request must be formatted:
```Javascript
{
	"username":"hrisi1",
	"passHash":"123456"
}
```
    Success response:
```Javascript
{
  "username": "hrisi1",
  "authKey": "hrisi1855445862175654608902543788968408876731838958065772870"
}
```
    You have to save the authKey (in localStorage for example).

    Error response:
```Javascript
{
  "message": "Invalid username or password"
}
```
    For loging out the user you have to delete the authKey from localStorage.

---

- **GET - api/users/:userId** - *Return user by id*  
    Response:
```Javascript
{
  "_id": "55f55e6a43475df421128318",
  "username": "",
  "nickname": "",
  "passHash": "799882677ea267e618f6c7cbb74fd57ae8654621",
  "authKey": "Mushi4288376909365802132585965253955567723278889912874373288",
  "__v": 0,
  "booksRead": [],
  "booksCurrentlyReading": [],
  "booksToRead": [
    {
      "status": "booksToRead",
      "updateDate": "2015-09-13T21:37:49.562Z",
      "_id": "55f5908d9d72061c143a07da"
    },
    {
      "status": "booksToRead",
      "updateDate": "2015-12-12T17:55:02.552Z",
      "_id": "55f573136c1174a825cc4bbe"
    }
  ],
  "links": {}
}
```
---

- **GET - api/books** - *Get Array of books. If no query params (page and size) are passed return first 10 books*  
    Response:
```Javascript
[ ……… ,
{
    "_id": "",
    "title": "",
    "rating": ,
    "author": "",
    "genres": [ "",""….],
      "description": "",
    "reviews": [
      {
        "userId": "5673f4f1573922b8014dbc28",
        "review": "Very interesting book"
      }
    ],
    "coverUrl": "http://d.gr-assets.com/books/1328833164l/7003902.jpg",
    "pages": 258
  },
………..
]
```
--- 

- **POST - api/books** - *Add new book to DB.(User must be loged in)*  
    Body of Request:
```Javascript
{
	"title": "Cookies",
	"rating": 5,
	"author": "dhoidoi",
	"genres": ["Computer Science", "Programming"],
	"description": "mcfask'fmlsmf'sfm'slfm;lf",
	"reviews": [],
	"coverUrl": "http://d.gr-assets.com/books/1328833164l/7003902.jpg",
	"pages": 258
}
```
    Headers of request:
```Javascript
{
    "contentType": "application/json",
    "x-auth-key": "auth key from localStorage"
}
```
    Success response:
```Javascript
{
  "__v": 0,
  "title": "Cookies",
  "author": "dhoidoi",
  "description": "mcfask'fmlsmf'sfm'slfm;lf",
  "coverUrl": "http://d.gr-assets.com/books/1328833164l/7003902.jpg",
  "pages": 258,
  "_id": "57e40410d958702a0c1c08c9",
  "comments": [],
  "progresses": [],
  "reviews": [],
  "ratings": [],
  "genres": [
    "Computer Science",
    "Programming"
  ]
}
```
    The response if the book is created with this username:
```Javascript
{
  "message": "Book already in DB"
}
```
---

- **GET - api/books/:bookId** - *Return book by id*  
    Response:
```Javascript
{
  "_id": "",
  "title": "",
  "rating": ,
  "author": "",
  "genres": [ "", ""…. ],
  "description": "",
  "reviews": [
    {
      "review": "Very interesting book",
      "userId": "5673f4f1573922b8014dbc28"
    }
  ],
  "coverUrl": "http://d.gr-assets.com/books/1328833164l/7003902.jpg",
  "pages": 258
}
```
---

- **PUT - api/books/:bookId** - *Change the rating of the book(User must be loged in)*  
    Body of request:
```Javascript
{
    "bookId": "55f574bf6c1174a825cc4c77",
    "rating": 4
}
```
    Headers of request:
```Javascript
{
    "contentType": "application/json",
    "x-auth-key": "auth key from localStorage"
}
```
    Success response:
```Javascript
{
  "result": {
    "_id": "",
    "title": "",
    "description": "",
    "author": "",
    "pages": ,
    "coverUrl": "",
    "__v": 6,
    "progess": [],
    "progesses": [],
    "comments": [],
    "progresses": [
      {
        "dateOfProgress": "",
        "progress":,
        "userId": ""
      }, …………,
    ],
    "reviews": [
      {
        "review": "",
        "userId": ""
      }
    ],
    "ratings": [
      {
        "rating": 4,
        "userId": "55f55e6a43475df421128318"
      }
    ],
    "genres": [ ]
  }
}
```
    Response without Loged in User:
```Javascript
{
  "message": "Unauthorized user"
}
```
    Response if Rating is not valid
```Javascript
{
  "message": "Invalid rating"
}
```
---

- **PUT - api/mybooks** - *Add status on book(User must be loged in)*  
    Body of request:
```Javascript
{
	"bookId":"55f573136c1174a825cc4bbe",
	"bookStatus": "currently-reading"
}
```
    Headers of request:
```Javascript
{
    "contentType": "application/json",
    "x-auth-key": "auth key from localStorage"
}
```
    Success response:
```Javascript
{
  "__v": 0,
  "text": "mushi changed 2001: A Space Odyssey 's status to booksCurrentlyReading",
  "date": "2016-09-22T17:11:59.056Z",
  "user": {
    "id": "55f55e6a43475df421128318",
    "username": "mushi"
  },
  "book": {
    "status": "booksCurrentlyReading",
    "title": "2001: A Space Odyssey",
    "_id": "55f573136c1174a825cc4bbe"
  },
  "_id": "57e410dfabe809063c470c52"
}
```
---

- **GET - api/mybooks/all** - *Return all books linked with the user.(User must be loged in)*  
    Headers of request:
```Javascript
{
    "contentType": "application/json",
    "x-auth-key": "auth key from localStorage"
}
```
    Response:
```Javascript
[
  {
    "_id": "",
    "title": "",
    "author": "",
    "genres": [ ],
    "description": "",
    "pages": 297,
    "coverUrl": "",
    "status": ""
  }
]
```
---

- **GET - api/mybooks/to-read** - *Return all books with status "want to read".(User must be loged in)*
    Headers of request:
```Javascript
{
    "contentType": "application/json",
    "x-auth-key": "auth key from localStorage"
}
```
    Response:
```Javascript
[
  {
    "_id": "",
    "title": "",
    "description": "",
    "author": "",
    "pages": ,
    "coverUrl": "",
    "__v": ,
    "progess": [],
    "comments": [],
    "progresses": [],
    "reviews": [
      {
        "review": "",
        "userId": ""
      }
    ],
    "genres": [ ]
  }
]
```
---

- **GET - api/mybooks/currently-reading** - *Return all books with status "reading".(User must be loged in)* 
    Headers of request:
```Javascript
{
    "contentType": "application/json",
    "x-auth-key": "auth key from localStorage"
}
``` 
    Response:
```Javascript
[
  {
    "_id": "",
    "title": "",
    "description": "",
    "author": "",
    "pages":,
    "coverUrl": "",
    "__v":,
    "progess": [],
    "comments": [],
    "progresses": [],
    "reviews": [
      {
        "review": "",
        "userId": ""
      }
    ],
    "ratings": [
      {
        "rating": ,
        "username": "",
        "userId": ""
      }
    ],
    "genres": [ ]
  }
]
```
---

- **GET - api/mybooks/read** - *Return all books with status "read"(User must be loged in)*  
    Headers of request:
```Javascript
{
    "contentType": "application/json",
    "x-auth-key": "auth key from localStorage"
}
```
    Response:
```Javascript
[
  {
    "_id": "",
    "title": "",
    "description": "",
    "author": "",
    "pages": ,
    "coverUrl": "",
    "__v":  ,
    "progess": [],
    "comments": [],
    "progresses": [],
    "reviews": [
      {
        "review": "",
        "userId": ""
      }
    ],
    "ratings": [
      {
        "rating": ,
        "username": "",
        "userId": ""
      }
    ],
    "genres": [ ]
  }
]
```
---

- **PUT - api/mybooks/review** - *Add review for book(User must be loged in)*  
    Body of request:
```Javascript
{
	"bookId":"55f573136c1174a825cc4bbe",
	"rating": 3,
	"review": "fjoqnjfpowfnpowsnfpofnpofnofpw"
}
```
    Headers of request:
```Javascript
{
    "contentType": "application/json",
    "x-auth-key": "auth key from localStorage"
}
```
    Success response:
```Javascript
{
  "result": {
    "_id": "",
    "title": "",
    "description": "",
    "author": "",
    "pages": ,
    "coverUrl": "",
    "__v": ,
    "progess": [],
    "comments": [],
    "progresses": [],
    "reviews": [
      {
        "review": "fjoqnjfpowfnpowsnfpofnpofnofpw",
        "username": "mushi",
        "userId": "55f55e6a43475df421128318"
      }
    ],
    "ratings": [
      {
        "rating": 3,
        "username": "mushi",
        "userId": "55f55e6a43475df421128318"
      }
    ],
    "genres": [ ]
  }
}
```
    Response if Rating is not valid:
```Javascript
{
  "message": "Invalid rating"
}
```
---

- **PUT - api/mybooks/progress** - *Add progress to book(User must be loged in)*  
    Body of request:
```Javascript
{
	"bookId":"55f573136c1174a825cc4bbe",
	"review": "",
	"progress": 350
}
```
    Headers of request:
```Javascript
{
    "contentType": "application/json",
    "x-auth-key": "auth key from localStorage"
}
```
    Success Response:
```Javascript
{
  "result": {
    "_id": "",
    "title": "",
    "description": "",
    "author": "",
    "pages": ,
    "coverUrl": "",
    "__v": ,
    "progess": [],
    "comments": [],
    "progresses": [
      {
        "dateOfProgress": "2016-09-22T17:39:02.878Z",
        "progress": -56,
        "userId": "55f55e6a43475df421128318"
      },
      {
        "dateOfProgress": "2016-09-22T17:39:28.647Z",
        "progress": 255,
        "userId": "55f55e6a43475df421128318"
      },
      {
        "dateOfProgress": "2016-09-22T17:39:46.640Z",
        "progress": 350,
        "userId": "55f55e6a43475df421128318"
      }
    ],
    "reviews": [ ],
    "ratings": [ ],
    "genres": [ ]
  }
}
```
    Must be add validation.

---

- **GET - /api/search/pattern** - *Search book by pattern*  
/api/search?pattern=harry potter
    Body of response:
```Javascript
[
  {
    "_id": "55f56b3c6c1174a825cc4a6f",
    "title": "Harry Potter and the Chamber of Secrets",
    "rating": null,
    "author": "J.K. Rowling",
    "genres": [
      "Fantasy",
      "Young Adult",
      "Fiction",
      "Fantasy",
      "Magic",
      "Childrens",
      "Adventure"
    ],
    "description": "",
    "reviews": [],
    "coverUrl": "",
    "pages": 
  }
]
```
    Query params(page and size) can be passed to control count of responsed books. If no query params - returns first 10 books.

---

- **GET /api/updates** - *Returns the updates(Page and size can be passed to control count of responsed updates)*  
    Response:
```Javascript
[
  {
    "_id": "",
    "text": "",
    "date": "",
    "user": "",
    "likes": ,
    "comments": {
      "comment": "",
      "userId": ""
    }
  },
  {
    "_id": "",
    "text": "one user liked another user status",
    "date": "",
    "user": "user",
    "comments": null
  },
]
```
---

- **PUT - api/updates/:updateId** - *Automatically likes the update(User must be loged in)*
    Headers of request:
```Javascript
{
    "contentType": "application/json",
    "x-auth-key": "auth key from localStorage"
}
```
```Javascript
{
  "result": {
    "likes": [
      {
        "userId": "55f55e6a43475df421128318"
      }
    ],
    "_id": "",
    "text": "",
    "date": "",
    "user": {
      "username": "",
      "id": ""
    },
    "book": {
      "_id": "",
      "title": ""
    },
    "review": "",
    "progress":,
    "__v": 
  }
}
```
---

- **PUT - api/updates/:updateId/comment** - *Add comment on update(User must be loged in)*
    Request:
```Javascript
{
	"comment": "mmfcposfmcpsfmcpsdmlsx"
}
```
    Headers of request:
```Javascript
{
    "contentType": "application/json",
    "x-auth-key": "auth key from localStorage"
}
```
    Success:
```Javascript
{
  "result": {
    "comments": [
      {
        "comment": "mmfcposfmcpsfmcpsdm;lsx",
        "userId": "55f55e6a43475df421128318"
      }
    ],
    "_id": "",
    "text": "",
    "date": "",
    "user": {
      "username": "",
      "id": ""
    },
    "book": {
      "_id": "",
      "title": ""
    },
    "review": "",
    "progress":,
    "__v": 2,
    "likes": [
      {
        "userId": ""
      }
    ]
  }
}
```
    Must add validation.