import express from "express";
import cors from "cors";
import { User, sendUser } from "./registro/registro";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserLogin, getUser } from "./login/login";
import {  EncabezadosPost, postEncabezado } from "./encabezados/encabezados";
import { getUserPermiso } from "./busquedadUsuario/usuario";
import path from "path";
import fs from "fs";
import { NewCasilla, addCasilla } from "./encabezados/casillas/casillas";


const app = express();
app.use(express.json());
app.use(cors());
app.use('/perfil', express.static(path.join(__dirname, '../perfil')));
// Comprueba si el directorio 'posts' existe
if (!fs.existsSync('./perfil')) {
    // Si no existe, lo crea
    fs.mkdirSync('./perfil');
}

app.post("/registro", async(req: express.Request,res:express.Response) => {
    const { nombre, email,password,perfil } = req.body;
    // Aquí debes validar las credenciales y registrar al usuario
    // Si el registro es exitoso:

    // primero verifico si los datos no me llegaron vacio
    if(nombre.trim() !== "" && email.trim() !== "" && password.trim() !== ""){

        const userLogin:User = {
            nombre:nombre,
            email:email,
            password:password,
            perfil:perfil
        };
        const  result = await sendUser(userLogin);
        res.json(result);

    }else{
        res.status(400).json({error:"datos vacios"});
    }
    
});



// aqui va el del login

app.post("/login",async(req: express.Request,res:express.Response) => {
    const {email,password} = req.body;
    const user:UserLogin={
        email:email,
        password:password
    };
    const result = await getUser(user);
    // aqui le envio los resultados al cliente
    res.json(result);
   

});

app.post("/encabezado",async(req: express.Request,res:express.Response)=>{
    interface MyTokenPayload extends JwtPayload {
        _id: string;
    }
    const {titulo, miembroSelecionado , casilla}=req.body;
    const authHeader = req.headers.authorization;
   

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Aquí se obtiene el token del encabezado de autorización

        try {
            const decoded = jwt.verify(token, 'your-secret-key') as MyTokenPayload; // Aquí se decodifica el token
            const userId = decoded._id; // Aquí se obtiene el ID del usuario del token decodificado
            const enc:EncabezadosPost ={
                    title:titulo,
                    author:userId,
                    administradores:[userId],
                    permisos:miembroSelecionado,
                    casillas:[{
                        titulo:casilla,
                        permisos:[]
                    }]
                };
               const result = await postEncabezado(enc);
               res.json(result);
            

            // Ahora puedes usar el ID del usuario...
        } catch (err) {
            return res.status(401).send('Token inválido');
        }
    } else {
        return res.status(401).send('No se proporcionó ningún token');
    }
   
});

// este es solo para obtenerlo los encabezados del ususario

app.get("/getencabezado",async(req: express.Request,res:express.Response)=>{
    interface MyTokenPayload extends JwtPayload {
        _id: string;
    }
   
    const authHeader = req.headers.authorization;
   

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Aquí se obtiene el token del encabezado de autorización

        try {
            const decoded = jwt.verify(token, 'your-secret-key') as MyTokenPayload; // Aquí se decodifica el token
            const userId = decoded._id; // Aquí se obtiene el ID del usuario del token decodificado
            const enc:EncabezadosPost ={
                
                    author:userId,
                    
                    
                };
               const result = await postEncabezado(enc);
               res.json(result);
            

            // Ahora puedes usar el ID del usuario...
        } catch (err) {
            return res.status(401).send('Token inválido');
        }
    } else {
        return res.status(401).send('No se proporcionó ningún token');
    }
   
});


// aqui se agrega casillas nuevas

app.post("/addcasilla",async(req: express.Request,res:express.Response)=>{

    interface MyTokenPayload extends JwtPayload {
        _id: string;
    }
    const authHeader = req.headers.authorization;
   
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Aquí se obtiene el token del encabezado de autorización

        try {
            const decoded = jwt.verify(token, 'your-secret-key') as MyTokenPayload; // Aquí se decodifica el token
            const userId = decoded._id; // Aquí se obtiene el ID del usuario del token decodificado
            const {idContenedor, casilla}= req.body;
            const casillas:NewCasilla={
                titulo:casilla,
                permisos:[]
            };
            console.log(idContenedor);
            console.log(casilla);
            const respuesta = await addCasilla(idContenedor ,casillas, userId);
            res.json(respuesta);


         } catch (err) {
                return res.status(401).send('Token inválido');
            }
        } else {
            return res.status(401).send('No se proporcionó ningún token');
        }       

   

});



// aqui es para buscar a los usuarios

app.get("/getuser",async(req: express.Request,res:express.Response)=>{
    interface MyTokenPayload extends JwtPayload {
        _id: string;
    }
    const user = req.query.user;
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Aquí se obtiene el token del encabezado de autorización
        try{
            const decoded = jwt.verify(token, 'your-secret-key') as MyTokenPayload; // Aquí se decodifica el token
            const userId = decoded._id; // Aquí se obtiene el ID del usuario del token decodificado
            if (typeof user === 'string') {
                const result = await getUserPermiso(user,userId);
                res.json(result);
            } else {
                // Maneja el caso en que user es undefined, o no es una cadena
                res.json({ error: "Se requiere un nombre de usuario" });
            }


        }catch(err){
            return res.status(401).send('Token inválido');

        }

    }

   
});






// aqui pongo a correr el servidor
app.listen(8080, () => {
    console.log("its running");
});
