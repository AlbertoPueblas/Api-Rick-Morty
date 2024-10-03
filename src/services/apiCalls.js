import axios from 'axios'

//-----------------------------------------

const API_URL = "https://rickandmortyapi.com/api/"

//Todos los personajes.
export const bringAllCharacters = async () => {
    const response = await axios.get(`${API_URL}character`)

    return response;
}
