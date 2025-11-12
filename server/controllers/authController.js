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

    // check if the user already exists
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
      { expiresIn: "7d" },
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

    // if the user could not be logged in
    // NOTE: status code = '500' ==> internal server error
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Server error during login",
    });
  }
};

// export the function for `/register` and `/login`
module.exports = {
  register,
  login,
};
