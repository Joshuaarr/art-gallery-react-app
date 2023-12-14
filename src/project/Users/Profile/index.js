import React from "react";
import { useParams, useNavigate, Link, useLocation, Route, Routes } from "react-router-dom";
import * as client from "../client";
import * as likesClient from "../likes/client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as followsClient from "../follows/client";
import * as imageClient from "../../client";
import * as gallaryClient from "../Gallary/client";
import "./index.css";
import "../Gallary/index.css";
function Profile() {



  const [gallaries, setGallaries] = useState([]); 
  const [gImageUrls, setGImageUrls] = useState([]);
  const [distinctGallaryIDs, setGallaryIDs] = useState([]);
  const fetchGallaries = async () => {
    try {
      // Fetch distinct gallaryIDs
      const distinctGallaryIDs = await gallaryClient.findGallariesThatUserCreates(currId);
      setGallaryIDs(distinctGallaryIDs);

      // Fetch details for each gallaryID
      const fetchedGallaries = await Promise.all(
        distinctGallaryIDs.map(async (gallaryID) => {
          const gallary = await gallaryClient.findOneGallery(gallaryID);
          return gallary;
        })
      );
      setGallaries(fetchedGallaries);
    } catch (error) {
      console.error("Error fetching gallaries:", error);
    }
  };




  const [user, setUser] = useState(null);
  const [likes, setLikes] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const { currentUser } = useSelector((state) => state.userReducer);
  const { id } = useParams();
  const { pathname } = useLocation();
  const [pathnameKey, setPathnameKey] = useState(pathname);
  const [currId, setCurrId] = useState(() => id || (currentUser ? currentUser._id : null));
  const [imageUrls, setImageUrls] = useState([]);
  const fetchLikes = async () => {
    const likes = await likesClient.findArtsThatUserLikes(currId);
    setLikes(likes);
  };
  const navigate = useNavigate();
  const fetchUser = async () => {
      const user = await client.findUserById(currId);
      setUser(user);
  };

  const fetchImageUrls = async () => {
    try {
      if (likes && likes.length > 0) {
        const urls = await Promise.all(likes.map(like => imageClient.findImageByID(like.artworkID)));
        setImageUrls(urls);

        const gurls = await Promise.all(gallaries.map(gallary => imageClient.findImageByID(gallary.artworkID)));
        setGImageUrls(gurls);
      }
    } catch (error) {
      console.error('Error fetching image URLs:', error);
    }
  };


  const followUser = async () => {
    const status = await followsClient.userFollowsUser(currId);
    fetchFollowers();
  };
  const unfollowUser = async () => {
    const status = await followsClient.userUnfollowsUser(currId);
    fetchFollowers();
  };
  const fetchFollowers = async () => {
    const followers = await followsClient.findFollowersOfUser(currId);
    setFollowers(followers);
  };
  const fetchFollowing = async () => {
    const following = await followsClient.findFollowedUsersByUser(currId);
    setFollowing(following);
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
    fetchGallaries();
  }, [id, currentUser, pathnameKey]);

  useEffect(() => {
    fetchFollowers();
    fetchFollowing();
    fetchGallaries();
  }, [pathnameKey]);


  useEffect(() => {
    fetchImageUrls();
  }, [likes, gallaries]);


  
  useEffect(() => {
    setCurrId(id || (currentUser ? currentUser._id : null))
    setPathnameKey(pathname);
  }, [pathname]);
  return (
    <div className="container ms-2 mt-2">
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
              <button className="btn btn-primary" style={{backgroundColor: "black", border: "none"}}>
                Update Personal Information
              </button>
            </Link>
          </>
          ) : null}
          <hr />
          <br />
          {user.role === "CREATER" && (
          <>
            <h3> Galleries </h3>
            <div className="gallary-list-group card-container m-1">
              {gallaries.map((gallary, index) => (
                currentUser && currId === currentUser._id ?(
                  <>
                    <Link
                    key={gallary.gallaryID}
                    to={`/project/gallary/${gallary.gallaryID}`}
                    className="gallary-list-group card-size card-title">

                    <img
                      key={gallary.artworkID}
                      src={imageUrls[index]}
                      alt={`Artwork ${gallary.artworkID}`}
                      style={{ maxWidth: "250px", maxHeight: "220px", margin: "5px" }}
                    />
                    <p className="card-title ms-2">
                      {gallary.gallaryID}
                    </p>
                    </Link>
                  </>
                ):(
                  <>
                    <Link
                    key={gallary.gallaryID}
                    to={`/project/${currId}/gallary/${gallary.gallaryID}`}
                    className="gallary-list-group card-size card-title">

                    <img
                      key={gallary.artworkID}
                      src={imageUrls[index]}
                      alt={`Artwork ${gallary.artworkID}`}
                      style={{ maxWidth: "250px", maxHeight: "220px", margin: "5px" }}
                    />
                    <p className="card-title ms-2">
                      {gallary.gallaryID}
                    </p>
                    </Link>
                  </>
                )
              ))
            }
        </div>
        </>)}
          <div className="row mt-5">
          <div className="col-8">
          <h3 className="">Collections</h3>
          </div>
          <div className="col-4">
          {currentUser && currId === currentUser._id ? (
            <Link to={`/project/likes`}>
              <button className="btn btn-primary float-end" style={{backgroundColor: "black", border: "none"}}>
                Go to All Collections
              </button>
            </Link>
          ) : (
            null
          )}
          </div>
          </div>
          <div className="gallary-list-group card-container m-1">
            {likes.slice(0, 10).map((like, index) => (
              <Link key={index} className="gallary-list-group card-size card-title" to={`/project/details/${like.artworkID}`}>
                <img
                  key={index}
                  src={imageUrls[index]}
                  style={{ maxWidth: "250px", maxHeight: "220px", margin: "5px" }}
                />
                </Link>
            ))}
          </div>
          <h3>Followers</h3>
          <div className="profile-list-group card-container">
            {followers.slice(0, 10).map((follows, index) => (
              <Link
                key={index}
                className="profile-list-group card-size card-title"
                to={`/project/profile/${follows.follower._id}`}
              >
                {follows.follower.username}
              </Link>
            ))}
          </div>
          <h3>Following</h3>
          <div className="profile-list-group card-container">
            {following.slice(0, 10).map((follows, index) => (
              <Link
                key={index}
                className="profile-list-group card-size card-title"
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