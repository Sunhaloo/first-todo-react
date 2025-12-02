// import the required knex 'server' to 'database' connection
const db = require("../db/knex");

// asynchronous function that will fetch the user's username
const getUserProfile = async (req, res) => {
  try {
    // get the user's ID from the user ( using authentication token )
    const userId = req.user.userId;

    // get the user's profile from the database
    const userProfile = await db("user")
      .select("id", "username", "created_at")
      .where({ id: userId })
      .first();

    // if the user has not been found ( on the database )
    if (!userProfile) {
      console.log("[USER API](Get Profile) User not found!");

      return res.status(404).json({
        error: "[USER API](Get Profile) User not found",
      });
    }

    console.log("[USER API](Get Profile) User profile successfully retrieved");

    res.json({
      message: "[USER API](Get Profile) User profile successfully retrieved",
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
    console.error("[USER API](Get Profile) Get profile server error:", error);

    res.status(500).json({
      error: "[USER API](Get Profile) Server error during login",
    });
  }
};

// asynchronous function that will be used to delete user profile entirely
const deleteAccount = async (req, res) => {
  try {
    // get the crendentials from the 'JSON' body
    const userId = req.user.userId;

    // check if the user already exists
    const existingUser = await db("user").where({ id: userId }).first();

    if (!existingUser) {
      console.log(
        "[USER API](Delete Account) Username or email does not exists!",
      );

      return res.status(400).json({
        error: "[USER API](Delete Account) Username or email does not exists",
      });
    }

    // delete the user from the database
    await db("user").where({ id: userId }).del();

    res.json({
      message: "[USER API](Delete Account) User profile successfully deleted",
    });
  } catch (error) {
    console.error("[USER API](Delete Account) Deletion server error:", error);

    res.status(500).json({
      error: "[USER API](Delete Account) Server error during deletion",
    });
  }
};

// export the function to be used by others
module.exports = {
  getUserProfile,
  deleteAccount,
};
