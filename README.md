# First TODO React Application

A simple, responsive TODO application built with React, CSS and JavaScript with a database back-end.

> [!NOTE]
> Resources used while building and learning:
>
> - Official React documentation: <https://reactjs.org/>
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

## Login And / Or Registration

Upon opening the web-app, the user will be welcomed with:

![Login Page](./screenshots/light_login.png)

If the user is already an _existing_ user; then he / she simply needs to log into the web-app. Else if user is a _new_ user; then he will have to **sign up** / **register** for an account.

## Homepage

![Homepage](./screenshots/light_homepage.png)

This is where a user is going to be spending most of his time in. As you can see from the above screenshot; the user is able to:

- Toggle the page's theme
- 'Logout' or 'Delete Account' from the profile menu
- Create a new 'TODO' item with a category ( _defaults to 'Miscellaneous'_ )
- Edit already created 'TODO' item
- Check-off completed 'TODO' item
- Finally, we can delete an entire 'TODO' item

## Screenshots

### Light Mode

- Sign Up Page:

![Sign Up Page](./screenshots/light_signup.png)

- Profile Menu:

![Profile Menu](./screenshots/light_profile.png)

- 'TODO' Item Created:

![TODO Item Created](./screenshots/light_TODO_items.png)

- Edit TODO:

![Edit TODO Item](./screenshots/light_edit_TODO.png)

- Account Deletion:

![Delete Account](./screenshots/light_delete_account.png)

### Dark Mode

- Homepage:

![Dark Homepage](./screenshots/dark_homepage.png)
