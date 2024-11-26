import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const RiskManager = () => {


    const [risks, setRisks] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [editingRisk, setEditingRisk] = useState(null);
    const [newRisk, setNewRisk] = useState({
        text: '',
        description: '',
        category: '',
        alcance: '',
        tiempo: '',
        costo: '',
        calidad: '',
        status: '',
    })

    const category = [
        'Analisis',
        'Diseño',
        'Codificacion',
        'Pruebas',
        'EntregaDelProducto',
    ];

    useEffect(() => {
        if (selectedCategory) {
            loadCrud(selectedCategory);
        }
    }, [selectedCategory])

    const loadCrud = (category) => {
        const formattedCategory = category.replace(' ', '');

        axios.get(`https://calidad-back.vercel.app/risks/${formattedCategory}`)
            .then(response => {
                setRisks(response.data);
                console.log('Crud cargado', response.data);
            })
            .catch(error => {
                console.log('Error al cargar crud', error)
                toast.error('Error al cargar el gestor de riesgos');
            })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!newRisk.text || !newRisk.alcance
            || !newRisk.calidad || !newRisk.costo
            || !newRisk.tiempo || !newRisk.description) {
            toast.error('Por favor complete todos los campos')
            return;
        }

        const riskToAdd = {
            ...newRisk,
            category: selectedCategory.replace(' ', '')
        }

        axios.post('https://calidad-back.vercel.app/risks', riskToAdd)
            .then(response => {
                toast.success('Riesgo agregado exitosamente');
                setNewRisk({
                    text: '',
                    description: '',
                    category: '',
                    alcance: '',
                    tiempo: '',
                    costo: '',
                    calidad: ''
                });
                loadCrud(selectedCategory);

            })
            .catch(error => {
                toast.error('Error al agregar riesgo');
                console.log('Error al agregar riesgo', error);
            })

        
    }


    // Funciones para manejar edición y eliminación
    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de que desea eliminar este riesgo?')) {
            try {
                await axios.delete(`https://calidad-back.vercel.app/risks/${id}`)
                toast.success('Riesgo eliminado exitosamente')
                loadCrud(selectedCategory) // Recargar la lista
            } catch (error) {
                console.error('Error al eliminar el riesgo:', error)
                toast.error('Error al eliminar el riesgo')
            }
        }
    }

    const handleEdit = (risk) => {
        setEditingRisk(risk);
    }

    const handleUpdate = async (updatedRisk) => {
        try {
            await axios.put(`https://calidad-back.vercel.app/risks/${updatedRisk._id}`, updatedRisk);
            toast.success('Riesgo actualizado exitosamente');
            loadCrud(selectedCategory);
            setEditingRisk(null);
        } catch (error) {
            console.error('Error al actualizar el riesgo:', error);
            toast.error('Error al actualizar el riesgo');
        }
    }


    return (
        <div className="min-h-screen p-8 text-white bg-zinc-900">
            <div className="max-w-4xl mx-auto">
                <h1 className="mb-8 text-3xl font-bold text-center">Gestor de Riesgos</h1>
                <div className="mb-4">
                    <select
                        className="w-full p-2 text-black rounded"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">Seleccione una categoria </option>
                        {category.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
                {selectedCategory && (
                    <div className="p-4 mb-8 bg-gray-800 rounded">
                        <h2 className="mb-4 text-xl">Agregar Riesgo</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Riesgo"
                                    className="w-full p-2 text-black rounded"
                                    value={newRisk.text}
                                    onChange={(e) => setNewRisk({
                                        ...newRisk,
                                        text: e.target.value
                                    })}
                                />
                            </div>
                            <div className="mb-4">
                                <select
                                    disabled='true'
                                    className="w-full p-2 text-black rounded"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="">Seleccione una categoria </option>
                                    {category.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="">
                                <input
                                    type="text"
                                    placeholder="Descripcion"
                                    className="w-full p-2 text-black rounded"
                                    value={newRisk.description}
                                    onChange={(e) => setNewRisk({
                                        ...newRisk,
                                        description: e.target.value
                                    })}
                                />
                            </div>

                            <h2 className='py-0 my-2 text-lg text-center text-gray-300'>Define los siguientes parametos de 1 a 5 </h2>
                            <div className="flex gap-4 mb-4">

                                <div className="w-1/3">
                                    <label for="alcance" className='text-gray-300 text-s'>Alcance:</label>
                                    <input
                                        name='alcance'
                                        type="number"
                                        min='1'
                                        max='5'
                                        placeholder="Alcance 1-5"
                                        className="w-full p-2 text-black rounded"
                                        value={newRisk.alcance}
                                        onChange={(e) => setNewRisk({
                                            ...newRisk,
                                            alcance: e.target.value
                                        })}
                                    />
                                </div>
                                <div className="w-1/3">
                                    <label for="tiempo" className='text-gray-300 text-s'>Tiempo:</label>
                                    <input
                                        name='tiempo'
                                        type="number"
                                        min='1'
                                        max='5'
                                        placeholder="Tiempo 1-5"
                                        className="w-full p-2 text-black rounded"
                                        value={newRisk.tiempo}
                                        onChange={(e) => setNewRisk({
                                            ...newRisk,
                                            tiempo: e.target.value
                                        })}
                                    />
                                </div>
                                <div className="w-1/3">
                                    <label for="costo" className='text-gray-300 text-s'>Costo:</label>
                                    <input
                                        name='costo'
                                        type="number"
                                        min='1'
                                        max='5'
                                        placeholder="Costo 1-5"
                                        className="w-full p-2 text-black rounded"
                                        value={newRisk.costo}
                                        onChange={(e) => setNewRisk({
                                            ...newRisk,
                                            costo: e.target.value
                                        })}
                                    />
                                </div>
                                <div className="w-1/3">
                                    <label for="calidad" className='text-gray-300 text-s'>Calidad:</label>
                                    <input
                                        name='calidad'
                                        type="number"
                                        min='1'
                                        max='5'
                                        placeholder="Calidad 1-5"
                                        className="w-full p-2 text-black rounded"
                                        value={newRisk.calidad}
                                        onChange={(e) => setNewRisk({
                                            ...newRisk,
                                            calidad: e.target.value
                                        })}
                                    />
                                </div>

                            </div>

                            <button
                                type="submit"
                                className="w-full p-2 text-white bg-green-600 rounded hover: "  >
                                Agregar Riesgo
                            </button>
                        </form>
                    </div>
                )}

                {risks.length > 0 && (
                    <div className="mt-8">
                        <h2 className="mb-4 text-xl">Riesgos Registrados</h2>
                        {risks.map((risk) => (
                            <div key={risk._id} className="p-4 mb-4 bg-gray-800 rounded-lg">
                                {editingRisk?._id === risk._id ? (
                                    // Formulario de edición
                                    <div className="flex flex-col gap-2">
                                        <div className="">
                                            <label for="name">Nombre del riesgo:</label>
                                            <input
                                                type="text"
                                                name='name'
                                                className="w-full p-2 text-black rounded"
                                                value={editingRisk.text}
                                                onChange={(e) => setEditingRisk({
                                                    ...editingRisk,
                                                    text: e.target.value
                                                })}
                                            />
                                        </div>
                                        <div className="">
                                            <label for="description">Descripcion:</label>
                                            <input
                                                type="text"
                                                name='description'
                                                className="w-full p-2 text-black rounded"
                                                value={editingRisk.description}
                                                onChange={(e) => setEditingRisk({
                                                    ...editingRisk,
                                                    description: e.target.value
                                                })}
                                            />
                                        </div>

                                        {/* 4 parametros */}
                                        <div className="flex gap-3">
                                            <div className="flex flex-col w-1/3">
                                                <label for="alcance">Alcance:</label>
                                                <input
                                                    type="text"
                                                    name='alcance'
                                                    className="p-2 text-black rounded disabled:"
                                                    value={editingRisk.alcance}
                                                    onChange={(e) => setEditingRisk({
                                                        ...editingRisk,
                                                        alcance: e.target.value
                                                    })}
                                                />
                                            </div>
                                            <div className="flex flex-col w-1/3">
                                                <label for="tiempo">Tiempo:</label>
                                                <input
                                                    type="text"
                                                    name='tiempo'
                                                    className="p-2 text-black rounded disabled:"
                                                    value={editingRisk.tiempo}
                                                    onChange={(e) => setEditingRisk({
                                                        ...editingRisk,
                                                        tiempo: e.target.value
                                                    })}
                                                />
                                            </div>
                                            <div className="flex flex-col w-1/3">
                                                <label for="costo">Costo:</label>
                                                <input
                                                    type="text"
                                                    name='costo'
                                                    className="p-2 text-black rounded disabled:"
                                                    value={editingRisk.costo}
                                                    onChange={(e) => setEditingRisk({
                                                        ...editingRisk,
                                                        costo: e.target.value
                                                    })}
                                                />
                                            </div>
                                            <div className="flex flex-col w-1/3">
                                                <label for="calidad">Calidad:</label>
                                                <input
                                                    type="text"
                                                    name='calidad'
                                                    className="p-2 text-black rounded disabled:"
                                                    value={editingRisk.calidad}
                                                    onChange={(e) => setEditingRisk({
                                                        ...editingRisk,
                                                        calidad: e.target.value
                                                    })}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2 pt-2">
                                            <button
                                                onClick={() => handleUpdate(editingRisk)}
                                                className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                                            >
                                                Guardar
                                            </button>
                                            <button
                                                onClick={() => setEditingRisk(null)}
                                                className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // Vista normal
                                    <div className="flex items-center justify-between">
                                        <div className='px-4'>
                                            <p className="text-lg">Riesgo: {risk.text}</p>
                                            <p className="text-sm text-gray-400">Descripción: {risk.description}</p>
                                            <div className="flex gap-3">
                                            <p className="text-sm text-gray-400">Categoría: {risk.category}</p>
                                            <p className="text-sm text-gray-400">Alcance: {risk.alcance}</p>
                                            <p className="text-sm text-gray-400">Tiempo: {risk.tiempo}</p>
                                            <p className="text-sm text-gray-400">Costo: {risk.costo}</p>
                                            <p className="text-sm text-gray-400">Calidad: {risk.calidad}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(risk)}
                                                className="px-3 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(risk._id)}
                                                className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                    </div>
                )}


            </div>
        </div>
    )
}

export default RiskManager