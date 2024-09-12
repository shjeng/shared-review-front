import React, { useEffect } from "react";
import "./style.css";
import { Board } from "../../types/interface";
import { useLocation, useNavigate } from "react-router-dom";
import { BOARD_DETAIL, USER_BOARD } from "../../constant";

interface Props {
  board: Board;
}
const BoardItem = ({ board }: Props) => {
  const navigator = useNavigate();
  const detailView = () => {
    navigator(BOARD_DETAIL(board.boardId));
  };

  const userBoard = (event: { stopPropagation: () => void }) => {
    event.stopPropagation(); // 부모 onClick이벤트 전파 차단
    if (!board.user) {
      return;
    }
    navigator(USER_BOARD(board.user.email));
  };

  return (
    <div id="board-item-wrap" onClick={detailView}>
      <div className="board-item-top-box">
        <div className="board-item-profile" onClick={userBoard}>
          {board.user.profileImage ? (
            <div
              className="board-item-profile-image"
              style={{ backgroundImage: `url(${board.user.profileImage})` }}
            ></div>
          ) : (
            <div className="board-item-profile-image-default"></div>
          )}
          <div className="board-item-write-box">
            <div className="board-item-nickname">{board.user.nickname}</div>
            <div className="board-item-write-date">
              {new Date(board.writeDateTime).toISOString().split("T")[0]}
            </div>
          </div>
        </div>

        {/* 백에서 카테고리 받아오기 {board.category}*/}
        <div className="board-item-category">{board.category.categoryName}</div>
      </div>

      {board.backImg && board.backImg.imageUrl ? (
        <div
          className="board-item-middle-box"
          style={{ backgroundImage: `url(${board.backImg.imageUrl})` }}
        >
          {/* 이미지 넣는건가 */}
        </div>
      ) : (
        <div className="board-item-middle-box">{/* 이미지 넣는건가 */}</div>
      )}

      <div className="board-item-bottom-box">
        <div className="board-item-title">{board.title}</div>
        <div className="board-item-counts">
          <div className="board-item-counts-left">
            <div className="like-count-box">
              <div className="like-count-image"></div>
              <div className="like-count">{board.favoriteCount}</div>
            </div>

            <div className="comment-count-box">
              <div className="comment-count-image"></div>
              <div className="comment-count">{board.commentCount}</div>
            </div>
          </div>
          <div className="board-item-counts-right">
            <div className="view-count-box">
              <div className="view-count-image"></div>
              <div className="view-count">{board.viewCount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardItem;
