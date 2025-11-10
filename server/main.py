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
