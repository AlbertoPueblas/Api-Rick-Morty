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
                console.log(res.data.results);

            })
    }

    useEffect(() => {
        bringEpisodes();
    }, [episodes])
    return (
        <>
            <Container>
                <Row>
                    {episodes.map((episode) => (
                        <div className='carta'>
                            <Card.Title><h4>Episode: {episode.episode}</h4></Card.Title >
                            <div key={episode.id}>
                                <br/>
                               <h5>Name: {episode.name}</h5> 
                               <br/>
                               <h6>Air Date: {episode.air_date}</h6> 
                                <br />
                            </div>
                        </div>
                    ))}
                </Row>
            </Container>
        </>
    )
}