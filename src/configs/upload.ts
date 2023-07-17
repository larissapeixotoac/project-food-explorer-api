const path = require('path')
import multer from 'multer'
import crypto from 'crypto'

const TMP_FOLDER = path.resolve(__dirname, "..", "tmp") //on render, using build the tmp go to the root
//const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp") //using npm rum dev works as should be
const UPLOADS_FOLDER = path.resolve(TMP_FOLDER, "uploads")

const MULTER = {
    storage: multer.diskStorage({
        destination: TMP_FOLDER,
        filename(request, file, callback) {
            const fileHash = crypto.randomBytes(10).toString("hex")
            const fileName = `${fileHash}-${file.originalname}`
            
            return callback(null, fileName)
        }
    })
}

module.exports = {
    TMP_FOLDER,
    UPLOADS_FOLDER,
    MULTER
}
