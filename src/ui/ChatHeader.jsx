import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { useUser } from "../UserProvider";
import axios from "axios";
import ContentLoader from "react-content-loader";
import "../scss/ChatHeader.scss";
function ChatHeader() {
  const [isDropdown, setIsDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { token } = useAuth();
  const { user, handleGetProfile } = useUser();
  const userProfile = user.user;
  const SERVER_DOMAIN = import.meta.env.VITE_SERVER_DOMAIN;
  const { handleLogout } = useAuth();
  const modalRef = useRef();
  const searchRef = useRef();
  const resultRef = useRef();

  const handleButtonClick = (buttonType) => {
    switch (buttonType) {
      case "profile":
        setIsDropdown(false);
        navigate("/home/profile/" + userProfile.user_id);

        break;
      case "logout":
        handleLogout();
        break;
      case "settings":
        setIsDropdown(false);
        navigate("/home/profiledetail");

        break;
      default:
        break;
    }
  };
  const handleDropdown = () => {
    setIsDropdown(!isDropdown);
  };
  useEffect(() => {
    if (user.length == 0) handleGetProfile();
  }, []);
  useEffect(() => {
    if (search.length < 3) return;
    const debounceTimer = setTimeout(() => {
      setIsResultModalOpen(true);
      setIsLoading(true);
      axios
        .get(SERVER_DOMAIN + "/search?keyword=" + search, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.data.data.length === 0) {
            setSearchResult(null);
          } else setSearchResult(res.data.data);

          setIsLoading(false);
          console.log(res.data.data);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [search]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        !searchRef.current.contains(event.target)
      ) {
        console.log(modalRef.current.contains(event.target), resultRef);

        setIsDropdown(false);
        setIsResultModalOpen(false);
      }
    };

    if (isDropdown || isResultModalOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isDropdown, isResultModalOpen]);
  return (
    <div className="chat-header">
      <div className="search-ctn">
        <img src="/logo.png" alt="logo" onClick={() => navigate("/home")} />
        <div className="search-bar">
          <input
            id="searchbar"
            className="search-input"
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            ref={searchRef}
            onFocus={() => setIsResultModalOpen(true)}
          />

          {isResultModalOpen && isLoading ? (
            <ul className="search-result" ref={resultRef}>
              <li>Searching...</li>
            </ul>
          ) : (
            <>
              {isResultModalOpen &&
              searchResult == null &&
              search.length !== "" ? (
                <ul className="search-result" ref={resultRef}>
                  <li className="">No result</li>
                </ul>
              ) : (
                isResultModalOpen &&
                search !== "" &&
                searchResult != null && (
                  <ul className="search-result" ref={resultRef}>
                    {searchResult.map((post) => (
                      <li className="search-item" key={post.post_id}>
                        {post.title}
                      </li>
                    ))}
                  </ul>
                )
              )}
            </>
          )}
        </div>
      </div>
      <div className="user-info flex a-center" ref={modalRef}>
        {user ? (
          <>
            <div className="user-ava" onClick={() => handleDropdown()}>
              <img
                crossOrigin="anonymous"
                src={
                  userProfile?.profile_picture
                    ? userProfile?.profile_picture
                    : "/user.png"
                }
                alt="user-ava"
                className="ava"
                onError={(e) => {
                  e.target.src = "/public/user.png";
                }}
              />
              <img src="/up-arrow.png" alt="dropdown" className="icon" />
            </div>
            {isDropdown ? (
              <ul className="menu">
                <li className="menu-item">
                  <button
                    className="flex a-center"
                    onClick={() => handleButtonClick("profile")}
                  >
                    <img
                      crossOrigin="anonymous"
                      src={
                        userProfile?.profile_picture
                          ? userProfile?.profile_picture
                          : "/public/user.png"
                      }
                      alt="user-ava"
                      className="ava"
                    />
                    <div className="flex">
                      <div className="user-name">
                        <p>{`${userProfile?.first_name || ""} ${
                          userProfile?.last_name || ""
                        }`}</p>
                        <p>{userProfile?.email || ""}</p>
                      </div>
                    </div>
                  </button>
                </li>
                <li className="menu-item">
                  <button onClick={() => handleButtonClick("settings")}>
                    <img src="/settings.png" alt="setting-icon" />
                    <p>Edit my profile</p>
                  </button>
                </li>
                <li className="menu-item">
                  <button onClick={() => handleButtonClick("logout")}>
                    <img src="/logout.png" alt="activity-icon" />
                    <p>Log out</p>
                  </button>
                </li>
              </ul>
            ) : null}
          </>
        ) : (
          <ContentLoader
            speed={5}
            width={50}
            height={50}
            viewBox="0 0 400 160"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            className="user-info"
          >
            <rect x="0" y="56" rx="3" ry="3" width="410" height="6" />
            <rect x="0" y="72" rx="3" ry="3" width="380" height="6" />
            <rect x="0" y="88" rx="3" ry="3" width="178" height="6" />
          </ContentLoader>
        )}
      </div>
    </div>
  );
}

export default ChatHeader;
