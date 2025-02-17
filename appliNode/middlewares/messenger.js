import nodemailer from 'nodemailer';
import 'dotenv/config';
import { Message, Messagerie, Profil } from '../mongoDB/lesShemas.js';

const mailpassword = process.env.MAILPASSWORD;

// Création d'un objet transporteur
const transporter = nodemailer.createTransport({
  host: 'mail.infomaniak.com',
  port: 465,
  secure: true, // utilise TLS
  auth: {
    user: 'karadev92@ikmail.com',
    pass: mailpassword,
  }
});

//fonction pour envoyer un mail
const main = async (destinataire, sujet, contenu) => {
        // send mail with defined transport object
        try {
            const info = await transporter.sendMail({
                from: '"Divine Club" <karadev92@ikmail.com>', // sender address
                to: destinataire,   //"bar@example.com, baz@example.com", // list of receivers
                subject: sujet,   //"Hello ✔", // Subject line
                text: contenu     //"Hello world?", // plain text body
                //html: "<b>Hello world?</b>", // html body
            });
            
            console.log("Message sent: %s", info.messageId);
            // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
        } catch (error) {
            console.log("Erreur d'envoi du mail : ", error);
            throw new Error;
        }

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

//envoi de message et sauvegarde dans la BDD
export const sendMessage = async (req, res) => {
    const expediteur = req.body.expediteur;
    const destinataire = req.body.destinataire;
    const sujet = req.body.sujet;
    const contenu = req.body.contenu;

    const userId = req.userId;
    
    try {
        const subject = "Nouveau message de " + expediteur + " sur Divine Club";
        const content = "Bonjour " + destinataire + ",\n\n" + expediteur + " vous a envoyé un message sur Divine Club.\n\n\nCordialement,\n\nL'équipe Divine Club";

        //récupération adresse mail du destinataire
        const target =  await findEmailAndIdByPseudo(destinataire);

        //envoi du mail
        await main(target.adresse_mail, subject, content);

        //enregistrement du message chez le destinataire et dans la collection messages
        await recordMessage(userId, target._id, sujet, contenu);

        res.status(201).send();

    } catch (error) {
        console.log('Erreur lors de l\'envoi du mail : ', error);
        res.status(500).send();
    }
};
 
//pour récupérer la liste des messages et des amis
export const getMessagesFriends = async (req, res) => {
    const userId = req.userId;
    try {
        const listMessages = await Messagerie.findById(userId)
        .select("amis messages -_id")
        .populate([
            {path: "amis", select: "pseudo -_id", options: { sort: { pseudo: 1 }}},
            {path: "messages", select: "expediteur sujet contenu date lu -_id", options: { sort: { date: -1 }}}
        ])
        .lean()
        .exec();

        //for...of pour l'asynchrone
        for (let element of listMessages.messages) {
            const pseudoExp = await Profil.findById(element.expediteur)
                .select("pseudo -_id")
                .lean()
                .exec();
            element.expediteur = pseudoExp.pseudo;
        }

        res.status(200).send(listMessages);

    } catch (error) {
        console.log('problème BDD : ', error);
        res.status(502).send();
    }
};

//pour marquer un message comme lu
export const markread = async (req, res) => {
    const userId = req.userId;
    try {
        const message = await Message.findOne({destinataire: userId, date: req.body.date});
        message.lu = true;
        await message.save();
        res.status(201).send(); 
    } catch (error) {
        console.log('problème BDD : ', error);
        res.status(502).send();
    }
};

//pour envoyer un message de suppression d'amitié
export const warnExFriend = async (expediteur, destinataire, destinataireEMail) => {
    try {
        const sujet = "Action de " + expediteur + " sur Divine Club";
        const contenu = "Bonjour " + destinataire + ",\n\n" + expediteur + " vous a supprimé de ses amis sur Divine Club.\n\n\nCordialement,\n\nL'équipe Divine Club";

        //envoi du mail
        await main(destinataireEMail, sujet, contenu);

    } catch (error) {
        console.log('Erreur lors de l\'envoi du mail (fin amitié) à l\'ex-ami : ', error);
    }
};

//pour effacer un message
export const deleteMessage = async (req, res) => {
    const ladate = req.body.date;
    const userId = req.userId;

    try {
        const user = await Messagerie.findById(userId)
            .select("messages")
            .lean()
            .exec();

        const lemessage = await Message.findOne({date : ladate});
            
        const newListMessages = user.messages.filter((mess) => String(mess._id) !== String(lemessage._id));
            
        const cursorUser = await Messagerie.findById(userId);
        
        cursorUser.messages = newListMessages;
        await cursorUser.save();

        await lemessage.deleteOne();

        res.status(200).send();

    } catch (error) {
        console.log("Erreur dans la suppression du message : ", error);
        res.status(502).send();
    }
};

//pour envoyer un message de bienvenu (pour un nouvel inscrit)
export const welcomeMail = async (email, pseudo) => {
    const sujet = "Bienvenu au Divine Club";
    const contenu = `Bonjour ${pseudo}, \n\nNous sommes heureux de vous accueillir au sein de notre communauté d'êtres exceptionnels. \nVous aurez la possibilité de communiquer avec vos amis et aussi de faire de nouvelles rencontres.\n\n\nCordialement,\n\nL'équipe Divine Club`;

    try {
        await main(email, sujet, contenu);
    } catch (error) {
        console.log('Erreur lors de l\'envoi du mail de bienvenu : ', error);
    }  
};

//envoi mail requête amitié en enregistrement requête dans BDD
export const askForFriend = async (req,res) => {
    const userId = req.userId;
    const pseudoAmi = req.body.pseudo;
    const sujet = "Demande d'amitié";

    try {
        const amiDemande = await findEmailAndIdByPseudo(pseudoAmi); //adresse_mail et _id schema Messagerie
        const user = await Messagerie.findById(userId)
            .select("pseudo")
            .exec();
        
        const contenu = `Bonjour ${pseudoAmi}, \n\nVous avez reçu une demande d'amitié de la part de ${user.pseudo}.\n\n\nCordialement,\n\nL'équipe Divine Club`;

        await main(amiDemande.adresse_mail, sujet, contenu);
        
        const receveur = await Profil.findById(amiDemande._id);
        receveur.req_ami.push(userId);
        await receveur.save();

        
    } catch (error) {
        console.log('Erreur lors de la demande d\'amitié : ', error);
    }  


}