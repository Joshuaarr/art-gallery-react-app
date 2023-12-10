import React from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import * as client from "../client";
import * as likesClient from "../likes/client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as followsClient from "../follows/client";
function Profile() {
  const [user, setUser] = useState(null);
  const [likes, setLikes] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const { currentUser } = useSelector((state) => state.userReducer);
  const { id } = useParams();
  const { pathname } = useLocation();
  const [pathnameKey, setPathnameKey] = useState(pathname);
  const [currId, setCurrId] = useState(() => id || (currentUser ? currentUser._id : null));
  const fetchLikes = async () => {
    const likes = await likesClient.findArtsThatUserLikes(currId);
    setLikes(likes);
  };
  const navigate = useNavigate();
  const fetchUser = async () => {
      const user = await client.findUserById(currId);
      setUser(user);
  };

  const followUser = async () => {
    const status = await followsClient.userFollowsUser(currId);
  };
  const unfollowUser = async () => {
    const status = await followsClient.userUnfollowsUser(currId);
  };
  const fetchFollowers = async () => {
    const followers = await followsClient.findFollowersOfUser(currId);
    setFollowers(followers);
  };
  const fetchFollowing = async () => {
    const following = await followsClient.findFollowedUsersByUser(currId);
    setFollowing(following);
    console.log(following);
  };
  const alreadyFollowing = () => {
    return followers.some((follows) => {
      return follows.follower._id === currentUser._id;
    });
  };
  useEffect(() => {
    setCurrId(id || (currentUser ? currentUser._id : null));
    fetchUser();
    fetchLikes();
    fetchFollowers();
    fetchFollowing();
  }, [id, currentUser, pathnameKey]);
  
  useEffect(() => {
    setCurrId(id || (currentUser ? currentUser._id : null))
    setPathnameKey(pathname);
  }, [pathname]);
  return (
    <div>
      {currentUser && currentUser._id !== currId && (
        <>
          {alreadyFollowing() ? (
            <button onClick={unfollowUser} className="btn btn-danger float-end">
              Unfollow
            </button>
          ) : (
            <button onClick={followUser} className="btn btn-warning float-end">
              Follow
            </button>
          )}
        </>
      )}
      
      {user && (
        <div>
          <h2>{user.username}'s Profile</h2>
          {currentUser && currId === currentUser._id ?(
          <>
            <p>Email: {user.email}</p>
            <p>
              First Name: {user.firstName}
            </p>
            <p>Last Name: {user.lastName}</p>
            <Link to={`/project/account`}>
              <button className="btn btn-primary">
                Update Personal Information
              </button>
            </Link>
          </>
          ) : null}
          <Link to={`/project/${user.username}/gallary`}>
            <h3>Gallary</h3>
          </Link>
          {currentUser && currId === currentUser._id ? (
            <Link to={`/project/likes`}>
              <h3>Likes</h3>
            </Link>
          ) : (
            <h3>Likes</h3>
          )}
          <ul className="list-group">
            {likes.slice(0, 10).map((like, index) => (
              <li key={index} className="list-group-item">
                <Link to={`/project/details/${like.artworkID}`}>
                  {like.artworkID}
                </Link>
              </li>
            ))}
          </ul>
          <h3>Followers</h3>
          <div className="list-group">
            {followers.slice(0, 10).map((follows, index) => (
              <Link
                key={index}
                className="list-group-item"
                to={`/project/profile/${follows.follower._id}`}
              >
                {follows.follower.username}
              </Link>
            ))}
          </div>
          <h3>Following</h3>
          <div className="list-group">
            {following.slice(0, 10).map((follows, index) => (
              <Link
                key={index}
                className="list-group-item"
                to={`/project/profile/${follows.followed._id}`}
              >
                {follows.followed.username}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;