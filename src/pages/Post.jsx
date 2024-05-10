/* eslint-disable react/prop-types */
import "../scss/Post.scss";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
function Post({ post, isSavedPost, handleUnsavePost }) {
  const { post_id, title, tags, user, created_at, likeCount, commentCount } =
    post;
  const navigate = useNavigate();
  let date = new Date(created_at * 1000);
  let date_string = moment(date).format("LLL");

  return (
    <div className="post flex">
      <div className="stats">
        <p>{likeCount} Likes</p>
        <p>{commentCount} Comments</p>
      </div>
      <div className="question">
        <Link to={`/home/post/${post_id}`}>
          <h3 className="title">{title}</h3>
        </Link>
        <div className="tags flex ">
          {tags
            ?.split(",")

            .map((tag) => (
              <p
                key={tag}
                onClick={() =>
                  navigate(
                    "/home/search?q=" + encodeURIComponent(`@tag:${tag}`)
                  )
                }
              >
                {tag}{" "}
              </p>
            ))}
        </div>
        <div className="post-info flex a-center">
          <img
            crossOrigin="anonymus"
            src={user?.profile_picture}
            alt=""
            onError={(e) => {
              e.target.src = "/public/user.png";
            }}
          />
          <p
            className="post-description"
            onClick={() => navigate(`/home/profile/${user?.user_id}`)}
          >
            {user?.first_name} {user?.last_name} | {date_string}
          </p>
        </div>
      </div>
      {isSavedPost && (
        <>
          <div className="unsave-post">
            <button
              data-tooltip-id="unsave-button"
              data-tooltip-content="Unsave Post"
              data-tooltip-place="top"
              onClick={() => handleUnsavePost(post_id)}
            >
              <i className="fa-regular fa-bookmark"></i>
            </button>
          </div>
          <Tooltip id="unsave-button" />
        </>
      )}
    </div>
  );
}

export default Post;
