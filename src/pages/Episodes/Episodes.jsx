import { useEffect, useState } from 'react';
import { AllEpisodes } from '../../services/apiCalls';
import './Episodes.css'
import { useNavigate } from 'react-router-dom';
import { Card, Container, Row } from 'react-bootstrap';

//---------------------------------------------

export const Episodes = () => {

    const [episodes, setEpisodes] = useState([]);

    const navigate = useNavigate();

    const bringEpisodes = () => {
        AllEpisodes()
            .then((res) => {
                setEpisodes(res.data.results)
            })
    }

    useEffect(() => {
        bringEpisodes();
    }, [])
    return (
        <>
            <Container>
                <Row>
                    {episodes.map((episode) => (
                        <div key={episode.id} className='carta'>
                            <Card.Title>Episode: {episode.episode}</Card.Title >

                                <br/>
                               <h5>Name: {episode.name}</h5> 
                               <br/>
                               <h6>Air Date: {episode.air_date}</h6> 
                                <br />

                        </div>
                    ))}
                </Row>
            </Container>
        </>
    )
}