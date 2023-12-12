import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import * as likesClient from "./client";
import * as gallaryClient from "../Gallary/client";

const LikesList = () => {
  const [likes, setLikes] = useState([]);
  const { currentUser } = useSelector((state) => state.userReducer);

  const fetchLikes = async () => {
    const likes = await likesClient.findArtsThatUserLikes(currentUser._id);
    setLikes(likes);
  };

  const [galleries, setGalleries] = useState([]);
  const [selectedGallery, setSelectedGallery] = useState("");

  const fetchGalleries = async () => {
    const userGalleries = await gallaryClient.findGallariesThatUserCreates(currentUser._id);
    setGalleries(userGalleries);
  };

  const handleRemoveLike = async (artworkID) => {
    const removedLike = await likesClient.deleteUserLikesArt(currentUser._id, artworkID);
    fetchLikes();
    
  };

  const handleAddToGallery = async (artworkID) => {
    const artWork = await gallaryClient.createUserAddToGallary(currentUser._id, selectedGallery, artworkID);
  };

  useEffect(() => {
    fetchLikes();
    fetchGalleries();
  }, [currentUser]);
  
  return (
    <div>
      <h3>Likes of {currentUser.username}</h3>
      <ul className="profile-list-group">
        {likes.map((like, index) => (
          <li key={index} className="list-group-item">
            <Link to={`/project/details/${like.artworkID}`}>
              {like.artworkID}
            </Link>

            <select
              value={selectedGallery}
              onChange={(e) => setSelectedGallery(e.target.value)}
            >
              <option value="" disabled>
                Select Gallery
              </option>
              {galleries.map((gallery) => (
                <option key={gallery} value={gallery}>
                  {gallery}
                </option>
              ))}
            </select>
            <button onClick={() => handleAddToGallery(like.artworkID)} disabled={!selectedGallery}>
              Add to Gallery
            </button>
            <button onClick={() => handleRemoveLike(like.artworkID)}>
              Remove Like
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LikesList;