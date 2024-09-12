import ResponseDto from "../response.dto";
import {Board, Comment, Favorite, Tag, User} from "../../../types/interface";
import Pageable from "../../../types/interface/pageable.interface";

export default interface GetBoardDetailResponseDto extends ResponseDto{
    user: User;
    boardDetail: Board;
    comments: Pageable<Comment>;
    favorites: Favorite[];
    tags: Tag[];
    favoriteCheck: boolean,
    favoriteCount: number,
}