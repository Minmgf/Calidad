import { Link, useLocation } from 'react-router-dom';
import { TableMatrixRisk } from './TableMatrixRisk';
import { useCompany } from '../../context/CompanyContext'; // Change this line
import { useUser } from '../../context/UserContext';
import html2pdf from 'html2pdf.js';

export const RiskMatrix = () => {
    const { selectedCompany } = useCompany(); // Use the hook instead of useContext
    const location = useLocation();
    const { evaluationResults } = location.state || { evaluationResults: [] };
    const { user } = useUser();

    async function handleDownload() {
        const element = document.querySelector('#invoice');
    const options = {
            margin: 10, // Margen en milímetros
            filename: 'Matriz_de_Riesgos.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2, // Mejora la calidad del PDF
                useCORS: true
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'landscape' // O 'landscape' si lo necesitas horizontal
            }
        };
    
        html2pdf().set(options).from(element).save();
    }

    return (
        <div className="flex flex-col h-full min-h-screen text-white bg-zinc-900" id='invoice'>
            <div className="p-8 mx-auto my-12 bg-gray-300 rounded-md max-w-7xl bg-opacity-10">
                <h1 className="text-4xl font-bold text-center">
                    Matriz de Riesgos {selectedCompany?.label}
                </h1>
                <p className="text-center text-gray-400">Realizada por: {user.name}</p>
                <p className="text-center text-gray-400">
                    Realizada el: {new Date().toLocaleDateString()}
                </p>
                <hr className="py-1 opacity-15" />
                <TableMatrixRisk riesgos={evaluationResults} />
                <div className="flex justify-between">
                  <button
                    className='px-4 py-2 bg-green-600 rounded-lg'
                    onClick={handleDownload}
                  >
                    Descargar matriz de riesgos
                  </button>

                    <Link to="/" className="px-4 py-2 bg-gray-600 rounded-lg">
                        Regresar a inicio
                    </Link>
                </div>
            </div>
        </div>
    );
};
