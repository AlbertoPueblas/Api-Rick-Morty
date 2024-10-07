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

    const [currentPage, setCurrentPage] = useState(1); // Página actual
const residentsPerPage = 10;


    const bringLocation = () => {
        AllLocations()
            .then((res) => {
                setLocations(res.data.results)
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
    },[])

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

    const paginateResidents = (residentsList) => {
        const indexOfLastResident = currentPage * residentsPerPage;
        const indexOfFirstResident = indexOfLastResident - residentsPerPage;
        const currentResidents = residentsList.slice(indexOfFirstResident, indexOfLastResident);
    
        // Si la cantidad de residentes actuales es menor que el número máximo por página, añade espacios en blanco
        const remainingSpots = residentsPerPage - currentResidents.length;
    
        // Crear un array con elementos vacíos para completar la página
        const emptySlots = Array(remainingSpots).fill('');
    
        // Devuelve los residentes actuales y los elementos vacíos para que siempre sean 5
        return [...currentResidents, ...emptySlots];
    };
    const handleNextPage = () => {
        if (selectedLocationId && residents[selectedLocationId] && currentPage < Math.ceil(residents[selectedLocationId].length / residentsPerPage)) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };
    
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
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
                        <Card.Text> Name:  {location.name} </Card.Text>
                        <br/>
                        <Card.Text>  Type: {location.type} </Card.Text>
                        <br/>
                        <Card.Text> Dimension: {location.dimension} </Card.Text>
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
                    <ul>
                        {paginateResidents(residents[location.id]).map((resident, index) => (
                            <li key={index}>{resident || <span>&nbsp;</span>}</li> // Si el residente es vacío, deja espacio en blanco
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
                            disabled={currentPage >= Math.ceil(residents[location.id].length / residentsPerPage)}
                        >
                            Next
                        </Button>
                    </div>
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
            </Container>
        </>
    )
}