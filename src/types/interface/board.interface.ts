import User from "./user.interface";
import Tag from "./tag.interface";
import Category from "./category.interface";
import Image from "./image.interface";

export default interface Board {
  boardId: bigint;
  title: string;
  content: string;
  category: Category;
  backImg: Image;
  viewCount: number;
  commentCount: number;
  favoriteCount: number;
  updateDateTime: string;
  user: User;
  writeDateTime: string;
  tags: Tag[];
}
