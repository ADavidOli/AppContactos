import dotenv from "dotenv";
dotenv.config();

export const env = {
      PORT: process.env.APP_PORT ?? '3000',
      MONGODB_URI: process.env.MONGODB_URI ?? '',
}


if (!env.MONGODB_URI) {
    throw new Error('La variable MONGODB_URI no está definida');
}