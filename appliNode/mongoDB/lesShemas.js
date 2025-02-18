//les divers schémas utilisés pour CRUD les données dans la BDD

import mongoose from "mongoose";

const { Schema } = mongoose;

// pour connexion
const loginSchema = new Schema( {
    pseudo: String,
    mot_de_passe: String
}, {collection: "profils"});
export const Login = mongoose.model("Login", loginSchema);

// pour formulaire d'inscription
const newMemberSchema = new Schema( {
    pseudo: String,
    adresse_mail: String,
    mot_de_passe: String,
    nom: String,
    pantheon: String,
    type_deite: String,
    presentation: String,
    amis: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profil"
      }
    ],
    mur:  [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
      }
    ],
    admin: Boolean,
    messages:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
      }
    ],
    //avatar: {
       // type: mongoose.Schema.Types.ObjectId,
       // ref: "Album"
    //},
    //album:[fichiers photos]
}, {collection: "profils"});
export const NewMember = mongoose.model("NewMember", newMemberSchema);

//pour la liste d'amis
const friendSchema = new Schema( {
    pseudo: String,
    //statut: Boolean,
    type_deite: String,
    pantheon: String,
    presentation: String,
    amis: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Profil"
        }
      ],
    //avatar: String,
    mur:  [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Post"
        }
      ]
}, {collection: "profils"});
export const Friend = mongoose.model("Friend", friendSchema);

//pour les posts sur le mur
const postSchema = new Schema( {
    auteur: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Profil"
        }
    ,
    //photo: {
       // type: mongoose.Schema.Types.ObjectId,
       // ref: "Album"
    //},
    titre: String,
    contenu: String,
    date: Date
});
export const Post = mongoose.model("Post", postSchema);

// pour affichage du profil
const profilSchema = new Schema ( {
    pseudo: String,
    pantheon: String,
    type_deite: String,
    presentation: String,
    amis: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Profil"
        }
      ],
    //avatar: String,
    mur:  [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Post"
        }
      ],
    date_derniere_connexion : Date,
    req_ami:  [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profil"
      }
    ]
});
export const Profil = mongoose.model("Profil", profilSchema);

//pour le check admin
const adminSchema = new Schema( {
  admin: Boolean 
}, {collection: "profils"});
export const Admin = mongoose.model("Admin", loginSchema);

//pour le destinataire d'un message OU récupérer liste messages et amis
const messagerieSchema = new Schema( {
  pseudo: String,
  adresse_mail: String,
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message"
    }
  ],
  amis: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profil"
    }
  ]
}, {collection: "profils"});
export const Messagerie = mongoose.model("Messagerie", messagerieSchema);

const messageSchema = new Schema( {
  expediteur:  
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profil"
    },
  destinataire: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profil"
    },
  sujet: String,
  contenu: String,
  date: Date,
  lu: Boolean
}, {collection: "messages"});
export const Message = mongoose.model("Message", messageSchema);

