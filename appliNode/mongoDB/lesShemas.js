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
    admin: Boolean //,
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
    statut: Boolean
}, {collection: "profils"});
export const Friend = mongoose.model("Friend", friendSchema);

//pour les posts sur le mur
const postSchema = new Schema( {
    auteur: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Profil"
        }
    ],
    //photo: {
       // type: mongoose.Schema.Types.ObjectId,
       // ref: "Album"
    //},
    titre: String,
    contenu: String
});
export const Post = mongoose.model("Post", postSchema);

// pour affichage du profil
const profilSchema = new Schema ( {
    pseudo: String,
    pantheon: String,
    type_deite: String,
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
});
export const Profil = mongoose.model("Profil", profilSchema);