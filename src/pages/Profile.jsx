import { Code } from "react-content-loader";
import { useUser } from "../UserProvider";
import "../scss/Profile.scss";

import CreatePost from "./CreatePost";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "./Post";
import { useAuth } from "../AuthProvider";
import CreatePostModal from "../ui/CreatePostModal";
import { toast } from "react-toastify";

export default function Profile() {
  const { user, handleGetProfile } = useUser();
  const { token, setToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true); // [true, function
  const page = useRef(1);
  const [userProfile, setUserProfile] = useState(null);
  const SERVER_DOMAIN = import.meta.env.VITE_SERVER_DOMAIN;
  const [modalIsOpen, setIsOpen] = useState(false);
  const { userId } = useParams();
  const navigate = useNavigate();
  console.log("user", userProfile);
  const handleFollow = () => {
    axios
      .post(
        SERVER_DOMAIN + "/user/follow",
        {
          following_id: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setUserProfile({
          ...userProfile,
          isFollowing: true,
          followers: userProfile.followers + 1,
        });
        handleGetProfile();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong! Please try again!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 5000,
        });
      });
  };
  const handleUnfollow = () => {
    axios
      .post(
        SERVER_DOMAIN + "/user/unfollow",
        {
          following_id: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setUserProfile({
          ...userProfile,
          isFollowing: false,
          followers: userProfile.followers - 1,
        });
        handleGetProfile();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong! Please try again!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 5000,
        });
      });
  };
  useEffect(() => {
    axios
      .get(SERVER_DOMAIN + "/user/getProfile/" + userId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("profile", res.data);
        setUserProfile(res.data.data.user);
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
      });
  }, []);
  useEffect(() => {
    axios
      .get(SERVER_DOMAIN + `/getPosts?page=1&limit=5&userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("data", res.data.data);
        setIsLoading(false);
        setPosts(res.data.data);
      });
  }, [userProfile]);
  const fetchPosts = () => {
    page.current += 1;
    axios
      .get(
        SERVER_DOMAIN +
          `/getPosts?page=${page.current}&limit=5&userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.data.data.length === 0) {
          setHasMore(false);
          return;
        }
        setHasMore(true);
        console.log("fetch", res.data.data);
        setPosts([...posts, ...res.data.data]);
      })
      .catch((err) => {
        console.log(err);
        setHasMore(false);
      });
  };
  if (!user || !userProfile) return <Code />;
  return (
    <div className="profile">
      <div className="profile-header flex a-center">
        <div className="flex a-center">
          <div className="avatar-user">
            <img
              crossOrigin="anonymous"
              src={userProfile.profile_picture}
              alt="User profile"
              onError={(e) => {
                e.target.src = "/public/user.png";
              }}
            />
          </div>
          <div className="profile-information ">
            <div className="profile-name flex a-center">
              <h3 className="first-name">{userProfile.first_name}</h3>
              <h3 className="last-name">{userProfile.last_name}</h3>
              <p>{userProfile.nick_name ? `(${userProfile.nick_name})` : ""}</p>
            </div>
            <h5 className="followers">{userProfile.followers} followers</h5>
          </div>
        </div>
        <div className="follow-button">
          {userProfile.user_id !== user?.user?.user_id &&
            (userProfile.isFollowing ? (
              <button
                className="following flex a-center"
                onClick={handleUnfollow}
              >
                Following
                <img src="/check.png" alt="" />
              </button>
            ) : (
              <button className="follow" onClick={handleFollow}>
                Follow
              </button>
            ))}
        </div>
      </div>
      <div className="profile-section flex j-between">
        <div className="portfolio">
          <h3>Portfolio</h3>
          <div className="wrapper">
            <i className="fa-solid fa-envelope"></i>
            <span>{userProfile.email}</span>
          </div>
          {userProfile.location && (
            <div className="wrapper">
              <i className="fa-solid fa-location-dot"></i>
              <span>{userProfile.location}</span>
            </div>
          )}

          <div className="wrapper">
            <i className="fa-solid fa-comment"></i>
            <span>Bio</span>
            <textarea disabled name="" id="" cols="53" rows="10">
              {userProfile.bio}
            </textarea>
          </div>
          {userProfile.user_id === user?.user?.user_id && (
            <div className="edit-profile">
              <Link to="/home/profiledetail">Edit profile</Link>
            </div>
          )}
        </div>
        <div className="user-post">
          {userProfile.user_id === user?.user?.user_id && (
            <>
              <CreatePost
                setIsOpen={setIsOpen}
                profilePicture={userProfile.profile_picture}
              />
              <CreatePostModal
                modalIsOpen={modalIsOpen}
                setIsOpen={setIsOpen}
                user={user?.user}
              />
            </>
          )}

          {!isLoading ? (
            <InfiniteScroll
              dataLength={posts.length}
              next={fetchPosts}
              hasMore={hasMore}
              loader={<Code className="post" />}
              endMessage={
                <p style={{ textAlign: "center", marginTop: "2rem" }}>
                  <b>Yay! You have seen it all</b>
                </p>
              }
            >
              {posts?.map((post) => (
                <Post post={post} key={post.post_id} />
              ))}
            </InfiniteScroll>
          ) : (
            <>
              <Code className="post" />
              <Code className="post" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
