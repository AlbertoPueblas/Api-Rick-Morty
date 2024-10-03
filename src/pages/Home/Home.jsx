import React from 'react';
import { useEffect, useState } from 'react'
import './Home.css'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CustomInput } from '../../components/CustomInput';

//------------------------------------------------------

export const Home = () => {

    const [inputData, setInputdata] = useState('');
    const password = 'secreta';

    const navigate = useNavigate();

    const inputHandler = (event) => {
        setInputdata(event.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault(); // Evita el comportamiento por defecto del formulario.
        if (inputData === password) {
            toast.success('Bienvenido!!!')
            setTimeout(() => {
                navigate('/profile');
            }, 2000)
        } else {
            toast.error('contraseña incorrecta');
        }

    }
    return (
        <>
            <h1>Rick & Morty</h1>
            <div className="card">
                <form onSubmit={handleSubmit}>
                    <CustomInput type="email"
                        name='inputDeprueba'
                        placeholder='email'>
                    </CustomInput>
                    <CustomInput type="password"
                        name='password'
                        placeholder='password'
                        onChange={inputHandler}
                    >
                    </CustomInput>
                    <CustomInput type="date" name='fecha' />
                    <button onChange={inputHandler}>Confirm</button>
                </form>
            </div>
            <ToastContainer
            position='top-center'
            autoClose={1000}
            >

            </ToastContainer>
        </>
    )
}


