import multer from "multer";


const storage = multer.memoryStorage();


const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];


export const upload = multer({

  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },


  fileFilter: (
    _req,
    file,
    cb
  ) => {


    if (
      allowedTypes.includes(
        file.mimetype
      )
    ) {

      cb(null, true);

    } else {

      cb(
        new Error(
          "Formato de imagem não permitido. Use JPG, PNG ou WEBP."
        )
      );

    }

  },

});