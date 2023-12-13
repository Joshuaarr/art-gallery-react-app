import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import * as likesClient from "./client";
import * as gallaryClient from "../Gallary/client";
import * as client from "../../client";
import "../Gallary/index.css";

const LikesList = () => {
  const [likes, setLikes] = useState([]);
  const { currentUser } = useSelector((state) => state.userReducer);

  const fetchLikes = async () => {
    const likes = await likesClient.findArtsThatUserLikes(currentUser._id);
    setLikes(likes);
  };

  const [imageUrls, setImageUrls] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [selectedGalleries, setSelectedGalleries] = useState({});

  const fetchGalleries = async () => {
    const userGalleries = await gallaryClient.findGallariesThatUserCreates(currentUser._id);
    setGalleries(userGalleries);
  };

  const handleRemoveLike = async (artworkID) => {
    await likesClient.deleteUserLikesArt(currentUser._id, artworkID);
    fetchLikes();
  };

  const fetchImageUrls = async () => {
    try {
      if (likes && likes.length > 0) {
        const urls = await Promise.all(likes.map(like => client.findImageByID(like.artworkID)));
        setImageUrls(urls);
      }
    } catch (error) {
      console.error('Error fetching image URLs:', error);
    }
  };

  const handleAddToGallery = async (artworkID) => {
    const selectedGallery = selectedGalleries[artworkID];
    if (selectedGallery) {
      await gallaryClient.createUserAddToGallary(currentUser._id, selectedGallery, artworkID);
    }
  };

  useEffect(() => {
    fetchLikes();
    fetchGalleries();
  }, [currentUser]);

  useEffect(() => {
    fetchImageUrls();
  }, [likes]);

  return (
    <div className="ms-4 mt-3 me-1">
      <h2>Collection of {currentUser.username}</h2>
      <hr />
      <div className="gallary-list-group mt-1">
        {likes.map((like, index) => (
          <div className="row" style={{ minHeight: "200px", backgroundColor: "rgba(255, 255, 255, 80%)", marginTop: "10px" }} key={index}>
            <div className="col gallary-list-group card-title">
              <div className="row">
                <div className="col-4">
                  <div className="row">
                    <Link to={`/project/details/${like.artworkID}`}>
                      <img
                        src={imageUrls[index]}
                        style={{ maxWidth: "240px", margin: "5px" }}
                        alt={`Artwork ${like.artworkID}`}
                      />
                    </Link>
                  </div>
                </div>
                <div className="col-8">
                  <div className="row">
                    <select
                      className="form-control float-end mt-5"
                      value={selectedGalleries[like.artworkID] || ""}
                      style={{ maxWidth: "200px", height: "50px" }}
                      onChange={(e) => setSelectedGalleries((prev) => ({ ...prev, [like.artworkID]: e.target.value }))}
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
                    <button
                      className="btn btn-primary ms-2 mt-5"
                      style={{ backgroundColor: "black", border: "none", maxWidth: "150px", height: "50px" }}
                      onClick={() => handleAddToGallery(like.artworkID)}
                      disabled={!selectedGalleries[like.artworkID]}
                    >
                      Add to Gallery
                    </button>
                    <button
                      className="btn btn-primary mt-5 ms-5"
                      style={{ backgroundColor: "black", border: "none", maxWidth: "250px", height: "50px" }}
                      onClick={() => handleRemoveLike(like.artworkID)}
                    >
                      Remove Collection
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LikesList;
