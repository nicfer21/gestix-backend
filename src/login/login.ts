import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { cn } from "../conexion/conexion";
import { getUserModel } from "../models";

cn

const UserModel = getUserModel();

export type UserLogin={
    email:string,
    password:string,
    
};

export const getUser = async(user: UserLogin) => {

    try{
        // Busca al usuario por correo electrónico
        const userFound = await UserModel.findOne({ email: user.email });

        if (!userFound) {
            
            return { error: "El usuario no existe" };
        }

        // Compara la contraseña proporcionada con la contraseña encriptada almacenada
        const isMatch = await bcrypt.compare(user.password, userFound.password);

        if (!isMatch) {
            
            return { error: "Contraseña incorrecta" };
        }

        // Si todo está bien, devuelve un true
          // Genera un token
          const token:string = jwt.sign({ _id: userFound._id }, 'your-secret-key');
          
        
        return {data:true,token:token,perfil:userFound.perfil,name:userFound.nombre};

    }catch(err){
        
        return {error:"Ha ocurrido un error al enviar los datos"};

    }

};