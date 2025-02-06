
import 'dotenv/config'
import { NewMember, Login } from '../mongoDB/lesShemas';
//import { sign } from 'jsonwebtoken';
//import { bcrypt } from 'bcryptjs';
import pkg from 'bcryptjs';
const { bcrypt } = pkg;
import pkg2 from 'jsonwebtoken';
const { sign } = pkg2;

//pour créer un nouveau membre (sans fournir de token)
export const signup = (req, res) => {
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

    newUser.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
    });
};

//pour loguer un membre et lui fournir un token
export const signin = (req, res) => {
    Login.findOne({
        pseudo: req.body.username
    })
        .exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (!user) {
            res.status(404).send({ message: "User Not found." });
            return;
        }

        let passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }

        const token = sign({ id: user.id }, process.env.SECRET,
                {
                    algorithm: 'HS256',
                    allowInsecureKeySizes: true,
                    expiresIn: 3600, // 1 heure (en secondes !)
                }
        );

        res.status(200).send({
            id: user._id,
            pseudo: user.pseudo,
            accessToken: token
        });
    });
};