import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const QuestionManager = () => {
    const [questions, setQuestions] = useState([]);
    const [selectedModel, setSelectedModel] = useState('');
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [newQuestion, setNewQuestion] = useState({
        text: '',
        category: '',
        weight: '',
        model: ''
    });

    const models = [
        'ISO 25000',
        'Modelo FURPS',
        'Modelo Boehm',
        'Modelo McCall',
        'Modelo Dromey',
        'Modelo Six Sigma'
    ];

    useEffect(() => {
        if (selectedModel) {
            loadQuestions(selectedModel);
        }
    }, [selectedModel]);

    const loadQuestions = (model) => {
        // Formatear el modelo para que coincida con lo guardado en la BD
        const formattedModel = model.replace(' ', ''); // Eliminar espacios

        axios.get(`https://calidad-mu.vercel.app/questions/${formattedModel}`)
            .then(response => {
                setQuestions(response.data);
                console.log('Preguntas cargadas:', response.data);
            })
            .catch(error => {
                console.error('Error al cargar las preguntas:', error);
                toast.error('Error al cargar las preguntas');
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!newQuestion.text || !newQuestion.weight) {
            toast.error('Por favor complete todos los campos');
            return;
        }

        const questionToAdd = {
            ...newQuestion,
            model: selectedModel.replace(' ', '')
        };

        axios.post('https://calidad-mu.vercel.app/questions', questionToAdd)
            .then(response => {
                toast.success('Pregunta agregada exitosamente');
                loadQuestions(selectedModel);
                setNewQuestion({
                    text: '',
                    category: '',
                    weight: '',
                    model: ''
                });
            })
            .catch(error => {
                console.error('Error al crear la pregunta:', error);
                toast.error('Error al crear la pregunta');
            });
    };

    const handleEdit = (question) => {
        setEditingQuestion(question);
    };

    const handleUpdate = async (updatedQuestion) => {
        try {
            await axios.put(`https://calidad-mu.vercel.app/questions/${updatedQuestion._id}`, updatedQuestion);
            toast.success('Pregunta actualizada exitosamente');
            loadQuestions(selectedModel);
            setEditingQuestion(null);
        } catch (error) {
            console.error('Error al actualizar la pregunta:', error);
            toast.error('Error al actualizar la pregunta');
        }
    };

    const handleDelete = async (questionId) => {
        if (window.confirm('¿Está seguro de que desea eliminar esta pregunta?')) {
            try {
                await axios.delete(`https://calidad-mu.vercel.app/questions/${questionId}`);
                toast.success('Pregunta eliminada exitosamente');
                loadQuestions(selectedModel);
            } catch (error) {
                console.error('Error al eliminar la pregunta:', error);
                toast.error('Error al eliminar la pregunta');
            }
        }
    };

    return (
        <div className="min-h-screen p-8 text-white bg-zinc-900">
            <div className="max-w-4xl mx-auto">
                <h1 className="mb-8 text-3xl font-bold">Gestor de Preguntas</h1>

                {/* Selector de modelo */}
                <div className="mb-8">
                    <select
                        className="w-full p-2 text-black rounded"
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                    >
                        <option value="">Seleccione un modelo</option>
                        {models.map((model) => (
                            <option key={model} value={model}>
                                {model}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Formulario para agregar preguntas */}
                {selectedModel && (
                    <div className="p-4 mb-8 bg-gray-800 rounded">
                        <h2 className="mb-4 text-xl">Agregar Pregunta</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Pregunta"
                                    className="w-full p-2 text-black rounded"
                                    value={newQuestion.text}
                                    onChange={(e) => setNewQuestion({
                                        ...newQuestion,
                                        text: e.target.value
                                    })}
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="number"
                                    placeholder="Peso (1-5)"
                                    min="1"
                                    max="5"
                                    className="w-full p-2 text-black rounded"
                                    value={newQuestion.weight}
                                    onChange={(e) => setNewQuestion({
                                        ...newQuestion,
                                        weight: e.target.value
                                    })}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full p-2 text-white bg-green-600 rounded hover: "  >
                                Agregar Pregunta
                            </button>
                        </form>
                    </div>
                )}

                {/* Lista de preguntas existentes */}
                {questions.length > 0 && (
                    <div className="mt-8">
                        <h2 className="mb-4 text-xl">Preguntas Existentes</h2>
                        {questions.map((question) => (
                            <div key={question._id} className="p-4 mb-4 bg-gray-800 rounded">
                                {editingQuestion?._id === question._id ? (
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            className="w-full p-2 text-black rounded"
                                            value={editingQuestion.text}
                                            onChange={(e) => setEditingQuestion({
                                                ...editingQuestion,
                                                text: e.target.value
                                            })}
                                        />
                                        <input
                                            type="number"
                                            className="w-full p-2 text-black rounded"
                                            value={editingQuestion.weight}
                                            min="1"
                                            max="5"
                                            onChange={(e) => setEditingQuestion({
                                                ...editingQuestion,
                                                weight: e.target.value
                                            })}
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleUpdate(editingQuestion)}
                                                className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                                            >
                                                Guardar
                                            </button>
                                            <button
                                                onClick={() => setEditingQuestion(null)}
                                                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="mb-2">{question.text}</p>
                                        <p className="text-sm text-gray-400">
                                            Peso: {question.weight}
                                        </p>
                                        <div className="mt-2">
                                            <button
                                                onClick={() => handleEdit(question)}
                                                className="mr-2 text-blue-500 hover:text-blue-400"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(question._id)}
                                                className="text-red-500 hover:text-red-400"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestionManager;
