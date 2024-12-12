import { Types } from "mongoose";

export class UserDTO {
    fullname: string;
    email: string;
    subscription: Types.ObjectId;
    active: boolean;
}