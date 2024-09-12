import { Category } from "../../../types/interface";

export default interface BoardWriteRequestDto {
  title: string;
  contentHtml: string | undefined;
  contentMarkdown: string | undefined;
  category: Category | undefined;
  tags: string[];
}
