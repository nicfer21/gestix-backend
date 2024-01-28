import { Types } from "mongoose";
import { getEncabezadoModels } from "../models";

interface Casilla {
    titulo: string;
    permisos:string[];
    
}



export interface EncabezadosPost {
    title?: string;
    author: string;
    administradores?: string[];
    permisos?: string[];
    casillas?: Casilla[];
}

const EncabezadoM = getEncabezadoModels();

export const postEncabezado = async(encabezado: EncabezadosPost) => {
    if(encabezado.title){
        try{
            const existingEncabezado = await EncabezadoM.findOne({ 
                title: { $in: encabezado.title },
                author: encabezado.author
            });
            if (existingEncabezado !== null ) {
                return { error: `Ya existe un contenedor con el nombre ${encabezado.title}` };
            }

            const encabezadoP = new EncabezadoM({
                title: encabezado.title,
                author: new Types.ObjectId(encabezado.author),
                administradores: encabezado.administradores,
                permisos: encabezado.permisos,
                casillas: Array.isArray(encabezado.casillas) ? encabezado.casillas.map(casilla => ({
                    titulo: casilla.titulo,
                    permisos:[]
                })) : []
            });
    
            await encabezadoP.save();
            const encabezados = await EncabezadoM.find({ author: new Types.ObjectId(encabezado.author)});
            return encabezados;
        } catch(error){
            console.error("Ocurrió un error al obtener los datos:", error);
            return { error: "Ha ocurrido un error al enviar los datos" };
        }
    } else {
        try{
            const encabezados = await EncabezadoM.find({ author: new Types.ObjectId(encabezado.author)});
            return encabezados;
        } catch(error){
            console.error("Ocurrió un error al obtener los datos:", error);
            return { error: "Ha ocurrido un error al enviar los datos" };
        }
    }
};

