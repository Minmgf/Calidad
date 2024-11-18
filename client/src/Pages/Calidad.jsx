import React from 'react'
import NavBar from '../Components/NavBar'
import { Link } from 'react-router-dom'
import VentoItem from '../Components/VentoItem'
import { useCompany } from '../context/CompanyContext'; // Change this line

const Calidad = () => {
    const { selectedCompany } = useCompany(); // Use the hook instead of useContext
    return (
        <>
            <div className="flex flex-col h-screen bg-zinc-900">
                <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto text-center">
                    <div className="w-full p-8 bg-gray-300 rounded-md bg-opacity-10">

                        <p className='text-gray-400'>Empresa seleccionada: {selectedCompany?.label}</p>
                        <h1 className="pb-12 text-4xl text-white">Selecciona el modelo de calificacion de la calidad </h1>
                        <div className="flex flex-wrap justify-center gap-8">
                            <VentoItem
                                img='iso25k.png'
                                title='Iso 25000'
                                to='/isoTest'
                            />
                            <VentoItem
                                img='furps.png'
                                title='Modelo FURPS'
                                to='/Furps'
                            />
                            <VentoItem
                                img='Boehm.png'
                                title='Modelo Boehm'
                                to='/Boehm'
                            />
                            <VentoItem
                                img='McCall.jpg'
                                title='Modelo McCall'
                                to='/McCall'
                            />
                            <VentoItem
                                img='iso25k.png'
                                title='Modelo Dromey'
                                to='/Dromey'
                            />
                            <VentoItem
                                img='iso25k.png'
                                title='Modelo Six Sigma'
                                to='/SixSigma'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Calidad