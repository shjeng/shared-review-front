import ResponseDto from "../response.dto";
import {Board} from "../../../types/interface";

export default interface GetBoardListResponseDto extends ResponseDto {
  boardPage: {
    content: Board[];
    pageable: any;
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: any;
    first: boolean;
    numberOfElements: number;
    empty: boolean;
  };
}
