import moment from "moment";
import "../scss/SavedPosts.scss";
import { useUser } from "../UserProvider";
import { Code } from "react-content-loader";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "./Post";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthProvider";
import { toast } from "react-toastify";

function SavedPost() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useUser();
  const created_at = user?.user?.created_at;
  const { token } = useAuth();
  let date = new Date(created_at * 1000);
  let date_string = moment(date).format("LLL");
  const page = useRef(1);
  const SERVER_DOMAIN = import.meta.env.VITE_SERVER_DOMAIN;
  const handleUnsavePost = (post_id) => {
    setPosts(posts.filter((post) => post.post_id !== post_id));
    axios
      .delete(`${SERVER_DOMAIN}/unsavePost`, {
        data: {
          post_id: post_id,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {})
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong! Please try later!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 5000,
        });
      });
  };
  const fetchPosts = () => {
    page.current += 1;
    axios
      .get(SERVER_DOMAIN + `/getSavedPosts?page=${page.current}&limit=5`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.data.length === 0) {
          setHasMore(false);
          return;
        }
        console.log("fetch", res.data.data);
        setPosts([...posts, ...res.data.data]);
      })
      .catch((err) => {
        console.log(err);
        setHasMore(false);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(SERVER_DOMAIN + `/getSavedPosts?page=1&limit=5`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("data", res.data.data);
        setIsLoading(false);
        setPosts(res.data.data);
      });
  }, []);
  return (
    <div className="saved-post">
      <div className="saved-post-header">
        <div className="profile-info">
          <img src={user.user.profile_picture} alt="" crossOrigin="anonymous" />
          <div className="">
            <div className="name">{`${user.user.first_name} ${user.user.last_name}`}</div>
            <p>{`Member since ${date_string}`}</p>
          </div>
        </div>
        <div className="header-button">
          <button>Edit Profile</button>
          <button>Network Profile</button>
        </div>
      </div>

      <div className="saved-post-body">
        <h1>Saved Post</h1>
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
              <Post
                post={post.post}
                key={post.post_id}
                isSavedPost={true}
                handleUnsavePost={handleUnsavePost}
              />
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
  );
}

export default SavedPost;
