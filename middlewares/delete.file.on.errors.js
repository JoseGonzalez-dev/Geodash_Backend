import { unlink } from 'fs/promises'
import { join } from 'path'

export const deleteFileOnError = async (error, req, res, next) => {
    try {
        if (req.file && req.filePath) {
            const filePath = join(req.filePath, req.file.filename)
            await unlink(filePath)
        }

        if (req.files && Array.isArray(req.files) && req.filePath) {
            for (const file of req.files) {
                const filePath = join(req.filePath, file.filename)
                await unlink(filePath)
            }
        }
    } catch (e) {
        console.error('Error deleting uploaded file(s):', e)
    }

    if (error.status === 400 || error.errors) {
        return res.status(400).send({
            success: false,
            message: 'Error during request validation',
            error
        })
    }

    return res.status(500).send({
        success: false,
        message: error.message
    })
}