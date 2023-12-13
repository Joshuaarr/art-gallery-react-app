import React, { useState, View, useEffect } from "react";
import * as client from "../client";
import { Link , useParams, useNavigate} from "react-router-dom";
import "../Users/Gallary/index.css";
function Search() {
  const { search } = useParams();
  const [searchTerm, setSearchTerm] = useState(search);
  const [results, setResults] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const navigate = useNavigate();

  const fetchItems = async (search) => {
    const results = await client.findItems(search);
    setResults(results);
    setSearchTerm(search);
  };


  const fetchImageUrls = async () => {
    try {
      if (results && results.length > 0) {
        const urls = await Promise.all(results.map(artwork => client.findImageByID(artwork.id)));
        setImageUrls(urls);
      }
    } catch (error) {
      console.error('Error fetching image URLs:', error);
    }
  };

  useEffect(() => {
    if (search) {
      fetchItems(search);
    }
  }, [search]);
  
  useEffect(() => {
    fetchImageUrls();
  }, [results]);




  return (
    <div style={{maxWidth: "1000px"}}>
      <h1>Search</h1>
      <button 
      onClick={() => navigate(`/project/search/${searchTerm}`)}
       className="btn btn-primary float-end me-3" style={{backgroundColor: "black", border: "none"}}>
        Search
      </button>
      <input 
        type="text"
        className="form-control w-75 mb-4"
        placeholder="Search for art work's keyword..."
        onChange={(event) => {
          setSearchTerm(event.target.value);
        }}
      />
      <h2>Results for '{search}'</h2>
      <div className="gallary-list-group">
        {results &&
          results.map((artwork, index) => (
            <Link to={`/project/details/${artwork.id}`} className="gallary-list-group card-title" >
              <div className="row" style={{minHeight: "200px", backgroundColor: "rgba(255, 255, 255, 80%)", marginTop:"10px"}}>
                <div className="col-3">
                  <img
                    src={imageUrls[index]}
                    alt={artwork.alt_text}
                    style={{ maxWidth: "240px", margin: "5px" }}
                  />
                </div>
                <div className="col-8 ms-3 mt-3">
                  <h5>{artwork.title}</h5>
                  {artwork.thumbnail.alt_text}
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
  
export default Search;