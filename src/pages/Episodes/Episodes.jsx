import { useState } from 'react';
import { AllEpisodes } from '../../services/apiCalls';
import './Episode.css'

//---------------------------------------------

export const Episodes = () => {

    const [episodes, setEpisodes] = useState([]);

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