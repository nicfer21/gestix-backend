// import { getEncabezadoModels } from "../models";


// const EncabezadoM = getEncabezadoModels();
// export const updateEncabezadoTitle = async(encabezadoId: string, newTitle: string) => {
//     try {
//         const existingEncabezado = await EncabezadoM.findById(encabezadoId);
//         if (existingEncabezado === null ) {
//             return { error: `No existe un encabezado con el ID ${encabezadoId}` };
//         }

//         existingEncabezado.title = newTitle;
//         await existingEncabezado.save();

//         return existingEncabezado;
//     } catch(error) {
//         console.error("Ocurrió un error al actualizar los datos:", error);
//         return { error: "Ha ocurrido un error al actualizar los datos" };
//     }
// };