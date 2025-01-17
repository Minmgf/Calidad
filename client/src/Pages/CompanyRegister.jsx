import React, { useState, useEffect } from 'react' // Añadido useEffect
import axios from 'axios'
import toast from 'react-hot-toast'
import { useUser } from '../context/UserContext'

export const CompanyRegister = () => {
    const [company, setCompany] = useState({
        name: '',
        description: '',
        sector: '' // Añadido sector ya que se usa en la validación
    })
    const [error, setError] = useState('')
    const [companies, setCompanies] = useState([])
    const { user } = useUser()

    // Cargar empresas
    const loadCompanies = () => {
        axios.get('https://calidad-mu.vercel.app/companies')
            .then(response => {
                setCompanies(response.data)
            })
            .catch(err => {
                console.error(err)
                toast.error('Error al cargar las empresas')
            })
    }

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de que desea eliminar esta empresa?')) {
            try {
                await axios.delete(`https://calidad-mu.vercel.app/company/${id}`)
                toast.success('Empresa eliminada exitosamente')
                loadCompanies() // Recargar la lista
            } catch (error) {
                console.error('Error al eliminar la empresa:', error)
                toast.error('Error al eliminar la empresa')
            }
        }
    }

    useEffect(() => {
        loadCompanies()
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()

        // Validación del nombre
        if (!company.name.trim()) {
            setError('El nombre de la empresa es obligatorio')
            return
        }

        // Validación de campos vacíos - Corregida la lógica
        if (!company.name.trim() ) {
            setError('Todos los campos son obligatorios')
            return
        }

        axios.post('https://calidad-mu.vercel.app/company', company)
            .then(result => {
                console.log(result)
                toast.success('Empresa registrada exitosamente!')
                setError('')
                // Limpiar el formulario después de registrar
                setCompany({
                    name: '',
                    description: '',
                    sector: ''
                })
                // Recargar la lista de empresas
                loadCompanies()
            })
            .catch(err => {
                console.log(err)
                if (err.response?.data?.error) {
                    setError(err.response.data.error)
                } else {
                    setError('Error al registrar la empresa')
                }
                toast.error('Empresa no registrada')
            })
    }

    return (
        // Recuerde mk estos son los estilos para evitar el error de scroll
        <div className="min-h-screen p-8 text-center text-white bg-zinc-900">
            <div className="max-w-4xl mx-auto">
                <div className="w-full p-8 bg-gray-300 rounded-md bg-opacity-10">
                    <h1 className="pb-12 text-4xl font-bold">Registro de Empresa</h1>
                    {error && <div className="p-3 mb-4 text-red-500 bg-red-100 rounded">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Nombre de la empresa *"
                                className="w-full p-2 text-black rounded"
                                value={company.name}
                                onChange={(e) => setCompany({...company, name: e.target.value})}
                                required
                            />
                        </div>
                        {/* <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Descripción *"
                                className="w-full p-2 text-black rounded"
                                value={company.description}
                                onChange={(e) => setCompany({...company, description: e.target.value})}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Sector *"
                                className="w-full p-2 text-black rounded"
                                value={company.sector}
                                onChange={(e) => setCompany({...company, sector: e.target.value})}
                                required
                            />
                        </div> */}
                        <button
                            type="submit"
                            className="w-full p-2 text-white bg-green-600 rounded hover:bg-green-700"
                        >
                            Registrar Empresa
                        </button>
                    </form>

                    {/* Lista de empresas */}
                    <div className="mt-8">
                        <h2 className="mb-4 text-2xl">Empresas Registradas</h2>
                        <div className="space-y-4">
                            {companies.map(comp => (
                                <div
                                    key={comp._id}
                                    className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                                >
                                    <h3 className="text-xl font-bold">{comp.name}</h3>
                                    {/* <p className="text-gray-300">{comp.description}</p>
                                    <p className="text-gray-400">{comp.sector}</p> */}
                                    {user?.admin && (
                                        <button
                                            onClick={() => handleDelete(comp._id)}
                                            className="px-3 py-1 mt-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                                        >
                                            Eliminar
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyRegister
