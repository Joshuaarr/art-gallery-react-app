import * as client from "./client";
import * as userClient from "../client";
import * as imageClient from "../../client";
import { useEffect, useState } from "react";
import { Link, Navigate, } from "react-router-dom";
import { useSelector } from 'react-redux';
import "./index.css";


function GallaryList() {
    const { currentUser } = useSelector((state) => state.userReducer);
    const [newGallaryName, setNewGallaryName] = useState('');
    const [gallaries, setGallaries] = useState([]); 
    const [imageUrls, setImageUrls] = useState([]);
    const [distinctGallaryIDs, setGallaryIDs] = useState([]);

    const fetchImageUrls = async () => {
        try {
        if (gallaries && gallaries.length > 0) {
            const urls = await Promise.all(gallaries.map(gallary => imageClient.findImageByID(gallary.artworkID)));
            console.log(urls);
            setImageUrls(urls);
        }
        } catch (error) {
        console.error('Error fetching image URLs:', error);
        }
    };
    const fetchGallaries = async () => {
        try {
          // Fetch distinct gallaryIDs
          const distinctGallaryIDs = await client.findAllGallaries();
          setGallaryIDs(distinctGallaryIDs);
    
          // Fetch details for each gallaryID
          const fetchedGallaries = await Promise.all(
            distinctGallaryIDs.map(async (gallaryID) => {
              const gallary = await client.findOneGallery(gallaryID);
              return gallary;
            })
          );
          console.log(fetchedGallaries);
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

    useEffect(() => {
        fetchGallaries();
        fetchImageUrls();
    }, []);

    useEffect(() => {
        fetchImageUrls();
      }, [gallaries]);
    return (
      <div>
        
        {currentUser && (
            <>
            <h3>{currentUser.username}'s Gallary List</h3>
            <div>
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
            </div>
            <div className="gallary-list-group card-container m-1">
              {gallaries.map((gallary, index) => (
              <Link
                  key={gallary.gallaryID}
                  to={`/project/${currentUser.username}/gallary/${gallary.gallaryID}`}
                  className="gallary-list-group card-size card-title"
              >

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
              ))}
          </div>
          </>
        )}
      </div>
    );
  }
  
  export default GallaryList;