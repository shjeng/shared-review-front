import React from "react";
import "./style.css";
import { Board } from "../../types/interface";
import { useNavigate } from "react-router-dom";
import { BOARD_DETAIL } from "../../constant";

interface Props {
  board: Board;
}
const BoardItem2 = ({ board }: Props) => {
  const navigator = useNavigate();
  const detailView = () => {
    navigator(BOARD_DETAIL(board.boardId));
  };

  return (
    <div className="recent-board-item-box" onClick={detailView}>
      <div className="recent-board-item-top">
        <div className="recent-board-item-title">{board.title}</div>
      </div>
      <div className="recent-board-item-bottom">
        <div className="board-item-metaData-left">
          {board.user.profileImage ? (
            <div
              className="board-item-profile-image"
              style={{ backgroundImage: `url(${board.user.profileImage})` }}
            ></div>
          ) : (
            <div className="board-item-profile-image-default"></div>
          )}

          <div className="recent-board-item-nickname">
            {board.user.nickname}
          </div>
          <div className="recent-board-item-category">
            {board.category.categoryName}
          </div>
          <div className="recent-board-item-timeInfo">
            {new Date(board.writeDateTime).toISOString().split("T")[0]}
          </div>
        </div>

        <div className="board-item-metaData-right">
          <div className="board-comment-box">
            <div className="board-comment-img"></div>
            <div className="comment-count">{board.commentCount}</div>
          </div>

          <div className="board-like-box">
            <div className="board-like-img"></div>
            <div className="like-count">{board.favoriteCount}</div>
          </div>

          <div className="board-view-box">
            <div className="board-view-img"></div>
            <div className="view-count">{board.viewCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardItem2;
