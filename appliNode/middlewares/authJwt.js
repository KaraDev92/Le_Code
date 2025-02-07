//import { verify } from "jsonwebtoken";  //MODULE EN COMONjs
import pkg from 'jsonwebtoken';
const { verify } = pkg;
import { Profil } from "../mongoDB/lesShemas.js";
import 'dotenv/config';

//vérifie si la requête a un token
export const verifyToken = (req, res, next) => {
    let token = req.headers["Authorization"];

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!",
            });
        }
        req.userId = decoded.id;
        next();
    });
};

//vérifie si le profil est admin
export const isAdmin = (req, res, next) => {
    Profil.findById(req.userId)
    .then((user) => {
        if (user.admin) {  
            next();
            return;
        } else {
            res.status(403).send({ message: "Require Admin Role!" });
            return;
        }
    })
    .catch((err)=> {
        console.log(err);
        //res.status(500).send({ message: err });
        return;
    });
    // .exec((err, user) => {
    //     if (err) {
    //     res.status(500).send({ message: err });
    //     return;
    //     }
    //     if (user.admin) { 
    //         next();
    //         return;
    //     } else {
    //         res.status(403).send({ message: "Require Admin Role!" });
    //         return;
    //     }
    // });
};

