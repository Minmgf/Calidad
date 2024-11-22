// RiskEvaluation.jsx
import { useState, useEffect } from 'react';
import { useCompany } from '../../context/CompanyContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useUser } from '../../context/UserContext';

export const RiskEvaluation = () => {
    const { selectedCompany } = useCompany();
    const { user } = useUser();
    const navigate = useNavigate();
    const [selectedRisks, setSelectedRisks] = useState([]);
    const [evaluations, setEvaluations] = useState({});
    const [groupedRisks, setGroupedRisks] = useState({});
    const [categories] = useState([
        'Analisis',
        'Diseño',
        'Codificacion',
        'Pruebas',
        'EntregaDelProducto'
    ]);

    useEffect(() => {
        const loadSelectedRisks = async () => {
            try {
                if (!selectedCompany?.value) return;

                const response = await axios.get(`http://localhost:3001/selected-risks/${selectedCompany.value}`);
                if (response.data && response.data.selectedRisks) {
                    setSelectedRisks(response.data.selectedRisks);

                    // Agrupar riesgos por categoría
                    const grouped = response.data.selectedRisks.reduce((acc, risk) => {
                        if (!acc[risk.category]) {
                            acc[risk.category] = [];
                        }
                        acc[risk.category].push(risk);
                        return acc;
                    }, {});
                    setGroupedRisks(grouped);
                }
            } catch (error) {
                console.error('Error al cargar los riesgos:', error);
                toast.error('Error al cargar los riesgos seleccionados');
            }
        };

        loadSelectedRisks();
    }, [selectedCompany]);

    const handleEvaluation = (riskId, value) => {
        setEvaluations(prev => ({
            ...prev,
            [riskId]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            // Verificar que todos los riesgos han sido evaluados
            const allRisksEvaluated = selectedRisks.every(risk =>
                evaluations[risk._id] !== undefined
            );

            if (!allRisksEvaluated) {
                toast.error('Por favor evalúa todos los riesgos');
                return;
            }

            // Calcular los resultados para cada riesgo evaluado
            const evaluationResults = selectedRisks.map(risk => {
                const name = risk.text;
                const description = risk.description;
                const probabilidad = evaluations[risk._id];

                // Calcular impactos
                // imprime los parametros de los riesgos
                console.log('alcance', risk.alcance);
                console.log('tiempo', risk.tiempo);
                console.log('costo', risk.costo);
                console.log('calidad', risk.calidad);
                const impactoAlcance = probabilidad * (risk.alcance);
                const impactoTiempo = probabilidad * (risk.tiempo);
                const impactoCosto = probabilidad * (risk.costo);
                const impactoCalidad = probabilidad * (risk.calidad);
                const totalImpacto = (impactoAlcance + impactoTiempo + impactoCosto + impactoCalidad);
                console.log('totalImpacto:', totalImpacto);
                // Determinar nivel de riesgo basado en el total de impacto
                const nivelRiesgo = totalImpacto <= 10 ? 'Muy Bajo' :
                totalImpacto <= 30 ? 'Bajo' :
                totalImpacto <= 50 ? 'Medio' :
                totalImpacto <= 80 ? 'Alto' : 'Muy Alto';
                console.log('nivelRiesgo:', nivelRiesgo);
                
                return {
                    riskName: name,
                    riskDescription: description,
                    riskId: risk._id,
                    value: probabilidad,
                    probabilidad: probabilidad,
                    estimaciones:{
                        alcance: risk.alcance,
                        tiempo: risk.tiempo,
                        costo: risk.costo,
                        calidad: risk.calidad
                    },
                    impactos: {
                        alcance: impactoAlcance,
                        tiempo: impactoTiempo,
                        costo: impactoCosto,
                        calidad: impactoCalidad,
                        total: totalImpacto
                    },
                    nivelRiesgo
                };
            });

            const evaluationData = {
                companyId: selectedCompany?.value,
                evaluations: evaluationResults
            };

            const response = await axios.post(
                'http://localhost:3001/risk-evaluations',
                evaluationData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('response:', response);
            if (response.status === 201 || response.status === 200) {
                toast.success('Evaluación guardada exitosamente');
                // Navegar a la matriz de riesgo con los resultados
                navigate('/risk-matrix', {
                    state: { evaluationResults }
                });
            }
        } catch (error) {
            console.error('Error al guardar la evaluación:', error);
            toast.error('Error al guardar la evaluación');
        }
    };

    return (
        <div className="flex flex-col h-full min-h-screen text-white bg-zinc-900">
            <div className="max-w-4xl p-8 mx-auto my-12 bg-gray-300 rounded-md bg-opacity-10">
                <h1 className='pb-8 text-4xl font-bold text-center'>Evaluación de Riesgos</h1>
                <hr className='py-1 opacity-15' />
                <p>Evalúa la probabilidad de cada riesgo seleccionado para {selectedCompany?.label} usando una escala del 1 al 5, donde:</p>
                <ul className='mb-8 text-left'>
                    <li>1. Raro</li>
                    <li>2. Improbable</li>
                    <li>3. Posible</li>
                    <li>4. Probable</li>
                    <li>5. Casi Seguro</li>
                </ul>

                {categories.map(category => {
                    if (!groupedRisks[category]?.length) return null;

                    return (
                        <div key={category} className="mb-8">
                            <h2 className="mb-4 text-2xl font-bold">{category}</h2>
                            <div className="space-y-4">
                                {groupedRisks[category]?.map((risk, index) => (
                                    <div key={risk._id} className="flex items-center p-4 bg-gray-800 rounded-lg">
                                        <div className="flex-grow">
                                            <p className='text-sm'>Riesgo #{index + 1}:</p>
                                            <p>{risk.text}</p>
                                        </div>
                                        <div className="ml-4">
                                            <ul className='flex gap-4 text-gray-600'>
                                                {[1, 2, 3, 4, 5].map((value) => (
                                                    <label
                                                        key={value}
                                                        className={`flex items-center justify-center w-10 h-10 rounded cursor-pointer transition-colors border-gray-400 border-dotted border
                                                            ${evaluations[risk._id] === value
                                                                ? 'bg-green-500 text-white'  // Texto blanco cuando está seleccionado
                                                                : 'bg-gray-700 text-white hover:bg-green-200 hover:text-gray-800'  // Texto blanco por defecto, oscuro en hover
                                                            }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`risk-${risk._id}`}
                                                            value={value}
                                                            checked={evaluations[risk._id] === value}
                                                            onChange={() => handleEvaluation(risk._id, value)}
                                                            className="hidden"
                                                        />
                                                        <span className="text-lg font-medium">{value}</span>
                                                    </label>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 mt-6 text-white bg-green-600 rounded hover:bg-green-700"
                >
                    Realizar Evaluación
                </button>
            </div>
        </div>
    );
};
