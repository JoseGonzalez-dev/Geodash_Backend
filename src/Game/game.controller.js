import Game from './game.model.js'
import User from '../User/user.model.js'
import Category from '../Category/category.model.js'

export const createGame = async (req, res) => {
    const data = req.body
    try {
        if (!data.user || !data.category) return res.status(400).send(
            {
                success: false,
                message: 'Usuario y categoría son requeridos',
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
        const category = await Category.findById(data.category)
        if (!category) return res.status(404).send(
            {
                success: false,
                message: 'Categoría no encontrada',
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
                [
                    {
                        path: 'user',
                        select: 'name -_id'
                    },
                    {
                        path: 'category',
                        select: 'name -_id'
                    }
                ]
            )
            if(!games?.length) return res.status(404).send({
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
                [
                    {
                        path: 'user',
                        select: 'name -_id'
                    },
                    {
                        path: 'category',
                        select: 'name -_id'
                    }
                ]
            )
            if(!game) return res.status(404).send({
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
        if(!game) return res.status(404).send(
            {
                success: false,
                message: 'Partida no encontrada',
                data: null
            }
        )
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
                [
                    {
                        path: 'user',
                        select: 'name -_id'
                    },
                    {
                        path: 'category',
                        select: 'name -_id'
                    }
                ]
            )
            .sort({ startDate: -1 })

            if(!games?.length) return res.status(404).send({
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