import { useEffect, useState } from 'react';
import { AllEpisodes } from '../../services/apiCalls';
import './Episodes.css';
import { Button, Card, Container, Row } from 'react-bootstrap';

//---------------------------------------------

export const Episodes = () => {
    const [episodes, setEpisodes] = useState([]);
    //Paginaión
    const [currentPage, setCurrentPage] = useState(1);
    const episodesPerPage = 20;
    const [totalEpisodes, setTotalEpisodes] = useState(0);

    // Función para traer episodios de la API
    const bringEpisodes = async (page) => {
        try {
            const res = await AllEpisodes(page); // Cambia la función para aceptar el número de página
            console.log("Episodes fetched:", res.data.results);
            setEpisodes(res.data.results); // Guardar los episodios de la página actual
            setTotalEpisodes(res.data.info.count); // Establecer el total de episodios desde la respuesta
        } catch (error) {
            console.error('Error fetching episodes:', error);
        }
    };

    useEffect(() => {
        bringEpisodes(currentPage);
        console.log('useEfectc',currentPage);
        
    }, [currentPage]);

    // Calcular los episodios que se deben mostrar en la página actual
    const indexOfLastEpisode = currentPage * episodesPerPage;
    const indexOfFirstEpisode = indexOfLastEpisode - episodesPerPage;
    const currentEpisodes = episodes.slice(indexOfFirstEpisode, indexOfLastEpisode);

    const handleNextPage = () => {
        if (currentPage < Math.ceil(totalEpisodes / episodesPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <Container>
            <Row>
                {episodes.length > 0 ? (
                    episodes.map((episode) => (
                        <div key={episode.id} className='carta'>
                            <Card.Title>Title<br></br>{episode.name}</Card.Title>
                            <br/>
                            <h5>Air Date: {episode.air_date}</h5><br/>
                            <h6>Name: {episode.episode}</h6>
                        </div>
                    ))
                ) : (
                    <h5>No episodes found.</h5> // Mensaje en caso de que no haya episodios
                )}
            </Row>
            <div className="pagination-controls">
                <Button onClick={handlePrevPage} disabled={currentPage === 1}>Prev</Button>
                <span>Page {currentPage} of {Math.ceil(totalEpisodes / episodesPerPage)}</span>
                <Button onClick={handleNextPage} disabled={currentPage >= Math.ceil(totalEpisodes / episodesPerPage)}>Next</Button>
            </div>
        </Container>
    );
};
