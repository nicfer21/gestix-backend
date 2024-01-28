import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { cn } from "../conexion/conexion";
import { getUserModel } from "../models";
cn

const UserM = getUserModel();

// aqui creo el tipo user

export type User={
    nombre:string,
    email:string,
    password:string,
    perfil:string
};

export const sendUser = async(user: User) => {
    // Encripta la contraseña
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    try {
        // aqui estoy verificando si el email ya existe
        const existingUser = await UserM.findOne({ email: user.email });
        if (existingUser) {
           
            return { error: "El usuario ya existe" };
        } else {
            const userNew = new UserM({
                nombre: user.nombre,
                email: user.email,
                password: user.password,
                perfil:user.perfil
            });
            await userNew.save();
              // Genera un token
            const token:string = jwt.sign({ _id: userNew._id }, 'your-secret-key');
             // Devuelve el token y los datos del usuario
             return {
                token: token,
                user: {
                    name: userNew.nombre,
                    email: userNew.email,
                    perfil: userNew.perfil
                }
            };
        }
    } catch(err) {
        console.error("Ocurrió un error al obtener los datos:", err);
        return { error: "Ha ocurrido un error al enviar los datos" };
    }
};
