

export interface Message {
    expediteur: string;
    destinataire: string;
    sujet: string;
    contenu: string;
    date: Date;
    lu: boolean;
}