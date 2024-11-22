// TableMatrixRisk.jsx
import { useLocation } from 'react-router-dom';

export const TableMatrixRisk = () => {
    const location = useLocation();
    const { evaluationResults } = location.state || { evaluationResults: [] };



    return (
        <div className="p-4 ">
            {evaluationResults.map((riesgo, index,) => {
                const totalRiesgo =  riesgo.impactos.total;

                const getNivelRiesgoTexto = (totalRiesgo) => {
                    const valorRiesgo = totalRiesgo;
                    if (valorRiesgo >= 80) return 'Muy Alto';
                    if (valorRiesgo >= 51) return 'Alto';
                    if (valorRiesgo >= 31) return 'Medio';
                    if (valorRiesgo >= 11) return 'Bajo';
                    return 'Muy Bajo';
                };

                const getNivelRiesgoColor = (totalRiesgo) => {
                    const valorRiesgo = totalRiesgo;
                    // Muy Alto (> 80)
                    if (valorRiesgo >= 80) {
                        return "bg-red-600"; // Rojo intenso
                    }
                    // Alto (51-80)
                    if (valorRiesgo >= 51) {
                        return "bg-orange-500"; // Naranja
                    }
                    // Medio (31-50)
                    if (valorRiesgo >= 31) {
                        return "bg-yellow-500"; // Amarillo
                    }
                    // Bajo (11-30)
                    if (valorRiesgo >= 11) {
                        return "bg-green-500"; // Verde
                    }
                    // Muy Bajo (< 11)
                    return "bg-green-300"; // Verde claro
                };

                return(
                <table className="w-full mb-4 text-white">
                    <thead>
                        <tr>
                            <th className="w-1/5 px-4 py-2 border">Código</th>
                            <th className="w-1/5 px-4 py-2 border">Nombre</th>
                            <th className="w-[50%] px-4 py-2 border">Descripción del Riesgo</th>
                            <th className="w-[10%] px-4 py-2 border">Probabilidad</th>
                            <th className="w-1/5 px-4 py-2 border">Objetivo afectado</th>
                            <th className="w-1/5 px-4 py-2 border">Estimacion Impacto</th>
                            <th className="w-1/5 px-4 py-2 border">Impacto Total</th>
                            <th className="w-1/5 px-4 py-2 border">Nivel de Riesgo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr key={riesgo.riskId}>
                            <td className="px-4 border">{`R${index + 1}`}</td>
                            <td className="px-4 border">{riesgo.riskName}</td>
                            <td className="px-4 text-sm border">{riesgo.riskDescription}</td>
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
                            <td
                                className={`border px-4 py-2 text-center text-white ${getNivelRiesgoColor(totalRiesgo)}`}
                            >
                                {getNivelRiesgoTexto(totalRiesgo)}
                            </td>
                        </tr>
                        <tr>
                            <th className="px-4 "></th>
                            <th className="px-4 "></th>
                            <th className="px-4 "></th>
                            <th className="px-4 "></th>
                            <th className="px-4 "></th>
                            <th className="px-4 text-xs border">Total Probabilidad x impacto</th>
                            <th className="px-4 border">{totalRiesgo}</th>
                            <th className="px-4 "></th>
                        </tr>
                    </tbody>
                </table>
            )})}
        </div>
    );
};