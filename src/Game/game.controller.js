import Game from './game.model.js'
import User from '../User/user.model.js'
import Category from '../Category/category.model.js'
import Streak from '../Streak/streak.model.js'

// Agregar esta nueva función al controlador existente
export const createGuestGame = async (req, res) => {
    try {
        const { difficulty } = req.body

        if (!difficulty) {
            return res.status(400).send({
                success: false,
                message: 'La dificultad es requerida',
                data: null
            })
        }

        // Crear partida de invitado
        const guestGame = await Game.create({
            difficulty,
            isGuest: true,
            guestId: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            maxQuestions: 5,
            startDate: new Date()
        })

        res.status(201).send({
            success: true,
            message: 'Partida de invitado iniciada (máximo 5 preguntas)',
            data: guestGame,
            upgradeMessage: 'Regístrate para jugar las 510 preguntas completas y guardar tu progreso!'
        })

    } catch (e) {
        res.status(500).send({
            success: false,
            message: 'Error al iniciar partida de invitado',
            error: e.message
        })
    }
}

export const createGame = async (req, res) => {
    const data = req.body
    try {
        if (!data.user || !data.difficulty) return res.status(400).send(
            {
                success: false,
                message: 'Usuario y dificultad son requeridos',
                data: null
            }
        )
        const user = await User.findById(data.user)
        if (!user) return res.status(404).send(
            {
                success: false,
                message: 'Usuario no encontrado',
                data: null
            }
        )
        const game = new Game(data)
        await game.save()
        res.status(201).send(
            {
                success: true,
                message: 'Partida iniciada correctamente',
                data: game
            }
        )
    } catch (e) {
        res.status(500).send(
            {
                success: false,
                message: 'Error al iniciar la partida',
                error: e.message
            }
        )
    }
}

export const getGames = async (req, res) => {
    try {
        const games = await Game.find()
            .populate(
                {
                    path: 'user',
                    select: 'name -_id'
                }
            )
        if (!games?.length) return res.status(404).send({
            success: false,
            message: 'No se encontraron partidas',
            data: "NA"
        })
        return res.status(200).send(
            {
                success: true,
                message: 'Partidas obtenidas correctamente',
                data: games
            }
        )
    } catch (e) {
        res.status(500).send(
            {
                success: false,
                message: 'Error al obtener las partidas',
                error: e.message
            }
        )
    }
}

export const getGameById = async (req, res) => {
    const { id } = req.params
    try {
        const game = await Game.findById(id)
            .populate(
                {
                    path: 'user',
                    select: 'name -_id'
                }
            )
        if (!game) return res.status(404).send({
            success: false,
            message: 'No se encontraron partidas',
            data: "NA"
        })
        return res.status(200).send(
            {
                success: true,
                message: 'Partida obtenida correctamente',
                data: game
            }
        )
    } catch (e) {
        res.status(500).send(
            {
                success: false,
                message: 'Error al obtener la partida',
                error: e.message
            }
        )
    }
}

export const updateGame = async (req, res) => {
    const { id } = req.params
    const { endDate, totalScore, correctAnswers, totalResponseTimeMs } = req.body
    const allowedUpdates = { endDate, totalScore, correctAnswers, totalResponseTimeMs }
    const cleanData = Object.fromEntries(
        Object.entries(allowedUpdates).filter(([_, value]) => value !== undefined)
    )
    try {
        const game = await Game.findByIdAndUpdate(id, cleanData, { new: true })
        if (!game) return res.status(404).send(
            {
                success: false,
                message: 'Partida no encontrada',
                data: null
            }
        )

        // Si la partida se completó (tiene endDate), actualizar la racha del usuario
        if (endDate && game.user && !game.isGuest) {
            try {
                let userStreak = await Streak.findOne({ user: game.user })

                if (!userStreak) {
                    userStreak = new Streak({ user: game.user })
                }

                // Actualizar la racha con la fecha de finalización
                userStreak.updateStreak(new Date(endDate))
                await userStreak.save()

                // Agregar información de racha a la respuesta
                const streakStats = userStreak.getStreakStats()
                return res.status(200).send(
                    {
                        success: true,
                        message: 'Partida actualizada correctamente y racha actualizada',
                        data: game,
                        streak: streakStats
                    }
                )
            } catch (streakError) {
                console.error('Error updating streak:', streakError)
                // Continuar con la respuesta normal si hay error en la racha
            }
        }

        return res.status(200).send(
            {
                success: true,
                message: 'Partida actualizada correctamente',
                data: game
            }
        )
    } catch (e) {
        res.status(500).send(
            {
                success: false,
                message: 'Error al actualizar la partida',
                error: e.message
            }
        )
    }
}

export const getUserGames = async (req, res) => {
    const { userId } = req.params
    try {
        const games = await Game.find({ user: userId })
            .populate(
                {
                    path: 'user',
                    select: 'name -_id'
                }
            )
            .sort({ startDate: -1 })

        if (!games?.length) return res.status(404).send({
            success: false,
            message: 'No se encontraron partidas',
            data: "NA"
        })

        return res.status(200).send({
            success: true,
            message: 'Partidas del usuario obtenidas correctamente',
            data: games
        })
    } catch (e) {
        return res.status(500).send(
            {
                success: false,
                message: 'Error al obtener la partida del usuario',
                error: e.message
            }
        )
    }
}