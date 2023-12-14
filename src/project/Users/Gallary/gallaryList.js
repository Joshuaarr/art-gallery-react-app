import * as client from "./client";
import * as userClient from "../client";
import * as imageClient from "../../client";
import { useEffect, useState } from "react";
import { Link, Navigate, useParams} from "react-router-dom";
import { useSelector } from 'react-redux';
import "./index.css";


function GallaryList() {
  const {userID} = useParams();
  const [user, setUser] = useState(null);
  const { currentUser } = useSelector((state) => state.userReducer);
  const [currId, setCurrId] = useState(() => userID || (currentUser ? currentUser._id : null));

  const [newGallaryName, setNewGallaryName] = useState('');
  const [gallaries, setGallaries] = useState([]); 
  const [imageUrls, setImageUrls] = useState([]);
  const [distinctGallaryIDs, setGallaryIDs] = useState([]);

  const fetchImageUrls = async () => {
    try {
    if (gallaries && gallaries.length > 0) {
        const urls = await Promise.all(gallaries.map(gallary => imageClient.findImageByID(gallary.artworkID)));
        setImageUrls(urls);
    }
    } catch (error) {
    console.error('Error fetching image URLs:', error);
    }
  };

  const deleteGallaryByID = async (gallaryID) => {
    const deletedGallary = await client.deleteGallaryByID(gallaryID);
    fetchGallaries();
  }

  
  const fetchGallaries = async () => {
      try {
        // Fetch distinct gallaryIDs
        const distinctGallaryIDs = await client.findGallariesThatUserCreates(currId);
        setGallaryIDs(distinctGallaryIDs);
  
        // Fetch details for each gallaryID
        const fetchedGallaries = await Promise.all(
          distinctGallaryIDs.map(async (gallaryID) => {
            const gallary = await client.findOneGallery(gallaryID);
            return gallary;
          })
        );
        setGallaries(fetchedGallaries);
      } catch (error) {
        console.error("Error fetching gallaries:", error);
      }
    };
  const createNewGallary = async () => {
      try {
          const response = await client.createUserAddToGallary(currentUser._id, newGallaryName, "117241");
          setGallaries([...gallaries, response]);
          setNewGallaryName('');
      } catch (error) {
          console.error("Error creating new gallery:", error);
      }
  };
  const fetchUser = async () => {
    const user = await userClient.findUserById(currId);
    setUser(user);
};

  useEffect(() => {
    setCurrId(userID || (currentUser ? currentUser._id : null));
  }, []);

  useEffect(() => {
    fetchUser();
    fetchGallaries();
  }, [currId]);

  useEffect(() => {
      fetchImageUrls();
    }, [gallaries]);
  return (
    <div className="ms-4 mt-2">
      
      {user && (
          <>
          <h3>{user.username}'s Gallary List</h3>
          <div>
            {currentUser && currId === currentUser._id ?(
              <>
                <div className="row">
                  <div className="col-8">
                    <input
                        type="text"
                        className="form-control m-1"
                        placeholder="Enter new gallery name"
                        value={newGallaryName}
                        onChange={(e) => setNewGallaryName(e.target.value)}
                    />
                  </div>
                  <div className="col-4">
                    <button onClick={createNewGallary} className="btn btn-primary float-end m-1" style={{backgroundColor: "black", border: "none"}}>Create Gallary</button>
                  </div>
                </div>
              </>) : (null)}
          </div>
          <div className="gallary-list-group m-1 card-container">
            {gallaries.map((gallary, index) => (
              currentUser && currId === currentUser._id ?(
                <>
                <div className="gallary-list-group ">
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
                  <p className="card-title ms-2 card-size">
                    {gallary.gallaryID}
                  </p>
                  </Link>
                  <botton
                    className="btn btn-danger ms-2"
                    style={{border: "none"}}
                    onClick={() => deleteGallaryByID(gallary.gallaryID)}
                  >
                    Delete Gallary
                  </botton>
                  </div>
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
            ))}
        </div>
        </>
      )}
    </div>
  );
}

export default GallaryList;