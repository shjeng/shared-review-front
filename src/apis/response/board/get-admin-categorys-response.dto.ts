import CategorieList from "../../../types/interface/admin-categorie.interface";
import ResponseDto from "../response.dto";

export default interface GetAdminCategorysResponseDto extends ResponseDto {
  categorys: CategorieList[];
}
