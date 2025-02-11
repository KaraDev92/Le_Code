import { Friend } from "./friend";
import { Post } from "./post";

export interface Member {
    pseudo: string;
   //avatar: _File;
    type_deite: string;
    pantheon: string;
    presentation: string;
    amis: Array<Friend>;
    mur: Array<Post>;
    date_derniere_connexion: Date;
}
