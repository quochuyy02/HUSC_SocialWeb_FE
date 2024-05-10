import { Link, NavLink, useLocation } from "react-router-dom";
import "../scss/NavBar.scss";
import { useUser } from "../UserProvider";
import { useState } from "react";

const routes = ["home", "messages", "profile", "saved-post", "users"];
function NavBar() {
  const { user } = useUser();
  const user_id = user?.user?.user_id;
  const location = useLocation();
  const [tabSelected, setTabSelected] = useState(
    routes.filter((route) => location.pathname.includes(route)).reverse()[0]
  );

  return (
    <div className="navbar">
      <div className="logo-ctn">
        <img src="/logo.png" alt="logo" />
        <h1>HUSC Student Infomation Exchange</h1>
      </div>
      <ul>
        <li>
          <Link
            to="/home"
            onClick={() => setTabSelected("home")}
            className={`${tabSelected === "home" && "active"} `}
          >
            <i className="fa-solid fa-house"></i>
            <p>Home</p>
          </Link>
        </li>

        <li>
          <Link to="/messages">
            <i className="fa-solid fa-message"></i>
            <p>Message</p>
          </Link>
        </li>
        <li>
          <Link
            onClick={() => setTabSelected("profile")}
            to={`/home/profile/${user_id}`}
            className={`${tabSelected === "profile" && "active"} `}
          >
            <i className="fa-solid fa-id-card"></i>
            <p>My Profile</p>
          </Link>
        </li>
        <li>
          <Link
            to="/home/savedposts"
            onClick={() => setTabSelected("saved-post")}
            className={`${tabSelected === "saved-post" && "active"} `}
          >
            <i className="fa-sharp fa-solid fa-bookmark"></i>
            <p>Saved Post</p>
          </Link>
        </li>
        <li>
          <Link
            to="/home/users"
            onClick={() => setTabSelected("users")}
            className={`${tabSelected === "users" && "active"} `}
          >
            <i className="fa-solid fa-users"></i>
            <p>Users</p>
          </Link>
        </li>
        <li></li>
      </ul>
    </div>
  );
}

export default NavBar;
