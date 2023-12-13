import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import * as client from "./client";
import * as imageClient from "../../client";
import "./index.css";

const Gallary = () => {
  const { username, gallaryID } = useParams();
  const [ artWorks, setArtWroks] = useState([]);
  const { currentUser } = useSelector((state) => state.userReducer);
  const [imageUrls, setImageUrls] = useState([]);

  const fetchArtWorks = async () => {
    const currArtWorks = await client.findUserOneGallaryArtworks(currentUser._id, gallaryID);
    console.log(gallaryID);
    setArtWroks(currArtWorks);
  };

  const fetchImageUrls = async () => {
    try {
      if (artWorks && artWorks.length > 0) {
        const urls = await Promise.all(artWorks.map(artWork => imageClient.findImageByID(artWork.artworkID)));
        console.log(urls);
        setImageUrls(urls);
      }
    } catch (error) {
      console.error('Error fetching image URLs:', error);
    }
  };

  useEffect(() => {
    fetchArtWorks();
    fetchImageUrls();
  }, [currentUser]);

  useEffect(() => {
    fetchImageUrls();
  }, [artWorks]);
  
  return (
    <div>
      <h1>{gallaryID}</h1>
      <h5>Gallary of {currentUser.username}</h5>
      <ul className="gallary-list-group card-container">
        {artWorks.map((artWork, index) => (
          <div key={index} className="gallary-list-group card-size">
            <Link to={`/project/details/${artWork.artworkID}`}>
            <img
              src={imageUrls[index]}
              style={{ maxWidth: "250px", maxHeight: "220px", margin: "5px" }}
            />
            </Link>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Gallary;