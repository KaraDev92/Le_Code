//pour un signup : enregistrement d'un nouveau membre avec vérifications
//pour un signin : vérification des identifiants et création + envoi d'un token d'authentification
import 'dotenv/config'
import { NewMember, Login, Profil } from '../mongoDB/lesShemas.js';
//import { sign } from 'jsonwebtoken'; //module en CommonJS !
import bcrypt from 'bcryptjs';   //module en CommonJS !
import pkg2 from 'jsonwebtoken';
import { welcomeMail } from '../middlewares/messenger.js';
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
        presentation: '',
        admin: false,
        date_derniere_connexion: new Date() //,
        //avatar: req.body.avatar
    });

    try {
        const user = await newUser.save();
        //envoi mail de bienvenu
        welcomeMail(req.body.email, req.body.pseudo);

        res.status(201).send();
        console.log(`${req.body.peudo} was registered successfully!`);
    } catch (err) {
        res.status(502).send();
        console.log('erreur sauvegarde nouvel utilisateur : ', err);
    }
};

//pour loguer un membre et lui fournir un token
export const signin = async (req, res) => {
    try {
        const user = await Login.findOne({ pseudo: req.body.pseudo }).exec();

        if (!user) {
            return res.status(401).send();
        }

        const passwordIsValid = bcrypt.compareSync(req.body.password, user.mot_de_passe);

        if (!passwordIsValid) {
            return res.status(401).send();
        }

        const token = sign({ id: user.id }, process.env.SECRET, {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
            expiresIn: 3600, // 600 = 20 min,  3600 = 1 heure en secondes            
        });

        res.status(200).send({
            id: user._id,
            //pseudo: user.pseudo, //une data si besoin
            accessToken: token
        });

        //modifie la date de dernière connexion sur le profil
        const date = new Date();
        const doc = await Profil.findOne({pseudo: user.pseudo});
        doc.date_derniere_connexion = date;
        //doc.presence = true;
        await doc.save();

    } catch (err) {
        res.status(500).send();
        console.log('erreur de login : ', err);
    }
};
