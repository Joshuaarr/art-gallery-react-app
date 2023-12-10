import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import * as client from "./client";

const Gallary = () => {
  const { username, gallaryID } = useParams();
  const [ artWorks, setArtWroks] = useState([]);
  const { currentUser } = useSelector((state) => state.userReducer);

  const fetchArtWorks = async () => {
    const currArtWorks = await client.findUserOneGallaryArtworks(currentUser._id, gallaryID);
    console.log(gallaryID);
    setArtWroks(currArtWorks);
  };

  useEffect(() => {
    fetchArtWorks();
  }, [currentUser]);
  
  return (
    <div>
      <h1>{gallaryID}</h1>
      <h5>Gallary of {currentUser.username}</h5>
      <ul className="list-group">
        {artWorks.map((artWork, index) => (
          <li key={index} className="list-group-item">
            <Link to={`/project/details/${artWork.artworkID}`}>
              {artWork.artworkID}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Gallary;