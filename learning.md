---
id: TODO Application - React
aliases: TODO Application ( Database, ORM, AI Chat )
tags:
  - CSS
  - HTML
  - JS
  - basics
  - db
  - react
author: S.Sunhaloo
date: 2025-11-07
status: In-Progress
---

## List of Contents

- Planning
- Setup Project
- Configure The Knex
  - Write The Schema For Tables
  - Run The Migrations
- Configure The Main Express.JS Server
  - Setup Connection Between Database And Server
  - Create / Configure The Main Server File
- Security and Authentication
  - Creation Of Authentication Controller
  - Creation Of Routing For Authentication
    - Make The URL ( For Authentication )
    - Test The URL ( For Authentication )
  - Create Authentication Middleware
- TODO Related Tasks
  - Creation Of TODO Controller
  - Creation Of Routing For TODO
    - Make The URL ( For TODO )
    - Test The URL ( For TODO )
- React Development Setup
  - Download Required Dependencies
    - Setup React Project To Use Ant Design
  - Creation Of Folders
    - Testing Ant Design
- Registration - Login Page
  - Create Main 'Registration - Login' Page
    - Install React Icons
    - Example Usage
  - RGB Colour Shifting
    - Implementation In React
  - Logo Animation
- Axios API Connection
  - Create API Service
  - Connect React - Forms To API
    - Testing Front-End And Back-End Connection ( Register / Login )
  - Creation Of Main Page
    - Routes!!!
    - Create The Actual Dashboard File
    - Add The Routings
- Main Pages Components
  - Creating The MVP
    - Our Main ( Home ) Page
- Learn How To Use Postman
  - Login Post Requests
  - TODO Get Requests
- Create Username Component
  - Back-End / Express.JS
  - Front-End / React
- Create Profile Picture - Drop Down Menu Component
  - Make It Behave Like Ant Design's Component
  - Making The Card
- Toggle Theme ( Button / Toggle )
  - Theme Context
  - Create Actual Toggle Theme Component
  - The Select Component And Back-End Category
- Create TODO Form Component
  - But Before Ant Design!!!
  - The Select Component And Back-End Category
- Back-end Issue - Migration File
  - Start Clean - Revert / Rollback Everything
    - No Data In Database
- Migrating To Neon DB
  - Setup Neon
- Vercel
  - Deploying On Vercel
    - Back-End Deployment
    - Front-End Deployment
- Registration / Login Issues
  - Update Vercel Back-End's Environment Variables
  - Generate JSON Web Token Secret Key
- Project Improvements
  - Fetching Required TODOs
  - Fixing Category Disappearing
- AI Chatbot
  - Langchain
  - Installation
  - Implementation

> [!NOTE] Resource(s)
>
> - <https://knexjs.org/>
> - <https://knexjs.org/guide/#configuration-options>
> - <https://expressjs.com>
> - <https://expressjs.com/en/guide/routing.html>

> [!WARNING]
>
> Because I know nothing about this... I am going to be learning with [Claude](https://claude.ai) and [ChatGPT](https://chat.openai.com) and reading the official documentations:
>
> - <https://react.dev>
> - <https://react.dev/reference>
> - <https://knexjs.org/guide/>
> - <https://expressjs.com/en/starter>
>
> > I prefer 'Claude' instead of '[ChatGPT](https://www.youtube.com/watch?v=qaZ-u9n13gs)' as its answer are more "_Professional_"!

# Planning

> [!TIP] The Goal?
>
> Build a TODO list application with 'React'.
>
> The application needs to have:
>
> - Login Page
> - Toggle Theme
> - Weather
> - AI Chatbot

> [!NOTE] Software and Tools
>
> - React and Vite with 'JSX'
> - Designs from '[Ant Design](https://ant.design/)'
> - Follow the same layout as [this](https://github.com/Sunhaloo/Simple-HTML-CSS-JS-TODO)
> - SQLite Database
> - Object Relational Mapping: [Knex.js](https://knexjs.org/)

# Setup Project

- Setup a _private_ GitHub repository for our project using [github-cli](https://cli.github.com/):

```bash
# create a private repo 'todo' and clone
gh repo create todo --private --add-readme --description "TODO App in React" --clone
```

- Create the 'React' **front-end** _project_ / folder:

```bash
# create a folder that acts as our 'client' i.e font-end
npm create vite@latest client -- --template react
```

> `react` instead of `react-ts` is going to allow us to use `.jsx` file!

- Create a folder for the **back-end**:

```bash
# create folder for 'server' i.e back-end
mkdir server
```

- Initialise `npm` / 'Node' project:

```bash
# change directory to our backend
cd server

# initialise the node project
npm init -y
```

- Install the required dependencies:

```bash
# install the required dependencies for our project
npm install express knex sqlite3 cors dotenv
```

- Install `nodemon` a [deamon](<https://en.wikipedia.org/wiki/Daemon_(computing)>)

```bash
# install what is essentially what's 'Vite' is doing
npm install --save-dev nodemon
```

> [!NOTE] What did we install?
>
> - `express`: Web framework for API building
> - `knex`: The object relational mapping --> ORM builder
> - `sqlite3`: The actual database ( driver )
> - `cors`: Allows front-end to make requests to back-end ( allowing React to make requests )
> - `dotenv`: Loading of environment variable from file
> - `nodemon`: Auto restarts back-end server when update is made ( development only )

> [!NOTE]
>
> After running these `npm` command, you should see that the `package.json` file gets updated!

- Create the necessary files and folders **in** our `server` folder:

```bash
# create the following folders
mkdir db routers controllers middleware

# create the following files
touch index.js knexfile.js .env .gitignore
```

- Update the `server/.gitignore` file:

```gitignore
node_modules/
.env
*.db
*.sqlite
*.sqlite3
```

> [!NOTE] Testing
>
> - Add the following code in the `server/server.js` file:
>
> ```js
> console.log("Hello Server");
> ```
>
> - Run the following command to check if we have an output:
>
> ```bash
> # run the `server.js` file
> npm run start
> ```
>
> > [!SUCCESS]
> > When you run the `npm` command above, you should see that you have the following output:
> >
> > ```console
> > Hello Server
> > ```
>
> > Very Nice!

# Configure The Knex

- Add this code to the `knexfile.js`:

```js
module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./db/app.db",
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./db/migrations",
    },
    seeds: {
      directory: "./db/seeds",
    },
  },
};
```

> [!NOTE]
>
> > I hate Django! I don't fucking understand it!
>
> In Django, as you know we have the `python manage.py makemigrations` and **after** running the latter; you are going to _run_ the `python manage.py migrate`.
>
> The first command is basically telling Django to:
>
> - Take the _highly abstracted_ code that the user has written in his / her `models.py` file
> - Create another file that is going be already populated with how the table should be created
>
> Then after running the _second_ `migrate` command; you are going to see that, it then that Django is going to "_connect_" with the `db.sqlite3` file and then actually **write** the 'SQL' data definition commands so that it creates the tables!
>
> This is basically what Knex is doing! The `makemigration` command here is `npx knex migrate:make the_js_file_name`.
>
> > [!WARNING] Butt ))... Big Butt!
> > Compared to Django whereby the `0001_initial.py` is <strong><span style="color: red;">not</span></strong> going to be **populated**.
> >
> > What Knex is going to do; its going to **create** and **empty** `the_js_file_name` and then we are going to have to manually tell `sqlite` how to proceed with the creation of the tables!
> >
> > > Its only then that we are going to be able to run the `npx knex migrate:latest`!
>
> > You are going to see what I am talking about below...

- Add the following lines to our `.env` file:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=api_key_to_be_added_later
```

- Initialise Knex and create the migrations:

```bash
# make the migrations --> basically running `makemigrations` from Django
# our user's table
npx knex migrate:make create_users_table

# our todo's table
npx knex migrate:make create_todos_table

# switch to the `server/db` folder
cd db

# create the following 'seeds' folder
mkdir seeds
```

> [!NOTE] What is the `seeds` folder?
>
> In short, its just **sample** data that we can use and play around when we are developing the application!
>
> > That's basically it!

- After running the above `migrate:make` commands using `npx knex`; you should see this output and also have the respective file inside each folder:

```console
Using environment: development
Using environment: development
Using environment: development
Created Migration: /home/azmaan/GitHub/todo/server/db/db/migrations/20251107112030_create_users_table.js
Using environment: development
Using environment: development
Using environment: development
Created Migration: /home/azmaan/GitHub/todo/server/db/db/migrations/20251107112031_create_todos_table.js
```

## Write The Schema For Tables

- Head into the `db/migrations` folder and open the `{current_date_time}_create_users_table.js` and add the following code:

```js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// creation of 'user' table
exports.up = function (knex) {
  // use the `createTable` function to define - create table in database
  return knex.schema.createTable("user", (table) => {
    // our fields
    table.increments("id").primary();
    table.string("username", 50).notNullable().unique();
    table.string("email", 100).notNullable().unique();
    table.string("password").notNullable();
    table.enu("gender", ["male", "female"]).notNullable();

    // add time stamps of when created / updated
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// deletion of user table
exports.down = function (knex) {
  // use the `dropTable` to delete the table
  return knex.schema.dropTable("user");
};
```

- Head into the `db/migrations` folder and open the `{current_date_time}_create_todos_table.js` and add the following code:

```js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// creation of 'todos' table
exports.up = function (knex) {
  // use the `createTable` function to define - create table in database
  return knex.schema.createTable("todo", (table) => {
    // our fields
    table.increments("id").primary();
    table.text("description").notNullable();
    table
      .enu("category", [
        "Code Review",
        "Coding",
        "Debugging",
        "Deployment",
        "Documentation",
        "Learning",
        "Meeting",
        "Miscellaneous",
        "Planning",
        "Refactoring",
        "Testing",
      ])
      .defaultTo("Miscellaneous");
    table.boolean("completed").defaultTo(false);

    // add time stamps of when created / updated
    table.timestamps(true, true);

    // create the field for the foreign key here
    table.integer("user_id").unsigned().notNullable();
    // make the actual link using 'references'
    table.foreign("user_id").references("user.id").onDelete("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// deletion of user table
exports.down = function (knex) {
  // use the `dropTable` to delete the table
  return knex.schema.dropTable("todo");
};
```

## Run The Migrations

Now, we need to actually make `sqlite` think that we are actually running these 'Data Definition Language' commands like `CREATE`.

- Run the following command to `migrate`:

```bash
# run the migrations
npx knex migrate:latest
```

> [!NOTE] Switching Computers
>
> I am now at my desktop and I just clone the 'todo' repository that we are currently working on!
>
> Therefore running the above command gave me this:
>
> ```console
> Need to install the following packages:
> knex@3.1.0
> Ok to proceed? (y)
> ```
>
> Therefore similar to a Python virtual environment and the `requirements.txt` file. On a different computers that **does** not have the dependencies installed... We are going to have to _manually_ install them!
>
> > So compared to Python whereby we **don't** push the _virtual environment_... Here we just push everything!
>
> Therefore to install all the ( _development_ ) dependencies **from** the _file_; you can simply use the following `npm` command:
>
> ```bash
> # install all the dependencies on another computer ( for example )
> npm install
> ```

- Output logs after running the above command:

```console
Using environment: development
Batch 1 run: 2 migrations
```

> [!SUCCESS]
>
> You should now see that we have our `db/app.db` SQLite database file!

# Configure The Main Express.JS Server

## Setup Connection Between Database And Server

- Create a new file `knex.js` **inside** the `server/db` directory:

```js
// import the 'knex' library
const knex = require("knex");
const knexconfig = require("../knexfile.js");

// get the current environment --> default to 'development' if not found
const environment = process.env.NODE_ENV || "development";

// initialise knex with our 'knexfile.js' configuratin file
const db = knex(knexconfig[environment]);

// export the connection ( to be used in other files )
module.exports = db;
```

The above code / `knex.js` file is going to create the **connection** between the _server_ and _database_. Therefore, with the last line in the file, i.e, `module.exports = db;` allows us to use _this_ connection from **anywhere** in our `server` folder!

## Create / Configure The Main Server File

- Add the following code to the `server/server.js` file:

```js
// add the 'express', 'cors' and 'dotenv' libraries
const express = require("express");
const cors = require("cors");

// simply import the data found in our `.env` file
require("dotenv").config();

// create the actual 'express' application / server
const app = express();
// define the port ( default to environment variable or '5000' )
const PORT = process.env.PORT || 5000;

// define the middleware with 'cors'
// NOTE: the function that is going to allow front-end to talk with back-end
app.use(cors());

// convert front-end data into JS object
app.use(express.json());

// Routings

// test the main "landing" route
app.get("/", (req, res) => {
  res.json({
    message: "TODO API Running!",
    status: "success",
  });
});

// start the server
app.listen(PORT, () => {
  console.log(`Server running on 'http://localhost:${PORT}'`);
});
```

- Therefore, if you go ahead and run the `npm run dev` command inside the `todo/server` directory:

```console
> server@1.0.0 dev
> nodemon server

[nodemon] 3.1.10
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node server.js`
[dotenv@17.2.3] injecting env (3) from .env -- tip: 📡 add observability to secrets: https://dotenvx.com/ops
Server running on 'http://localhost:5000'
```

- Open your browser and head over to `http://localhost:5000` or `http://127.0.0.1:5000`, you should see this:

```console
{
  "message": "TODO API Running!",
  "status": "success"
}
```

> [!TIP] Testing Something
>
> As you can see the above output in the **browser** is due to this piece of code here:
>
> ```js
> // test the main "landing" route
> app.get("/", (req, res) => {
>   res.json({
>     message: "TODO API Running!",
>     status: "success",
>   });
> });
> ```
>
> As you can see its at the "_root_" of the URL as we have `/`... But what if we add something like this below the above code in the `server.js` file?
>
> ```js
> app.get("/someroute", (req, res) => {
>   res.json({
>     message: "Another Routing",
>     status: "success",
>   });
> });
> ```
>
> - Therefore, if you head over to this very URL now; `http://localhost:5000/someroute` you should see this:
>
> ```console
> {
>  "message": "Another Routing",
>  "status": "success"
> }
> ```
>
> > [!NOTE]
> > I have **removed** the above _testing_ code that we just wrote... Again it was just for testing purposes!

> [!NOTE] What is `app.use(express.json());`?
>
> Let's say that our user needs to enter his **username** and **password** to be able to login to the web-app.
>
> After entering his / her credentials, we need to make a _requests_ to the **server** to see if that is present.
>
> Our "_server_" only understands 'JSON' information; but when the user presses the _login_ button or whatever. The data that is going to be sent will be in the following format:
>
> ```console
> "{\"username\":\"Joe Mama\",\"password\":\"1234\"}"
> ```
>
> > This is just a **string**!
>
> Hence, the code `app.use(express.json());` is going to covert that _string literal_ into something like this:
>
> ```json
> {
>   "username": "Shehzaad",
>   "password": "1234"
> }
> ```

# Security and Authentication

> I **don't** know anything about this

> [!NOTE] Resource(s)
>
> - <https://www.npmjs.com/package/bcryptjs>
> - <https://www.npmjs.com/package/jsonwebtoken>

## Creation Of Authentication Controller

In Django, every application has it own `views.py` file. This means that we can have a **template** ( _basically an `app.html` file_ ) and its going to be rendered out when we hit the _routing_.

> This is what we are basically going to configure next!

| Django                      | Node - Express                              |
| --------------------------- | ------------------------------------------- |
| `main_project/urls.py` file | `server/server.js` file                     |
| `some_app/urls.py` file     | `server/routes/authRoutes.js` file          |
| `some_app/views.py` file    | `server/controllers/authController.js` file |

> [!WARNING] Before That!
>
> Similarly, if you head over to `http://localhost:8000/admin`, if you have ever created some sort of 'User' table that has a _password_ field... You know that if you head to the 'Admin' page.
>
> > You see that the passwords are **hashed**!
>
> Therefore, we need to install an `npm` package named 'bcryptjs' to be able to hash our user's passwords!
>
> Additionally, we are going to have to install 'jsonwebtoken'.
>
> > [!TIP] What's an Authentication Token?
> > Think of it like a badge for special access to some _special_ places only.
> >
> > When our user is going to **login**, a few things is going to happen:
> >
> > - Verification of their credentials
> > - Generation of **token** ( "_digital badge_" )
> > - Send **token** to _front-end_
> >
> > The front-end will then **store** that _token_ inside the user's **local storage** or **cookies**. Now, given that each user is going to have his / her own 'todos'; this has to be **protected** for each users.
> >
> > > Another user **cannot** / should **not** have _access_ to another's 'todos' item!
> >
> > Now, each time the user is going to make a _requests_ to a **protected endpoint** like `/api/todos`; The **token** is going to be _attached_ to the **request header**!
>
> Therefore, we have to install the following package from / using `npm`:
>
> ```bash
> # install the required packages for security / authentication purposes
> npm install bcryptjs jsonwebtoken
> ```

- Create a `server/controllers/authController.js` file:

```js
// import the security and authentication features
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// import the required knex 'server' to 'database' connection
const db = require("../db/knex");

// asynchronous function that registers a user
const register = async (req, res) => {
  try {
    // get the crendentials from the 'JSON' body
    const { username, email, password, gender } = req.body;

    // if the credentials are not valid
    if (!username || !email || !password || !gender) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    // check if the user already exists ( using database connection )
    const existingUser = await db("user")
      .where({ email })
      .orWhere({ username })
      .first();

    // if an already existing user tries to register again
    if (existingUser) {
      return res.status(400).json({
        error: "Username or email already exists",
      });
    }

    // use the `bycrypt` package to apply a hash to the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // if user does not exists and all inputs are inserted correctly ==> add the user to database
    const [userId] = await db("user").insert({
      username,
      email,
      password: hashedPassword,
      gender,
    });

    // create the digital token ( "security badge" ) for the user
    const token = jwt.sign({ userId, username }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // if everything has been created successfully ==> return a 'JSON' output
    // NOTE: status code = '201' ==> successful creation of a new resource on server
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: userId,
        username,
        email,
        gender,
      },
    });

    // if the user could not be registered
    // NOTE: status code = '500' ==> internal server error
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: "Server error during registration",
    });
  }
};

// asynchronous function that logs in a user
const login = async (req, res) => {
  try {
    // get the crendentials from the 'JSON' body
    const { username, password } = req.body;

    // if the credentials are not valid
    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required",
      });
    }

    // find the user in the database
    const user = await db("user").where({ username }).first();

    // if user does not exists
    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    // user the 'bcrypt' package to compare the password
    // NOTE: need to user the `bycrypt.compare` function as password in DB is hashed
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // if the password is not correct
    // NOTE: status code = '401' ==> missing / invalid / failed authentication details
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    // create the digital token ( "security badge" ) for the user
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // if user is able to login ==> return a 'JSON' output
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        gender: user.gender,
      },
    });

    // if the user could not be logged int
    // NOTE: status code = '500' ==> internal server error
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Server error during login",
    });
  }
};

// export the routing for `/register` / `login`
module.exports = {
  register,
  login,
};
```

> [!NOTE] What Have We Just Done?
>
> We have just code the function that are going to be used when we go to an _endpoint_ like `/api/auth/register`. That endpoint is then going to call the `authCrontroller.register()` function which is going to allow the user to **register** for the web-app.
>
> > This is basically the same thing as we do in our `views.py` file in Django!

## Creation Of Routing For Authentication

Given that we created the _functions_ that are going to be called when going to an endpoint like `/api/auth/register`. But how are we going to access that endpoint ( _from the user's perspective_ )?

> Well, we have to code the **routes**?

- Create the `server/routers/authRouter.js` file:

```js
// import the 'express' library and the endpoint's function for 'register' and 'login'
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// 'POST' route ==> /api/auth/register
router.post("/register", authController.register);

// 'POST' route ==> /api/auth/login
router.post("/login", authController.login);

// export the acutal routes ( `/register` and `/login` )
module.exports = router;
```

### Make The URL ( For Authentication )

Therefore, we need to actually make the routing for `/register` and `/login`. Therefore open up our `server/server.js` file and modify it so that it now looks like this:

```js
// add the 'express', 'cors' and 'dotenv' libraries
const express = require("express");
const cors = require("cors");

// simply import the data found in our `.env` file
require("dotenv").config();

// import our routers
const authRouter = require("./routers/authRouters");

// create the actual 'express' application / server
const app = express();
// define the port ( default to environment variable or '5000' )
const PORT = process.env.PORT || 5000;

// define the middleware with 'cors'
// NOTE: the function that is going to allow front-end to talk with back-end
app.use(cors());

// convert front-end data into JS object
app.use(express.json());

// Routings

// test the main "landing" route
app.get("/", (req, res) => {
  res.json({
    message: "TODO API Running!",
    status: "success",
  });
});

// authentication routes
app.use("/api/auth", authRouter);

// start the server
app.listen(PORT, () => {
  console.log(`Server running on 'http://localhost:${PORT}'`);
});
```

### Test The URL ( For Authentication )

Given that I learned a bit about the `requests` and `json` modules... I am going to write a little Python code that's going to allow us to test our stuff.

- Create a `main.py` inside the `todo/server` folder:

```python
import requests
import json

# base 'localhost' URL
BASE_LOCAL_URL: str = "http://localhost:5000"


# function to test the registration
def test_registration():
    register_url = f"{BASE_LOCAL_URL}/api/auth/register"

    # define the 'JSON' "payload"
    payload: dict = {
        "username": "tester",
        "email": "tester@email.com",
        "password": "password1234",
        "gender": "male",
    }

    # send / 'POST' data to server ==> get the response
    response = requests.post(register_url, json=payload)

    # display the output
    print(json.dumps(response.json(), indent=2))


# function to test the login
def test_login():
    login_url = f"{BASE_LOCAL_URL}/api/auth/login"

    # define the 'JSON' "payload"
    payload: dict = {
        "username": "tester",
        "password": "password1234",
    }

    # send / 'POST' data to server ==> get the response
    response = requests.post(login_url, json=payload)

    # display the output
    print(json.dumps(response.json(), indent=2))


def main():
    # register the user
    test_registration()
    # log in user
    test_login()


if __name__ == "__main__":
    main()
```

> [!TIP] Running Python Script - **First Time**
>
> This is the output that I get after running the Python script for the **first** time!
>
> ```console
> {
>  "message": "User registered successfully",
>  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInVzZXJuYW1lIjoidGVzdGVyIiwiaWF0IjoxNzYyNjczMTU0LCJleHAiOjE3NjMyNzc5NTR9.shzPPe34TxmCHUaQFiBNkgng8C7nRLXP440thOa-Wjg",
>  "user": {
>    "id": 2,
>    "username": "tester",
>    "email": "tester@email.com",
>    "gender": "male"
>  }
> }
> {
>  "message": "Login successful",
>  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInVzZXJuYW1lIjoidGVzdGVyIiwiaWF0IjoxNzYyNjczMTU0LCJleHAiOjE3NjMyNzc5NTR9.shzPPe34TxmCHUaQFiBNkgng8C7nRLXP440thOa-Wjg",
>  "user": {
>    "id": 2,
>    "username": "tester",
>    "email": "tester@email.com",
>    "gender": "male"
>  }
> }
> ```

> [!TIP] Running Python Script - **Second Time**
>
> Before we run the `main.py` file again, let's go ahead and open up the `server/app.db` file with SQLite.
>
> - Open the `app.db` database file with `sqlite3`:
>
> ```sql
> sqlite> SELECT * FROM user;
> ```
>
> - This is the output that you should get after running the above command:
>
> ```console
> 2|tester|tester@email.com|$2b$10$ivYImfJRsKdeqH.KAtnk5OqvRh3tU6d72k.2smk/1BTYqJL9NrKGK|male|2025-11-09 07:25:54|2025-11-09 07:25:54
> ```
>
> > [!SUCCESS] Hence!
> > We should expect to see an **error** for the `test_registration` function!
> >
> > And we should **not** see any errors from the `test_login` function!
>
> - Running the Python script for a second I see that we have the following output:
>
> ```console
> {
>  "error": "Username or email already exists"
> }
> {
>  "message": "Login successful",
>  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInVzZXJuYW1lIjoidGVzdGVyIiwiaWF0IjoxNzYyNjczODI4LCJleHAiOjE3NjMyNzg2Mjh9.cY_jWYt2sHclYSgWzQ6phCVYhHUF35cAzg4032MefNk",
>  "user": {
>    "id": 2,
>    "username": "tester",
>    "email": "tester@email.com",
>    "gender": "male"
>  }
> }
> ```
>
> > [!SUCCESS]
> > Very nice!

> [!NOTE] Delete `tester` User From Database
>
> I am going to delete the `tester` user from or 'user' database.
>
> - Delete the `tester` user from `server/db/app.db` using `sqlite3`:
>
> ```sql
> DELETE FROM user WHERE username = 'tester';
> ```
>
> - Test if we have successfully deleted the `tester` user:
>
> ```sql
> SELECT * FROM user;
> ```
>
> - Therefore we should get the output found below:
>
> ```console
>
> ```
>
> > Which is **nothing**!

## Create Authentication Middleware

> [!NOTE] Resource(s)
>
> - <https://www.redhat.com/en/topics/middleware/what-is-middleware>
> - <https://www.redhat.com/en/topics/middleware/what-is-middleware#middleware-and-apis>
> - <https://en.wikipedia.org/wiki/Middleware>

A 'Middleware' is a _function_ that is going to sit in **between** a _request_ and a _response_. In our case, we are going to check if the _requests_ sent from the front-end is **valid** if and only if it as the 'JSON Web Token' in the _requests 'Authorisation' header_.

> [!NOTE]
>
> The middleware does **not** do anything when the user is going through the '**Authentication Phase**'.
>
> But it does comes into _action_ when the user is going through the '**Authorisation Phase**'!

- Create the `middleware/authMiddleware.js` file:

```js
// import the 'JSON Web Token' library
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  try {
    // get token from authrisation ( request ) header
    const authHeader = req.headers["authorization"];
    // split the data ( "Bearer ey12345.abc6789.xyz123" ) into 2 parts and get the token only
    const token = authHeader && authHeader.split(" ")[1];

    // if there are not token is not present
    // NOTE: status code = '401' ==> missing / invalid / failed authentication details
    if (!token) {
      return res.status(401).json({
        error: "Access denied. No token provided.",
      });
    }

    // use the `jwt.verify` function to verify token for each user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach / get the user information ( { userId, username } ) to the request object
    req.user = decoded;

    // continue to the actual route handler
    next();

    // NOTE: status code = '403' ==> request "valid" but unauthorised
  } catch (error) {
    return res.status(403).json({
      error: "Invalid or expired token",
    });
  }
};

// export the token
module.exports = { authenticateToken };
```

# TODO Related Tasks

## Creation Of TODO Controller

Similar to how we create our `authController.js` file; we need to make our `todoController.js` file that's going to allow us to do '_CRUD_' operations with our 'TODO' items!

> Again! In Django, we would be coding the `todo/views.py` file!

- Create the `server/controllers/todoControllers.js` file:

```js
// import the "database connection"
const db = require("../db/knex");

// function to be able to create a new 'TODO' item
const createTodo = async (req, res) => {
  try {
    // get the `userId` from the authentication token
    const userId = req.user.userId;

    // get the 'description' and 'category' from the body of the request
    const { description, category } = req.body;

    // if user did not add any description for the TODO item
    // NOTE: status code = '400' ==> cannot / will not process client request due to client-side error
    if (!description) {
      return res.status(400).json({
        error: "Description is required",
      });
    }

    // NOTE: no need to validate the 'category' / 'completed' as it's going to be defaulted to 'Miscellaneous'!

    // insert the new TODO item into the database
    const [todoId] = await db("todo").insert({
      user_id: userId,
      description,
      category: category || "Miscellaneous",
      completed: false,
    });

    // get the `id` of the newly created TODO item
    // NOTE: the `.first` function / method is going to only get the "first" data
    const newTodo = await db("todo").where({ id: todoId }).first();

    // if user has been able to successfully create / 'POST' TODO item on server
    // NOTE: status code = '201' ==> creation of a new resource on server
    res.status(201).json({
      message: "Todo created successfully",
      todo: newTodo,
    });

    // if the TODO item could not be inserted
    // NOTE: status code = '500' ==> internal server error
  } catch (error) {
    console.error("Create todo error:", error);
    res.status(500).json({
      error: "Server error while creating todo",
    });
  }
};

// function to get all the TODO items for the logged-in user
const getTodos = async (req, res) => {
  try {
    // get the `userId` from the authentication token
    const userId = req.user.userId;

    // get all of the TODO items from the database for that user in descending order of creation date
    const todos = await db("todo")
      .where({ user_id: userId })
      .orderBy("created_at", "desc");

    // get the data to the user with / using 'JSON'
    res.json({
      message: "Todos retrieved successfully",
      count: todos.length,
      todos,
    });

    // if the TODO item could not be fetched
  } catch (error) {
    console.error("Get todos error:", error);
    res.status(500).json({
      error: "Server error while fetching todos",
    });
  }
};

// edit / update a TODO item
const updateTodo = async (req, res) => {
  try {
    // get the `userId` from the authentication token
    const userId = req.user.userId;
    // get the TODO item's id from the parameters
    const todoId = req.params.id;
    // get the 'description', 'category' and 'completed' from the body of the request
    const { description, category, completed } = req.body;

    // check if the TODO item exists and also belongs to that user
    const todo = await db("todo")
      .where({ id: todoId, user_id: userId })
      .first();

    // if the TODO item has not been found ==> "Invoke" the famous famous '404' status code
    if (!todo) {
      return res.status(404).json({
        error: "Todo not found or does not belong to you",
      });
    }

    // update the required data for a TODO item ( to be updated )
    const updateData = {};
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (completed !== undefined) updateData.completed = completed;

    // update the TODO item in the database
    await db("todo").where({ id: todoId }).update(updateData);

    // get the `id` of the updated TODO item
    const updatedTodo = await db("todo").where({ id: todoId }).first();

    // simply return a little success message
    res.json({
      message: "Todo updated successfully",
      todo: updatedTodo,
    });

    // if the TODO item could not be updated
    // NOTE: status code = '500' ==> internal server error
  } catch (error) {
    console.error("Update todo error:", error);
    res.status(500).json({
      error: "Server error while updating todo",
    });
  }
};

// function to be able to delete a TODO item
const deleteTodo = async (req, res) => {
  try {
    // get the `userId` from the authentication token
    const userId = req.user.userId;
    // get the TODO item's id from the parameters
    const todoId = req.params.id;

    // check if the TODO item exists and also belongs to that user
    const todo = await db("todo")
      .where({ id: todoId, user_id: userId })
      .first();

    // if the TODO item has not been found ==> "Invoke" the famous famous '404' status code
    if (!todo) {
      return res.status(404).json({
        error: "Todo not found or does not belong to you",
      });
    }

    // delete the TODO item from the database
    await db("todo").where({ id: todoId }).delete();

    // simply return a little success message
    res.json({
      message: "Todo deleted successfully",
      deletedTodo: todo,
    });

    // if the TODO item could not be updated
    // NOTE: status code = '500' ==> internal server error
  } catch (error) {
    console.error("Delete todo error:", error);
    res.status(500).json({
      error: "Server error while deleting todo",
    });
  }
};

// export the functions that are going to be create to the 'CRUD' operations of TODOs
module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
```

> [!NOTE] Update to `getTodos` function!
>
> I have updated the `getTodos` function so that it's going to display the 'TODO' item in **ascending** order.
>
> - This is the bit of code that I updated:
>
> ```js
> const todos = await db("todo")
>   .where({ user_id: userId })
>   .orderBy("created_at", "asc");
> ```

## Creation Of Routing For TODO

- Create the `server/routers/todoRouters.js` file:

```js
// import the 'express' library and the endpoint's function for 'register' and 'login'
const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");
// NOTE: get the 'Authentication Token' as 'TODO' items are "private" to each user
const { authenticateToken } = require("../middleware/authMiddleware");

// get all TODO items for logged-in and authenticated user ( 'GET method on `/api/todos`' )
router.get("/", authenticateToken, todoController.getTodos);

// create new TODO item for logged-in and authenticated user ( 'POST method on `/api/todos`' )
router.post("/", authenticateToken, todoController.createTodo);

// update TODO item for logged-in and authenticated user ( 'PUT method on `/api/todos`' )
router.put("/:id", authenticateToken, todoController.updateTodo);

// delete TODO item for logged-in and authenticated user ( 'DELETE method on `/api/todos`' )
router.delete("/:id", authenticateToken, todoController.deleteTodo);

// export the acutal routes ( `/api/todos` )
module.exports = router;
```

### Make The URL ( For TODO )

Now, after creating that _functions_ that are going to be used at at our `/api/todos` endpoints... We, hence, need to update our `server/server.js` file to be able to make requests and get a response from it.

- Update our `server.js` file to make it like so:

```js
// add the 'express', 'cors' and 'dotenv' libraries
const express = require("express");
const cors = require("cors");

// simply import the data found in our `.env` file
require("dotenv").config();

// import our routers
const authRouter = require("./routers/authRouters");
const todoRouter = require("./routers/todoRouters.js");

// create the actual 'express' application / server
const app = express();
// define the port ( default to environment variable or '5000' )
const PORT = process.env.PORT || 5000;

// define the middleware with 'cors'
// NOTE: the function that is going to allow front-end to talk with back-end
app.use(cors());

// convert front-end data into JS object
app.use(express.json());

// Routings

// test the main "landing" route
app.get("/", (req, res) => {
  res.json({
    message: "TODO API Running!",
    status: "success",
  });
});

// authentication routes
app.use("/api/auth", authRouter);

// todo routers
app.use("/api/todos", todoRouter);

// start the server
app.listen(PORT, () => {
  console.log(`Server running on 'http://localhost:${PORT}'`);
});
```

### Test The URL ( For TODO )

- Update our `main.py` file to be able to test the _function_ related to 'TODO' _controllers_:

```python
import requests
import json

# base 'localhost' URL
BASE_LOCAL_URL: str = "http://localhost:5000"

# global variable to store the token after login
AUTH_TOKEN: str = ""


# function to test the registration
def test_registration():
    # URL ( endpoint ) to be able to register a user
    register_url = f"{BASE_LOCAL_URL}/api/auth/register"

    # define the 'JSON' "payload"
    payload: dict = {
        "username": "tester",
        "email": "tester@email.com",
        "password": "password1234",
        "gender": "male",
    }

    try:
        # send the registration crendentials to the database
        response = requests.post(register_url, json=payload)

        # display the response we get from the data
        print(json.dumps(response.json(), indent=2))

    except Exception as e:
        print(f"Registration Error: {e}")


# function to test the login
def test_login():
    # use the actual data inside the 'AUTH_TOKEN' variable
    global AUTH_TOKEN

    # URL ( endpoint ) to be able to login a user
    login_url = f"{BASE_LOCAL_URL}/api/auth/login"

    # define the 'JSON' "payload"
    payload: dict = {
        "username": "tester",
        "password": "password1234",
    }

    try:
        # send the login crendentials to the database
        response = requests.post(login_url, json=payload)

        # display the response we get from the data
        data = response.json()

        # store the token for later use
        if "token" in data:
            AUTH_TOKEN = data["token"]

    except Exception as e:
        print(f"Login Error: {e}")


# function to create a todo
def test_create_todo(description: str, category: str = "Miscellaneous"):
    # URL ( endpoint ) to be able to create a TODO item
    create_url = f"{BASE_LOCAL_URL}/api/todos"

    # define the 'JSON' "payload"
    payload: dict = {"description": description, "category": category}

    # add the authrorisation header with the associated token
    headers = {"Authorization": f"Bearer {AUTH_TOKEN}"}

    try:
        # send the TODO item details to the database
        response = requests.post(create_url, json=payload, headers=headers)

        # display the response we get from the data
        print(json.dumps(response.json(), indent=2))

        # return the TODO item's ID for later use
        data = response.json()

        if "todo" in data:
            return data["todo"]["id"]
        return None

    except Exception as e:
        print(f"Create Todo Error: {e}")
        return None


# function to get all todos
def test_get_todos():
    # URL ( endpoint ) to be able to get all TODO items
    get_url = f"{BASE_LOCAL_URL}/api/todos"

    # add the authrorisation header with the associated token
    headers = {"Authorization": f"Bearer {AUTH_TOKEN}"}

    try:
        # send the TODO item details to the database
        response = requests.get(get_url, headers=headers)

        # display the response we get from the data
        print(json.dumps(response.json(), indent=2))

    except Exception as e:
        print(f"Get Todos Error: {e}")


# function to update a todo
def test_update_todo(
    todo_id: int, completed: bool = None, description: str = None, category: str = None
):

    # URL ( endpoint ) to be able to update a specific TODO item
    update_url = f"{BASE_LOCAL_URL}/api/todos/{todo_id}"

    # define the 'JSON' "payload"
    payload: dict = {}

    # check if the the data is valid
    if completed is not None:
        payload["completed"] = completed
    if description is not None:
        payload["description"] = description
    if category is not None:
        payload["category"] = category

    # add the authrorisation header with the associated token
    headers = {"Authorization": f"Bearer {AUTH_TOKEN}"}

    try:
        # send the TODO item details to the database
        response = requests.put(update_url, json=payload, headers=headers)

        # display the response we get from the data
        print(json.dumps(response.json(), indent=2))

    except Exception as e:
        print(f"Update Todo Error: {e}")


# function to delete a todo
def test_delete_todo(todo_id: int):
    # URL ( endpoint ) to be able to delete a TODO item
    delete_url = f"{BASE_LOCAL_URL}/api/todos/{todo_id}"

    # add the authrorisation header with the associated token
    headers = {"Authorization": f"Bearer {AUTH_TOKEN}"}

    try:
        # delete the TODO item from the database
        response = requests.delete(delete_url, headers=headers)

        # display the response we get from the data
        print(json.dumps(response.json(), indent=2))

    except Exception as e:
        print(f"Delete Todo Error: {e}")


def main():
    # testing registration and login
    test_registration()
    test_login()

    # check if the user has / does not has the authentication token
    if not AUTH_TOKEN:
        print("\nNo token received. Cannot proceed with todo tests.")

        # end the "testing" program
        return

    # create some TODO items
    todo1_id = test_create_todo("Learn React hooks", "Learning")
    todo2_id = test_create_todo("Fix authentication bug", "Debugging")
    todo3_id = test_create_todo("Write API documentation", "Documentation")

    # funtion to display all the TODO items
    test_get_todos()

    # update the first TODO item --> change "status"
    if todo1_id:
        test_update_todo(todo1_id, completed=True)

    # update the second TODO item --> change 'description' and 'category'
    if todo2_id:
        test_update_todo(
            todo2_id, description="Fixed critical auth bug", category="Bug Fix"
        )

    # get all the TODO items again ( to show updated TODO items )
    test_get_todos()

    # if TODO item '3' exists ==> delete it
    if todo3_id:
        test_delete_todo(todo3_id)

    # get all the TODO items again ( to show updated TODO items )
    test_get_todos()


if __name__ == "__main__":
    main()
```

> [!SUCCESS]
>
> I do see all the **correct** 'JSON' output for the creation of 'TODO' items!
>
> Also looking at the `app.db` file with `sqlite3` ( _obviously_ ); I see that I have **one** _user_ and also **two** _todo_ items left.
>
> > [!NOTE]
> > Like before, I am going to delete all the data that we added to the database!

# React Development Setup

We are going to be using Ant Design as much as possible. Therefore, there are some _preparation_ that we are going to have **before** we start doing any real development.

## Download Required Dependencies

- Install Ant Design and 'Axios' package from `npm`:

```bash
# install 'antd' and 'axios'
npm install antd axios
```

> [!NOTE]
>
> - `antd`: Obviously for _pre-made_ designs and templates
> - `axios`: HTTP **client** to make _requests_ to our 'Express.js' **back-end**

### Setup React Project To Use Ant Design

> This is going to basically the exact same thing as we have done in 'React - Getting Started'.

- Add the following line of code to our `src/main.jsx` file:

```jsx
// "reset" all the CSS so that Ant Design can work
import "antd/dist/reset.css";
```

### Check If Main App Is Working

- Delete the **contents** of the following files + Delete unwanted _assets_:

```bash
# NOTE: make sure if you are in the `src/` folder... If not:
cd src

# remove the contents from `App.css` and `index.css` files
rm App.css index.css && touch App.css index.css

# delete the unwanted asset - react image
rm assets/react.svg

# change directory to where the `vite.svg` file is found
# NOTE: change from current working `src/` directory to `public/` folder
cd ../public/

# delete the unwanted asset - vite image
rm vite.svg
```

- Update the `App.jsx` file to check if everything is working correctly:

```jsx
import "./App.css";

function App() {
  return (
    <div>
      <h1
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        TODO Application
      </h1>
    </div>
  );
}

export default App;
```

- Run the development server with the following command:

```bash
# run the development server
npm run dev
```

> [!SUCCESS]
>
> You **should** see that you have the heading 'TODO Application' in the **middle** of your screen!

## Creation Of Folders

- Add the following folders to our `client/src` folder:

```bash
# create the following folders inside of `client/src`
mkdir context components pages services
```

> [!NOTE] What are these folders for?
>
> - `context`: For global state management ( _'current' theme, 'TODOs'_ )
> - `components`: For resuable designs / components ( _buttons, toggles_ )
> - `pages`: For full page views ( _register page, login page_ )
> - `services`: For handling API calls ( _to and from "our"' back-end_ )

### Testing Ant Design

- Update the `src/App.jsx` file to check if Ant Designs are working correctly:

```jsx
// import a 'Card' and 'Button' component from 'antd'
import { Button, Card } from "antd";
import "./App.css";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>TODO Application</h1>

      <Card title="Ant Design Card" style={{ width: "300" }}>
        <p>Working Ant Design Card Component!</p>

        <Button type="primary">Ant Design Test Button</Button>
      </Card>
    </div>
  );
}

export default App;
```

> [!SUCCESS]
>
> Our `antd` is working correctly and I can see the **card** and **button** component on the page!

# Registration - Login Page

## Create Main 'Registration - Login' Page

> [!NOTE] Resource(s)
>
> - <https://react.dev/reference/react/useState>
> - <https://react.dev/learn/conditional-rendering>

We are now going to code our _main_ view for the **registration** - **login** page. The file `AuthPages.jsx` file is going to handle that.

Now, we are going to be creating some **forms** later on that are going to show _either_ the **registration** page or the **login** page.

### Install React Icons

> [!NOTE] Resource(s)
>
> - <https://github.com/react-icons/react-icons>
> - <https://react-icons.github.io/react-icons/>

- Install `react-icons` package using the following command found below:

```bash
# install the cool 'react-icons' library
npm install react-icons
```

### Example Usage

- Example of using the _an_ icon from the `ri` group:

```jsx
// at the top
// import icons from 'react-icons' ( "ri" ) library
import { RiTodoLine } from "react-icons/ri";

// code above
<header className="auth-header">
  <nav className="auth-navbar">
    <RiTodoLine className="auth-logo" />
    <h3 className="auth-text-logo">Act Don't React</h3>
  </nav>
</header>;
// code below
```

## RGB Colour Shifting

I am now going to try to implement the 'RGB' colour shifting / cycle that we used in our 'TODO Application - Pure HTML, CSS and JS' project!

This is the code that we are going to try to replication... Again this was written for that Project.

- This is the `index.html` file and this is **part** of the code:

```html
<!-- user is going to be able to enter his username and should be saved -->
<input id="username" type="text" placeholder="User's Name" />
```

- This is the actual implementation of the 'RGB' colour cycle:

```css
/* create a custom 'hue' property */
@property --hue {
  /* user defined 'HSL' angle / degree */
  syntax: "<angle>";
  /* each element needs to have the 'hue' property added to it */
  inherits: false;
  /* if user does not provide a angle ==> default to '0' */
  initial-value: 0deg;
}

/* define a custom animation called `rgb-cycle` */
@keyframes rgb-cycle {
  /* initial state */
  from {
    --hue: 0deg;
  }
  /* final state */
  to {
    --hue: 360deg;
  }
}

/* add an infinite, always on RGB cycle to the user's name */
#username {
  /* define the intial colour of the text logo */
  color: hsl(var(--hue), 100%, 75%);
  /* the actual animation that will cycle infinitely */
  animation: rgb-cycle 2s linear infinite;
  /* change the font weight to be a little more bold */
  font-weight: 700;
}
```

### Implementation In React

Because I want to be able to **reuse** this effect on other "_things_". Therefore, I am going going to code a `<span>` **component** that can be used and modified using _external_ 'CSS'!

- Create a new component `client/src/components/RGBText.jsx`:

```jsx
function RGBText({ className, spanText }) {
  return <span className={className}>{spanText}</span>;
}

export default RGBText;
```

- Add basically the **same** code to our `client/src/index.css` file:

```css
/* create the custom hue property */
@property --hue {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}

/* define the custom animation called 'rgb-cycle' */
@keyframes rgb-cycle {
  from {
    --hue: 0deg;
  }
  to {
    --hue: 360deg;
  }
}
```

> [!WARNING] I did all of this but I am **not** going to use it
>
> > Yet!
>
> My friend told me that the RGB effect is dumb and **unreadable** in the _light mode_ / theme!
>
> He is telling me to basically when the user is going to switch to the _dark mode_ version... Its then that "_something_" is going to have the 'RGB' cycle effect.

## Logo Animation

I wanted a little animation on the page, there go ahead and add this to your `src/index.css` file:

```css
/* define the custom animation called 'move-up-down' */
@keyframes move-up-down {
  0% {
    transform: translateY(2px);
  }
  50% {
    transform: translateY(-2px);
  }
  100% {
    transform: translateY(2px);
  }
}
```

- Applying that to the whole logo 'Act Don't React':

```css
.auth-navbar:hover,
.auth-navbar:focus-visible {
  animation: move-up-down 1s ease-in-out infinite;
}
```

### Updated Error Message To Use Message Component

Thanks to Girik, I have been able to update my `InputDisplayTodo.jsx` ( _you are going to come across this file later_ ) to add the `message` component by Ant Design.

Therefore, I am here to update the `errorMessage` and `setErrorMessage` to _convert_ them to use `messageApi` instead!

- Import the `message` component from Ant Design:

```jsx
// import components from 'antd'
import { Button, Form, Input, Select, message } from "antd";
```

- Create variable that is going to have access to `.useMessage` from the `message` component:

```jsx
// declare variable to be able to use the `message` component
const [messageApi, contextHolder] = message.useMessage();
```

- Add to all required functions:

> Using `handleLogin` as example...

```jsx
// function to handle the login of users
const handleLogin = async (values) => {
  // change the 'loading' state to true
  setLoading(true);
  try {
    const response = await apiLogin(values);

    // Use context method to set authentication state
    login(response.token);
    console.log(`Values = ${values}`);

    // display a little 'success' message to the user
    console.log("Logged in user:", response.user);

    // navigate to the dashboard route
    navigate("/homepage");
  } catch (error) {
    // if any errors occur during the registration process
    if (error.response) {
      // server side errors
      if (error.response.status === 401) {
        messageApi.open({
          type: "error",
          content: "Invalid credentials",
          duration: 1,
        });

        // if user did not fill the form correctly
      } else if (error.response.status === 400) {
        messageApi.open({
          type: "error",
          content: "Please fill in all required fields",
          duration: 1,
        });
      } else {
        // if anything else happened
        messageApi.open({
          type: "error",
          content: "An error occurred during login",
          duration: 1,
        });
      }

      // requests sent but no response
    } else if (error.request) {
      messageApi.open({
        type: "error",
        content: "Network error - please check your connection",
        duration: 1,
      });
      // if anything else happened
    } else {
      messageApi.open({
        type: "error",
        content: "Invalid Credentials",
        duration: 1,
      });
    }
    console.error("Login error:", error);

    // change the loading status back to `false`
  } finally {
    setLoading(false);
  }
};
```

- Therefore to be able to use it:

```jsx
return (
<>
  {contextHolder}
  // other codes here
</>
```

# Axios API Connection

> [!NOTE] Resource(s)
>
> - <https://axios-http.com/>
> - <https://axios-http.com/docs/intro>

## Create API Service

We are now going to create the API that is going to allow us to connect to the 'Express.js' back-end.

- Create the `client/src/services/api.js` file:

```js
// import the 'axios' library to connect front-end to back-end
import axios from "axios";

// our base URL for the back-end ( API )
const API_BASE_URL = "http://localhost:5000/api";

// create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// add the token to the requests automaticlaly if it exists ( gets the token from local storage )
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  // if the token has not been found --> reject the user's request
  (error) => {
    return Promise.reject(error);
  }
);

// register a new user ( endpoint )
export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Registration failed" };
  }
};

// login a new user ( endpoint )
// NOTE: the `crendentials` parameters is basically the 'JSON' object
export const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Login failed" };
  }
};

// get all TODOs for logged-in user ( endpoint )
export const getTodos = async () => {
  try {
    const response = await api.get("/todos");
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch todos" };
  }
};

// create a new TODO for logged-in user ( endpoint )
export const createTodo = async (todoData) => {
  try {
    const response = await api.post("/todos", todoData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to create todo" };
  }
};

// update ( a ) TODO for logged-in user ( endpoint )
export const updateTodo = async (todoId, todoData) => {
  try {
    const response = await api.put(`/todos/${todoId}`, todoData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to update todo" };
  }
};

// delete ( a ) TODO for logged-in user ( endpoint )
export const deleteTodo = async (todoId) => {
  try {
    const response = await api.delete(`/todos/${todoId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to delete todo" };
  }
};

// export the actual connection
export default api;
```

> [!NOTE] What is this doing?
>
> - Create an 'Axios' instance which is a pre-configured HTTP client
> - Automatically adds the 'JSON' web token ( _if available_ )
>   - If the 'JWT' is **not** available then "_reject_" the user's requests
> - If the user is trying to **register**
>   - Send the `credentials` 'JSON' object to the back-end
> - If the user is trying to **login**
>   - Send the `credentials` 'JSON' object to the back-end
> - Create the required 'TODO' _functions_ that are going to be used later

## Connect React - Forms To API

To be able connect the _forms_ ( "_data_" ) to our back-end; we are going to have to update our `client/src/pages/AuthPages.jsx` file.

- Import `ConfigProvider` and `message` component from `antd` into `main.jsx` file:

```jsx
// import `ConfigProvider` and `message` from 'antd'
import { ConfigProvider, message } from "antd";

// configure message globally
message.config({
  top: 100,
  duration: 3,
  maxCount: 3,
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConfigProvider>
      <App />
    </ConfigProvider>
  </StrictMode>
);
```

- Import `message` component from `antd` into `pages/AuthPages.jsx` file:

```jsx
// import components from 'antd'
import { Button, Form, Input, Select, message } from "antd";
```

- Import the API function itself ( _i.e our `client/src/services/api.js` file_ ):

```jsx
// import the API function that will talk to back-end
import { register, login } from "../services/api";
```

- Create a `loading` state for when the user is going to press the "_respective_" button:

```jsx
// declare "variable" to show 'loading' state
const [loading, setLoading] = useState(false);
```

- Function that are actually going to **use** the `register` and `login` function from `client/src/services/api.js` file:

> Which in turn is going to be making our requests to 'Express.js' back-end

```jsx
// function to handle the registration of users
const handleRegister = async (values) => {
  // change the 'loading' state to true
  setLoading(true);
  try {
    const response = await register(values);

    // once 'crendentials' of user "appeared" ==> save the token for user in local storage
    localStorage.setItem("token", response.token);

    // display a little 'success' message to the user
    message.success("Registration successful!");
    console.log("Registered user:", response.user);

    // BUG: still need to redirect the user
  } catch (error) {
    message.error(error.error || "Registration failed. Please try again.");
    console.error("Registration error:", error);
  } finally {
    setLoading(false);
  }
};

// function to handle the login of users
const handleLogin = async (values) => {
  // change the 'loading' state to true
  setLoading(true);
  try {
    const response = await login(values);

    // once 'crendentials' of user "appeared" ==> save the token for user in local storage
    localStorage.setItem("token", response.token);

    // display a little 'success' message to the user
    message.success("Login successful!");
    console.log("Logged in user:", response.user);

    // BUG: still need to redirect the user
  } catch (error) {
    message.error(error.error || "Login failed. Please try again.");
    console.error("Login error:", error);
  } finally {
    setLoading(false);
  }
};
```

> [!WARNING]
>
> We still need to modify the `handleRegister` and `handleLogin` function to be able to **redirect** the user to the "_home_" page / dashboard.
>
> > The above mentioned step is going to allow us to learn 'React Routing'!

- Update the front-end to make use of these functions and _spinner_ loading:

```jsx
              <Form layout="vetical" onFinish={handleLogin}>
```

```jsx
              <Form layout="vetical" onFinish={handleRegister}>
```

- Updated the **both** `Button` component to add the loading spinner:

```jsx
<Button
  className="register-button"
  type="primary"
  htmlType="submit"
  block
  size="large"
  loading={loading}
>
  Sign Up
</Button>
```

### Testing Front-End And Back-End Connection ( Register / Login )

- Run the **front-end** server:

```bash
# make sure that you are in the `client/` folder
# then run the front-end server
npm run dev
```

- Run the **back-end** server:

```bash
# make sure that you are in the `server/` folder
# then run the back-end server
npm run dev
```

> [!WARNING] It Works But...
>
> The `message` component from `antd` is **not** compatible with the latest version of React!
>
> Therefore the `message` and the `loading` ( _`<Button>` component_ ) attribute is **not** going to work.
>
> > [!SUCCESS]
> > But looking at the actual data, i.e _credentials_ for **registration** and **login**.
> >
> > We are able to use the `AuthPages.jsx`!

## Creation Of Main Page

We are now going to create our main page that's going to be basically the whole web-app.

This page is going to be our "_main_" thing. That is, its going to have:

- Top bar
- User greetings and weather
- TODOs
  - Input
  - Display
- AI
  - Input
  - Display

### Routes

Compared to regular 'HTML' whereby we can use the `href` tag to be able to _go to_ another page.

> Here is completely different as we need to use **routes**!

To be able to _switch_ to other pages, we are going to first install the `react-router-dom` package.

- Install the `react-router-dom` to be able to use routes:

```bash
# install the 'react-router-dom' to be able to "switch" pages
npm install react-router-dom
```

### Create The Actual Dashboard File

- Create the `client/src/pages/Homepage.jsx` file:

```jsx
function Homepage() {
  return (
    <div>
      <h1>Main Page</h1>
      <p>Logged In</p>
    </div>
  );
}

export default Homepage;
```

> [!NOTE]
>
> We are just testing to see if the routing is going to work right now. Its later that we are going to be focusing on the UI!

### Add The Routings

- Update the `client/src/App.jsx` file to be like this:

```jsx
// import required routing component from 'react-router-dom' library
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import our Components
import AuthPages from "./pages/AuthPages";
import Homepage from "./pages/Homepage";

// import a 'Card' and 'Button' component from 'antd'
import "./App.css";

function App() {
  // check if the user has been logged in
  const isAuthenticated = !!localStorage.getItem("token");
  return (
    <BrowserRouter>
      {/* create the individual routes */}
      <Routes>
        {/* route for the login page ( go to homepage if already logged in) */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/homepage" /> : <AuthPages />
          }
        />

        <Route
          element={isAuthenticated ? <Homepage /> : <Navigate to="/" />}
          path="/homepage"
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

- Update the `client/src/pages/AuthPages.jsx` file:

```jsx
// import the `useNavigate` component from 'react-router-dom'
import { useNavigate } from "react-router-dom";

// other codes

  // declare "variable" to show error messages
  const [errorMessage, setErrorMessage] = useState("");

  // ADD THIS
  // declare variable to be able to use the `useNavigate` function
  const navigate = useNavigate();

  // function to handle the registration of users
  const handleRegister = async (values) => {

// other codes

   // USE IT LIKE SO
      // navigate to the dashboard route
      navigate("/homepage");

      // BUG: not really satified with this solution
      window.location.reload();

// other codes

   // USE IT INSIDE `login` NOW
      // navigate to the dashboard route
      navigate("/homepage");
```

> [!WARNING] `window.location.reload()`!
>
> This is really **not** optimal but this is the only that is solving the problem of the route.

#### Using Context To Solve The `window.location.reload()` Issue

> [!NOTE] Resource(s)
>
> - <https://react.dev/reference/react/useContext>
> - <https://legacy.reactjs.org/docs/context.html> ( "_deprecated_" )
> - <https://react.dev/reference/react/useEffect>

> [!TIP] What is a Context?
>
> Before we go ahead an understand what the hell is a 'Context'... We need to first understand what are _props_.
>
> > [!TIP] What are Props?
> >
> > - Parameters!
> >
> > They are simply **parameters** that are passed to _components_. The problem in our "_context_" ( _get it... our context..._ ), they are many places where we _would_ need to pass parameters into parameters.
> >
> > Therefore, this is the main reason as to why we use **contexts**. Think of them like _global state management_.
>
> A **context** is going to allow us to **share** data to _multiple_ components ( _without the use of props_ )!
>
> In this case, we are going to use a _global_ state that is going to handle the **creation** and **deletion** of the `token` in our `localStorage` by providing us with _functions_ to be able to do so!

- Create `client/src/contexts/AuthContext.jsx` file:

```jsx
// import the required "routing" component from the 'react' library
import React, { createContext, useContext, useState, useEffect } from "react";

// create the context for the authentication
const AuthContext = createContext();

// Custom hook to use the AuthContext
// own custom 'hook' that is going to use the `AuthContext` context
export const useAuth = () => {
  // create another context inside of `useAuth`
  const context = useContext(AuthContext);

  // if not found within and 'AuthProvider'
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// the actual 'AuthProvider' resuable component
export const AuthProvider = ({ children }) => {
  // declare variables that is going to check if `token` key exists in local storage
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  // get the value of the `token` from the local storage
  const [token, setToken] = useState(localStorage.getItem("token"));

  // function to login the user
  const login = (token) => {
    // if the `token` value actually exists --> set the token key to the `token` value
    localStorage.setItem("token", token);

    // set the token to our variable
    setToken(token);

    // mark the user as ( actually ) authenticated
    setIsAuthenticated(true);
  };

  // function to login the user
  const logout = () => {
    // if the `token` value actually exists --> remove the token key-value pair
    localStorage.removeItem("token");

    // set the token variable to `null`
    setToken(null);

    // user has logged out from the application
    setIsAuthenticated(false);
  };

  // function to check the aunthentication status of the user
  const checkAuthStatus = () => {
    // get the value of the `token` key from local storage
    const token = localStorage.getItem("token");

    // change the token value to the current `token` value
    setToken(token);

    // check if the use is actually authenticated based on `token` value
    setIsAuthenticated(!!token);
  };

  // use the `useEffect` function / component to be able to see external changes from local storage
  useEffect(() => {
    // function that is going to check if there has been a change to local storage
    const handleStorageChange = () => {
      // call the above function to check changes from local storage
      checkAuthStatus();
    };

    // listen to the `storage` for changes
    window.addEventListener("storage", handleStorageChange);

    // remove that event listener when completed
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // allow others to use the `value` object
  const value = {
    isAuthenticated,
    token,
    login,
    logout,
    checkAuthStatus,
  };

  // setup `AuthProvider` so that all components are able to use context
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

- Update our `client/src/pages/Homepage.jsx` file:

```jsx
// import the `useAuth` function from `AuthContext.jsx`
import { useAuth } from "../contexts/AuthContext";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

function Homepage() {
  // get the `logout` function
  const { logout } = useAuth();
  // variable that is going to allow us to navigate to other pages
  const navigate = useNavigate();

  // function to be able to logout the user
  const handleLogout = () => {
    // call the logout function
    logout();

    // go back to the login - register page
    navigate("/");
  };

  return (
    <div>
      {/* display button to be able to logout user */}
      <h1>Main Page</h1>
      <p>Logged In</p>
      <Button onClick={handleLogout} type="primary">
        Logout
      </Button>
    </div>
  );
}

export default Homepage;
```

- Update our `client/src/pages/AuthPages.jsx` file:

```jsx
// import the AuthContext
import { useAuth } from "../contexts/AuthContext";

// other codes above

// get authentication functions from context
const { login } = useAuth();

// function to handle the registration of users
const handleRegister = async (values) => {
  // change the 'loading' state to true
  setLoading(true);
  // clear any previous error message
  setErrorMessage("");
  try {
    const response = await register(values);

    // Use context method to set authentication state
    login(response.token);

    // display a little 'success' message to the user
    console.log("Registered user:", response.user);

    // navigate to the dashboard route
    navigate("/homepage");
  } catch (error) {
    // if any errors occur during the registration process
    if (error.response) {
      // server side errors
      if (error.response.status === 400) {
        setErrorMessage(
          error.response.data.error ||
            "Registration failed - Please check your information"
        );
      } else {
        setErrorMessage("An error occurred during registration");
      }

      // requests sent but no response
    } else if (error.request) {
      setErrorMessage("Network error - please check your connection");

      // if anything else happened
    } else {
      setErrorMessage("An unexpected error occurred");
      setErrorMessage("Test");
    }

    // log the error to the console
    console.error("Registration error:", error);
  } finally {
    // change the loading status back to `false`
    setLoading(false);
  }
};

// function to handle the login of users
const handleLogin = async (values) => {
  // change the 'loading' state to true
  setLoading(true);
  // clear any previous error message
  setErrorMessage("");
  try {
    const response = await apiLogin(values);

    // Use context method to set authentication state
    login(response.token);
    console.log(`Values = ${values}`);

    // display a little 'success' message to the user
    console.log("Logged in user:", response.user);

    // navigate to the dashboard route
    navigate("/homepage");
  } catch (error) {
    // if any errors occur during the registration process
    if (error.response) {
      // server side errors
      if (error.response.status === 401) {
        setErrorMessage("Invalid credentials");
        // if user did not fill the form correctly
      } else if (error.response.status === 400) {
        setErrorMessage("Please fill in all required fields");
      } else {
        // if anything else happened
        setErrorMessage("An error occurred during login");
      }

      // requests sent but no response
    } else if (error.request) {
      setErrorMessage("Network error - please check your connection");
      // if anything else happened
    } else {
      setErrorMessage("Invalid Credentials");
    }
    console.error("Login error:", error);
  } finally {
    setLoading(false);
  }
};

// other codes below
```

- Update our `client/src/App.jsx` file:

```jsx
// import required routing component from 'react-router-dom' library
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import our Components
import AuthPages from "./pages/AuthPages";
import Homepage from "./pages/Homepage";

// import AuthContext
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// import a 'Card' and 'Button' component from 'antd'
import "./App.css";

// Component to handle routing with auth context
function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* route for the login page ( go to homepage if already logged in) */}
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/homepage" /> : <AuthPages />}
      />

      <Route
        element={isAuthenticated ? <Homepage /> : <Navigate to="/" />}
        path="/homepage"
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
```

# Main Pages Components

## Creating The MVP

We are now going to create basically the main _thing_ of our application.

### Our Main ( Home ) Page

I am now going to be updating our `client/src/pages/Homepage.jsx` file, but because the file is really long ( _that's what she said_ ). I am **not** going to be _pasting_ the whole thing here!

> Instead of I am just going to show you parts of it!

- Our required imports:

```jsx
// import the `useEffect` and `useState` hooks from 'react'
import { useEffect, useState } from "react";

// import the `useAuth` function from `AuthContext.jsx`
import { useAuth } from "../contexts/AuthContext";

// import the following components from 'antd'
import { Button, Card, Checkbox, Form, Input, List, Select } from "antd";

// import the API function that will talk to back-end
import { createTodo, getTodos, updateTodo, deleteTodo } from "../services/api";

// import the `useNavigate` component from 'react-router-dom'
import { useNavigate } from "react-router-dom";

// import the styling the for our homepage component
import "./Homepage.css";
```

- Definition / Declaration of variables ( _inside the "main" `Homepage()` function_ ):

```jsx
// get the `logout` function
const { logout } = useAuth();

// variable that is going to allow us to navigate to other pages
const navigate = useNavigate();

// states for our TODO items
const [todos, setTodos] = useState([]);
const [todoFetchLoading, setTodoFetchLoading] = useState(false);
const [form] = Form.useForm();
```

- Functions defined inside of `Homepage()`:

```jsx
// function that is going to fetch / get TODOs from the database
const fetchTodos = async () => {
  setTodoFetchLoading(true);

  try {
    // get the response / TODO ( `id` ) from the database
    const response = await getTodos();

    // get the user's TODOs if not present return an empty list
    setTodos(response.todos || []);

    // if some error while fetching TODOs occurs
  } catch (error) {
    console.error(`Error while fetching TODOs: ${error}`);

    // change the loading status back to `false`
  } finally {
    setTodoFetchLoading(false);
  }
};

// fetch the TODOs when the components loads up ( from the database )
useEffect(() => {
  fetchTodos();
}, []);

const handleCreateTodo = async (values) => {
  try {
    // wait for the database to finish writing TODO items
    const response = await createTodo(values);

    // display a little message inside the console
    console.log("Todo Created");

    // add the new TODO item to the list ==> to be rendered out
    setTodos([response.todo, ...todos]);

    // create the form for new input of TODO item
    form.resetFields();

    // if there was any errors while creation of TODO item
  } catch (error) {
    console.error(`Error while creating TODOs: ${error}`);
  }
};

// function to "check-off" TODO items
const handleToggleComplete = async (todoId, currentStatus) => {
  try {
    // run the `updateTodo` function and "inverse" the current `completed` status
    const response = await updateTodo(todoId, {
      completed: !currentStatus,
    });

    // update "that" TODO item in the list using its `id`
    setTodos(todos.map((todo) => (todo.id === todoId ? response.todo : todo)));

    // display a little message
    console.log("Todo Updated ( Check Off Function )");

    // if any error happends when "checking-off" a TODO item
  } catch (error) {
    console.error(`Error updating todo: ${error}`);
  }
};

// function to delete TODO items
const handleDeleteTodo = async (todoId) => {
  try {
    // run the `deleteTodo` function on a specific TODO item
    await deleteTodo(todoId);

    // Remove todo from the list
    setTodos(todos.filter((todo) => todo.id !== todoId));

    // display a little message
    console.log("Todo deleted!");

    // if there are any errors that occurs during deletion
  } catch (error) {
    console.error(`Error deleting todo: ${error}`);
  }
};

// function to be able to logout the user
const handleLogout = () => {
  // call the logout function
  logout();

  // go back to the login - register page
  navigate("/");
};
```

- The Main 'JSX' _front-end_ part:

```jsx
return (
  <div className="homepage-container">
    {/* Simple header with logout */}
    <div className="homepage-header">
      <h1>My TODOs</h1>
      <Button onClick={handleLogout} danger>
        Logout
      </Button>
    </div>

    {/* Create TODO Form */}
    <Card title="Create New TODO" style={{ marginBottom: "20px" }}>
      <Form form={form} layout="vertical" onFinish={handleCreateTodo}>
        <Form.Item
          name="description"
          label="What do you need to do?"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <Input.TextArea placeholder="E.g., Fix the login bug..." rows={3} />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select placeholder="Select category">
            <Select.Option value="Code Review">Code Review</Select.Option>
            <Select.Option value="Coding">Coding</Select.Option>
            <Select.Option value="Debugging">Debugging</Select.Option>
            <Select.Option value="Deployment">Deployment</Select.Option>
            <Select.Option value="Documentation">Documentation</Select.Option>
            <Select.Option value="Learning">Learning</Select.Option>
            <Select.Option value="Meeting">Meeting</Select.Option>
            <Select.Option value="Miscellaneous">Miscellaneous</Select.Option>
            <Select.Option value="Planning">Planning</Select.Option>
            <Select.Option value="Refactoring">Refactoring</Select.Option>
            <Select.Option value="Testing">Testing</Select.Option>
          </Select>
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Add TODO
        </Button>
      </Form>
    </Card>

    {/* TODO List */}
    <Card title={`My TODOs (${todos.length})`}>
      {todoFetchLoading ? (
        <p>Loading todos...</p>
      ) : todos.length === 0 ? (
        <p style={{ textAlign: "center", color: "#999" }}>
          No todos yet. Create your first one above! 📝
        </p>
      ) : (
        <List
          dataSource={todos}
          renderItem={(todo) => (
            <List.Item
              actions={[
                <Button
                  danger
                  size="small"
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  Delete
                </Button>,
              ]}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  width: "100%",
                }}
              >
                <Checkbox
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo.id, todo.completed)}
                  style={{ marginRight: "12px" }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      textDecoration: todo.completed ? "line-through" : "none",
                      color: todo.completed ? "#999" : "#000",
                    }}
                  >
                    {todo.description}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginTop: "4px",
                    }}
                  >
                    Category: {todo.category}
                  </div>
                </div>
              </div>
            </List.Item>
          )}
        />
      )}
    </Card>
  </div>
);
```

## Creating A New Branch

Given that we now have our 'MVP'; I am going to create a new branch whereby I can _break_ the `Homepage.jsx` file and then learn a bit on my own instead of relying / understanding codes that 'LLMs' are giving me.

- Create a new branch ( _and switch to it_ ) with the name `test`:

```bash
# create a new branch named `test`
git switch -c test
```

- Push the local `test` branch to **remote**:

```bash
# commit the changes
git commit -m "Initial commit on `test` branch"

# push the changes / whole branch
git push -u origin test
```

---

# Learn How To Use Postman

> Not the guy that delivers your letters!

> [!NOTE] Resource(s)
>
> - <https://www.postman.com/>

> [!TIP]
>
> Instead of using Python scripts to _test_ our **outputs**... We can simply use a powerful tool like 'Postman' to be able to get these **same** _outputs_ but in a more clean and effective way.
>
> Also its good that every one in their mother know how to use this!

## Login Post Requests

- Given that this is our **base URL** ( _server side's "port"_ ):

```console
http://localhost:5000
```

Let us say that we now want to know the 'JSON' output that we get when the `test` user logs into our web-app. Here are the steps that you should follow to be able to do just that.

- Make sure that you are doing a <span style="color: #FEE37E;">POST</span> request
- Endpoint URL: `http://localhost:5000/api/auth/login`
- Change the `Content-Type` from `text/plain` to `application/json` ( _simply create another key pair value_ )
- Add the following content to the body:

  ```json
  {
    "username": "test",
    "password": "1234"
  }
  ```

- Simply press the <button>Send</button> button
- Therefore you should see something like this:

  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsInVzZXJuYW1lIjoidGVzdCIsImlhdCI6MTc2MzAxMTE3OCwiZXhwIjoxNzYzNjE1OTc4fQ.71ryQevORVhAzXUa5cMsbzszYDObdJwPATPiy_zSI80",
    "user": {
      "id": 5,
      "username": "test",
      "email": "test@gmail.com",
      "gender": "male"
    }
  }
  ```

> [!NOTE]- We are going to be using that `token`!
>
> We are going to be using this very `token` value that we got:
>
> ```console
> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsInVzZXJuYW1lIjoidGVzdCIsImlhdCI6MTc2MzAxMTE3OCwiZXhwIjoxNzYzNjE1OTc4fQ.71ryQevORVhAzXUa5cMsbzszYDObdJwPATPiy_zSI80
> ```

## TODO Get Requests

Similarly, let's say that we want to be able to list out all the 'TODO' items that a user has created; therefore, we can make a `GET` requests to _that_ endpoint and therefore get all the 'TODO' item created by that user.

Follow the steps below to be able to achieve this:

- Make sure that you are doing a <span style="color: #6BDD9A;">GET</span> request
- Endpoint URL: `http://localhost:5000/api/todos`
- Change the `Content-Type` from `text/plain` to `application/json` ( _simply create another key pair value_ )
- Change the 'Authorization' **type** to be 'Bearer Token'

  - Then simply paste the user's _token_ value there!

- Therefore in my case, I see this as output:

```json
{
  "message": "Todos retrieved successfully",
  "count": 2,
  "todos": [
    {
      "id": 5,
      "description": "Test's Coding TODO Item\n\n- Create a new branch\n- Push new branch to remote",
      "category": "Deployment",
      "completed": 0,
      "created_at": "2025-11-13 04:48:46",
      "updated_at": "2025-11-13 04:48:46",
      "user_id": 5
    },
    {
      "id": 4,
      "description": "Test's TODO Item",
      "category": "Testing",
      "completed": 1,
      "created_at": "2025-11-13 04:48:14",
      "updated_at": "2025-11-13 04:48:14",
      "user_id": 5
    }
  ]
}
```

# Create Username Component

I am now going to create a "_username_" component that's going to fetch **display** the user's _username_. Originally, I was just going to make / use a simple `<input>` tag.

But there is a massive issue with this... "_Why do that_?". We already have the user's _username_ in the **database**. Therefore we are going to create another controller ( _remember its just a function interacting with database_ ) and make its specific **route** whereby the front-end is going to _hit_ that **endpoint**.

## Back-End / Express.JS

- Create the `server/controller/userController.js` file:

```js
// import the required knex 'server' to 'database' connection
const db = require("../db/knex");

// asynchronous function that will fetch the user's username
const getUserProfile = async (req, res) => {
  try {
    // get the user's ID from the user ( using authentication token )
    const userId = req.user.userId;

    // get the user's profile from the database
    const userProfile = await db("user")
      .select("id", "username", "gender", "created_at")
      .where({ id: userId })
      .first();

    // if the user has not been found ( on the database )
    if (!userProfile) {
      // send the famous, famous '404' error
      return res.status(404).json({
        error: "User not found",
      });
    }

    // send the whole user ( profile ) data as the response
    res.json({
      message: "User profile successfully retrieved",
      user: {
        id: userProfile.id,
        username: userProfile.username,
        gender: userProfile.gender,
        createdAt: userProfile.created_at,
      },
    });

    // if the user could not be authenticated
    // NOTE: status code = '500' ==> internal server error
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({
      error: "Server error during login",
    });
  }
};

// export the function to be used by others
module.exports = {
  getUserProfile,
};
```

- Create the `server/routers/userRouters.js` file:

```js
// import the 'express' library and function for user at endpoint
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// NOTE: get the 'Authentication Token' as 'TODO' items are "private" to each user
const { authenticateToken } = require("../middleware/authMiddleware");

// get the user profile details
router.get("/user", authenticateToken, userController.getUserProfile);

// export the actual routes ( `/api/user/{functionName}` )
module.exports = router;
```

- Update the `server/server.js` file:

```js
// other imports above

// import our routers
const authRouter = require("./routers/authRouters.js");
const todoRouter = require("./routers/todoRouters.js");
const userRouter = require("./routers/userRouters.js");

// other codes below

// authentication routes
app.use("/api/auth", authRouter);

// todo routers
app.use("/api/todos", todoRouter);

// user routers
app.use("/api/user", userRouter);

// other codes below
```

### Testing With Postman

We know that the **base** URL is going to be `http://localhost:5000/api/user`. Therefore, we just need to make a `GET` request and we **should** see the user details.

Additionally, as this is a _protected_ area; we are going to have to add the 'Bearer Token' to Postman. Given that I am already logged in the browser, I am just going to head to the local storage and _yoink_ that `token` value there.

- This is what I get for _my_ user when I do a `GET` request:

```json
{
  "message": "User profile successfully retrieved",
  "user": {
    "id": 5,
    "username": "test",
    "gender": "male",
    "createdAt": "2025-11-13 04:47:50"
  }
}
```

## Front-End / React

- Create / _Update_ our `client/src/components/Username.jsx` file:

```jsx
// import the `useState` and `useEffect` function from 'react' library
import { useEffect, useState } from "react";

// import the API function that will talk to back-end
import { getUserProfile } from "../services/api";

function Username({ className }) {
  // declare variable that is going to hold the username
  const [username, setUsername] = useState("");

  // declare variable to keep track of "loading"
  const [userFetchLoading, setUserFetchLoading] = useState(true);

  // function that is going to fetch / get user details from the database
  const fetchProfile = async () => {
    try {
      const response = await getUserProfile();

      setUsername(response.user.username);

      // if the user profile / username could not be fetch from database
    } catch (error) {
      console.error(`Failed to fetch user's username: ${error}`);

      // if the data could not be retrieved
    } finally {
      setUserFetchLoading(false);
    }
  };

  // fetch the TODOs when the components loads up ( from the database )
  useEffect(() => {
    fetchProfile();
  }, []);

  // conditional way to display the username
  if (userFetchLoading) {
    // if the username has been NOT retrieved
    return <span className={className}>Loading...</span>;
  }

  // else if the username HAS been retrieved from the database
  return <span className={className}>{username}</span>;
}

// export as reusable component
export default Username;
```

- Test our component by simply adding it ( _in a random place_ ) in our `client/src/pages/Homepage.jsx` file:

```jsx
<h1>
  <Username />
</h1>
```

### Update: Adding Greetings

Remember how we add a "_random greetings_" in our "_pure_" 'HTML', 'CSS' and 'JS' TODO project?

> For more information visit the file / note: 'TODO Application - Pure HTML, CSS and JS'

Therefore I am going to be **updating** our `<Username />` component to basically be the same as the above.

- Create the actual `greetings` list and random ( index ) variable:

```jsx
// declare array of "greetings"
const greetings = [
  "Welcome Back",
  "Hello",
  "Hi",
  "Hey",
  "Greetings",
  "Howdy",
  "Salutations",
  "Good day",
  "Aloha",
  "Bonjour",
  "Hola",
  "G'day",
];

// get a random number ( upper bound ==> length of array )
const greetIndex = Math.floor(Math.random() * greetings.length);
```

- Therefore updated our _last_ `return` statement:

```jsx
// else if the username HAS been retrieved from the database
return (
  <span className={className}>
    {greetings[greetIndex]} {username}
  </span>
);
```

> [!SUCCESS]
>
> Therefore you should see that there are some _greetings_ that are shown **before** the username and if you refresh the page.
>
> You should see that the _greetings_ changes!

# Create Profile Picture - Drop Down Menu Component

> [!NOTE] Resource(s)
>
> - <https://www.youtube.com/watch?v=zQ2kqc0eep8>
> - <https://react.dev/reference/react/useRef>
> - <https://react.dev/reference/react/useRef#manipulating-the-dom-with-a-ref>

> [!WARNING] Only showing parts of it!!!
>
> Please refer to the actual `ProfileMenu.jsx` for the whole implementation. I am only going to be showing _pieces_ of it here!

## Make It Behave Like Ant Design's Component

As you already know by now; Ant Design provides us with **premade** designs. But we can easily use the `className` attribute to be able to further customise.

> I don't really need to do this but I want to learn how to do this!

So I want to have a **predefined** styling and then we can also change the styling somewhere else. Given that I know that we have to use the `||` / "_or_" syntax but I don't really know how to actually code it. Therefore, I asked [Gemini](https://gemini.google.com) from [opencode](https://opencode.ai/) to show me hows its done.

> I am basically updating my code to allow _handling_ the different class names.

```jsx
// declare variable that is going to handle the "custom" `className`
const customClassName = `profile-menu-component ${className || ""}`.trim();

return <div className={customClassName} {...props}></div>;
```

As you can see, we use `...props` with the _spread_ operator that is going to allow us to pass **multiple** _arguments_.

> The "_thing_" that is related to the parent-child passing down of arguments.

As you can see we are using a default `className` of `profile-menu-component` if the _place_ we are using that component does **not** add any custom `className`; then its going to use the _default_ styling of `ProfileMenu.jsx`.

But if the user is enters a "_custom_" class name of `custom-profile-thing`; then the `className` is going to actually be `profile-menu-component custom-profile-thing`.

> Yes! Yes you can do this!

In 'CSS', we know that ( _I found that from using Django_ ) the **order** of the actual _stylesheet_ is important.

> For example, the `src/index.css` file is going to have **precedence** over `App.css`!

But you can do something similar with this using `className`. Additionally, this is <strong><span style="color: red;">not</span></strong> a 'React' specific syntax. This actually exists in simple 'CSS'!

> "_The more you know..._"

## Making The Card

This is how we made the contents / components to be shown inside the card.

```jsx
// other codes above

// get the `logout` function
const { logout } = useAuth();

// variable that is going to allow us to navigate to other pages
const navigate = useNavigate();

// function to be able to logout the user
const handleLogout = () => {
  // call the logout function
  logout();

  // go back to the login - register page
  navigate("/");
};

// declare the menus that are going to be present upon hover / click
const profileMenus = [
  <Button onClick={handleLogout} danger>
    Logout
  </Button>,
];

// other codes here

<div className="profile-menu-card" ref={profileMenusRef}>
  <ul>
    {profileMenus.map((menuItem) => (
      <li
        className="profile-menu-items"
        key={menuItem}
        onClick={() => setOpen(false)}
      >
        {menuItem}
      </li>
    ))}
  </ul>
</div>;

// other codes below
```

This is how we made the _card_ to show on **mouse hover** and also on **mouse click** and also close _only_ on **mouse click**.

```jsx
// other codes above

// variable to check if profile is opened
const [open, setOpen] = useState(false);

// create "reference" to the DOM for the whole menu and image
const profileMenusRef = useRef(null);
const imageRef = useRef(null);

// function that is going to make use of `useEffect` to be able to close menu when click elsewhere
const handleOutsideClick = (e) => {
  if (profileMenusRef.current && imageRef.current) {
    if (
      !profileMenusRef.current.contains(e.target) &&
      !imageRef.current.contains(e.target)
    ) {
      setOpen(false);
    }
  }
};

// talk to the browser / external resources
useEffect(() => {
  // close the profile "card" if already open
  document.addEventListener("click", handleOutsideClick);

  return () => {
    document.removeEventListener("click", handleOutsideClick);
  };
}, []);

return (
  <div className={customClassName} {...props}>
    <img
      ref={imageRef}
      className="profile-picture"
      src={profilePicture}
      onClick={() => setOpen(!open)}
      onMouseOver={() => setOpen(!open)}
    />

    {open && (
      <div className="profile-menu-card" ref={profileMenusRef}>
        <ul>
          {profileMenus.map((menuItem) => (
            <li
              className="profile-menu-items"
              key={menuItem}
              onClick={() => setOpen(false)}
            >
              {menuItem}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

// other codes below
```

### Toggle Page Width

Given that in our `index.css` file we have the following:

```css
/* style the whole HTML tag */
html {
  max-width: 100%;
  margin: auto;
}
```

If you go ahead and play with the `max-width` property; you are going to see that _whole_ `Homepage.jsx` page is going to be more in the **middle**.

Therefore, I want to update our profile menu so that it has a _settings_ to be able to toggle the width from 70% to 100% and back.

- Update `client/src/index.css` file add variable for page width:

```css
/* add variable to 'root' */
:root {
  /* other codes */
  --page-width: 100%;
}

/* other codes */

/* update styling for 'html' property */
/* style the whole HTML tag */
html {
  max-width: var(--page-width);
  margin: auto;
}
```

- Create the function that will interact with our "_root_" in our `ProfileMenu.jsx` file:

```jsx
// function to be able to toggle the whole width of the page
const handleWidthToggle = () => {
  // current value of `--page-width` variable
  const currentWidth = getComputedStyle(document.documentElement)
    .getPropertyValue("--page-width")
    .trim();

  // compare current value to "set" value ( by first setting the initial value with `currentWidth`)
  const setWidth = currentWidth === "100%" ? "80%" : "100%";

  // change the value of the width by setting the new value
  document.documentElement.style.setProperty("--page-width", setWidth);
};

// declare the menus that are going to be present upon hover / click
const profileMenus = [
  <p onClick={handleLogout}>Logout</p>,
  // Add the following line below
  <p onClick={handleWidthToggle}>Toggle Width</p>,
];
```

### Show Only On Big Devices

When looking at the page from a small devices such as a smartphone, if we use our newly created 'Toggle Width' "_button_", it just messes with everything.

Because my 'CSS' styling for _responsiveness_ is pretty good right now. I don't want to touch it. Hence, I was thinking that we should completely remove the 'Toggle Width' button on 'non-desktop' computers.

- Create a new folder called 'hooks' under `src`:

```bash
# NOTE: make sure that you are in the 'client/src' folder

# create a new folder 'hooks'
mkdir hooks
```

- Create `client/src/hooks/useMediaQuery.js` file:

```js
// import the `useEffect` and `useState` hooks from 'react'
import { useState, useEffect } from "react";

// custom hook that takes a string ( a CSS media query )
export const useMediaQuery = (query) => {
  // set the initial value to that query
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  // listen to any changes made to `query`
  useEffect(() => {
    const media = window.matchMedia(query);

    const listener = (e) => {
      setMatches(e.matches);
    };

    // add an event listener that is going to respond to change
    media.addEventListener("change", listener);

    // remove the event listener once complete
    return () => media.removeEventListener("change", listener);
  }, [query]);

  // returnn the actual value
  return matches;
};
```

- Therefore, update our `ProfileMenu.jsx` file:

> [!WARNING] Completed Changed!
>
> Please refer to the actual `ProfileMenu.jsx` file in the code as there has been many _good_ changes.

> [!SUCCESS]
>
> Now the 'Toggle Width' button only shows when the user is on a big screen!

# Toggle Theme ( Button / Toggle )

> [!NOTE] Resource(s)
>
> - <https://react.dev/reference/react/createContext>
> - <https://react.dev/reference/react/useContext>

Most people from what I can see on YouTube ( _by most I mean the popular videos_ ) are using 'DOM' to be able to access them. But one of the developers told me that it's going to be better if I use **contexts**.

> [!NOTE]
>
> The **official** documentation also provides and example of '_Toggle Theme_'.
>
> > See above links!
>
> So this is what I am going to be using then...

## Theme Context

- Create the `client/src/contexts/ThemeContext.jsx` file:

```jsx
// import the required components from the 'react' library
import { createContext, useContext, useState, useEffect } from "react";

// create the context for the theme
const ThemeContext = createContext(null);

// own custom 'hook' that is going to use the `ThemeContext` context
export const useTheme = () => {
  // use the context inside of `useTheme`
  const context = useContext(ThemeContext);

  // if not found within and 'ThemeProvider'
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  // return the context globally
  return context;
};

// the actual `ThemeProvider` resuable component
export const ThemeProvider = ({ children }) => {
  // declare variables that is going to check if `theme` key exists in local storage
  const [theme, setTheme] = useState(() => {
    // if `theme` key does not exists ==> set the `theme` variable ( or key ) to 'light'
    return localStorage.getItem("theme") || "light";
  });

  // function to be able to toggle the theme ==> main function to be used by components
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // use the `useEffect` function / component to be able to see external changes from local storage
  useEffect(() => {
    // change / update the `theme` key with the current value / theme
    localStorage.setItem("theme", theme);

    // change the styling of the actual 'HTML' tags to use the "proper" colours
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  // allow others to use the `value` object
  const value = { theme, toggleTheme };

  // setup `ThemeProvider` so that all components are able to use context
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
```

- Update our `client/src/main.jsx` file to use the `ThemeProvider`:

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// import `ConfigProvider` from 'antd'
import { ConfigProvider } from "antd";

// import ThemeContext
import { ThemeProvider } from "./contexts/ThemeContext";

// "reset" all the CSS so that Ant Design can work
import "antd/dist/reset.css";

import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConfigProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ConfigProvider>
  </StrictMode>
);
```

## Create Actual Toggle Theme Component

> [!NOTE] Resource(s)
>
> - <https://react-icons.github.io/react-icons/>

- This is the implementation of the `ToggleTheme.jsx` component:

```jsx
// import the `Button` component from 'antd'
import { Button } from "antd";

// import the `useAuth` function from `AuthContext.jsx`
import { useTheme } from "../contexts/ThemeContext";

// import icons from 'react-icons' ( "ai" ) library
import { AiFillMoon, AiFillSun } from "react-icons/ai";

// add the required styling to toggle theme button
import "./ToggleTheme.css";

function ToggleTheme({ className }) {
  // get the `theme` and `toggleTheme` function
  const { theme, toggleTheme } = useTheme();

  // function to be able to toggle the theme
  const handleToggleTheme = () => {
    // call the `toggleTheme` function
    toggleTheme();
  };

  // the actual component that is going to be returned
  return (
    <Button
      // implement the "custom" 'antd' class name
      className={`theme-toggle-button ${className || ""}`.trim()}
      onClick={handleToggleTheme}
      icon={theme === "light" ? <AiFillSun /> : <AiFillMoon />}
      type="primary"
      size="large"
    >
      {/* "write" 'Light' when on light theme and vice versa ( for dark theme ) */}
      {theme === "light" ? "Light" : "Dark"}
    </Button>
  );
}

// export as reusable component
export default ToggleTheme;
```

- Styling for the `ToggleTheme` component:

```css
.theme-toggle-button {
  min-width: 5rem;
  height: 2.3rem;
  background-color: var(--primary);
  color: white;
  border: none;
  transition: var(--transition);
}

.theme-toggle-button:hover {
  background-color: var(--secondary);
  transform: scale(1.05);
}

.theme-toggle-button:active {
  transform: scale(0.95);
}

.theme-toggle-button .anticon {
  font-size: 1.2rem;
}
```

# Create TODO Form Component

## But Before Ant Design

Originally, I was using Ant Design's components for things like the 'Logout'. But then I implemented the 'Toggle Theme' button.

> Switching the page to 'Dark Mode'; The Ant's component did **not** switch!

Therefore, I reverted back to using simple `<li>` and `<p>` tags. But then the developers told me that there is a way to be able to do that and given that I already have my `ThemeContext.jsx` file in my 'contexts' folder... [ChatGPT](https://chat.openai.com).

- Create the `src/AppWithProviders.jsx` file:

```jsx
// import `ConfigProvider`, `antdTheme` component, hook from 'antd'
import { ConfigProvider, theme as antdTheme } from "antd";

// import the theme provider and custom hook from 'ThemeContext.jsx'
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";

// import the actual "main" react application
import App from "./App.jsx";

// get the required algorithm from 'antd'
const { defaultAlgorithm, darkAlgorithm } = antdTheme;

function AntdThemedApp() {
  // get the current theme
  const { theme } = useTheme();

  return (
    <ConfigProvider
      theme={{
        // switch the theme for the 'antd' components depending on the current theme
        algorithm: theme === "dark" ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <App />
    </ConfigProvider>
  );
}

// return the function that is going to wrap everything
export default function AppWithProviders() {
  return (
    <ThemeProvider>
      <AntdThemedApp />
    </ThemeProvider>
  );
}
```

- Update our `main.jsx` file:

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// "reset" all the CSS so that Ant Design can work
import "antd/dist/reset.css";

import "./index.css";

// import the actual react application
import AppWithProviders from "./AppWithProviders.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppWithProviders />
  </StrictMode>
);
```

> [!SUCCESS]
>
> Therefore, you should see that even the Ant Design components are going to switch to the _correct_ 'Dark Mode'.
>
> > [!NOTE]
> > Now, I have gone and updates all of the places ( _mostly inside of `client/src/AuthPages.jsx`_ ) whereby I have hard coded some colours as our theme is currently "_per browser_".
> >
> > Meaning that if the user switches to 'Dark Mode'; then the `AuthPages.jsx` is also going to **switch** to the dark variant.

> [!WARNING]
>
> The `InputDisplayTodo.jsx` file is getting to big ( _that's what she said_ ). Therefore, I will suggest you to look at the code itself as its basically front-end stuff and using components from 'Ant Design'.
>
> > [!NOTE] Nevertheless...
> > Here are some of the things that we implemented:
> >
> > - Custom 'TODO' input component
> > - Custom heading for 'TODO' count
> > - Custom component for displaying 'TODO'

## The Select Component And Back-End Category

Currently for the 'TODO' `category`, I am asking the user to select from a _number of items_ that we have from the database but not really!

- This is the `.enu` that is used inside the `server/db/migrations/<DateTime>_create_todos_table.js` file:

```js
table
  .enu("category", [
    "Code Review",
    "Coding",
    "Debugging",
    "Deployment",
    "Documentation",
    "Learning",
    "Meeting",
    "Miscellaneous",
    "Planning",
    "Refactoring",
    "Testing",
  ])
  .defaultTo("Miscellaneous");
```

- Therefore in the front-end over at `client/src/components/InputDisplayTodo.jsx`, we are using the `Select` component from 'antd':

```jsx
<Select placeholder="Select category">
  <Select.Option value="Code Review">Code Review</Select.Option>
  <Select.Option value="Coding">Coding</Select.Option>
  <Select.Option value="Debugging">Debugging</Select.Option>
  <Select.Option value="Deployment">Deployment</Select.Option>
  <Select.Option value="Documentation">Documentation</Select.Option>
  <Select.Option value="Learning">Learning</Select.Option>
  <Select.Option value="Meeting">Meeting</Select.Option>
  <Select.Option value="Miscellaneous">Miscellaneous</Select.Option>
  <Select.Option value="Planning">Planning</Select.Option>
  <Select.Option value="Refactoring">Refactoring</Select.Option>
  <Select.Option value="Testing">Testing</Select.Option>
</Select>
```

> [!NOTE]
>
> I am also doing this for the `Modal` component when we are **editing** a 'TODO' item!

Speaking and showing my code to one of the developers, he was like "_Why are you doing that_?", "_Why are you hard-coding the values_?". He is telling to basically "_automate_" the process of **adding** more categories.

Currently, if I was to **change** or **add** another _category_... I would first have to update the _migration file_ and then make other `<Select.Option>` tag!

> Now what if we have a million "_category_"?

- Create a shared category list `server/db/config/categories.js` file:

```js
// define the available categories that match the ENUM in the database migration
const TODO_CATEGORIES = [
  "Code Review",
  "Coding",
  "Debugging",
  "Deployment",
  "Documentation",
  "Learning",
  "Meeting",
  "Miscellaneous",
  "Planning",
  "Refactoring",
  "Testing",
];

// export the list
module.exports = {
  TODO_CATEGORIES,
};
```

> Now, whenever we need to **add** / **remove** a _category_ we can simply modify the `categories.js` file!

- Update our `server/db/migrations/<DateTime>_create_todos_table.js` file to use the `categories.js` / `TODO_CATEGORIES` file:

```js
// import the 'categories' list
const { TODO_CATEGORIES } = require("../../config/categories");

// creation of 'todos' table
exports.up = function (knex) {
  // use the `createTable` function to define - create table in database
  return knex.schema.createTable("todo", (table) => {
    // our fields
    table.increments("id").primary();
    table.text("description").notNullable();

    // use the `TODO_CATEGORIES` instead of the hardcoding each value
    table.enu("category", TODO_CATEGORIES).defaultTo("Miscellaneous");

    table.boolean("completed").defaultTo(false);

    // add time stamps of when created / updated
    table.timestamps(true, true);

    // create the field for the foreign key here
    table.integer("user_id").unsigned().notNullable();
    // make the actual link using 'references'
    table.foreign("user_id").references("user.id").onDelete("CASCADE");
  });
};

// other code here
```

- Update the controller file to make achieve 'GET' request to `TODO_CATEGORIES` list:

```js
// import the `TODO_CATEGORIES` list
const { TODO_CATEGORIES } = require("../config/categories");

// other codes here

// function to get available categories
const getCategories = async (req, res) => {
  try {
    // return the list of possible categories that match the ENUM in the database
    // this matches the categories defined in the migration file
    const categories = TODO_CATEGORIES;

    res.json({
      message: "Categories retrieved successfully",
      categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      error: "Server error while fetching categories",
    });
  }
};

// UPDATE: export the functions that are going to be create to the 'CRUD' operations of TODOs
module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getCategories,
};
```

- Update our `server/routers/todoRouters.js` file:

```js
// get available categories ( 'GET method on `/api/todos/categories`' )
router.get("/categories", authenticateToken, todoController.getCategories);
```

- Update the `client/src/services/api.js` file:

```js
// other codes

// get available categories ( endpoint )
export const getCategories = async () => {
  try {
    const response = await api.get("/todos/categories");
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch categories" };
  }
};

// other codes
```

> [!NOTE] Again...
>
> Now, we are going to have to update our `client/src/components/InputDisplayTodos.jsx` file to use the `TODO_CATEGORIES` / `getCategories` in the `Select` component instead of hard coding it.
>
> > Therefore, please refer to the actual file instead!

# Back-end Issue - Migration File

In terms of functionality and implementation there are no issues, but...

> Then where's the actual issue!

I made a single letter typo ( _a typo nonetheless_ )! In our `server/db/migrations/<DateTime>_create_todos_table.js` I made this typo when typing 'Refactoring'.

```js
table
  .enu("category", [
    "Code Review",
    "Coding",
    "Debugging",
    "Deployment",
    "Documentation",
    "Learning",
    "Meeting",
    "Miscellaneous",
    "Planning",
    "Refactorig", // typo issue right here
    "Testing",
  ])
  .defaultTo("Miscellaneous");
```

> Instead I wrote 'Refactorig'!!!

> [!NOTE]
>
> I corrected the mistake that I made above in the note!

Therefore, to be able to solve this issue, we are going to have to **revert** back and then make the migrations, meaning that we are going to have to _re-write_ the files inside the `server/db/migrations` folder.

But before we actually do anything, let's see some of the other options that we have!

## Start Clean - Revert / Rollback Everything

> [!BUG] Don't Use This Method In Production Environment!!!
>
> This is _extremely_ **dangerous** as its going to wipe the fuck out of everything!
>
> In the real world instead of starting out from scratch, you run the `npx knex migrate:make table_name` whereby its ( _in our case_ ) going to create the file(s) inside the `migrations` folder and then after populating it, then we run the `npx knex migrate:latest` which is going to actually write _things_ to the database.

Let's say that you are working and you are still on the **pre-testing** phase. Therefore, its okay to use this method as you are **not** going to be affecting anyone.

> Hence, let's do this shit!

- Revert the **all** the migrations:

```bash
# make sure that you are in the 'server' folder

# rollback the migrations
npx knex migrate:rollback --all
```

> [!BUG] Fuck Shit!
>
> This is the **error** that I got after running the above command:
>
> ```console
> Using environment: development
> The migration directory is corrupt, the following files are missing: 20251110050510_create_users_table.js, 20251110050511_create_todos_table.js
> Error: The migration directory is corrupt, the following files are missing: 20251110050510_create_users_table.js, 20251110050511_create_todos_table.js
>    at validateMigrationList (/home/azmaan/GitHub/todo/server/node_modules/knex/lib/migrations/migrate/Migrator.js:567:11)
>    at /home/azmaan/GitHub/todo/server/node_modules/knex/lib/migrations/migrate/Migrator.js:179:13
> ```

> [!TIP] The Solution
>
> Speaking with one of the developers, they are telling me to simply **delete** the `db/app.db` database file and then run the migrations **after** updating our _required_ file.
>
> - Delete the `app.db` DB file:
>
> ```bash
> # NOTE: make sure that you are in the `server/db/` directory
> # delete the database file
> rm app.db
> ```
>
> - Run the migrations with the following command **after** making the change in the _required_ file:
>
> ```bash
> # run the following command to remake the migrations
> npx knex migrate:latest
> ```
>
> > [!SUCCESS] Therefore!
> >
> > > [!WARNING]
> > > The output below is **not** good... Please keep scrolling!
> >
> > - This is what we get after running the above command:
> >
> > ```console
> > Using environment: development
> > Already at the base migration
> > ```
> >
> > You should also see that our `app.db` database file is created!

### No Data In Database

> [!BUG] I **cannot** create / register any users!

As we have deleted the whole database file, this means that we **lost** all of our users and _their_ respective 'TODO' items.

Therefore, I started **both** the back-end and front-end server. Now then registering the a new user gives me the error:

> This is the _log_ that our back-end is giving us:

```console
Registration error: [Error: select * from `user` where `email` = 'test@email.com' or (`username` = 'test') limit 1 - SQLITE_ERROR: no such table: user] {
  errno: 1,
  code: 'SQLITE_ERROR'
}
```

- Check the status of the migrations using the following command:

```bash
# check the status of the migration
npx knex migrate:status
```

- _In my case_, I get the following output:

```console
Using environment: development
No Completed Migration files Found.
Found 2 Pending Migration file/files.
20251107113745_create_users_table.js
20251107113746_create_todos_table.js
```

"_Pending_"... What the actual fuck, we did absolutely run the `npx knex migrate:latest` command above!

- Running the migration command again:

```bash
# run the migration again
npx knex migrate:latest
```

- The output after running the above command:

```console
Using environment: development
Batch 1 run: 2 migrations
```

- Run the `status` command to check if migrations has been applied

```bash
# check the status of the migration ( again )
npx knex migrate:status
```

- This is the status / output after running the the migration again:

```console
Using environment: development
Found 2 Completed Migration file/files.
20251107113745_create_users_table.js
20251107113746_create_todos_table.js
No Pending Migration files Found.
```

> [!SUCCESS]
>
> Going into the `app.db` database file using the `sqlite3` command; running the following command:
>
> ```sql
> -- check the DDL command used to create 'todo' table
> .schema todo
> ```
>
> - Therefore, I get the following output:
>
> ```console
> CREATE TABLE `todo` (
>  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
>  `description` TEXT NOT NULL,
>  `category` TEXT
>    CHECK (
>      `category` IN (
>        'Code Review',
>        'Coding',
>        'Debugging',
>        'Deployment',
>        'Documentation',
>        'Learning',
>        'Meeting',
>        'Miscellaneous',
>        'Planning',
>        'Refactoring',
>        'Testing'
>      )
>    )
>    DEFAULT 'Miscellaneous',
>  `completed` BOOLEAN DEFAULT '0',
>  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
>  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
>  `user_id` INTEGER NOT NULL,
>  FOREIGN KEY (`user_id`)
>    REFERENCES `user`(`id`)
>    ON DELETE CASCADE
> );
> ```
>
> > As you can see our _typo_ if fixed!

# Migrating To Neon DB

> [!NOTE] Resource(s)
>
> - <https://neon.com/>
> - <https://vercel.com/>
> - <https://render.com/>

Given that I want / will host my React 'TODO' application online. One of the developers was telling me to check our 'Vercel' or 'Render'. Given that I have seen many people online use Vercel, I am going to go with it!

> [!BUG] The Problem
>
> The main problem is that 'SQLite' is **not** supported by Vercel. Therefore I am going to have to switch to the other supported "_databases_".
>
> Because its not really the actual database, we are talking about '**Managed Database-as-a-Service**' ( 'DBaaS' ) which is basically a _database on "[cloud](https://en.wikipedia.org/wiki/Cloud_database)"_.

Therefore, speaking with some of the developers here; as they use '[Postgresql](https://www.postgresql.org/)', they recommend to use 'Neon'. Therefore, I am going to switch to it, right now, right here.

## Setup Neon

> [!NOTE] Sign Up and Project Creation
>
> - Project Name: TODO - React Web App
> - Postgresql: 17
> - Cloud Service Provider: AWS
> - Region: AWS Asia Pacific 1 (Singapore)
> - Enable Neon Auth: True

> [!SUCCESS]
>
> I have been able to **create** our first "_project_" and I have been redirected to this URL `https://console.neon.tech/app/projects/`!

### Setup Connection

Upon being redirected to the above link ( _or simply go to that link_ ), you are going to see your first Project, click on it and in the 'Dashboard' tab there is going to be a <button>Connect</button> press it and **save** the connection string.

> This is the main way that our _application_ is going to **connect** to the database found on the server!

- This is how the connection string looks like:

```console
psql 'postgresql://neondb_owner:****************@ep-twilight-bonus-a1yrz92a-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
```

> I have hidden the password so that you don't see it... _Obviously_!

- Go ahead and **uninstall** `sqlite3` and **install** `pg`:

```bash
# make sure that you are inside the `server/` folder
cd server

# uninstall sqlite3 node package
npm uninstall sqlite3

# install pg node package
npm install pg
```

> You should see that the `server/package.json` file has been updated!

#### Update Our Knex Database Connection File

> [!NOTE] Resource(s)
>
> - <https://knexjs.org/guide/#configuration-options>

- Therefore go ahead and update our `server/knexfile.js` like so:

```js
// knexfile.js
require("dotenv").config();

module.exports = {
  development: {
    client: "postgresql",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./db/migrations",
    },
    seeds: {
      directory: "./db/seeds",
    },
  },

  production: {
    client: "postgresql",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./db/migrations",
    },
    seeds: {
      directory: "./db/seeds",
    },
  },
};
```

> [!TIP] What is `pool`?
>
> It refer to the number of _connections_ that stays open whereby Knex **reuses** them instead of destroying it and recreating another one!

#### Update Our Environment File

- Add the connection string like so to the `.env` file:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=api_key_to_be_added_later

DATABASE_URL=postgresql://neondb_owner:****************@ep-twilight-bonus-a1yrz92a-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

> [!WARNING] **Not** The Same Connection String
>
> Yes, you are going to have to modify the connection string so that it looks like this ( when added to `DATABSE_URL` ):
>
> ```console
> postgresql://neondb_owner:****************@ep-twilight-bonus-a1yrz92a-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
> ```

> Obviously this `****************` is my password!

#### Delete The Old SQLite Database Files

- Remove the `server/db/app.db` file from our project:

```bash
# if you are at the root of the `server` folder
rm db/app.db
```

> [!NOTE]
>
> Optionally... Update the `.gitignore` file to **remove** all the "_things_" related to SQLite!

#### Run The Migrations

- Therefore check what _pending_ migrations that we still have:

```bash
# check the status of the migration
npx knex migrate:status
```

- This is the output that I get:

```console
[dotenv@17.2.3] injecting env (4) from .env -- tip: ⚙️  load multiple .env files with { path: ['.env.local', '.env'] }
Using environment: development
No Completed Migration files Found.
Found 2 Pending Migration file/files.
20251107113745_create_users_table.js
20251107113746_create_todos_table.js
```

- Therefore, simply run the following command to migrate:

```bash
# migrate / create of tables over at Neon
npx knex migrate:latest
```

- This is the output after running the above `migrate` command:

```console
[dotenv@17.2.3] injecting env (4) from .env -- tip: 🔐 prevent building .env in docker: https://dotenvx.com/prebuild
Using environment: development
Batch 1 run: 2 migrations
```

> [!SUCESS]
>
> > OMG It Fucking Worked!
>
> Running the `migrate:status` 'knex' command; I see that we have **no** pending migrations and also heading over to the 'Tables' tab over at Neon.
>
> I do see that the tables have been created!

## Running The TODO Application

After starting **both** _front-end_ and _back-end_ local, development servers using the `npm run dev` command, I see that it ran perfectly fine!

As I have just created **new** tables for both `todo` and `user`... I decided to create our little 'test' user. But when **registering**; I got this error:

```console
__AuthPages.jsx:92__ Registration error:
 1. {error: 'Server error during registration'}
  1. error: "Server error during registration"
    2. Prototype: Object
  handleRegister@__AuthPages.jsx:92__
```

This is simply due to the fact that there are going to be **differences** in SQLite's syntax compared to 'Postgres'. Therefore we are going to have to update our "_controllers_" so that they now uses the 'Postgres' syntax.

- Head over to the `server/db/controllers/authController.js` file and update line '37' to line '47' ( _register function_ ) to this:

```js
// if user does not exists and all inputs are inserted correctly ==> add the user to database
const [result] = await db("user")
  .insert({
    username,
    email,
    password: hashedPassword,
  })
  .returning("*");

// get the 'ID' from the returning result
const userId = result.id;
```

- Head over to the `server/db/controllers/todoController.js` file and update line '37' to line '47' ( _register function_ ) to this:

```js
// for the create todo function

// other codes here
// insert the new TODO item into the database
const [newTodo] = await db("todo")
  .insert({
    user_id: userId,
    description,
    category: category || "Miscellaneous",
    completed: false,
  })
  .returning("*");
// other codes here

// for the update todo function
// other codes here
// get the update and return query in one object
const [updatedTodo] = await db("todo")
  .where({ id: todoId })
  .update(updateData)
  .returning("*");

// other codes here
```

> [!SUCCESS]
>
> I see that I have been able to successfully:
>
> - **Register** and **Login** User
> - **Create**, **Update** and **Delete** 'TODO' Item

# Vercel

> [!NOTE] Resource(s)
>
> - <https://vercel.com/>
> - <https://vercel.com/docs/getting-started-with-vercel>
> - <https://www.youtube.com/watch?v=22Rywce_kcg>

This is the platform that we are going to use to **host**, **deploy** our 'TODO' application. I have already signed in and we are going to get started with _deploying_ our application to the world!

- Create the `server/vercel.json` file:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

- Update the `server/.gitignore` file:

```gitignore
node_modules/
.env
.vercel
```

> Then push the changes to **remote** repository!

## Deploying On Vercel

### Back-End Deployment

Head over to the link '<https://vercel.com/dashboard>' to get started with the **deployment**!

> [!TIP] Steps
>
> - Click on the 'Add New' button and select the 'Project' option
> - Import the correct GitHub repository ( _like our `first-todo-react` repository_ )
> - Root Directory: `server`
> - Framework Preset: Other
> - Build Command: Leave Empty / `npm install`
> - Output Directory: Leave Empty
> - Install Command: `npm install`
> - Click on the 'Deploy' button
>
> > [!NOTE]
> > We are going to be adding the **Environment Variables** later on!
> >
> > > So its totally okay if it does not deploy!

> [!TIP] Setting Up Environment Variables
>
> After the initial deployment above; head over to the 'Settings' tab for our project and click on the 'Environment Variables' option.
>
> Therefore, add the "_required_" variables ( _again, found inside the `server/.env` file_ ) and **click** 'Save' after _adding_ **each** one!
>
> > [!NOTE]
> > In my `.env` file, I have this:
> >
> > ```env
> > JWT_SECRET=api_key_to_be_added_later
> > ```
> >
> > Therefore, I am going to simply **omit** it!
>
> After adding "_everything_", simply click on the 'Redeploy' button that appears in the bottom right corner of head over to the 'Deployment' tab above and redeploy!

> [!SUCCESS]
>
> Therefore, in my case, I get the following link, '<https://first-todo-react-one.vercel.app/>', whereby its going to output the _response_ like so:
>
> ```console
> {
>  "message": "TODO API Running!",
>  "status": "success"
> }
> ```

### Run Migrations On Production / Vercel

```bash
# switch `NODE_ENV` to `production` temporarily
export NODE_ENV=production

# run the migrations
npx knex migrate:latest

# verify the migration
npx knex migrate:status
```

- This is the output that I get after running the above commands:

```console
[dotenv@17.2.3] injecting env (3) from .env -- tip: ⚙️  enable debug logging with { debug: true }
Using environment: production
Already up to date
[dotenv@17.2.3] injecting env (3) from .env -- tip: 🛠️  run anywhere with `dotenvx run -- yourcommand`
Using environment: production
Found 2 Completed Migration file/files.
20251107113745_create_users_table.js
20251107113746_create_todos_table.js
No Pending Migration files Found.
```

### Front-End Deployment

Now that we have deployed our back-end; we need to also deploy the **front-end** so that the user will be able to interact with it!

- Update the `client/src/services/api.js` file:

```js
// update only the `API_BASE_URL` variable

// our base URL for the back-end ( API ) --> "vercel" backend + localhost
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
```

- Create a `.env.development` file for the **front-end**:

```env
VITE_API_URL=http://localhost:5000/api
```

- Create a `.env.production` file for the **front-end**:

```env
VITE_API_URL=https://your-backend.vercel.app/api
```

- Update our `.gitignore` file to **not** push these `.env`s file:

```gitignore
.env
.env.local
.env.production
.vercel
```

> Therefore push the changes to the **remote** repository!

Head over to the link '<https://vercel.com/dashboard>' to get started with the **deployment**!

> [!TIP] Steps
>
> - Click on the 'Add New' button and select the 'Project' option
> - Import the correct GitHub repository ( _like our `first-todo-react` repository_ )
> - Root Directory: `client`
> - Framework Preset: Vite
> - Build Command: `npm run build`
> - Output Directory: `dist`
> - Install Command: `npm install`
> - Click on the 'Deploy' button
> - Add the required Environment Variables

> [!SUCCESS]
>
> I have now been able to deploy my web-app on Vercel and anyone can access it!

# Registration / Login Issues

This is what appears on the console, when I try to **login** _first_ and _then_ **register**:

```console
Failed to load resource: the server responded with a status of 500 ()

index-D7KBWe7p.js:287 Login error:

1. {error: 'Server error during login'}

2. error: "Server error during login"
3. Prototype: Object

|   |   |   |   |
|---|---|---|---|
||v|@|index-D7KBWe7p.js:287|

index-D7KBWe7p.js:284 POST https://first-todo-react-one.vercel.app/api/auth/register 400 (Bad Request)

index-D7KBWe7p.js:287 Registration error:

1. {error: 'Username or email already exists'}

|   |   |   |   |
|---|---|---|---|
||m|@|index-D7KBWe7p.js:287|
||await in m|||
||onFinish|@|index-D7KBWe7p.js:161|
||(anonymous)|@|index-D7KBWe7p.js:161|
||Promise.then|||
||(anonymous)|@|index-D7KBWe7p.js:161|
||onSubmit|@|index-D7KBWe7p.js:161|
||_C|@|index-D7KBWe7p.js:8|
||(anonymous)|@|index-D7KBWe7p.js:8|
||ml|@|index-D7KBWe7p.js:8|
||Cg|@|index-D7KBWe7p.js:8|
||jg|@|index-D7KBWe7p.js:9|
||M_|@|index-D7KBWe7p.js:9|
```

> [!NOTE]
>
> I think I know the issue... The issue is coming "_primarily_" from Neon. The thing is Neon, by default, gave us 2 branches. The _development_ branch and the _production_ branch.
>
> Now, **before** deploying / hosting; when we _migrated_, the `user` and `todo` tables were successfully created! Now, remember how we did change the `NODE_ENV` to `production` because we has to run it again the "_production_" branch. Well that command silently **failed**!
>
> > I currently **don't** have any _tables_ in my 'production' branch in Neon!
>
> Therefore, we are going to try to solve this issue!

- Update the `server/.env` file:

```env
PORT=5000
NODE_ENV=production # Change to production
JWT_SECRET=your_jwt_secret
DATABASE_URL=postgresql://... # Use PRODUCTION connection string
```

- Run the migrations again:

```bash
# run the migrations
npx knex migrate:latest

# verify the migration
npx knex migrate:status
```

- This is the output after running the above commands:

```console
[dotenv@17.2.3] injecting env (4) from .env -- tip: 👥 sync secrets across teammates & machines: https://dotenvx.com/ops
Using environment: production
Batch 1 run: 2 migrations
[dotenv@17.2.3] injecting env (4) from .env -- tip: ⚙️  suppress all logs with { quiet: true }
Using environment: production
Found 2 Completed Migration file/files.
20251107113745_create_users_table.js
20251107113746_create_todos_table.js
No Pending Migration files Found.
```

> [!SUCCESS]
>
> I know see that the **all** the _tables_ has been created in 'production' branch!

> [!WARNING]
>
> Now, you need to switch back to the 'development' for the `DATABASE_URL` and `NODE_ENV`!

## Update Vercel Back-End's Environment Variables

As the heading suggests, we need to update the back-end's environment variables to _reflect_ the 'production' "_environment_"!

> Make sure to use `production` for `NODE_ENV` and also the **production** connection string for `DATABASE_URL`!

- Update our `server/server.js` file:

```js
// other codes here

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://first-todo-react-dstv.vercel.app/",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// other codes here
```

## Generate JSON Web Token Secret Key

- Use the following command to generate a strong 'JWT' key:

```bash
# generate the 'JWT' token "key" with 'node'
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

- Generate something that looks like this:

```console
a3f5d8e9c2b1a4f7e6d3c8b9a2f5e1d4c7b3a9f6e2d8c1b5a7f4e3d9c6b2a8f5
```

> Therefore add the `JWT_SECRET` key-value pair to the back-end's environment variables!

> [!SUCCESS]
>
> Fuck!!! It was the `JWT_SECRET` key!
>
> But I can not successfully use the web-app!

# Delete Account

We do want to give the user the ability to **delete** his / her account... Therefore, we are going to have to update _things_ from the database to be able to get the functionality that we want in our front-end.

> Hence!

- Update our `server/controllers/userController.js` file with the following function:

```js
// asynchronous function that will be used to delete user profile entirely
const deleteAccount = async (req, res) => {
  try {
    // get the crendentials from the 'JSON' body
    const userId = req.user.userId;

    // check if the user already exists
    const existingUser = await db("user").where({ id: userId }).first();

    if (!existingUser) {
      return res.status(400).json({
        error: "Username or email does not exists",
      });
    }

    // delete the user from the database
    await db("user").where({ id: userId }).del();

    res.json({
      message: "User profile successfully deleted",
    });
  } catch (error) {
    console.error("Deletion error:", error);
    res.status(500).json({
      error: "Server error during deletion",
    });
  }
};

// export the function to be used by others
module.exports = {
  getUserProfile,

  // NOTE: don't forget to export the 'deleteAccount' functioon
  deleteAccount,
};
```

- Update the `server/routers/userRouters.js` file:

```js
// delete the user from the database
router.delete("/", authenticateToken, userController.deleteAccount);
```

- Update the `client/services/api.js` file:

```js
// delete an existing user ( endpoint )
export const deleteUser = async () => {
  try {
    const response = await api.delete("/user");
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Deletion of account failed" };
  }
};
```

- Update the `client/components/ProfileMenu.jsx` file:

```jsx
// other codes here

// import the required components from 'antd'
import { Button, Modal } from "antd";

// other codes here

  // function to be able to delete the user's account
  const handleDelete = async () => {
    try {
      // call the function to be able to delete the user account
      await deleteUser();

      // log the user out
      logout();

      // go back to the login - register page
      navigate("/");
    } catch (error) {
      // log the error to the console
      console.error(`Failed to delete account`, error);
    }
  };

// other codes here

            <li>
              <Button
                onClick={() => {
                  setShowDeleteModal(true);
                  setOpen(false);
                }}
                type="text"
                danger
              >
                Delete Account
              </Button>
            </li>

// other codes here

      <Modal
        title="Confirm Account Deletion"
        open={showDeleteModal}
        onOk={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        okText="Yes, Delete"
        cancelText="No, Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>
          Are you sure you want to delete your account? This action cannot be
          undone and all your data will be permanently removed.
        </p>
      </Modal>

// other codes here
```

> [!SUCCESS]
>
> We have now been able to implement the 'Delete Account' button / functionality in our web-app!

---

# Project Improvements

## Fetching Required TODOs

Currently, in our back-end over at `server/controller/todoController.js` file, we are fetching **all** the TODO items _all at once_.

But this fine when we are dealing will little amounts of TODOs; but what's going to happen if the user has a million TODO items?

Therefore, the _startup time_ / loading time for the website when the user is going to load into the hompage is going to be terribly slow!

Therefore, as we have the scrolling effect in our front-end we are going to use it to out advantage.

> We are going to use pagination!

Instead of doing a 'GET' resquest **all at once**, we are going to only _fetch_ the ones that should be shown!

- Currently we have the following `getTodos` function in our `todoController.js` file:

```js
// function to get all the TODO items for the logged-in user
const getTodos = async (req, res) => {
  try {
    // get the `userId` from the authentication token
    const userId = req.user.userId;

    // get all of the TODO items from the database for that user in descending order of creation date
    const todos = await db("todo")
      .where({ user_id: userId })
      .orderBy("created_at", "asc");

    console.log("[TODO API](Get) TODO retrieved successfully");

    res.json({
      message: "[TODO API](Get) TODO retrieved successfully",
      count: todos.length,
      todos,
    });

    // if the TODO item could not be fetched
  } catch (error) {
    console.error("[TODO API](Get) Fetch TODO server error:", error);

    res.status(500).json({
      error: "[TODO API](Get) Server error while fetching todos",
    });
  }
};
```

- Modify the `getTodos` function to something like this:

```js
// function to get all the TODO items for the logged-in user ==> based on what's shown
const getTodos = async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const todos = await db("todo")
      .where({ user_id: userId })
      .orderBy("created_at", "asc")
      .limit(limit)
      .offset(offset);

    const totalCount = await db("todo")
      .where({ user_id: userId })
      .count("* as count")
      .first();

    res.json({
      message: "Todos retrieved successfully",
      todos,
      pagination: {
        page,
        limit,
        total: parseInt(totalCount.count),
        hasMore: offset + todos.length < parseInt(totalCount.count),
      },
    });
  } catch (error) {
    console.error("Get todos error:", error);
    res.status(500).json({ error: "Server error while fetching todos" });
  }
};
```

> Hence, we are going to have to modify our front-end to make use of the new `getTodos` function

> [!NOTE]
>
> Please do refer to the `client/src/components/InputDisplayTodo.jsx` file / component itself.
>
> This is due to the fact that we have to update everything from getting the TODOs to updating them.

## Fixing Category Disappearing

So the problem that we have right now is the issue whereby the 'Miscellaneous' category disappearing after entering a TODO item.

- This is what the current implmentation of the "_fetch_" looks like:

```js
// helper function to find the Miscellaneous category if it exists
const getMiscellaneousCategory = () => {
  return categories.find((cat) => cat === "Miscellaneous");
};

// function that is going to fetch available categories from the server
const fetchCategories = async () => {
  try {
    const response = await getCategories();
    setCategories(response.categories || []);
  } catch (error) {
    console.error(
      `[CATEGORIES](Get) Error while fetching categories: ${error}`
    );

    // Fallback to default categories if API fails
    setCategories([
      "Code Review",
      "Coding",
      "Debugging",
      "Deployment",
      "Documentation",
      "Learning",
      "Meeting",
      "Miscellaneous",
      "Planning",
      "Refactoring",
      "Testing",
    ]);
  }
};

// fetch the TODOs and categories when the component loads up ( from the database )
useEffect(() => {
  fetchInitialTodos();
  fetchCategories();
}, []);
```

As you can clearly see above, we are only calling the `getMiscellaneousCategory` function only **once** on the _first_ request when the database loads up!

Well, to fix this we have to re-initialise the `<Select>` component from Ant Design so that it sets the value for the category again.

- Therefore add the following code to our `handeCreateTodo` function in `client/src/components/InputDisplayTodo.jsx`:

```jsx
const handleCreateTodo = async (values) => {
  // Prevent duplicate submissions
  if (todoCreateLoading) return;

  setTodoCreateLoading(true);

  try {
    // wait for the database to finish writing TODO items
    await createTodo(values);

    console.log("[TODO](Create) TODO created successfully!");

    // display a success message to the user
    messageApi.open({
      type: "success",
      content: "TODO created successfully",
      duration: 1,
    });

    // increment the total count
    setTotalTodoCount((prev) => prev + 1);

    // refetch the initial todos to maintain proper chronological order
    await fetchInitialTodos();

    // create the form for new input of TODO item
    form.resetFields();

    // INFO: set the value for the 'select' component again after reseting the fields

    // reset the category field to 'Miscellaneous' after form reset
    const miscellaneousCategory = getMiscellaneousCategory();
    if (miscellaneousCategory) {
      form.setFieldsValue({ category: miscellaneousCategory });
    } else {
      form.setFieldsValue({ category: categories[0] || "Miscellaneous" });
    }

    // if there was any errors while creation of TODO item
  } catch (error) {
    console.error(`[TODO](Create) Error while creating TODOs: ${error}`);

    messageApi.open({
      type: "error",
      content: "Error creating TODO. Please try again.",
      duration: 1,
    });
  } finally {
    setTodoCreateLoading(false);
  }
};
```

---

# AI Chatbot

> [!NOTE] Resource(s)
>
> - http://langchain.com
> - https://docs.langchain.com

We are now going to implement an AI assistant in the form of a 'Chatbot' whereby the user will be able to _message_ it and in turn perform the required 'CRUD' operation on a TODO item based on that input message.

> [!WARNING] Second Time Implementing AI Chatbot!
>
> This is the not first time that I am implementing this Chatbot!
>
> If you look at the 'test' branch, you are going to see that we have a 65% working AI chatbot.
> The main reason that I abandon it was that there were to many things to fix...
>
> > I would rather **delete** the _noodle_ **instead** of untangling the _noodle_!
>
> Hence, this is going to be me, trying to implement a better version of what I had in 'test' because I know what mistakes and bugs that was present in the app. And now I have fixed it and therefore should be better off.

> We are going to be using Langchain ( _and maybe langraph_! )

Therefore, I already have the "_front-end_" setup and I given that I am not too much interest in the front-end side... Simply refer to the actual `client/src/components/ChatBot.jsx` file.

> I am going to be modifying it again after we implement Langchain!

## Langchain

> What is Langchain? Read more on the Wiki: https://en.wikipedia.org/wiki/LangChain

From what I can understand in my / our case; its going to be acting _like_ wrapper function for any models from and provider!

Additionally, it should **fix** the bug whereby when the user is requests to do a 'DELETE' request... It should now **not** get stuck on the `getTodo` function call and should actually call the `deleteTodo` function.

### Installation

> [!WARNING] Head over to the back-end ( `server/` ) directory first!

- Use the following command to install the actual **core** of Langchain:

```bash
# install the core tools provided by langchain
npm install langchain @langchain/core
```

> [!NOTE] Gemini Model From Google!
>
> Given that I am going to be using the 'google/gemini-2.5-flash-lite' ( _for development_ ) and 'google/gemini-2.5-flash' ( _for production_ ).
>
> I am going to have to install the intregration between Google ( _SDK_ ) and langchain using the following command below.
>
> > But if you are using from other providers, do head over to the following link: https://docs.langchain.com/oss/javascript/integrations/providers/overview ( _this one is for Javascript / Typescript_ )

- Install the Google 'Gemini' - Langchain integration:

```bash
# install the package to integrate langchain with google's SDK
npm install	@langchain/google-genai
```

> In my case, I am going to be referring to this documentation: https://docs.langchain.com/oss/javascript/integrations/chat/google_generative_ai

> [!TIP] Given that we are already installing things...
>
> - Use the following command to install 'zod':
>
> ```bash
> # install the 'zod' data handling schema thing
> npm install zod
> ```
>
> This is basically a standalone `npm` package that is going to offer us schema validation and static type inference. We are going to be **needing** this when we are going to perform our _tool calls_
>
> > Refer to the official documentation: https://zod.dev/

### Implementation

- Create a new folder `services` inside of the `server/` directory:

```bash
# create 'services' folder for our back-end
# NOTE: make sure that you are already in 'server/' directory
mkdir services
```

- Create the `server/services/todoService.js` file:

```js
const db = require("../db/knex");

// global TODO service file that is going to be used by langchain
const todoService = {
  // asynchronous function to create TODO item
  async createTodo(userId, todoData) {
    const { description, category } = todoData;

    if (!description) {
      console.log("[TODO SERVICE](Create) Description is required!");

      throw new Error("Description is required");
    }

    const [newTodo] = await db("todo")
      .insert({
        user_id: userId,
        description,
        category: category || "Miscellaneous",
        completed: false,
      })
      .returning("*");

    console.log("[TODO SERVICE](Create) TODO successfully created!");

    return newTodo;
  },

  // asynchronous function to get all TODO item(s)
  async getTodos(userId) {
    const todos = await db("todo")
      .where({ user_id: userId })
      .orderBy("created_at", "asc");

    console.log("[TODO SERVICE](Create) TODO successfully fetched!");

    return todos;
  },

  // asynchronous function to update a TODO item
  async updateTodo(userId, todoId, updates) {
    const { description, category, completed } = updates;

    // check if TODO item belongs to that specific user
    const todo = await db("todo")
      .where({ id: todoId, user_id: userId })
      .first();

    if (!todo) {
      console.log(
        "[TODO SERVICE](Create) TODO not found or does not belong to you!"
      );

      throw new Error("Todo not found or does not belong to you");
    }

    // create the update object - data
    const updateData = {};
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (completed !== undefined) updateData.completed = completed;

    const [updatedTodo] = await db("todo")
      .where({ id: todoId })
      .update(updateData)
      .returning("*");

    console.log("[TODO SERVICE](Create) TODO successfully updated");

    return updatedTodo;
  },

  // asynchronous function to delete a TODO item
  async deleteTodo(userId, todoId) {
    // check if TODO item belongs to that specific user
    const todo = await db("todo")
      .where({ id: todoId, user_id: userId })
      .first();

    if (!todo) {
      console.log(
        "[TODO SERVICE](Create) TODO not found or does not belong to you!"
      );

      throw new Error("Todo not found or does not belong to you");
    }

    await db("todo").where({ id: todoId }).delete();

    console.log("[TODO SERVICE](Create) TODO successfully deleted");

    return todo;
  },

  // function to get all categories for a TODO item
  getCategories() {
    const { TODO_CATEGORIES } = require("../config/categories");
    return TODO_CATEGORIES;
  },
};

// export all functions
module.exports = todoService;
```

Given that Langchain's "_tool_" function / method, needs just a **simple** function **without** sending _requests_ or getting back any _response_.

Therefore, this is the reasonn as to why we have to do that, else we are going to have to duplicate everything if we were to only use the `todoController.js` file!

- Create a new folder `tools` inside of the `server/` directory:

```bash
# create 'tools' folder for our back-end
# NOTE: make sure that you are already in 'server/' directory
mkdir tools
```

> [!NOTE] Refer to the actual files in repository
>
> We are going to have to create these `.js` file inside our `tools/` folder.
>
> > Basically, it should look like this:
>
> ```console
>  .
> ├──  createTodoTool.js
> ├──  deleteTodoTool.js
> ├──  getTodosTool.js
> ├──  index.js
> └──  updateTodoTool.js
> ```

> [!TIP]
>
> After creating the files ( _with the codes inside obviously_ ), run the following command below:
>
> ```bash
> # check if all our tools are defined correctly
> node -e "const tools = require('./tools'); console.log(Object.keys(tools));"
> ```
>
> - Therefore, you should see that you have the following output:
>
> ```console
> [dotenv@17.2.3] injecting env (10) from .env -- tip: ⚙️  load multiple .env files with { path: ['.env.local', '.env'] }
> [
>   'createTodoTool',
>   'getTodosTool',
>   'updateTodoTool',
>   'deleteTodoTool'
> ]
> ```

- Create the `server/controllers/chatController.js` file:

> [!NOTE]
>
> Similarly, because the file is too long ( _that's what she said_ ); I recommend you to actually look at the code itself.
>
> > Nevertheless, here is a breakdown of it!
>
> - The actual asynchronous `chat` function
> - Get the message and also "_instantiate_" empty `history` array variable
> - Create the actual model / `llm` using the `ChatGoogleGenerativeAI` provided by '@langchain/google-genai'
>   - Configure the model with the required configuration like `apiKey` and `temperature`
>   - Add / Bind the tools created in our `server/tools/` folder to the 'model' created
>   - Create an array to hold AI's messages + history manipulation
>   - Tool calling in a loop

- Create the `server/routers/chatRouters.js` file:

```js
// import the 'express' library and function for chat at each endpoint
const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// NOTE: get the 'Authentication Token' as 'TODO' items are "private" to each user
const { authenticateToken } = require("../middleware/authMiddleware");

// create new AI chat for logged-in and authenticated user
router.post("/", authenticateToken, chatController.chat);

// export the actual routes ( `/api/todos/{functionName}` )
module.exports = router;
```

- Therefore, update the `server/server.js` file:

```js
// other codes above
const chatRouter = require("./routers/chatRouters.js");

// other codes here
app.use("/api/chat", chatRouter);

// other codes below
```

- Update the `client/src/components/ChatBot.jsx` file:

```jsx
// function to "enable" / run when the switch is on
const handleSwitchChecked = (checked) => {
  // change / set the animation for the heading
  setHeadingAnimating(checked);
  // change / set the visibility of the chat app
  setIsChatVisible(checked);

  // display a success message to the user
  messageApi.open({
    type: "success",
    content: "AI Chatbot Successfully Toggled",
    duration: 1,
  });

  console.log("[ChatBot](Toggle) AI Chatbot Successfully Toggled");
};

// function to send message to the AI backend
const handleSendMessage = async () => {
  // validate message
  if (!userMessage.trim()) {
    return;
  }

  const currentMessage = userMessage.trim();
  setUserMessage(""); // clear input immediately
  setIsLoading(true);

  // add user message to chat history
  const updatedHistory = [
    ...chatHistory,
    { role: "user", content: currentMessage },
  ];
  setChatHistory(updatedHistory);

  try {
    // call the `sendChatMessage` function / end-point
    const data = await sendChatMessage(currentMessage, chatHistory);

    // update chat history with AI response
    setChatHistory([
      ...updatedHistory,
      { role: "assistant", content: data.message },
    ]);

    // trigger the page fresh on "CUD" operation
    if (data.toolsUsed && onTodoChange) {
      onTodoChange();
    }

    console.log("[ChatBot](Send) Message sent and response received");
  } catch (error) {
    console.error("[ChatBot](Send) Error:", error);

    messageApi.open({
      type: "error",
      content: error.error || "Failed to get AI response",
      duration: 3,
    });

    // Revert to previous history since request failed
    setChatHistory(chatHistory);
  } finally {
    setIsLoading(false);
    // refocus input after sending
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }
};

// handle `<Enter>` key press
const handleKeyPress = (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSendMessage();
  }
};
```

> Refer to the actual code / file for _usage_!

> [!TIP] ...
>
> Now go ahead and test it out and you should see that you go get response back and also AI assistant is able to do 'CRUD' operations!
>
> But make sure you have the following **keys** inside the `server/.env` file:
>
> ```bash
> GEMINI_API_KEY=your-api-key-here
> GEMINI_MODEL=gemini-2.5-flash
> GEMINI_TEMPERATURE=0.2
> GEMINI_SYSTEM_PROMPT="Your AI Prompt Here"
> ```

---

# Socials

- **Instagram**: <https://www.instagram.com/s.sunhaloo>
- **YouTube**: <https://www.youtube.com/@s.sunhaloo>
- **GitHub**: <https://www.github.com/Sunhaloo>

---

S.Sunhaloo
Thank You!
