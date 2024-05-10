import { Code } from "react-content-loader";
import "../scss/PostDetail.scss";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import CodeBlock from "../ui/CodeBlock.jsx";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import moment from "moment";
import { useUser } from "../UserProvider.jsx";
import Comment from "../ui/Comment.jsx";
export default function PostDetail() {
  const [refresher, setRefresher] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [postDetail, setPostDetail] = useState(null);
  const [userComment, setUserComment] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModifyOpen, setModifyOpen] = useState(false);
  const SERVER_DOMAIN = import.meta.env.VITE_SERVER_DOMAIN;
  const { token } = useAuth();
  const { postId } = useParams();
  const { user } = useUser();
  const likeListRef = useRef();
  const modifyRef = useRef();
  const navigate = useNavigate();
  console.log(postDetail);
  const handleDeletePost = () => {
    axios
      .delete(`${SERVER_DOMAIN}/deletePost`, {
        data: {
          post_id: postId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success("Post deleted successfully!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 5000,
        });
        navigate("/home");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong! Please try again!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 5000,
        });
      });
  };
  const handleLikeButton = () => {
    console.log(postDetail);
    if (!postDetail.isLiked) {
      setPostDetail({
        ...postDetail,
        isLiked: true,
        Likes: [
          ...postDetail.Likes,
          { user_id: user.user.user_id, post_id: postDetail.post_id },
        ],
      });
      axios
        .post(
          `${SERVER_DOMAIN}/likePost`,
          {
            post_id: postId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {})
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong! Please try again!", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 5000,
          });
        });
    } else {
      setPostDetail({
        ...postDetail,
        isLiked: false,
        Likes: postDetail.Likes.filter(
          (like) => like.user_id !== user.user.user_id
        ),
      });
      axios
        .delete(`${SERVER_DOMAIN}/unlikePost/`, {
          data: {
            post_id: postId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {})
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong! Please try again!", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 5000,
          });
        });
    }
  };
  const handleSaveButton = () => {
    if (!postDetail.isSaved) {
      setPostDetail({
        ...postDetail,
        isSaved: true,
      });
      axios
        .post(
          `${SERVER_DOMAIN}/savePost`,
          {
            post_id: postId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          toast.success("Post saved successfully!", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 5000,
          });
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong! Please try later!", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 5000,
          });
        });
    } else {
      setPostDetail({
        ...postDetail,
        isSaved: false,
      });
      axios
        .delete(`${SERVER_DOMAIN}/unsavePost`, {
          data: {
            post_id: postId,
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
    }
  };
  const handleReportPost = () => {
    toast.info("This feature is not available yet!", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 5000,
    });
  };
  const handleUserComment = (e) => {
    setUserComment(e.target.value);
    autoResizeTextarea(e.target);
  };
  const autoResizeTextarea = (textarea) => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight + 25}px`;
  };
  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (userComment === "") {
      return;
    }

    axios
      .post(
        `${SERVER_DOMAIN}/addComment`,
        {
          post_id: postId,
          content: userComment,
          created_at: moment().unix(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setUserComment("");
        setRefresher(!refresher);
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
      .get(`${SERVER_DOMAIN}/postdetail/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setPostDetail(res.data.data);
        setIsLoading(false);
        console.log("postdetail", res.data.data);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setIsLoading(false);
          setIsNotFound(true);
        } else {
          toast.error("Something went wrong! Please try again!", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 5000,
          });
          console.log(err);
        }
      });
  }, [postId, refresher]);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        likeListRef.current &&
        e.target.contains(likeListRef.current) &&
        !modifyRef.current.contains(e.target)
      ) {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen || isModifyOpen)
      window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen, isModifyOpen]);
  if (isNotFound)
    return (
      <div className="post-not-found">
        <h2>Post not found!</h2>
      </div>
    );
  if (isLoading) {
    return <Code />;
  }
  return (
    <div className="post-detail">
      <div className="post-detail-header flex a-center j-between">
        <h1>{postDetail.title}</h1>
        <div className="post-detail-header-btn">
          <button className="post-save" onClick={handleSaveButton}>
            <i
              className={`${
                postDetail.isSaved ? "fa-solid" : "fa-regular"
              } fa-bookmark`}
            ></i>
          </button>
          <button className="post-like" onClick={handleLikeButton}>
            <i
              className={`${
                postDetail.isLiked ? "fa-solid" : "fa-regular"
              } fa-heart`}
            ></i>
          </button>
          <button
            className="post-edit"
            onClick={() => setModifyOpen((prev) => !prev)}
          >
            <i className="fa-solid fa-ellipsis"></i>
            {isModifyOpen && (
              <ul className="modify-dropdown" ref={modifyRef}>
                {postDetail.user_id === user?.user.user_id && (
                  <>
                    {/* <li>
                      <button type="button" onClick={handleEditButton}>
                        Edit
                      </button>
                    </li> */}
                    <li>
                      <button type="button" onClick={handleDeletePost}>
                        Delete
                      </button>
                    </li>
                  </>
                )}
                <li>
                  <button type="button" onClick={handleReportPost}>
                    Report
                  </button>
                </li>
              </ul>
            )}
          </button>
        </div>
      </div>
      <div className="post-detail-content">
        <p
          className="post-content"
          dangerouslySetInnerHTML={{ __html: postDetail.content }}
        ></p>
      </div>
      {postDetail.code && (
        <div className="post-detail-code">
          <CodeBlock codeString={postDetail?.code} />
        </div>
      )}

      <div className="post-detail-hashtag">
        {postDetail.tags?.split(",").map((tag) => (
          <span className="hashtag" key={tag}>
            #{tag}
          </span>
        ))}
      </div>
      <div className="post-detail-description flex a-center j-between">
        <div className="post-detail-voting">
          <span
            className="number-of-likes"
            onClick={() => setIsModalOpen(true)}
          >
            <i className="fa-solid fa-heart"></i> {postDetail.Likes.length}{" "}
            Likes
          </span>
          <span className="number-of-comment">
            <i className="fa-solid fa-comments"></i>{" "}
            {postDetail.Comments.length} Comments
          </span>
        </div>
        <div className="post-info flex a-center">
          <img
            crossOrigin="anonymus"
            src={postDetail.user?.profile_picture}
            alt=""
          />
          <p
            className="post-description"
            onClick={() =>
              navigate(`/home/profile/${postDetail.user?.user_id}`)
            }
          >
            {postDetail.user?.first_name} {postDetail.user?.last_name} |{" "}
            {moment.unix(postDetail.created_at).format("LLL")}
          </p>
        </div>
      </div>

      <div className="post-detail-create-comment flex a-center ">
        <img
          crossOrigin="anonymous"
          src={user?.user?.profile_picture || "/user.png"}
          alt="user-ava"
        />
        <textarea
          type="text"
          placeholder="Write something..."
          value={userComment}
          onChange={handleUserComment}
        ></textarea>

        <img
          src="/comment-icon.png"
          alt="comment icon"
          className="comment-icon"
          onClick={handleSubmitComment}
        />
      </div>

      <div className="post-detail-comment">
        {postDetail?.Comments.map((comment) => (
          <Comment
            comment={comment}
            key={comment.comment_id}
            setRefresher={setRefresher}
            postDetail={postDetail}
            setPostDetail={setPostDetail}
            userId={user?.user?.user_id}
            token={token}
          />
        ))}
      </div>
      {isModalOpen && (
        <ul className="like-list" ref={likeListRef}>
          <h2>Who likes</h2>
          <img
            src="/close.png"
            alt="/close.png"
            className="btn-close"
            onClick={() => setIsModalOpen(false)}
          />

          {postDetail.Likes?.map((like) => (
            <li key={like.user_id}>
              <button
                type="button"
                className="flex a-center"
                onClick={() => navigate(`/home/profile/${like.user_id}`)}
              >
                <img
                  crossOrigin="anonymus"
                  src={like?.user?.profile_picture}
                  alt="Profile Picture"
                />
                <p>
                  {like.user?.first_name} {like.user?.last_name}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
