import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import  Login  from './Login.jsx'
import Singup from './Signup.jsx';
import Picker from './Pages/Picker.jsx';
import Calidad from './Pages/Calidad.jsx';
import {Riesgo} from './Pages/riesgo/Riesgo.jsx';
import { IsoTest } from './Pages/calidad/IsoTest.jsx';
import { FurpsTest } from './Pages/calidad/FurpsTest.jsx';
import NavBar from './Components/NavBar.jsx';
import Home from './Pages/Home.jsx';
import { CompanyRegister } from './Pages/CompanyRegister.jsx';
import { Toaster } from 'react-hot-toast';
import { CompanyProvider } from './context/CompanyContext.jsx';
import { UserProvider } from './context/UserContext.jsx';
import QuestionManager from './Pages/QuestionManager.jsx';
import ResultsPage from './Pages/ResultsPage.jsx';
import { McCallTest } from './Pages/calidad/McCallTest.jsx';
import { DromeyTest } from './Pages/calidad/DromeyTest.jsx';
import { BoehmTest } from './Pages/calidad/BoehmTest.jsx';
import { SixSigmaTest } from './Pages/calidad/SixSigmaTest.jsx';
import RiskManager from './RiskManager.jsx';
import {RiskEvaluation} from './Pages/riesgo/RiskEvaluation.jsx';
import  {RiskMatrix}  from './Pages/riesgo/RiskMatrix.jsx';


function App() {

    return (
        <UserProvider>

        <CompanyProvider>
            <BrowserRouter>
                <NavBar />
                <Toaster position="bottom-right" /> {/* Agregamos esto */}





                <Routes>
                    <Route path='/register' element={<Singup/>}></Route>
                    <Route path='/Login' element={<Login/>}></Route>
                    <Route path='/Home' element={<Home/>}></Route>
                    <Route path='/' element={<Home/>}></Route>
                    <Route path='/Riesgos' element={<Riesgo/>}></Route>
                    <Route path='/Picker' element={<Picker/>}></Route>

                    <Route path='/register-company' element={<CompanyRegister/>}/>
                    <Route path="/question-manager" element={<QuestionManager />} />
                    <Route path="/risk-manager" element={<RiskManager />} />
                    <Route path="/risk-evaluation" element={<RiskEvaluation />} />
                    <Route path="/risk-matrix" element={<RiskMatrix />} />



                    <Route path="/results" element={<ResultsPage />} />



                    <Route path='/Calidad' element={<Calidad/>}></Route>
                    <Route path='/isoTest' element={<IsoTest/>}></Route>
                    <Route path='/Furps' element={<FurpsTest/>}></Route>
                    <Route path='/McCall' element={<McCallTest/>}></Route>
                    <Route path='/Dromey' element={<DromeyTest/>}></Route>
                    <Route path='/Boehm' element={<BoehmTest/>}></Route>
                    <Route path='/SixSigma' element={<SixSigmaTest/>}></Route>
                </Routes>
            </BrowserRouter>

        </CompanyProvider>
        </UserProvider>

    )
}

export default App
