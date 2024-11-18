// src/Pages/Home.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useCompany } from '../context/CompanyContext';
import { DropDownCompanies } from '../Components/DropDownCompanies';
import { toast } from 'react-hot-toast';

const Home = () => {
    const navigate = useNavigate();
    const { selectedCompany } = useCompany();

    const handleContinue = () => {
        if (selectedCompany) {
            console.log('Empresa seleccionada para evaluacion 👇')
            console.log("Nombre:", selectedCompany.label);
            console.log("ID:", selectedCompany.value);
            navigate('/picker');
        } else {
            toast.error('Por favor seleccione una empresa');
        }
    };

    return (
        <div className="flex flex-col h-screen bg-zinc-900">
            <div className="flex flex-col items-center justify-center h-full max-w-4xl gap-8 mx-auto text-center">
                <div className="w-full p-8 bg-gray-300 rounded-md bg-opacity-10">
                    <h1 className="pb-12 text-4xl text-white">
                        Selecciona la empresa a Evaluar
                    </h1>
                    <div className="max-w-xs mx-auto">
                        <DropDownCompanies />
                        <button 
                            onClick={handleContinue}
                            disabled={!selectedCompany}
                            className={`
                                flex items-center justify-center w-full py-4 mt-5 
                                font-semibold tracking-wide transition-all duration-300 
                                ease-in-out rounded-lg text-white-500 
                                ${selectedCompany 
                                    ? 'bg-green-400 hover:bg-green-700 cursor-pointer' 
                                    : 'bg-gray-400 cursor-not-allowed'
                                }
                            `}
                        >
                            Continuar
                        </button>
                    </div>
                </div>
                <div className="flex justify-center w-full">
                    <Link to={'/results'} className='w-3/4 p-4 bg-green-400 rounded-xl link'>Ver resultados</Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
