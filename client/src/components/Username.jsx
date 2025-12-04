// import the `useState` and `useEffect` function from 'react' library
import { useEffect, useState } from "react";

// import required components from antd
import { Skeleton } from "antd";

// import the API function that will talk to back-end
import { getUserProfile } from "../services/api";

function Username({ className }) {
  // declare array of "greetings"
  const greetings = [
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

  // declare variable that is going to hold the username
  const [username, setUsername] = useState("");

  // declare variable to keep track of "loading"
  const [userFetchLoading, setUserFetchLoading] = useState(true);

  // get a random number ( upper bound ==> length of array )
  const greetIndex = Math.floor(Math.random() * greetings.length);

  // function that is going to fetch / get user details from the database
  const fetchProfile = async () => {
    try {
      const response = await getUserProfile();

      setUsername(response.user.username);

      // if the user profile / username could not be fetch from database
    } catch (error) {
      console.error(
        `[USERNAME](Get) Failed to fetch user's username: ${error}`,
      );

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
    return <Skeleton.Button className={className} active />;
  }

  // else if the username HAS been retrieved from the database
  return (
    <span className={className}>
      {greetings[greetIndex]} {username}
    </span>
  );
}

// export as reusable component
export default Username;
