import { Post } from './post';

export interface Friend {
    pseudo: string;
    presentation: string;
    pantheon: string;
    type_deite: string;
    amis: Array<Friend>;
    mur: Array<Post>;
    //statut: boolean;
    //avatar: string;

}
