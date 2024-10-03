import { useEffect, useState } from 'react'
import './Home.css'

export const Home = () => {

    const [count, setCount] = useState(0)
    const [inputData, setInputdata] = useState('')
    const password = 'secreta'


    const inputHandler = (event) => {
        setInputdata(event.target.value);
    }

    useEffect(() => {
        console.log(count);
    }, [count])

    useEffect(() => {
        if (inputData === password) {
            console.log('iguales');
            setCount(9999)
        }
    }, [inputData])

    return (
        <>
            <h1>Rick & Morty</h1>
            <div className="card">
                <button onClick={() => setCount(count + 1)}>
                    count is {count}
                </button>
                <input type="text" name='inputDePrueba' onChange={(event) => inputHandler(event)} />
            </div>
        </>
    )
}


