import { Navigate, Route, Routes } from "react-router-dom"
import { Home } from '../Home/Home'
import { Profile } from '../Profile/Profile'
import { Characters } from "../Characters/Characters";
import { Episodes } from "../Episodes/Episodes";

export const Body = () => {
    return (
        <>
            <Routes>
                <Route path='*' element={<Navigate to='/' />} />
                {/* <Route path='/' element={<Home />} />
                <Route path='profile' element={<Profile />} /> */}
                <Route path='/' element={<Characters />} />
                <Route path='/episode' element={<Episodes />} />
            </Routes>
        </>
    );
};

