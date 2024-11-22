const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require("./models/User");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("");

// LOGIIIIIIIIIIIIIN]
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email: email }).then((user) => {
        if (user) {
            if (user.password === password) {
                res.json({
                    status: "Success",
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        admin: user.admin, // Añadimos el campo admin
                    },
                });
            } else {
                res.json({ status: "Error", message: "The password is not correct" });
            }
        } else {
            res.json({ status: "Error", message: "Usuario no registrado" });
        }
    });
});

app.post("/register", (req, res) => {
    UserModel.create(req.body)
        .then((users) => res.json(users))
        .catch((err) => res.json(err));
});

// EMPRESAAAAAAAAAAAAAAAAAS
const CompanyModel = require("./models/Company");

app.post("/company", (req, res) => {
    const { name } = req.body;

    // Primero buscamos si existe una empresa con ese nombre
    CompanyModel.findOne({ name: name })
        .then((existingCompany) => {
            if (existingCompany) {
                // Si la empresa existe, enviamos un error
                res.status(400).json({ error: "Esta empresa ya está registrada" });
            } else {
                // Si no existe, creamos la nueva empresa
                CompanyModel.create(req.body)
                    .then((company) => {
                        res.json(company);
                    })
                    .catch((err) => {
                        res.status(500).json({ error: "Error al crear la empresa" });
                    });
            }
        })
        .catch((err) => {
            res.status(500).json({ error: "Error al verificar la empresa" });
        });
});

// Eliminar empresa
app.delete("/company/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCompany = await CompanyModel.findByIdAndDelete(id);
        if (!deletedCompany) {
            return res.status(404).json({ error: "Empresa no encontrada" });
        }
        res.json({ message: "Empresa eliminada exitosamente" });
    } catch (err) {
        res.status(500).json({ error: "Error al eliminar la empresa" });
    }
});

// Obtener todas las empresas
app.get("/companies", (req, res) => {
    CompanyModel.find({})
        .then((companies) => {
            res.json(companies);
        })
        .catch((err) => {
            res.json(err);
        });
});

// PREGUNTAAAAAAAAS
const QuestionModel = require("./models/Question");

// Obtener preguntas por modelo
app.get("/questions/:model", (req, res) => {
    const { model } = req.params;
    QuestionModel.find({ model: model })
        .sort({ number: 1 })
        .then((questions) => {
            res.json(questions);
        })
        .catch((err) => {
            res.status(500).json({ error: "Error al obtener las preguntas" });
        });
});

// Crear nueva pregunta
app.post("/questions", (req, res) => {
    QuestionModel.create(req.body)
        .then((question) => {
            res.json(question);
        })
        .catch((err) => {
            res.status(500).json({ error: "Error al crear la pregunta" });
        });
});

// Actualizar pregunta
app.put("/questions/:id", (req, res) => {
    const { id } = req.params;
    QuestionModel.findByIdAndUpdate(id, req.body, { new: true })
        .then((question) => {
            if (!question) {
                return res.status(404).json({ error: "Pregunta no encontrada" });
            }
            res.json(question);
        })
        .catch((err) => {
            res.status(500).json({ error: "Error al actualizar la pregunta" });
        });
});

// Elminar Pregunta
app.delete("/questions/:id", (req, res) => {
    const { id } = req.params;
    QuestionModel.findByIdAndDelete(id)
        .then((question) => {
            if (!question) {
                return res.status(404).json({ error: "Pregunta no encontrada" });
            }
            res.json({ message: "Pregunta eliminada exitosamente" });
        })
        .catch((err) => {
            res.status(500).json({ error: "Error al eliminar la pregunta" });
        });
});

// Evaluacionessssssssssssssss
const EvaluationModel = require("../server/models/Evaluations");

app.post("/evaluations", async (req, res) => {
    const { userId, companyId, modelType, answers } = req.body;
    console.log("Datos recibidos:", req.body);

    // Calcular calificación final basada en las respuestas
    const finalScore =
        answers.reduce((sum, answer) => sum + answer.value, 0) / answers.length;

    try {
        const evaluation = await EvaluationModel.create({
            userId,
            companyId,
            modelType,
            answers,
            finalScore,
        });
        res.status(201).json(evaluation);
    } catch (err) {
        console.error("Error al guardar la evaluación:", err);
        res.status(500).json({ error: "Error al guardar la evaluación" });
    }
});

app.get("/evaluations", async (req, res) => {
    try {
        const evaluations = await EvaluationModel.find()
            .populate("userId") // Asegúrate de que 'userId' es el nombre correcto del campo
            .populate("companyId", "name")
            .populate("answers.questionId", "text")
            .sort({ createdAt: -1 });
        res.json(evaluations);
    } catch (err) {
        console.error("Error al obtener evaluaciones:", err);
        res.status(500).json({ error: "Error al obtener evaluaciones" });
    }
});

// RIESGOOOOooooooooooooS
const RiskModel = require("./models/Risk");

//  Crear nuevo riesgo
app.post("/risks", (req, res) => {
    RiskModel.create(req.body)
        .then((risk) => {
            res.json(risk);
        })
        .catch((err) => {
            res.status(500).json({ error: "Error al crear los riesgos" });
        });
});

// Obtener riesgos por categoría
app.get("/risks/:category", (req, res) => {
    const { category } = req.params;
    RiskModel.find({ category: category })
        .then((risks) => {
            res.json(risks);
        })
        .catch((err) => {
            res.status(500).json({ error: "Error al obtener los riesgos" });
        });
});

app.delete("/risks/:id", async (req, res) => {
    try {
        const deletedRisk = await RiskModel.findByIdAndDelete(req.params.id);
        if (!deletedRisk) {
            return res.status(404).json({ error: "Riesgo no encontrado" });
        }
        res.json({ message: "Riesgo eliminado exitosamente" });
    } catch (err) {
        res.status(500).json({ error: "Error al eliminar el riesgo" });
    }
});

const RiskEvaluationModel = require("./models/RiskEvaluation");
app.put("/risks/:id", async (req, res) => {
    try {
        const updatedRisk = await RiskModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedRisk) {
            return res.status(404).json({ error: "Riesgo no encontrado" });
        }
        res.json(updatedRisk);
    } catch (err) {
        res.status(500).json({ error: "Error al actualizar el riesgo" });
    }
});

// Endpoint para guardar los riesgos seleccionados
app.post("/selected-risks", async (req, res) => {
    try {
        const { companyId, risks } = req.body;

        // Validación de datos
        if (!companyId || !risks || !Array.isArray(risks)) {
            return res.status(400).json({
                error: "Datos inválidos. Se requiere companyId y un array de risks",
            });
        }

        // Crear el registro de evaluación de riesgos
        const riskEvaluation = await RiskEvaluationModel.create({
            companyId,
            selectedRisks: risks,
            status: "pending_evaluation",
        });

        res.status(201).json({
            message: "Riesgos guardados exitosamente",
            evaluation: riskEvaluation,
        });
    } catch (error) {
        console.error("Error al guardar los riesgos:", error);
        res.status(500).json({
            error: "Error al guardar los riesgos seleccionados",
        });
    }
});

app.get("/selected-risks/:companyId", async (req, res) => {
    try {
        const { companyId } = req.params;

        // Buscar la evaluación de riesgos más reciente para esta empresa
        const riskEvaluation = await RiskEvaluationModel.findOne({
            companyId: companyId,
            status: "pending_evaluation",
        }).sort({ createdAt: -1 });

        if (!riskEvaluation) {
            return res.status(404).json({
                error: "No hay riesgos seleccionados para esta empresa",
            });
        }



        // Obtener los detalles completos de los riesgos
        const selectedRisks = await RiskModel.find({
            _id: { $in: riskEvaluation.selectedRisks },
        });

        res.json({ selectedRisks });
    } catch (error) {
        console.error("Error al obtener riesgos seleccionados:", error);
        res.status(500).json({
            error: "Error al obtener los riesgos seleccionados",
        });
    }
});

// Endpoint para guardar las evaluaciones de riesgos
app.post("/risk-evaluations", async (req, res) => {
    try {
        const { companyId, evaluations } = req.body;

        // Validar los datos recibidos
        if (!companyId || !evaluations || !Array.isArray(evaluations)) {
            return res.status(400).json({
                error:
                    "Datos inválidos. Se requiere companyId y un array de evaluations",
            });
        }

        // Validar que cada evaluación tenga la estructura correcta
        const isValidEvaluations = evaluations.every(
            (eval) =>
                eval.riskId &&
                typeof eval.value === "number" &&
                eval.value >= 1 &&
                eval.value <= 5
        );

        if (!isValidEvaluations) {
            return res.status(400).json({
                error: "Formato de evaluaciones inválido",
            });
        }

        // Crear el documento de evaluación
        const riskEvaluation = await RiskEvaluationModel.create({
            companyId,
            evaluations: evaluations.map((eval) => ({
                riskId: eval.riskId,
                value: eval.value,
            })),
            status: "completed",
            completedAt: new Date(),
        });

        // Actualizar el estado de la evaluación pendiente si existe
        await RiskEvaluationModel.findOneAndUpdate(
            {
                companyId: companyId,
                status: "pending_evaluation",
            },
            { status: "completed" }
        );

        res.status(201).json({
            message: "Evaluación guardada exitosamente",
            evaluation: riskEvaluation,
        });
    } catch (error) {
        console.error("Error al guardar la evaluación:", error);
        res.status(500).json({
            error: "Error al guardar la evaluación de riesgos",
        });
    }
});

// En server/index.js
app.post('/risk-evaluations', async (req, res) => {
    try {
        const { companyId, evaluations } = req.body;

        // Validar que se recibieron los datos necesarios
        if (!companyId || !evaluations || !Array.isArray(evaluations)) {
            return res.status(400).json({
                error: 'Datos inválidos o incompletos'
            });
        }

        // Validar que cada evaluación tenga la estructura correcta
        const isValidEvaluations = evaluations.every(eval =>
            eval.riskId &&
            eval.estimacionProbabilidad &&
            typeof eval.estimacionProbabilidad === 'number' &&
            eval.estimacionProbabilidad >= 1 &&
            eval.estimacionProbabilidad <= 5 &&
            eval.objetivos &&
            eval.resultados
        );

        if (!isValidEvaluations) {
            return res.status(400).json({
                error: 'Formato de evaluaciones inválido'
            });
        }

        // Crear el documento de evaluación
        const riskEvaluation = await RiskEvaluationModel.create({
            companyId,
            evaluations: evaluations.map(eval => ({
                riskId: eval.riskId,
                codigo: eval.codigo,
                descripcion: eval.descripcion,
                faseAfectada: eval.faseAfectada,
                causaRaiz: eval.causaRaiz,
                entregablesAfectados: eval.entregablesAfectados,
                estimacionProbabilidad: eval.estimacionProbabilidad,
                objetivos: {
                    alcance: eval.objetivos.alcance,
                    tiempo: eval.objetivos.tiempo,
                    costo: eval.objetivos.costo,
                    calidad: eval.objetivos.calidad
                },
                resultados: {
                    impactoAlcance: eval.resultados.impactoAlcance,
                    impactoTiempo: eval.resultados.impactoTiempo,
                    impactoCosto: eval.resultados.impactoCosto,
                    impactoCalidad: eval.resultados.impactoCalidad,
                    totalImpacto: eval.resultados.totalImpacto,
                    nivelRiesgo: eval.resultados.nivelRiesgo
                }
            })),
            status: "completed",
            completedAt: new Date()
        });

        // Actualizar el estado de la evaluación pendiente si existe
        await RiskEvaluationModel.findOneAndUpdate(
            {
                companyId: companyId,
                status: "pending_evaluation"
            },
            {
                status: "completed",
                completedAt: new Date()
            }
        );

        res.status(201).json({
            message: "Evaluación guardada exitosamente",
            evaluation: riskEvaluation
        });

    } catch (error) {
        console.error("Error al guardar la evaluación:", error);
        res.status(500).json({
            error: "Error al guardar la evaluación de riesgos"
        });
    }
});

app.listen(3001, () => {
    console.log("Server is running");
});
