import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

export const CompanyRegister = () => {
    const [company, setCompany] = useState({
        name: '',
        description: '',
    })
    const [error, setError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        
        // Validación del nombre
        if (!company.name.trim()) {
            setError('El nombre de la empresa es obligatorio')
            return
        }
        
        // Validación de campos vacíos
        if (!company.name.trim() && !company.description.trim() && !company.sector.trim()) {
            setError('No se pueden registrar empresas vacías')
            return
        }

        axios.post('http://localhost:3001/company', company)
            .then(result => {
                console.log(result)
                toast.success('Empresa registrada exitosamente!')
                setError('')
                // Aquí puedes agregar redirección o mensaje de éxito
            })
            .catch(err => {
                console.log(err)
                setError('Error al registrar la empresa')
                toast.error('Empresa no registrada ')

            })


            
    }

    return (
        <div className="flex flex-col h-screen text-white bg-zinc-900">
            <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto">
                <div className="w-full p-8 bg-gray-300 rounded-md bg-opacity-10">
                    <h1 className="pb-12 text-4xl font-bold">Registro de Empresa</h1>
                    {error && <div className="p-3 mb-4 text-red-500 bg-red-100 rounded">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Nombre de la empresa *"
                                className="w-full p-2 text-black rounded"
                                onChange={(e) => setCompany({...company, name: e.target.value})}
                                required
                            />
                        </div>
                        {/* Resto de los campos igual */}
                        <button type="submit" className="w-full p-2 text-white bg-green-600 rounded hover:bg-green-700">
                            Registrar Empresa
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
