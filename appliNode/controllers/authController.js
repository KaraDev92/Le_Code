
import 'dotenv/config'
import { NewMember, Login } from '../mongoDB/lesShemas.js';
//import { sign } from 'jsonwebtoken'; //module en CommonJS !
import bcrypt from 'bcryptjs';   //module en CommonJS !
import pkg2 from 'jsonwebtoken';
const { sign } = pkg2;

//pour créer un nouveau membre (sans fournir de token)
export const signup = async (req, res) => {
    const newUser = new NewMember({
        pseudo: req.body.pseudo,
        mot_de_passe: bcrypt.hashSync(req.body.password, 8),
        adresse_mail: req.body.email,
        nom: req.body.name,
        pantheon: req.body.pantheon,
        type_deite: req.body.divinity,
        admin: false //,
        //avatar: req.body.avatar
    });

    try {
        const user = await newUser.save();
        res.status(201).send();
        console.log('User was registered successfully!');
    } catch (err) {
        res.status(500).send();
        console.log('erreur sauvegarde nouvel utilisateur : ', err);
    }
};

//pour loguer un membre et lui fournir un token
export const signin = async (req, res) => {
    try {
        const user = await Login.findOne({ pseudo: req.body.pseudo }).exec();

        if (!user) {
            //return res.status(404).send({ message: "User Not found." });
            return res.status(401).send();
        }

        const passwordIsValid = bcrypt.compareSync(req.body.password, user.mot_de_passe);

        if (!passwordIsValid) {
            // return res.status(401).send({
            //     accessToken: null,
            //     message: "Invalid Password!"
            // });
            return res.status(401).send();
        }

        const token = sign({ id: user.id }, process.env.SECRET, {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
            expiresIn: 3600, // 1 heure en secondes            
        });

        res.status(200).send({
            id: user._id,
            //pseudo: user.pseudo, //une data si besoin
            accessToken: token
        });
    } catch (err) {
        res.status(500).send();
        console.log('erreur de login : ', err);
    }
};
