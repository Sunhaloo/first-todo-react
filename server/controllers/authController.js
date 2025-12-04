// import the security and authentication features
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// import the required knex 'server' to 'database' connection
const db = require("../db/knex");

// asynchronous function that registers a user
const register = async (req, res) => {
  try {
    // get the crendentials from the 'JSON' body
    const { username, email, password } = req.body;

    // if the credentials are not valid
    if (!username || !email || !password) {
      console.log("[AUTH API](Register) All fields are required!");

      return res.status(400).json({
        error: "[AUTH API](Register) All fields are required",
      });
    }

    // check if the user already exists
    const existingUser = await db("user")
      .where({ email })
      .orWhere({ username })
      .first();

    // if an already existing user tries to register again
    if (existingUser) {
      console.log("[AUTH API](Register) Username or email already exists!");

      return res.status(400).json({
        error: "[AUTH API](Register) Username or email already exists",
      });
    }

    // use the `bycrypt` package to apply a hash to the password
    const hashedPassword = await bcrypt.hash(password, 10);

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

    // create the digital token ( "security badge" ) for the user
    const token = jwt.sign({ userId, username }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log("[AUTH API](Register) User registered successfully");

    // NOTE: status code = '201' ==> successful creation of a new resource on server
    res.status(201).json({
      message: "[AUTH API](Register) User registered successfully",
      token,
      user: {
        id: userId,
        username,
        email,
      },
    });

    // if the user could not be registered
    // NOTE: status code = '500' ==> internal server error
  } catch (error) {
    console.error("[AUTH API](Register) Registration error:", error);

    res.status(500).json({
      error: "[AUTH API](Register) Server error during registration",
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
      console.log("[AUTH API](Login) Username and password are required!");

      return res.status(400).json({
        error: "[AUTH API](Login) Username and password are required",
      });
    }

    // find the user in the database
    const user = await db("user").where({ username }).first();

    // if user does not exists
    if (!user) {
      console.log("[AUTH API](Login) Invalid credentials!");

      return res.status(401).json({
        error: "[AUTH API](Login) Invalid credentials",
      });
    }

    // user the 'bcrypt' package to compare the password
    // NOTE: need to user the `bycrypt.compare` function as password in DB is hashed
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // if the password is not correct
    // NOTE: status code = '401' ==> missing / invalid / failed authentication details
    if (!isPasswordValid) {
      console.log("[AUTH API](Login) Invalid credentials!");

      return res.status(401).json({
        error: "[AUTH API](Login) Invalid credentials",
      });
    }

    // create the digital token ( "security badge" ) for the user
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    console.log("[AUTH API](Login) Login successful");

    // if user is able to login ==> return a 'JSON' output
    res.json({
      message: "[AUTH API](Login) Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });

    // NOTE: status code = '500' ==> internal server error
  } catch (error) {
    console.error("[AUTH API](Login) Login error:", error);
    res.status(500).json({
      error: "[AUTH API](Login) Server error during login",
    });
  }
};

// export the function for `/register` and `/login`
module.exports = {
  register,
  login,
};
