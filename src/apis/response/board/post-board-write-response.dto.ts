import ResponseDto from "../response.dto";

export default interface PostBoardWriteResponseDto extends ResponseDto {
  boardId: BigInt;
}
