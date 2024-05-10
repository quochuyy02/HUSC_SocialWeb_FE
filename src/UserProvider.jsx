import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthProvider";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();
// eslint-disable-next-line react/prop-types
function UserProvider({ children }) {
  const [user, setUser] = useState([]);
  const { token, setToken } = useAuth();
  const navigate = useNavigate();
  const SERVER_DOMAIN = import.meta.env.VITE_SERVER_DOMAIN;
  const handleGetProfile = () => {
    axios
      .get(SERVER_DOMAIN + "/user/getProfile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data.data);
        setUser(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) {
          toast.error("Please login to continue!", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 5000,
          });
          localStorage.removeItem("token");
          setToken(null);
          navigate("/");
          return;
        }
        toast.error("Something went wrong! Please try again!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 5000,
        });
      })
     
  };
  const value = { user, setUser, handleGetProfile };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
const useUser = () => {
  return useContext(UserContext);
};
export { UserProvider, useUser };
