import mongoose, { Document, Model, Schema } from 'mongoose';

interface IUser extends Document {
    nombre: string;
    email: string;
    password: string;
    perfil: string;
}

export const getUserModel = (): Model<IUser> => {
    if (mongoose.models.users) {
        return mongoose.model<IUser>('users');
    } else {
        const UserSchema = new mongoose.Schema({
            nombre: {
                type: String,
                require: true
            },
            email: {
                type: String,
                require: true,
                unique: true
            },
            password: {
                type: String,
                required: true,
            },
            perfil: {
                type: String,
                require: true
            }
        });
        return mongoose.model<IUser>('users', UserSchema);
    }
};

// este es el modelo de los encabezados
interface Casilla {
    titulo: string;
    
}
 interface Encabezados extends Document {
    title: string;
    author: string;
    administradores:string[],
    permisos: string[];
    casillas:Casilla[];
    
}

export const getEncabezadoModels = (): Model<Encabezados> => {
    if (mongoose.models.encabezado) {
        return mongoose.model<Encabezados>('encabezado');
    }

    const CasillaSchema = new mongoose.Schema({
        titulo: {
            type: String,
        },
        permisos:{
            type: [Schema.Types.ObjectId],
            required: true,
            ref: "users"
        }
    });

    const EncabezadoS = new mongoose.Schema({
        title: {
            type: String,
            required: true
        },
        author: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "users"
        },
        administradores: {
            type: [Schema.Types.ObjectId],
            required: true
        },
        permisos: {
            type: [Schema.Types.ObjectId],
            required: true,
            ref: "users"
        },
        casillas: {
            type: [CasillaSchema]
        }
    });

    EncabezadoS.index({ 'casillas._id': 1, author: 1 }, { unique: true });

    return mongoose.model<Encabezados>("encabezado", EncabezadoS);
};

