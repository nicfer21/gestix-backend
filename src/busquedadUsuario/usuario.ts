import { cn } from "../conexion/conexion";
import { getUserModel } from "../models";


cn

const UserModel = getUserModel();

export const getUserPermiso = async(user: string, userId:string) => {
    if(user !== ""){

        try{
            // Busca al usuario por nombre similar
            const userFound = await UserModel.find({ nombre: { $regex: new RegExp(user), $options: 'i' },_id: { $ne: userId }}).select('-password');;
        
            if (!userFound) {
                return { error: "El usuario no existe" };
            }
         
            return userFound;
        
        }catch(err){
            return {error:"Ha ocurrido un error al enviar los datos"};
        }
    }
};