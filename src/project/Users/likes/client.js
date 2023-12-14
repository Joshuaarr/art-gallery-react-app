import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE;

const USERS_API = `${API_BASE}/users`;
const LIKES_API = `${API_BASE}/likes`;

export const findAllLikes = async () => {};
export const createUserLikesArt = async (userId, artworkID) => {
  const response = await axios.post(`${USERS_API}/${userId}/likes/${artworkID}`);
  return response.data;
};
export const deleteUserLikesArt = async (userId, artworkID) => {
  const response = await axios.delete(`${USERS_API}/${userId}/likes/${artworkID}`);
  return response.data;
};
export const findUsersThatLikeArt = async (artworkID) => {
  const response = await axios.get(`${LIKES_API}/${artworkID}/users`);
  return response.data;
};
export const findArtsThatUserLikes = async (userId) => {
  const response = await axios.get(`${USERS_API}/${userId}/likes`);
  return response.data;
};