import axios from "axios";

const API_BASE = "http://localhost:4000/api";

const USERS_API = `${API_BASE}/users`;
const GALLARIES_API = `${API_BASE}/gallaries`;

export const findAllGallaries = async () => {
    const response = await axios.get(`${GALLARIES_API}`);
    return response.data;
};

export const findOneGallery = async (gallaryID) => {
  const response = await axios.get(`${GALLARIES_API}/${gallaryID}`);
  return response.data;
}

export const createUserAddToGallary = async (userId, gallaryID, artworkID) => {
    const response = await axios.post(`${USERS_API}/${userId}/gallaries/${gallaryID}/${artworkID}`);
    console.log("Response:", response.data);
    return response.data;
  };

  export const deleteUserAddToGallary = async (userId, gallaryID, artworkID) => {
    const response = await axios.delete(`${USERS_API}/${userId}/gallaries/${gallaryID}/${artworkID}`);
    return response.data;
  };

  export const findUserOneGallaryArtworks = async (userId, gallaryID) => {
    const response = await axios.get(`${USERS_API}/${userId}/gallaries/${gallaryID}`);
    return response.data;
  };

  export const findGallariesThatUserCreates = async (userId) => {
    const response = await axios.get(`${USERS_API}/${userId}/gallaries`);
    return response.data;
  };