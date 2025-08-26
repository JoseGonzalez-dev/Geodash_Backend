import UserAnswer from './userAnswer.model.js'
import Game from '../Game/game.model.js'
import Question from '../Questions/question.model.js'

export const createUserAnswer = async (req, res) => {
    const { game, question, selectedOption, responseTimeMs } = req.body
    
    try {
        // Validar que la partida exista
        const gameExists = await Game.findById(game)
        if (!gameExists) {
            return res.status(404).send({
                success: false,
                message: 'Partida no encontrada'
            })
        }
        
        // Validar que la pregunta exista
        const questionExists = await Question.findById(question)
        if (!questionExists) {
            return res.status(404).send({
                success: false,
                message: 'Pregunta no encontrada'
            })
        }
        
        // Crear la respuesta del usuario
        const userAnswer = await UserAnswer.create({
            game,
            question,
            selectedOption,
            responseTimeMs: responseTimeMs || 0
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