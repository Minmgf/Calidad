const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const UserModel = require('./models/User')

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect('mongodb+srv://usco:usco@cluster0.9ao6n.mongodb.net/users');

// LOGIIIIIIIIIIIIIN]
app.post('/login', (req,res) => {
    const {email, password} = req.body;
    UserModel.findOne({email:email})
    .then(user => {
        if(user){
            if(user.password === password){
                res.json({
                    status: 'Success',
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        admin: user.admin // Añadimos el campo admin
                    }
                });
            } else {
                res.json({status: 'Error', message: 'The password is not correct'});
            }
        } else {
            res.json({status: 'Error', message: 'Usuario no registrado'})
        }
    })
})


app.post('/register', (req, res) => {
    UserModel.create(req.body)
    .then( users => res.json(users))
    .catch( err => res.json(err))
})



// EMPRESAAAAAAAAAAAAAAAAAS
const CompanyModel = require('./models/Company')

app.post('/company', (req, res) => {
    const { name } = req.body;

    // Primero buscamos si existe una empresa con ese nombre
    CompanyModel.findOne({ name: name })
        .then(existingCompany => {
            if (existingCompany) {
                // Si la empresa existe, enviamos un error
                res.status(400).json({ error: 'Esta empresa ya está registrada' });
            } else {
                // Si no existe, creamos la nueva empresa
                CompanyModel.create(req.body)
                    .then(company => {
                        res.json(company);
                    })
                    .catch(err => {
                        res.status(500).json({ error: 'Error al crear la empresa' });
                    });
            }
        })
        .catch(err => {
            res.status(500).json({ error: 'Error al verificar la empresa' });
        });
});


// Obtener todas las empresas
app.get('/companies', (req, res) => {
    CompanyModel.find({})
        .then(companies => {
            res.json(companies)
        })
        .catch(err => {
            res.json(err)
        })
})

// PREGUNTAAAAAAAAS
const QuestionModel = require('./models/Question');

// Obtener preguntas por modelo
app.get('/questions/:model', (req, res) => {
    const { model } = req.params;
    QuestionModel.find({ model: model })
        .sort({ number: 1 })
        .then(questions => {
            res.json(questions);
        })
        .catch(err => {
            res.status(500).json({ error: 'Error al obtener las preguntas' });
        });
});

// Crear nueva pregunta
app.post('/questions', (req, res) => {
    QuestionModel.create(req.body)
        .then(question => {
            res.json(question);
        })
        .catch(err => {
            res.status(500).json({ error: 'Error al crear la pregunta' });
        });
});

// Actualizar pregunta
app.put('/questions/:id', (req, res) => {
    const { id } = req.params;
    QuestionModel.findByIdAndUpdate(id, req.body, { new: true })
        .then(question => {
            if (!question) {
                return res.status(404).json({ error: 'Pregunta no encontrada' });
            }
            res.json(question);
        })
        .catch(err => {
            res.status(500).json({ error: 'Error al actualizar la pregunta' });
        });
});

// Elminar Pregunta
app.delete('/questions/:id', (req, res) => {
    const { id } = req.params;
    QuestionModel.findByIdAndDelete(id)
        .then(question => {
            if (!question) {
                return res.status(404).json({ error: 'Pregunta no encontrada' });
            }
            res.json({ message: 'Pregunta eliminada exitosamente' });
        })
        .catch(err => {
            res.status(500).json({ error: 'Error al eliminar la pregunta' });
        });
});

// Evaluacionessssssssssssssss
const EvaluationModel = require('../server/models/Evaluations');

app.post('/evaluations', async (req, res) => {
    const { userId, companyId, modelType, answers } = req.body;
    console.log('Datos recibidos:', req.body);

    // Calcular calificación final basada en las respuestas
    const finalScore = answers.reduce((sum, answer) => sum + answer.value, 0) / answers.length;

    try {
        const evaluation = await EvaluationModel.create({
            userId,
            companyId,
            modelType,
            answers,
            finalScore
        });
        res.status(201).json(evaluation);
    } catch (err) {
        console.error('Error al guardar la evaluación:', err);
        res.status(500).json({ error: 'Error al guardar la evaluación' });
    }
});

app.get('/evaluations', async (req, res) => {
    try {
        const evaluations = await EvaluationModel.find()
            .populate('userId') // Asegúrate de que 'userId' es el nombre correcto del campo
            .populate('companyId', 'name')
            .populate('answers.questionId', 'text')
            .sort({ createdAt: -1 });
        res.json(evaluations);
    } catch (err) {
        console.error('Error al obtener evaluaciones:', err);
        res.status(500).json({ error: 'Error al obtener evaluaciones' });
    }
});




app.listen( 3001, () => {
    console.log('Server is running')
})