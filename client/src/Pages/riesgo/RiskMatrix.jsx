// RiskMatrix.jsx
import { useLocation } from 'react-router-dom';
import {TableMatrixRisk} from './TableMatrixRisk';

export const RiskMatrix = () => {
    const location = useLocation();
    const { evaluationResults } = location.state || { evaluationResults: [] };

    return (
        <div className="flex flex-col h-full min-h-screen text-white bg-zinc-900">
            <div className="p-8 mx-auto my-12 bg-gray-300 rounded-md max-w-7xl bg-opacity-10">
                <h1 className='pb-8 text-4xl font-bold text-center'>Matriz de Riesgos</h1>
                <hr className='py-1 opacity-15' />
                <TableMatrixRisk riesgos={evaluationResults} />
            </div>
        </div>
    );
};
