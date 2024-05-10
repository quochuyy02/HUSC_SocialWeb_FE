/* eslint-disable react/prop-types */
import "../scss/User.scss";

function User({ user }) {
  console.log(user);
  return (
    <div className="user-item">
      <div className="user-item__avatar">
        <img
          src={user?.profile_picture}
          alt="User avatar"
          crossOrigin="anonymous"
          onError={(e) => {
            e.target.src = "/public/user.png";
          }}
        />
      </div>
      <div className="user-item__info">
        <h4>{`${user.first_name} ${user.last_name}`}</h4>
        <p className="nick-name">{user.nick_name}</p>
        <p>{user.location}</p>
        <p>{user.follower_count} Folowers</p>
      </div>
    </div>
  );
}

export default User;
