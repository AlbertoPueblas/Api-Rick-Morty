import { useEffect, useState } from 'react';
import { AllLocations } from '../../services/apiCalls';
import './Locations.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { Button, Card, Container, Modal, Row } from 'react-bootstrap';

//---------------------------------------------

export const Locations = () => {

    const [locations, setLocations] = useState([]); // Para todas las localizaciones
    const [residents, setResidents] = useState({}); // Para almacenar los residentes por localización
    const [selectedLocationId, setSelectedLocationId] = useState(null); // Localización seleccionada
    const [showModal, setShowModal] = useState(false); // Control del modal

    const navigate = useNavigate();

    const bringLocation = () => {
        AllLocations()
            .then((res) => {
                setLocations(res.data.results)
                console.log(res.data.results);
            })
    }

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
    useEffect(() => {
        bringLocation();
    },[locations])

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
    return (
        <>
        <Container>
            <Row xs={12} sm={6} md={3}>
            {locations.map((location) => (
                <div key={location.id} style={{ width: '18rem' }} className='card'>
                    <Card.Body>

                        <Card.Title> <h3>Location Details</h3> </Card.Title>
                        <br/>
                        <Card.Text> <h4>Name:  {location.name} </h4></Card.Text>
                        <br/>
                        <Card.Text> <h4> Type: {location.type} </h4></Card.Text>
                        <br/>
                        <Card.Text> <h4>Dimension: {location.dimension} </h4></Card.Text>
                    </Card.Body>

                    <Button variant='outline-info' onClick={() => handleShow(location.id)} >
                        Show Residents
                    </Button>


                    <Modal show={showModal && selectedLocationId === location.id} onHide={handleClose} >
                        <Modal.Header closeButton>
                            <Modal.Title> Residents of {location.name} </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {/* Si los residentes ya fueron cargados, los mostramos */}
                            {residents[location.id] ? (
                                residents[location.id].length > 0 ? (

                                    <ol>
                                    {residents[location.id].map((resident, index) => (
                                        <li key={index}> {resident}</li>
                                    ))}
                                </ol>
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
            </Container>
        </>
    )
}