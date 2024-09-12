import User from "./user.interface";

export default interface Comment{
    commentId: bigint;
    content: string;
    user: User;
    createDateTime: string;
}