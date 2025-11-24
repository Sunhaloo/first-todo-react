# First TODO React Application

A simple TODO application built with React, CSS and JavaScript with a database back-end.

> [!NOTE]
> Resources used while building and learning:
>
> - Official React documentation: https://reactjs.org/
> - Various tutorials and community examples for UI patterns and local storage usage
> - All my learning, failures and experimentation are found in the `learning.md` file

# Features

- Light and Dark themes
- Category selection for each TODO item
- Mark TODOs as completed ( check-off )
- Edit TODO item content ( category immutable )
- Delete TODO items
- Persistent storage using local storage
- Enter a username to personalize the experience

# Usage

Upon opening the web-app, the user can:

1. Sign up and login
2. Create a TODO by adding content and selecting a category ( defaults to Miscellaneous )
3. Save TODOs to Neon Database ( as a service ) so they persist across sessions
4. Mark TODOs complete or incomplete
5. Edit the content of existing TODOs (category remains unchanged)
6. Delete TODOs that are no longer needed
7. Toggle between Light and Dark themes
