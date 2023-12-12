import * as client from "./client";
import * as userClient from "../client";
import { useEffect, useState } from "react";
import { Link, Navigate, } from "react-router-dom";
import { useSelector } from 'react-redux';

function GallaryList() {
    const { currentUser } = useSelector((state) => state.userReducer);
    const [newGallaryName, setNewGallaryName] = useState('');
    const [gallaries, setGallaries] = useState([]); 
    const fetchGallaries = async () => {
        // only fetched the distince names of the galarries
        const gallaries = await client.findGallariesThatUserCreates(currentUser._id);
        setGallaries(gallaries);
    };
    const createNewGallary = async () => {
        try {
            const response = await client.createUserAddToGallary(currentUser._id, newGallaryName, "117241");
            console.log(response);
            setGallaries([...gallaries, newGallaryName]);
            setNewGallaryName('');
        } catch (error) {
            console.error("Error creating new gallery:", error);
        }
    };

    useEffect(() => {
        fetchGallaries();
    }, []);
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
            <div className="profile-list-group m-1">
                {gallaries.map((gallary) => (
                <Link
                    key={gallary.gallaryID}
                    to={`/project/${currentUser.username}/gallary/${gallary}`}
                    className="list-group-item"
                >
                    {gallary}
                </Link>
                ))}
            </div>
          </>
        )}
      </div>
    );
  }
  
  export default GallaryList;