import axios from "axios";
export const MUSEUM_API = "https://api.artic.edu/api/v1/artworks";


export const findItems = async (searchTerm) => {
    const response = await axios.get(
        `${MUSEUM_API}/search?q=${searchTerm}`
    );
    
    return response.data.data;
}

export const findArtByID = async (artworkId) => {
    const response = await axios.get(
        `${MUSEUM_API}/${artworkId}?fields=id,title,image_id,artist_display,place_of_origin,description`
    )
    return response.data;
}

export const findImageByID = async (artworkId) => {
    const response = await axios.get(
        `${MUSEUM_API}/${artworkId}?fields=id,title,image_id`
    )
    const imageId = response.data.data.image_id;
    const iiifUrl = response.data.config.iiif_url;
    const imgURL = `${iiifUrl}/${imageId}/full/843,/0/default.jpg`
    console.log(imgURL);
    return imgURL;
}



