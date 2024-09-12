export default interface CategorieList {
  selected: boolean;
  categoryId: bigint;
  categoryName: string;
  userNickname: string;
  writeDateTime: string;
  userEmail: string;
  [key: string]: any;
}
