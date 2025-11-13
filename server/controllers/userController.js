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
    if (!user) {
      // send the famous, famous '404' error
      return res.status(404).json({
        error: "User not found",
      });
    }

    // send the whole user ( profile ) data as the response
    res.json({
      message: "User profile successfully retrieved",
      user: {
        id: user.id,
        username: user.username,
        gender: user.gender,
        createdAt: user.created_at,
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
