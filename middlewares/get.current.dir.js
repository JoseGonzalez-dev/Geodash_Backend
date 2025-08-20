import {dirname, join} from 'path'
import { fileURLToPath } from 'url'

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url))

export const getCurrentDir = (req,res,next)=>{
    let fullPath = join(CURRENT_DIR,'../uploads')
    req.filePath = fullPath
    next()
}
