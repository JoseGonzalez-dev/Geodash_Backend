import UserAnswer from './userAnswer.model.js'
import Game from '../Game/game.model.js'
import Question from '../Questions/question.model.js'

// Agregar esta nueva función al controlador existente
export const createGuestAnswer = async (req, res) => {
    const data = req.body  // ← Mantener data
    
    try {
        if (!data.guestGameId || !data.question || !data.selectedOption) {
            return res.status(400).send({
                success: false,
                message: 'guestGameId, question y selectedOption son requeridos'
            })
        }
        
        // Verificar que la pregunta exista
        const questionExists = await Question.findById(data.question)  // ← data.question
        if (!questionExists) {
            return res.status(404).send({
                success: false,
                message: 'Pregunta no encontrada'
            })
        }
        
        // 🎯 CALCULAR si la respuesta es correcta
        const isCorrect = questionExists.correcto === data.selectedOption  // ← data.selectedOption
        
        // Contar respuestas existentes para este invitado
        const existingAnswers = await UserAnswer.countDocuments({ 
            guestGameId: data.guestGameId,  // ← data.guestGameId
            isGuest: true 
        })
        
        if (existingAnswers >= 5) {
            return res.status(400).send({
                success: false,
                message: 'Has alcanzado el límite de preguntas para invitados',
                upgradeMessage: '¡Regístrate para continuar jugando!'
            })
        }
        
        // Crear respuesta de invitado con isCorrect calculado
        const guestAnswer = await UserAnswer.create({
            question: data.question,
            selectedOption: data.selectedOption,
            isCorrect,  // ← Usar el valor calculado
            isGuest: true,
            guestGameId: data.guestGameId,
            responseTimeMs: data.responseTimeMs || 0
        })
        
        const remainingQuestions = 5 - (existingAnswers + 1)
        
        res.status(201).send({
            success: true,
            message: 'Respuesta de invitado registrada',
            data: guestAnswer,
            remainingQuestions,
            upgradePrompt: remainingQuestions === 0 ? '¡Última pregunta! Regístrate para más.' : null
        })
        
    } catch (e) {
        res.status(500).send({
            success: false,
            message: 'Error al registrar respuesta de invitado',
            error: e.message
        })
    }
}

export const createUserAnswer = async (req, res) => {
    const data = req.body  // ← Mantener data
    
    try {
        // Validar que la partida exista
        const gameExists = await Game.findById(data.game)  // ← data.game
        if (!gameExists) {
            return res.status(404).send({
                success: false,
                message: 'Partida no encontrada'
            })
        }
        
        // Validar que la pregunta exista
        const questionExists = await Question.findById(data.question)  // ← data.question
        if (!questionExists) {
            return res.status(404).send({
                success: false,
                message: 'Pregunta no encontrada'
            })
        }
        
        // 🎯 CALCULAR si la respuesta es correcta
        const isCorrect = questionExists.correcto === data.selectedOption  // ← data.selectedOption
        
        // Crear la respuesta del usuario con isCorrect calculado
        const userAnswer = await UserAnswer.create({
            game: data.game,
            question: data.question,
            selectedOption: data.selectedOption,
            isCorrect,  // ← Usar el valor calculado
            responseTimeMs: data.responseTimeMs || 0
        })
        
        res.status(201).send({
            success: true,
            message: 'Respuesta registrada correctamente',
            data: userAnswer
        })
        
    } catch (e) {
        res.status(500).send({
            success: false,
            message: 'Error al registrar la respuesta',
            error: e.message
        })
    }
}

export const getUserAnswersByGame = async (req, res) => {
    const { gameId } = req.params
    
    try {
        const answers = await UserAnswer.find({ game: gameId })
            .populate('question', 'question')
            .populate('game', 'startDate category')
        
        if (answers.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No se encontraron respuestas para esta partida',
                data: []
            })
        }
        
        return res.status(200).send({
            success: true,
            message: 'Respuestas obtenidas correctamente',
            data: answers
        })
        
    } catch (e) {
        res.status(500).send({
            success: false,
            message: 'Error al obtener las respuestas',
            error: e.message
        })
    }
}

export const getUserAnswerStats = async (req, res) => {
    const { userId } = req.params
    
    try {
        // Obtener todas las respuestas del usuario
        const userGames = await Game.find({ user: userId })
        const gameIds = userGames.map(game => game._id)
        
        const answers = await UserAnswer.find({ game: { $in: gameIds } })
        
        // Calcular estadísticas
        const totalAnswers = answers.length
        const correctAnswers = answers.filter(answer => answer.isCorrect).length
        const accuracy = totalAnswers > 0 ? (correctAnswers / totalAnswers * 100).toFixed(2) : 0
        
        const stats = {
            totalAnswers,
            correctAnswers,
            incorrectAnswers: totalAnswers - correctAnswers,
            accuracy: `${accuracy}%`
        }
        
        return res.status(200).send({
            success: true,
            message: 'Estadísticas obtenidas correctamente',
            data: stats
        })
        
    } catch (e) {
        res.status(500).send({
            success: false,
            message: 'Error al obtener las estadísticas',
            error: e.message
        })
    }
}