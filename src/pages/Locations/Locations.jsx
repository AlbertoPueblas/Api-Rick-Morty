import { useEffect, useState } from 'react';
import { AllLocations } from '../../services/apiCalls';
import './Locations.css'
import axios from 'axios'
import { Button, Card, Container, Modal, Row } from 'react-bootstrap';

//---------------------------------------------

export const Locations = () => {

    const [locations, setLocations] = useState([]); // Para todas las localizaciones
    const [residents, setResidents] = useState({}); // Para almacenar los residentes por localización
    const [selectedLocationId, setSelectedLocationId] = useState(null); // Localización seleccionada
    const [showModal, setShowModal] = useState(false); // Control del modal
    //Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const locationsPerPAge = 20;
    const [totalLocations, setTotalLocations] = useState(0);

    const bringLocation = async (page) => {
        try {
            const response = await AllLocations(page);
            setLocations(response.data.results);
            setTotalLocations(response.data.info.count);
            console.log(response.data.results);
            
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        bringLocation(currentPage);
    }, [currentPage]);

    const indexOfLastEpisode = currentPage * locationsPerPAge;
    const indexOfFirstEpisode = indexOfLastEpisode - locationsPerPAge;
    const currentLocations = locations.slice(indexOfFirstEpisode, indexOfLastEpisode);
    
    const fetchResidents = async (id) => {
        const location = locations.find((resident) => resident.id === id);
        const residentUrls = location.residents;

        try {
            const residentPromise = residentUrls.map((url) => axios.get(url));
            const residentResponse = await Promise.all(residentPromise);

            const residentNames = residentResponse.map((res) => res.data.name)

            setResidents((prevState) => ({
                ...prevState,
                [id]: residentNames,
            }));
        } catch (error) {
            console.log(error);

        }
    }

    // Función para abrir el modal
    const handleShow = (id) => {
        setSelectedLocationId(id); // Guardamos el ID del personaje seleccionado
        setShowModal(true);

        if (!residents[id]) {
            fetchResidents(id); // Cargar episodios si aún no están cargados
        }
    };

    // Función para cerrar el modal
    const handleClose = () => {
        setShowModal(false);
        setSelectedLocationId(null); // Limpiamos el personaje seleccionado
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(totalLocations / locationsPerPAge)) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    }

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    }

    return (
        <>
            <Container>
                <Row xs={12} sm={6} md={3}>
                    {locations.map((location) => (
                        <div key={location.id} style={{ width: '13rem', height: '10rem' }} className='card'>
                            <Card.Body >
                                <Card.Title> <h5>{location.name}</h5> </Card.Title>
                                <p>Type</p>
                               
                                <Card.Text>Type: {location.type} </Card.Text>
                                <p>Dimension</p>
                                <Card.Text>{location.dimension} </Card.Text>
                            </Card.Body>

                            <Button variant='outline-info' onClick={() => handleShow(location.id)} >
                                Show Residents
                            </Button>


                            <Modal show={showModal && selectedLocationId === location.id} onHide={handleClose} >
                                <Modal.Header closeButton>
                                    <Modal.Title> Residents of {location.name} </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {/* Si los residentes ya fueron cargados, los mostramos paginados */}
                                    {residents[location.id] ? (
                                        residents[location.id].length > 0 ? (
                                            <>
                                                <ol>
                                                    {residents[location.id].map((resident, index) => (
                                                        <li key={index}>{resident}</li>
                                                    ))}
                                                </ol>
                                            </>
                                        ) : (
                                            <h6>No residents found.</h6>
                                        )
                                    ) : (
                                        <p>Loading resident...</p>
                                    )}
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant='secondary' onClick={handleClose}>Close</Button>
                                </Modal.Footer>
                            </Modal>

                        </div>
                    ))}
                </Row>
                <div className="pagination-controls">
                    <Button
                        variant="primary"
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </Button>
                    <span>Page {currentPage} of {Math.ceil(totalLocations / locationsPerPAge)}</span>
                    <Button
                        variant="primary"
                        onClick={handleNextPage}
                        disabled={currentPage >= Math.ceil(totalLocations / locationsPerPAge)}
                    >
                        Next
                    </Button>
                </div>
            </Container>
        </>
    )
}