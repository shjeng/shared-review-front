import UserList from "../../../types/interface/user-list.interface";
import ResponseDto from "../response.dto";

export default interface GetUserListResponseDto extends ResponseDto {
  userList: UserList[];
}
