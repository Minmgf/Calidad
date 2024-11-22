// TableMatrixRisk.jsx
import { useLocation } from 'react-router-dom';

export const TableMatrixRisk = () => {
    const location = useLocation();
    const { evaluationResults } = location.state || { evaluationResults: [] };
    const total = evaluationResults.reduce((acc, riesgo) => acc + riesgo.impactos.total, 0);

    // Función para determinar el color según el nivel de riesgo
    const getNivelRiesgoColor = (probabilidad, impacto) => {
        const valorRiesgo = probabilidad * impacto;
        if (valorRiesgo >= 51) return 'bg-red-600';    // Muy Alto
        if (valorRiesgo >= 31) return 'bg-orange-500'; // Alto
        if (valorRiesgo >= 21) return 'bg-yellow-500'; // Medio
        if (valorRiesgo >= 11) return 'bg-blue-500';   // Bajo
        return 'bg-green-500';                         // Muy Bajo
    };

    // Función para obtener el texto del nivel de riesgo
    const getNivelRiesgoTexto = (probabilidad, impacto) => {
        const valorRiesgo = probabilidad * impacto;
        if (valorRiesgo >= 51) return 'Muy Alto';
        if (valorRiesgo >= 31) return 'Alto';
        if (valorRiesgo >= 21) return 'Medio';
        if (valorRiesgo >= 11) return 'Bajo';
        return 'Muy Bajo';
    };

    return (
        <div className="p-4">
            <table className="w-full text-white">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border">Código</th>
                        <th className="px-4 py-2 border">Nombre</th>
                        <th className="px-4 py-2 border">Descripción del Riesgo</th>
                        <th className="px-4 py-2 border">Probabilidad</th>
                        <th className="px-4 py-2 border">Objetivo afectado</th>
                        <th className="px-4 py-2 border">Estimacion Impacto</th>
                        <th className="px-4 py-2 border">Impacto Total</th>
                        <th className="px-4 py-2 border">Nivel de Riesgo</th>
                    </tr>
                </thead>
                <tbody>
                    {evaluationResults.map((riesgo, index) => (
                        <tr key={riesgo.riskId}>
                            <td className="px-4 border">{`R${index + 1}`}</td>
                            <td className="px-4 border">{riesgo.riskName}</td>
                            <td className="px-4 border">{riesgo.riskDescription}</td>
                            <td className="px-4 text-center border">{riesgo.probabilidad}</td>
                            <td className="text-center border-y ">
                                <ul>
                                    <li className='border'>Alcance</li>
                                    <li className='border'>Tiempo</li>
                                    <li className='border'>Costo</li>
                                    <li className='border'>Calidad</li>
                                </ul>
                            </td>
                            <td className="text-center border-y ">
                                <ul>
                                    <li className='border'>{riesgo.estimaciones.alcance}</li>
                                    <li className='border'>{riesgo.estimaciones.tiempo}</li>
                                    <li className='border'>{riesgo.estimaciones.costo}</li>
                                    <li className='border'>{riesgo.estimaciones.calidad}</li>
                                </ul>
                            </td>
                            <td className="text-center border-y ">
                                <ul>
                                    <li className='border'>{riesgo.impactos.alcance}</li>
                                    <li className='border'>{riesgo.impactos.tiempo}</li>
                                    <li className='border'>{riesgo.impactos.costo}</li>
                                    <li className='border'>{riesgo.impactos.calidad}</li>
                                </ul>
                            </td>
                            <td className={` border text-center ${getNivelRiesgoColor(riesgo.probabilidad, riesgo.impactos.total)}`}>
                                {riesgo.nivelRiesgo}
                            </td>
                        </tr>
                    ))}
                </tbody>
                    <tr>
                        <th className="px-4 "></th>
                        <th className="px-4 "></th>
                        <th className="px-4 "></th>
                        <th className="px-4 "></th>
                        <th className="px-4 "></th>
                        <th className="px-4 border">Total Probabilidad x impacto</th>
                        <th className="px-4 border">{total}</th>
                        <th className="px-4 "></th>
                    </tr>
            </table>
        </div>
    );
};