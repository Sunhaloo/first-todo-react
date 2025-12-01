// import the 'axios' library to connect front-end to back-end
import axios from "axios";

// our base URL for the back-end ( API ) --> "vercel" backend + localhost
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// add the token to the requests automaticlaly if it exists ( gets the token from local storage )
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  // if the token has not been found --> reject the user's request
  (error) => {
    return Promise.reject(error);
  },
);

// register a new user ( endpoint )
export const register = async (userData) => {
  try {
    const response = await api.post(`${API_BASE_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Registration failed" };
  }
};

// login a new user ( endpoint )
// NOTE: the `crendentials` parameters is basically the 'JSON' object
export const login = async (credentials) => {
  try {
    const response = await api.post(`${API_BASE_URL}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Login failed" };
  }
};

// delete an existing user ( endpoint )
export const deleteUser = async () => {
  try {
    const response = await api.delete("/user");
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Deletion of account failed" };
  }
};

// get all TODOs for logged-in user ( endpoint )
export const getTodos = async () => {
  try {
    const response = await api.get("/todos");
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch todos" };
  }
};

// create a new TODO for logged-in user ( endpoint )
export const createTodo = async (todoData) => {
  try {
    const response = await api.post("/todos", todoData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to create todo" };
  }
};

// update ( a ) TODO for logged-in user ( endpoint )
export const updateTodo = async (todoId, todoData) => {
  try {
    const response = await api.put(`/todos/${todoId}`, todoData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to update todo" };
  }
};

// delete ( a ) TODO for logged-in user ( endpoint )
export const deleteTodo = async (todoId) => {
  try {
    const response = await api.delete(`/todos/${todoId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to delete todo" };
  }
};

// get the user's profile detail
export const getUserProfile = async () => {
  try {
    const response = await api.get("/user");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { error: "Failed to fetch user profile data" }
    );
  }
};

// get available categories ( endpoint )
export const getCategories = async () => {
  try {
    const response = await api.get("/todos/categories");
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch categories" };
  }
};

// send message to AI
export const sendChatMessage = async (message, chatHistory = []) => {
  try {
    // get the token created when the user is logged in from the local storage
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/chat/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      // send the message and also the full conversation history
      body: JSON.stringify({ message, history: chatHistory }),
    });

    // wait for the response
    const data = await response.json();

    // if the reponse failed
    if (!response.ok) {
      throw new Error(data.error || "Failed to send message");
    }

    // return the data to the front-end
    return data;
  } catch (error) {
    console.error("Chat API Error:", error);
    throw error;
  }
};

// export the actual connection
export default api;
