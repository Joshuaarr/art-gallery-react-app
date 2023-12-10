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
            <h1>{currentUser.username}'s Gallary List</h1>
            <div>
                <input
                    type="text"
                    placeholder="Enter new gallery name"
                    value={newGallaryName}
                    onChange={(e) => setNewGallaryName(e.target.value)}
                />
                <button onClick={createNewGallary}>Create Gallary</button>
            </div>
            <div className="list-group">
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