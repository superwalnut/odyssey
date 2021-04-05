import { User } from "../models/user";

export class UserFamily {
    docId: string;
    name: string;
    user: User;
    families: string[];
}