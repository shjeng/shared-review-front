export default interface BoardListInterface {
  // 이름 뭐로 할지 몰라서 임시로 BoardListInterface로 함
  boardId: number;
  title: string;
  commentCount: number;
  favoriteCount: number;
  viewCount: number;
  writeDateTime: string;

  user: any;
  selected: boolean;
  content: string;
  category: string;
}
