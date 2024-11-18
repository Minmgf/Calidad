import { useEffect, useState } from 'react';
import axios from 'axios';

const ResultsPage = () => {
    const [evaluations, setEvaluations] = useState([]);  // Inicializar como array vacío
    const [frequentEvaluations, setFrequentEvaluations] = useState([]); // Inicializar como array vacío

    const getVerdict = (score) => {
        if (score <= 2.0) return {
            level: "Calidad Crítica",
            colorClass: "bg-red-600"
        };
        if (score <= 3.0) return {
            level: "Calidad Baja",
            colorClass: "bg-orange-500"
        };
        if (score <= 4.0) return {
            level: "Calidad Media",
            colorClass: "bg-yellow-500"
        };
        if (score <= 4.5) return {
            level: "Calidad Buena",
            colorClass: "bg-green-500"
        };
        return {
            level: "Calidad Excelente",
            colorClass: "bg-green-600"
        };
    };

    useEffect(() => {
        axios.get('http://localhost:3001/evaluations')
            .then(response => {
                // Modifica esto para acceder directamente a response.data
                setEvaluations(response.data);
                // setFrequentEvaluations(response.data.frequentEvaluations);
            })
            .catch(err => {
                console.error('Error al obtener evaluaciones:', err);
            });
    }, []);

    return (
        <div className='flex h-full px-4 py-8 bg-zinc-900'>
            <div className='w-full h-full max-w-4xl pt-8 mx-auto text-center text-white bg-gray-300 rounded-md bg-opacity-10'>

                <h2 className='mb-8 text-2xl font-bold underline'>Evaluaciones realizadas</h2>
                <div className="flex flex-wrap justify-center max-w-4xl gap-4 pb-20 ">
                    {evaluations && evaluations.length > 0 ? (
                        evaluations.map((evaluation) => {
                            const verdict = getVerdict(evaluation.finalScore);
                            return (
                                <div key={evaluation._id} className="w-1/5 p-4 bg-gray-800 rounded-xl">
                                    <p>Usuario: {evaluation.userId?.name || 'Usuario no disponible'}</p>
                                    <p>Empresa: {evaluation.companyId?.name || 'Empresa no disponible'}</p>
                                    <p>Modelo: {evaluation.modelType}</p>
                                    <p>Puntuación Final: {evaluation.finalScore}</p>
                                    <div className={` px-2 text-white rounded ${verdict.colorClass}`}>
                                        <p className="text-xs font-bold">{verdict.level}</p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className='p-4'>No hay evaluaciones para mostrar</p>
                    )}
                </div>
            </div>
        </div>

    );
};

export default ResultsPage;
