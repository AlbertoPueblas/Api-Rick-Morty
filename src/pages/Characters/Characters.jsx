import { useState } from 'react';
import { bringAllCharacters } from '../../services/apiCalls';
import './Characters.css'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';

//---------------------------------

export const Characters = () => {

    const [characters, setCharacters] = useState([]);
    const [flippedCards, setFlipedCards] = useState({});

    const navigate = useNavigate();

    const bringCharacters = () => {
        bringAllCharacters()
            .then((apiResponse) => {
                setCharacters(apiResponse.data.results);
                console.log(apiResponse.data.results);
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
    }

    function formatDate(dateString) {
        const date = new Date(dateString)
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        return `${day}/${month}/${year}`  
    }
    let hoy = new Date()
    
    return (
        <div className='design'>
            <button className='boton' onClick={() => (navigate('episode'))}>Episodes</button>
            {characters.map((person) => (
                <Card key={person.id} style={{ width: '18rem' }}>
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
                                <Card.Text>City: {person.episode}</Card.Text>
                                <Card.Text>Created: {formatDate(person.created)}</Card.Text>
                                <Button variant="primary" onClick={() => flipCard(person.id)}>
                                    Go Back
                                </Button>
                            </Card.Body>
                        </div>
                    ) : (
                        // Mostrar el anverso de la carta
                        <div>
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
        </div>
    );
};