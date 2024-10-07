import { useEffect, useState } from 'react';
import axios from 'axios';
import { bringAllCharacters } from '../../services/apiCalls';
import './Characters.css'
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Container, Row } from 'react-bootstrap';


//---------------------------------

export const Characters = () => {

    const [characters, setCharacters] = useState([]);
    const [flippedCards, setFlipedCards] = useState({});
    const [episodes, setEpisodes] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    // Paginacion.
    const [currentPage, setCurrentPage] = useState(1);
    const episodesPerPage = 10;

    const navigate = useNavigate();

useEffect(() => {
    const fetchUsers = async () => {
        bringCharacters();
    }
    fetchUsers();
},[characters])

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

    const paginateEpisodes = (episodesList) => {
        const indexOfLastEpisode = currentPage * episodesPerPage;
        const indexOfFirstEpisode = indexOfLastEpisode - episodesPerPage;
        const currentEpisodes = episodesList.slice(indexOfFirstEpisode, indexOfLastEpisode);
    
        // Si la cantidad de episodios actuales es menor que el número máximo por página (5), añade espacios en blanco
        const remainingSpots = episodesPerPage - currentEpisodes.length;
    
        // Crear un array con elementos vacíos para completar la página
        const emptySlots = Array(remainingSpots).fill('');
    
        // Devuelve los episodios actuales y los elementos vacíos para que siempre sean 5
        return [...currentEpisodes, ...emptySlots];
    };

    // Funciones para cambiar de página
    const handleNextPage = () => {
        if (selectedCharacter && episodes[selectedCharacter] && currentPage < Math.ceil(episodes[selectedCharacter].length / episodesPerPage)) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    return (
        <div className='desing'>
            <Container>
                <Row xs={12} sm={6} md={3}>
                    {characters.map((person) => (
                        <Card key={person.id} style={{ width: '18rem' }} className='card'>
                            {flippedCards[person.id] ? (
                                <div>
                                    <Card.Title>Detalles</Card.Title>
                                    <Card.Body>
                                        <Card.Text>Specie: {person.species}</Card.Text>
                                        <Card.Text>Status: {person.status}</Card.Text>
                                        <Card.Text>Sex: {person.gender}</Card.Text>
                                        <Card.Text>Origin: {person.origin.name}</Card.Text>
                                        <Card.Text>City: {person.location.name}</Card.Text>
                                        <Card.Text className='btnCard'>
                                        <Button variant='primary' onClick={() => handleShow(person.id)}>
                                            Show Episodes
                                        </Button>
                                        </Card.Text>
                                        <Button variant="primary" onClick={() => flipCard(person.id)}>
                                            Go Back
                                        </Button>
                                    </Card.Body>
                                </div>
                            ) : (
                                <div>
                                    <Card.Title><h5>{person.name}</h5></Card.Title>
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
                </Row>
            </Container>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Episodes for {selectedCharacter !== null ? characters.find((char) => char.id === selectedCharacter).name : ''}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCharacter !== null && episodes[selectedCharacter] ? (
                        <>
                            <ul>
                                {paginateEpisodes(episodes[selectedCharacter]).map((episodeName, index) => (
                                    <li key={index}>{episodeName}</li>
                                ))}
                            </ul>
                            <div className="pagination-controls">
                                <Button
                                    variant="secondary"
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={handleNextPage}
                                    disabled={currentPage >= Math.ceil(episodes[selectedCharacter].length / episodesPerPage)}
                                >
                                    Next
                                </Button>
                            </div>
                        </>
                    ) : (
                        toast.success('Charging Episodes')
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