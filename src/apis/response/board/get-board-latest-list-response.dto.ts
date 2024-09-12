import {Board} from "../../../types/interface";
import Pageable from "../../../types/interface/pageable.interface";

export default interface BoardListResponse {
    boards: Board[];
    condition: string | null;
    boardPage: Pageable<Board>;
}