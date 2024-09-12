import AdminBoard from "../../../types/interface/admin-board.interface";
import ResponseDto from "../response.dto";

export default interface GetAdminBoardResponseDto extends ResponseDto {
  boards: AdminBoard[];
}
