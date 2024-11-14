import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import  Login  from './Login.jsx'
import Singup from './Signup.jsx';


function App() {

    return (
        <BrowserRouter>
        <Routes>
            <Route path='/register' element={<Singup/>}></Route>
            <Route path='/Login' element={<Login/>}></Route>
        </Routes>

        </BrowserRouter>
    )
}

export default App
