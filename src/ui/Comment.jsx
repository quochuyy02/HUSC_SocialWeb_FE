/* eslint-disable react/prop-types */

import moment from "moment";
import { useEffect, useRef, useState } from "react";
import "./../scss/Comment.scss";
import axios from "axios";
import { toast } from "react-toastify";
import ShowMoreText from "react-show-more-text";
import { Navigate, useNavigate } from "react-router-dom";

function Comment({
  comment,
  userId,
  setRefresher,
  token,
  postDetail,
  setPostDetail,
}) {
  const modalRef = useRef();
  const [isDropdown, setIsDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [curComment, setCurComment] = useState(comment.content);
  const [editTime, setEditTime] = useState(comment.updated_at);
  const [editedComment, setEditedComment] = useState(comment.content);
  const SERVER_DOMAIN = import.meta.env.VITE_SERVER_DOMAIN;
  const navigate = useNavigate();
  const handleEditComment = () => {
    setCurComment(editedComment);
    setIsEditing(false);
    const editTimeUnix = moment().unix();
    setEditTime(editTimeUnix);
    axios
      .patch(
        `${SERVER_DOMAIN}/editComment`,
        {
          comment_id: comment.comment_id,
          content: editedComment,
          updated_at: editTimeUnix,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {})
      .catch(() => {
        toast.error("Something went wrong! Please try again!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 5000,
        });
      });
  };
  const handleEditButton = () => {
    setIsDropdown(false);
    setIsEditing(true);
  };
  const handleDeleteComment = () => {
    const newComments = postDetail.Comments.filter(
      (cmt) => cmt.comment_id != comment.comment_id
    );
    setPostDetail({ ...postDetail, Comments: newComments });
    axios
      .delete(`${SERVER_DOMAIN}/deleteComment`, {
        data: {
          comment_id: comment.comment_id,
          created_at: moment().unix(),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success("Delete comment successfully!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 5000,
        });
        setRefresher((prev) => !prev);
      })
      .catch(() => {
        toast.error("Something went wrong! Please try again!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 5000,
        });
      });
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        console.log(modalRef.current.contains(event.target));
        setIsDropdown(false);
      }
    };

    if (isDropdown) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isDropdown]);
  useEffect(() => {
    const handleEscapeEvent = (e) => {
      if (e.key === "Escape") {
        setIsEditing(false);
      }
    };

    if (isEditing) window.addEventListener("keydown", handleEscapeEvent);
    return () => window.removeEventListener("keydown", handleEscapeEvent);
  }, [isEditing]);
  return (
    <div className="comment-detail flex" key={comment.comment_id}>
      <img
        crossOrigin="anonymous"
        src={comment.user.profile_picture}
        alt="user-ava"
      />
      <div className="wrapper">
        <h3 onClick={() => navigate("/home/profile/" + comment.user.user_id)}>
          {comment.user.first_name} {comment.user.last_name}
        </h3>
        {isEditing && (
          <>
            <div className="edit-comment">
              <textarea
                type="text"
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
                minLength={1}
              />

              <img
                src="/comment-icon.png"
                alt="Edit comment icon"
                onClick={handleEditComment}
              />
            </div>
            <p className="cancle-noti">
              Press Esc to <u onClick={() => setIsEditing(false)}>cancle</u>.
            </p>
          </>
        )}
        {!isEditing && (
          <>
            <ShowMoreText
              lines={5}
              more="Show more"
              less="Show less"
              className="expanded-comment"
              anchorClass="show-more-less-clickable"
              onClick={null}
              expanded={false}
              truncatedEndingComponent={"... "}
            >
              <p>{curComment} </p>
            </ShowMoreText>
            <p className="comment-time">
              {editTime
                ? moment(new Date(editTime * 1000)).format("LLL") + " (edited)"
                : moment(new Date(comment.created_at * 1000)).format("LLL")}
            </p>
          </>
        )}
      </div>
      <button
        type="button"
        className="modify-button"
        onClick={() => setIsDropdown(true)}
      >
        <i className="fa-solid fa-ellipsis"></i>
      </button>
      {isDropdown && (
        <ul className="modify-dropdown" ref={modalRef}>
          {userId === comment?.user?.user_id && (
            <>
              <li>
                <button type="button" onClick={handleEditButton}>
                  Edit
                </button>
              </li>
              <li>
                <button type="button" onClick={handleDeleteComment}>
                  Delete
                </button>
              </li>
            </>
          )}
          {userId !== comment?.user?.user_id && (
            <>
              <li>
                <button type="button">Report</button>
              </li>
            </>
          )}
        </ul>
      )}
    </div>
  );
}

export default Comment;
