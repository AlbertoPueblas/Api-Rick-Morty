import { useEffect, useState } from 'react';
import axios from 'axios';
import { bringAllCharacters } from '../../services/apiCalls';
import './Characters.css';
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
    //Paginación.
    const [currentPage, setCurrentPage] = useState(1);
    const charactersPerPage = 20;
    const [totalCharacters, setTotalCharacters] = useState(0); // Estado para almacenar el total de personajes

    useEffect(() => {
        const fetchCharacters = async () => {
            await bringCharacters(currentPage);
        };
        fetchCharacters();
    }, [currentPage]);

    const bringCharacters = async (page) => {
        try {
            const apiResponse = await bringAllCharacters(page);
            
            setCharacters(apiResponse.data.results);
            console.log('eee',apiResponse.data.results);
            setTotalCharacters(apiResponse.data.info.count); // Almacenar el total de personajes
        } catch (error) {
            console.log(error);
            toast.error(`Error al cargar personajes: ${error}`);
        }
    };

    const flipCard = (id) => {
        setFlipedCards(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
        if (!episodes[id]) {
            fetchEpisodes(id);
        }
    };

    const fetchEpisodes = async (id) => {
        const character = characters.find((person) => person.id === id);
        const episodeUrls = character.episode;

        const episodePromise = episodeUrls.map((url) => axios.get(url));
        try {
            const episodeResponse = await Promise.all(episodePromise);
            const episodeNames = episodeResponse.map((res) => res.data.name);
            setEpisodes((prevState) => ({
                ...prevState,
                [id]: episodeNames,
            }));
        } catch (error) {
            toast.error(`Error al cargar episodios`);
        }
    };

    const handleShow = (id) => {
        setSelectedCharacter(id);
        setShowModal(true);
        if (!episodes[id]) {
            fetchEpisodes(id);
        }
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedCharacter(null);
    };

    const totalPages = Math.ceil(totalCharacters / charactersPerPage); // Calcular total de páginas

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    return (
        <div className='design'>
            <Container>
                <Row xs={12} sm={6} md={3}>
                    {characters.map((person) => (
                        <Card key={person.id} style={{ width: '19rem' }} className='card'>
                            {flippedCards[person.id] ? (
                                <div>
                                        <Card.Text>Species: {person.species}</Card.Text>
                                        <Card.Text>Status: {person.status}</Card.Text>
                                        <Card.Text>Sex: {person.gender}</Card.Text>
                                        <Card.Text>Origin: {person.origin.name}</Card.Text>
                                        <Card.Text>City: {person.location.name}</Card.Text>
                                    <Card.Body>
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
                                    <Card.Title><h6>{person.name}</h6></Card.Title>
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
                <div className="pagination-controls">
                    <Button
                        variant="primary"
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <Button
                        variant="primary"
                        onClick={handleNextPage}
                        disabled={currentPage >= totalPages}
                    >
                        Next
                    </Button>
                </div>
            </Container>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Episodes for {selectedCharacter !== null ? characters.find((char) => char.id === selectedCharacter).name : ''}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCharacter !== null && episodes[selectedCharacter] ? (
                        <ul>
                            {episodes[selectedCharacter].map((episodeName, index) => (
                                <li key={index}>{episodeName}</li>
                            ))}
                        </ul>
                    ) : (
                        toast.success('Cargando episodios...')
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
