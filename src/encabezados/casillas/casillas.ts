import { getEncabezadoModels } from "../../models";



const CasillaM = getEncabezadoModels();



export interface NewCasilla {
    
    
        titulo:string,
        permisos?: string[];
    
}

export const addCasilla = async(idContenedor: string, casilla: NewCasilla, author:string) => {
    try {
        const existingEncabezado = await CasillaM.findById(idContenedor);
        if (existingEncabezado === null ) {
            return { error: `No existe un encabezado con el ID ${idContenedor}` };
        }

        const newCasilla = {
            titulo: casilla.titulo,
            permisos: casilla.permisos,
        };

        existingEncabezado.casillas.push(newCasilla);
        await existingEncabezado.save();
        // Buscar todos los encabezados con el mismo author
        const encabezados = await CasillaM.find({ author: author });
        return encabezados;


    } catch(error) {
        console.error("Ocurrió un error al agregar la casilla:", error);
        return { error: "Ha ocurrido un error al agregar la casilla" };
    }
};
