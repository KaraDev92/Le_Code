import { Friend } from "./friend";
import { Post } from "./post";

export interface Member {
    pseudo: string;
    //avatar: string;
    type_deite: string;
    pantheon: string;
    amis: Array<Friend>;
    mur: Array<Post>;
    date_derniere_connexion: Date;
}
