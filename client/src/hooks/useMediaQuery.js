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
