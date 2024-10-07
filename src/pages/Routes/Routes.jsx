import { Navigate, Route, Routes } from "react-router-dom"
import { Home } from '../Home/Home'
import { Characters } from "../Characters/Characters";
import { Locations } from "../Locations/Locations";
import { Episodes } from "../Episodes/Episodes";
import { Test } from "../test";

export const Body = () => {
    return (
        <>
            <Routes>
                <Route path='*' element={<Navigate to='/' />} />
                <Route path='/' element={<Home />} />
                <Route path='characters' element={<Characters />} />
                <Route path='location' element={<Locations />} />
                <Route path="episodes" element={<Episodes />} />
                <Route path="test" element={<Test />} />
            </Routes>
        </>
    );
};

