//import { verify } from "jsonwebtoken";
import pkg from 'jsonwebtoken';
const { verify } = pkg;
import { Profil } from "../mongoDB/lesShemas";
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
    Profil.findById(req.userId).exec((err, user) => {
        if (err) {
        res.status(500).send({ message: err });
        return;
        }
        // if (user.admin) {  //A compléter pour l'admin
        //     next();
        //     return;
        // } else {
        //     res.status(403).send({ message: "Require Admin Role!" });
        //     return;
        // }
    });
};

