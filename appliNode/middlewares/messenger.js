import nodemailer from 'nodemailer';
import 'dotenv/config';
import { Message, Messagerie } from '../mongoDB/lesShemas.js';

const mailpassword = process.env.MAILPASSWORD;

// Création d'un objet transporteur
const transporter = nodemailer.createTransport({
  host: 'smtp.mail.infomaniak.com',
  port: 465,
  secure: true, // utilise TLS
  auth: {
    user: 'karadev92@ikmail.com',
    pass: mailpassword,
  }
});
//fonction pour envoyer un mail
const main = async (destinaire, sujet, contenu) => {
        // send mail with defined transport object
        const info = await transporter.sendMail({
        from: '"Divine Club" <karadev92@ikmail.com>', // sender address
        to: destinaire,   //"bar@example.com, baz@example.com", // list of receivers
        subject: sujet,   //"Hello ✔", // Subject line
        text: contenu     //"Hello world?", // plain text body
        //html: "<b>Hello world?</b>", // html body
        });
    
        console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
};

// Fonction pour trouver l'adresse mail et l'id d'un membre par son pseudo
const findEmailAndIdByPseudo = async (pseudo) => {
    return await Messagerie.findOne({ pseudo })
        .select("adresse_mail _id")
        .exec();
};

//enregistrement du message dans la BDD
const recordMessage = async (expediteur, destinataire, sujet, contenu) => {
    const message = new Message({
        expediteur: expediteur,
        destinataire: destinataire,
        sujet: sujet,
        contenu: contenu,
        date: new Date(),
        lu: false
    });
    await message.save();

    const user = await Messagerie.findById(destinataire);
    user.messages.push(message);
    await user.save();
};

//envoi de message et sauvegarde dans lz BDD
export const sendMessage = async (req, res) => {
    const { expediteur, destinaire, sujet, contenu } = req.body.message;
    const userId = req.userId;
    try {
        const subject = "Nouveau message de " + expediteur + " sur Divine Club";
        const content = "Bonjour " + destinaire + ",\n\n" + expediteur + " vous a envoyé un message sur Divine Club.\n\n\nCordialement,\n\nL'équipe Divine Club";

        //récupération adresse mail du destinataire
        const target =  findEmailAndIdByPseudo(destinaire);

        //envoi du mail
        await main(target.adresse_mail, subject, content);

        //enregistrement du message chez le destinataire et dans la collection messages
        await recordMessage(userId, target._id, sujet, contenu);

        res.status(201).send('Message envoyé');

    } catch (error) {
        console.log('Erreur lors de l\'envoi du mail : ', error);
        res.status(500).send();
    }
};
  
