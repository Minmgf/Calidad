import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../../context/CompanyContext';
import { toast } from 'react-hot-toast';

export const Riesgo = () => {
    const { selectedCompany } = useCompany();
    const [risks, setRisks] = useState([]);
    const [selectedRisks, setSelectedRisks] = useState({});
    const [categories, setCategories] = useState([
        'Analisis',
        'Diseño',
        'Codificacion',
        'Pruebas',
        'EntregaDelProducto'
    ]);
    const navigate = useNavigate();

    // Cargar los riesgos
    const loadRisks = async (category) => {
        try {
            const formattedCategory = category.replace(' ', '');
            const response = await axios.get(`https://calidad-5vft.vercel.app/risks/${formattedCategory}`);
            return response.data;
        } catch (error) {
            console.error('Error al cargar los riesgos:', error);
            toast.error('Error al cargar los riesgos');
            return [];
        }
    };

    useEffect(() => {
        const fetchAllRisks = async () => {
            const allRisks = {};
            for (const category of categories) {
                const risksForCategory = await loadRisks(category);
                allRisks[category] = risksForCategory;
            }
            setRisks(allRisks);
        };
        fetchAllRisks();
    }, []);

    const handleRiskSelection = (riskId) => {
        setSelectedRisks(prev => {
            const newState = {
                ...prev,
                [riskId]: !prev[riskId]
            };
            // Log para depuración
            console.log('Estado actualizado:', newState);
            return newState;
        });
    };

    const handleContinue = async () => {
        // Obtener array de IDs de riesgos seleccionados
        const selectedRiskIds = Object.entries(selectedRisks)
            .filter(([_, isSelected]) => isSelected === true)
            .map(([riskId]) => riskId);
    
        // Log para depuración
        console.log('Todos los riesgos disponibles:', risks);
        console.log('Estado de selecciones:', selectedRisks);
        console.log('Riesgos seleccionados:', selectedRiskIds);
    
        // Verificar selecciones por categoría
        categories.forEach(category => {
            const risksInCategory = risks[category] || [];
            const selectedInCategory = risksInCategory.filter(risk => selectedRisks[risk._id]);
            console.log(`Riesgos seleccionados en ${category}:`, selectedInCategory);
        });
    
        // Resto del código de handleContinue...
        try {
            const response = await axios.post('https://calidad-5vft.vercel.app/selected-risks', {
                companyId: selectedCompany.value,
                risks: selectedRiskIds
            });
    
            if (response.status === 201) {
                toast.success('Riesgos guardados exitosamente');
                navigate('/risk-evaluation');
            }
        } catch (error) {
            console.error('Error al guardar los riesgos:', error);
            toast.error(error.response?.data?.error || 'Error al guardar los riesgos seleccionados');
        }
    };
    
    

    return (
        <div className="flex flex-col h-full min-h-screen text-white bg-zinc-900">
            <div className="max-w-4xl p-8 mx-auto my-12 bg-gray-300 rounded-md bg-opacity-10">
                <h1 className='pb-8 text-4xl font-bold text-center'>Evaluacion de Riesgos</h1>
                <hr className='py-1 opacity-15' />
                <p>A continuación vas a calificar los riesgos presentes en {selectedCompany?.label}.</p>
                <p className="mb-8">Les pedimos encarecidamente que evalúen con discreción y seriedad, ya que su retroalimentación será clave para garantizar la precisión en los resultados de esta evaluación.</p>

                {categories.map(category => (
                    <div key={category} className="mb-8">
                        <h2 className="mb-4 text-2xl font-bold">{category}</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            {risks[category]?.map(risk => (
                                <div
                                    key={risk._id}
                                    className="p-4 transition-colors bg-gray-800 rounded-lg hover:bg-gray-700"
                                    onClick={() => handleRiskSelection(risk._id)}

                                >
                                    <div className="flex items-start space-x-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedRisks[risk._id] || false}
                                            onChange={() => handleRiskSelection(risk._id)}
                                            className="mt-1 form-checkbox"
                                        />
                                        <div>
                                            <h3 className="font-bold">{risk.text}</h3>
                                            <p className="text-sm text-gray-400">{risk.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="flex justify-center mt-8">
                    <button
                        onClick={handleContinue}
                        className="px-6 py-2 text-white transition-colors bg-green-600 rounded hover:bg-green-700"
                    >
                        Continuar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Riesgo;
