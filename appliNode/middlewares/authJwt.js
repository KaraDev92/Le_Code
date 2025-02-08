//import { verify } from "jsonwebtoken";  //MODULE EN COMONjs
import pkg from 'jsonwebtoken';
const { verify, TokenExpiredError } = pkg;
import { Profil } from "../mongoDB/lesShemas.js";
import 'dotenv/config';

const catchError = (err, res) => {
    if (err instanceof TokenExpiredError) {
        return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
    }
    return res.sendStatus(401).send({ message: "Unauthorized!" });
}

//vérifie si la requête a un token
export const verifyToken = (req, res, next) => {
    let token = req.headers["authorization"];

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            return catchError(err, res);
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
};

