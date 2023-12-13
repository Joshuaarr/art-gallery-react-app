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
  const [processedText, setProcessedText] = useState("no discription yet");

  const convertDiscription = async () => {
    const tempElement = document.createElement('div');
    console.log(art);
    tempElement.innerHTML = art.data.description;
    setProcessedText(tempElement.textContent || tempElement.innerText);
  }
  

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
  const fetchImageURL = async () => {
    try {
      const imageURL = await client.findImageByID(artworkID);
      setImgURL(imageURL);
    } catch (error) {
      console.error('Error fetching image URL:', error);
    }
  };

  useEffect(() => {
    fetchImageURL();
  }, [artworkID]);

  useEffect(() => {
    fetchLikes();
  }, [likes]);

  useEffect(() => {
    if(art !== null){
      convertDiscription();
    }
  }, [art]);

  useEffect(() => {
    fetchUser();
    fetchLikes();
    fetchArt();
  }, []);

  return (
    <div className="mt-4 container-fluid" style={{maxWidth: "1000px"}}>
      {art && (
        <div className="row">
          <div className="col-8">
              <h1>{art.title}</h1>
              <img
                src={imgURL}
                alt={art.title}
                className="img-fluid"
              />
              <h1>{art.data.title}</h1>
              <h5 className="mt-5">
              artist display: </h5>{art.data.artist_display}
              <h5 className="mt-4">
              place of origin: </h5>{art.data.place_of_origin}
              <h5 className="mt-4">
              description: </h5>{processedText}
              <h5 className="mt-4">
              source: </h5>{art.config.website_url}
          </div>
          <div className="col-4 mt-5">
            {currentUser && (
                  <button
                    onClick={currenUserLikesArt}
                    className="btn btn-primary"
                    style={{backgroundColor: "black", border: "none"}}
                  >
                    Add to Collection
                  </button>
                )}

            <h4 className="mt-5 ms-2 mb-4">Collectors ({likes.length}):</h4>
            <ul>
              {likes.slice(0, 10).map((like, index) => (
                <ul key={index}>
                  <Link className="profile-list-group card-size card-title" to={`/project/users/${like.user._id}`}>
                    @{like.user.firstName} {like.user.lastName}
                  </Link>
                </ul>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
  
}

export default Details;