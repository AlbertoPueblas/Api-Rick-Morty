import { useEffect, useState } from 'react'
import './profile.css'
import { useNavigate } from 'react-router-dom'
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
;


//------------------------------------------------------

export const Profile = () => {


    const notify = () => toast.warning("Wow so easy!");

    const navigate = useNavigate();

    return (
        <>
            <h1>Profile</h1>
<button onClick={() => navigate('/')}>Back</button>
            <div>
                <button onClick={notify}>Notify!</button>
                <ToastContainer
                position='top-center'
                autoClose={1000}
                // theme='colored' 
                />
            </div>
        </>
    )
}