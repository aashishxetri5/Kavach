// import axios from "axios";

const handleLogout = async () => {
  try {
    // const instance = axios.create({
    //   baseURL: "http://localhost:3000",
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    localStorage.removeItem("token");
    return true;

    // const response = await instance.post("/api/auth/logout");
    // if (response.status === 200) {
    // } else {
    //   return false;
    // }
  } catch (error) {
    console.error(error);
    return false;
  }
};

export default handleLogout;
