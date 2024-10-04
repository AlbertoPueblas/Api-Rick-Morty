import { useState } from 'react';
import { AllEpisodes } from '../../services/apiCalls';
import './Episode.css'
import { useNavigate } from 'react-router-dom';

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

    return(
        <>
            <button onClick={bringEpisodes}>Mostrar epìsodios</button>
            <button className='return' onClick={()=> (navigate('/'))}>Go Back</button>
            {episodes.map((episode) => (
                <div key={episode.id}>
                            Name: {episode.name}<br/>
                            Air Date: {episode.air_date}<br/>
                            Episode: {episode.episode}<br/>
                            <br/>
                </div>

            ))}

        </>
    )
}