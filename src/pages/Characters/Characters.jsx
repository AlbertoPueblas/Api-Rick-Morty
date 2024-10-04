import { useState } from 'react';
import axios from 'axios';
import { bringAllCharacters } from '../../services/apiCalls';
import './Characters.css'
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

//---------------------------------

export const Characters = () => {

    const [characters, setCharacters] = useState([]);
    const [flippedCards, setFlipedCards] = useState({});
    const [episodes, setEpisodes] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [selectedCharacter, setSelectedCharacter] = useState(null);

    const navigate = useNavigate();

    const bringCharacters = () => {
        bringAllCharacters()
            .then((apiResponse) => {
                setCharacters(apiResponse.data.results);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const flipCard = (id) => {
        setFlipedCards(prevState => ({
            ...prevState,
            [id]: !prevState[id]

        }))
        if (!episodes[id]) {
            fetchEpisodes(id);
        }
    }
    // Verifica si ya hemos cargado los episodios de este personaje
    // Función asíncrona para obtener los episodios de un personaje.
    const fetchEpisodes = async (id) => {
        const character = characters.find((person) => person.id === id);
        const episodeUrls = character.episode;

        //Hace peticiones a cada Url del episodio
        const episodePromise = episodeUrls.map((url) => axios.get(url));
        try {
            const episodeResponse = await Promise.all(episodePromise);
            const episodeNames = episodeResponse.map((res) => res.data.name);

            //Almacen de estados de los episodios.

            setEpisodes((prevState) => ({
                ...prevState,
                [id]: episodeNames,
            }));
        } catch (error) {
            toast.error(`Error fetching episodes`)
        }
    }
    // function formatDate(dateString) {
    //     const date = new Date(dateString)
    //     let day = date.getDate();
    //     let month = date.getMonth() + 1;
    //     let year = date.getFullYear();
    //     return `${day}/${month}/${year}`
    // }
    // let hoy = new Date()


    // Función para abrir el modal
    const handleShow = (id) => {
        setSelectedCharacter(id); // Guardamos el ID del personaje seleccionado
        setShowModal(true);
        if (!episodes[id]) {
            fetchEpisodes(id); // Cargar episodios si aún no están cargados
        }
    };

    // Función para cerrar el modal
    const handleClose = () => {
        setShowModal(false);
        setSelectedCharacter(null); // Limpiamos el personaje seleccionado
    };

    return (
        <div className='design'>
            <button className='boton' onClick={() => (navigate('episode'))}>Episodes</button>
            {characters.map((person) => (
                <Card key={person.id} style={{ width: '18rem'}} className='card'>
                    {flippedCards[person.id] ? (
                        // Mostrar el reverso de la carta
                        <div>
                            <Card.Title><h2>Detalles</h2></Card.Title>
                            <Card.Body>
                                <Card.Text>Specie: {person.species}</Card.Text>
                                <Card.Text>Status: {person.status}</Card.Text>
                                <Card.Text>Sex: {person.gender}</Card.Text>
                                <Card.Text>Origin: {person.origin.name}</Card.Text>
                                <Card.Text>City: {person.location.name}</Card.Text>
                                <Button variant='primary' onClick={() => handleShow(person.id)}>
                                    Show Episodes
                                </Button>
                                {episodes[person.id] ? (
                                    <ul>
                                    </ul>
                                ) : (
                                    <p>Charging episodes...</p>
                                )}
                                <Button variant="primary" onClick={() => flipCard(person.id)}>
                                    Go Back
                                </Button>
                            </Card.Body>
                        </div>
                    ) : (
                        // Mostrar el anverso de la carta
                        <div >
                            <Card.Title><h2>{person.name}</h2></Card.Title>
                            <Card.Img variant="top" src={person.image} />
                            <Card.Body>
                                <Button variant="primary" onClick={() => flipCard(person.id)}>
                                    More details
                                </Button>
                            </Card.Body>
                        </div>
                    )}
                </Card>
            ))}
            <button onClick={bringCharacters}>Traer personajes</button>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Episodes to {selectedCharacter !== null ? characters.find((char) => char.id === selectedCharacter).name : ''}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCharacter !== null && episodes[selectedCharacter] ? (
                        <ol>
                            {episodes[selectedCharacter].map((episodeName, index) => (
                                <li key={index}>{episodeName}</li>
                            ))}
                        </ol>
                    ) : (
                        <p>Charging episodes...</p>
                    )}

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};