import * as galleryClient from "../Users/Gallary/client";
import React, { useState, View, useEffect } from "react";
import { Link , useParams, useNavigate} from "react-router-dom";
import * as imageClient from "../client";
function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const [gallaries, setGallaries] = useState([]); 
  const [imageUrls, setImageUrls] = useState([]);

  const [gallaryIDs, setGallaryIDs] = useState([]);
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
      const distinctGallaryIDs = await galleryClient.findAllGallaries();
      setGallaryIDs(distinctGallaryIDs);

      // Fetch details for each gallaryID
      const fetchedGallaries = await Promise.all(
        distinctGallaryIDs.map(async (gallaryID) => {
          const gallary = await galleryClient.findOneGallery(gallaryID);
          return gallary;
        })
      );
      console.log(fetchedGallaries);
      setGallaries(fetchedGallaries);
    } catch (error) {
      console.error("Error fetching gallaries:", error);
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
      <div >
        <br />
        <h3>Search for artworks</h3>
        <button 
          onClick={() => navigate(`/project/search/${searchTerm}`)}
          className="btn btn-primary float-end me-3"
          style={{backgroundColor: "black", border: "none"}}>
            Search
          </button>
          <input 
            type="text"
            className="form-control w-75"
            placeholder="Search for art work's keyword..."
            onChange={(event) => {
              setSearchTerm(event.target.value);
            }}
          />
          <br />
          <h3>Gallaries</h3>
          <div className="profile-list-group m-1" style={{height: "200px"}}>
              {gallaries.map((gallary, index) => (
              <Link
                  key={gallary.gallaryID}
                  to={`/project/${gallary.username}/gallary/${gallary.gallaryID}`}
                  className="list-group-item"
              >
                  {gallary.gallaryID}
                  <img
                    key={gallary.artworkID}
                    src={imageUrls[index]}
                    alt={`Artwork ${gallary.artworkID}`}
                    style={{ maxWidth: "100px", maxHeight: "100px", margin: "5px" }}
                />
              </Link>
              ))}
          </div>



      </div>
    );
  }
  
  export default Home;