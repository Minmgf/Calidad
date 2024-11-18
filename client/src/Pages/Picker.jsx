// src/Pages/Picker.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useCompany } from '../context/CompanyContext'; // Change this line

const Picker = () => {
    const { selectedCompany } = useCompany(); // Use the hook instead of useContext

    return (
        <div className="flex flex-col h-screen bg-zinc-900">
            <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto text-center">
                <div className="w-full p-8 bg-gray-300 rounded-md bg-opacity-10">
                    <p className='text-gray-400'>Empresa seleccionada: {selectedCompany?.label}</p>
                    <h1 className="pb-12 text-4xl text-white">Que deseas hacer? </h1>
                    <div className="flex justify-center gap-8 text-xl">
                        <Link to='/Calidad' className="vento link">Evaluacion de Calidad</Link>
                        <Link to='/Riesgos' className="vento link">Evaluacion de Riesgos</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Picker;
