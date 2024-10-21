const API_URL = process.env.REACT_APP_API_URL;

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if(!response.ok) {
        throw new Error("Login Failed!!");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    return error.response.data;
  }
};
