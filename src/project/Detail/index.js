import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import * as client from "../client";
import * as userClient from "../Users/client";
import * as likesClient from "../Users/likes/client";

function Details() {
  const [currentUser, setCurrentUser] = useState(null);
  const [art, setArt] = useState(null);
  const { artworkID } = useParams();
  const [imgURL, setImgURL] = useState('');
  const [likes, setLikes] = useState([]);

  const fetchUser = async () => {
    try {
      const user = await userClient.account();
      setCurrentUser(user);
    } catch (error) {
      setCurrentUser(null);
    }
  };

  const fetchLikes = async () => {
    const likes = await likesClient.findUsersThatLikeArt(artworkID);
    setLikes(likes);
  };

  const currenUserLikesArt = async () => {
    const _likes = await likesClient.createUserLikesArt(
      currentUser._id,
      artworkID
    );
    setLikes([_likes, ...likes]);
  };

  const fetchArt = async () => {
    const result = await client.findArtByID(artworkID);
    setArt(result);
  };

  useEffect(() => {
    const fetchImageURL = async () => {
      try {
        const imageURL = await client.findImageByID(artworkID);
        setImgURL(imageURL);
      } catch (error) {
        console.error('Error fetching image URL:', error);
      }
    };

    fetchImageURL();
  }, [artworkID]);

  useEffect(() => {
    fetchUser();
    fetchLikes();
    fetchArt();
  }, []);

  return (
    <div>
      {art && (
        <div>
           {currentUser && (
            <button
              onClick={currenUserLikesArt}
              className="btn btn-warning float-end"
            >
              Like
            </button>
          )}
          <h1>{art.title}</h1>
          <img
            src={imgURL}
            alt={art.title}
          />
          <pre>{JSON.stringify(art, null, 2)}</pre>
          <h2>Likes</h2>
          <ul className="list-group">
            {likes.map((like, index) => (
              <li key={index} className="list-group-item">
                {like.user.firstName} {like.user.lastName}
                <Link to={`/project/users/${like.user._id}`}>
                  @{like.user.username}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Details;