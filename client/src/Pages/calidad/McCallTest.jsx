// client/src/Pages/calidad/IsoTest.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCompany } from '../../context/CompanyContext';
import toast from 'react-hot-toast'
import { useUser } from '../../context/UserContext';



export const McCallTest = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const { selectedCompany } = useCompany();
    const  {user}  = useUser();


    useEffect(() => {
        // Cargar preguntas del modelo McCall
        axios.get('http://localhost:3001/questions/ModeloMcCall')
            .then(response => {
                setQuestions(response.data);
            })
            .catch(error => {
                console.error('Error al cargar las preguntas:', error);
            });
    }, []);

    const handleAnswer = (questionId, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleSubmit = async () => {
        console.log({user});
        console.log({selectedCompany});



        if (!questions || questions.length === 0) {
            toast.error('No hay preguntas disponibles para responder');
            return;
        }

        const allQuestionsAnswered = questions.every(q => answers[q._id] !== undefined && answers[q._id] !== null);

        if (!allQuestionsAnswered) {
            toast.error('Por favor responde todas las preguntas antes de enviar');
            return;
        }

        try {
            // Preparar los datos de la evaluación
            const evaluationData = {
                userId: user._id,
                companyId: selectedCompany?.value || null,
                modelType: 'McCall',
                answers: Object.entries(answers).map(([questionId, value]) => ({
                    questionId,
                    value: parseInt(value, 10) // Asegurarse de que el valor sea un número
                }))
            };

            console.log(evaluationData);

            // Validar si la empresa seleccionada es válida
            if (!evaluationData.companyId) {
                toast.error('Por favor selecciona una empresa');
                return;
            }

            // Enviar los datos al servidor
            const response = await axios.post('http://localhost:3001/evaluations', evaluationData);

            // Confirmar éxito si el servidor responde correctamente
            if (response.status === 201 || response.status === 200) {
                toast.success('Evaluación guardada exitosamente');
                // Redireccionar o limpiar el formulario si es necesario
                setAnswers({}); // Limpia las respuestas
            } else {
                throw new Error('Error inesperado en el servidor');
            }
        } catch (error) {
            console.error('Error al guardar la evaluación:', error);

            // Mensaje de error personalizado dependiendo de la respuesta del servidor
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(`Error: ${error.response.data.error}`);
            } else {
                toast.error('Error al guardar la evaluación. Inténtalo de nuevo más tarde.');
            }
        }
    };


    return (
        <div className="flex flex-col h-full text-white bg-zinc-900">
            <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto my-12 text-center">
                <div className="w-full p-8 bg-gray-300 rounded-md bg-opacity-10">
                    <h1 className="text-4xl font-bold text-white ">
                        Evaluación bajo el modelo McCall
                    </h1>
                    <div className="max-w-2xl mx-auto my-10">
                        <hr className='opacity-15' />
                        <p>A continuación vas a calificar la calidad de {selectedCompany?.label}, se les solicita que califiquen su nivel de satisfacción utilizando una escala del 1 al 5, donde:</p>
                        <ul className='text-left '>
                            <li>1. Totalmente de acuerdo</li>
                            <li>2. De acuerdo</li>
                            <li>3. Neutral</li>
                            <li>4. En desacuerdo</li>
                            <li>5. Totalmente en desacuerdo</li>
                        </ul>
                        <p>Les pedimos encarecidamente que evalúen con discreción y seriedad, ya que su retroalimentación será clave para garantizar la precisión en los resultados de esta evaluación.</p>
                        <hr className='opacity-15' />
                    </div>
                    {questions.map((question, index) => (
                        <div key={question._id} className="flex items-center pr-2 mb-6">
                            <div className="w-10/12 text-left">
                                <p className='text-sm'>Pregunta #{index + 1}:</p>
                                <p>{question.text}</p>
                            </div>
                            <div>
                                <ul className='flex gap-4 text-gray-600'>
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <label
                                            key={value}
                                            className={`flex items-center justify-center px-4 py-2 rounded cursor-pointer transition-colors border-gray-400 border-dotted border
                                                    ${answers[question._id] === value
                                                    ? 'bg-green-500 text-white'
                                                    : 'hover:bg-green-200'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name={`question-${question._id}`}
                                                value={value}
                                                checked={answers[question._id] === value}
                                                onChange={() => handleAnswer(question._id, value)}
                                                className="hidden"
                                            />
                                            {value}
                                        </label>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 mt-6 text-white bg-green-600 rounded hover:bg-green-700"
                    >
                        Enviar Evaluación
                    </button>
                </div>
            </div>
        </div>
    );
};
