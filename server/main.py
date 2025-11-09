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
