import multer from "multer";
import { cloudinary } from "./db_connection.js";

//IMPORT multer
//-config storage
//-filtrar formatos (opcional)
//-config upload
//-set into server operation (post,put, delete, etc)


//CLOUDINARY UPLOAD HELPER
//MULTER FILE UPLOAD CONFIG 
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  allowed.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

const storage = multer.memoryStorage();

const upload = multer({ 
    storage, 
    fileFilter, 
    limits: {fileSize: 5 * 1024 * 1024}
});


const upload_cdy = (buffer,foldername) => {
    return new Promise((resolve,reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {folder:foldername},
            (error,result) => {
                if(result)
                    resolve(result);
                else
                    reject(error);
            }
        );
        stream.end(buffer);
    });
}


const delete_cdy = async(publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        throw new Error(`Error al eliminar la imagen de Cloudinary: ${error.message}`);
    }
}

const extractPublicId = (url) => {
    const segments = url.split('/');

    const folderIndex = segments.findIndex(seg => seg === 'appUserData' || seg === 'appUploads');
    if(folderIndex === -1) return null;

    //Quitarle la extension de la imagen
    const publicIdExt = segments.slice(folderIndex).join('/');
    const publicId = publicIdExt.substring(0, publicIdExt.lastIndexOf('.'));
    return publicId;
}

const extractRegistry = (url) => {
    const segments = url.split('/');
    const folderIndex = segments.findIndex(seg => seg === 'upload');
    if(folderIndex === -1) return null;

    //Quitarle la extension de la imagen
    const publicIdExt = segments.slice(folderIndex + 1).join('/');
    return publicIdExt;
}

export { upload, upload_cdy, delete_cdy, extractPublicId, extractRegistry };

