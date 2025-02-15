import { Friend } from "./friend";
import { Message } from "./message";

export interface ListMessages {
    amis: Array<Friend>;
    pseudo : string,
    messages : Array<Message>,
}