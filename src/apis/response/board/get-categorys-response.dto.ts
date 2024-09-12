import { Category } from "../../../types/interface";
import ResponseDto from "../response.dto";

export default interface GetCategorysResponseDto extends ResponseDto {
  categorys: Category[];
}
