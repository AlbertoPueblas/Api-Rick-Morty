import axios from 'axios'

//-----------------------------------------

const API_URL = "https://rickandmortyapi.com/api/"

//Todos los personajes.
export const bringAllCharacters = async (page = 1) => {
    const response = await axios.get(`${API_URL}character/?page=${page}`)

    return response;
}

export const AllLocations = async (page) => {
    const res = await axios.get(`${API_URL}location?page=${page}`)

    return res;
} 

export const AllEpisodes = async (page) => {
    const res = await axios.get(`${API_URL}episode?page=${page}`)
    return res;
}