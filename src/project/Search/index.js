import React, { useState, View, useEffect } from "react";
import * as client from "../client";
import { Link , useParams, useNavigate} from "react-router-dom";
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
    <div>
      <h1>Search</h1>
      <button 
      onClick={() => navigate(`/project/search/${searchTerm}`)}
       className="btn btn-primary float-end me-3" style={{backgroundColor: "black", border: "none"}}>
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

      <h1>Results</h1>
      <ul className="list-group">
        {results &&
          results.map((artwork, index) => (
            <li key={index} className="list-group-item">
              <Link to={`/project/details/${artwork.id}`}>
                <h3>{artwork.title}</h3>
                <img
                  src={imageUrls[index]}
                  alt={artwork.title}
                  className="col-11"
                />
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
  
export default Search;