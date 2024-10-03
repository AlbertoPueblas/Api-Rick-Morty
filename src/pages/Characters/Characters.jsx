import { useState } from 'react';
import { bringAllCharacters } from '../../services/apiCalls';
import './Characters.css'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Table } from 'react-bootstrap';

//---------------------------------

export const Characters = () => {

    const [characters, setCharacters] = useState([]);

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


    return (
        <>
            <div className="Desing">
                {/* {characters.map((person) => (
                    <ul key={person.id}>
                        <img src={person.image} alt={person.name} width={'200'} />
                        <li> {person.gender}</li>
                        <li>{person.name}</li>
                        <li>{person.status}</li>
                    </ul>
                ))} */}
                <button onClick={bringCharacters}>Traer personajes</button>
            </div>
            {characters.map((person) => (

                <Card style={{ width: '18rem' }}>
                        <Card.Title><h2>{person.name}</h2></Card.Title>
                    <Card.Img variant="top" src={person.image} />
                    <Card.Body>
                        <Card.Text><h4>Specie: {person.species} - Status: {person.status}</h4></Card.Text>
                        <Card.Text><h4>Sex: {person.gender}</h4></Card.Text>
                        <Card.Text><h5>Origin: {person.origin.name}</h5></Card.Text>
                        <Button variant="primary">Go somewhere</Button>
                    </Card.Body>
                </Card>
            ))}
        </>
    );
};