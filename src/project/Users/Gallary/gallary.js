import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import * as client from "./client";
import * as imageClient from "../../client";
import * as userClient from "../client";
import "./index.css";

const Gallary = () => {
  const { userID, gallaryID } = useParams();
  const [artWorks, setArtWroks] = useState([]);
  const { currentUser } = useSelector((state) => state.userReducer);
  const [imageUrls, setImageUrls] = useState([]);
  const [user, setUser] = useState(null);
  const [currId, setCurrId] = useState(() => userID || (currentUser ? currentUser._id : null));

  const fetchData = async () => {
    try {
      if (currId) {
        const user = await userClient.findUserById(currId);
        setUser(user);

        const currArtWorks = await client.findUserOneGallaryArtworks(currId, gallaryID);
        setArtWroks(currArtWorks);

        if (currArtWorks && currArtWorks.length > 0) {
          const urls = await Promise.all(currArtWorks.map((artWork) => imageClient.findImageByID(artWork.artworkID)));
          setImageUrls(urls);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    setCurrId(userID || (currentUser ? currentUser._id : null));
  }, [userID, currentUser]);

  useEffect(() => {
    fetchData();
  }, [currId, gallaryID]);
  
  return (
    <div className="ms-4">
      {user && (
          <>
      <h1>{gallaryID}</h1>
      <h5>Gallary of {user.username}</h5>
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
      </>)}
    </div>
  );
};

export default Gallary;