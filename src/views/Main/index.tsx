import React, { useEffect, useState } from "react";
import "./style.css";
import BoardItem from "../../components/BoardItem";
import { Board } from "../../types/interface";
import { getBoardLatestList, getFavoriteBoardTop3 } from "../../apis";
import ResponseDto from "../../apis/response/response.dto";
import { ResponseUtil } from "../../utils";
import BoardListResponse from "../../apis/response/board/get-board-latest-list-response.dto";
import BoardItem2 from "../../components/BoardItem2";

const Main = () => {
  const [favoriteBoardTop3ForWeek, setFavoriteBoardTop3ForWeek] = useState<
    Board[]
  >([]);
  const [favoriteBoardTop3ForMonth, setFavoriteBoardTop3Month] = useState<
    Board[]
  >([]);

  const [latestBoards, setLatestBoards] = useState<Board[]>([]);
  useEffect(() => {
    getBoardLatestList().then(getBoardLatestListResponse);
    getFavoriteBoardTop3("week").then(getFavoriteBoardTop3Response); // 일주일동안 인기 게시물
    getFavoriteBoardTop3("month").then(getFavoriteBoardTop3Response);
  }, []);

  const getBoardLatestListResponse = (
    responseBody: null | ResponseDto | BoardListResponse
  ) => {
    const result = ResponseUtil(responseBody);
    if (!result) {
      return;
    }
    const latestResult = result as BoardListResponse;
    setLatestBoards(latestResult.boardPage.content);
  };

  const getFavoriteBoardTop3Response = (
    responseBody: null | ResponseDto | BoardListResponse
  ) => {
    const result = ResponseUtil(responseBody);
    if (!result) {
      return;
    }
    const resultBody = result as BoardListResponse;
    if (resultBody.condition === "week") {
      setFavoriteBoardTop3ForWeek(resultBody.boards);

      // console.log(
      //   "서버에서 받아온 resultBody.boards값 : ",
      //   JSON.stringify(resultBody.boards, null, 2)
      // );
    }
    if (resultBody.condition === "month") {
      setFavoriteBoardTop3Month(resultBody.boards);
    }
  };

  return (
    <div id="main-wrap">
      <div className="main-top-box">
        <div className="main-jumbotron">
          SReview에서 <br /> 다양한 리뷰를 해주세요!
        </div>
      </div>

      <div className="main-mid-box">
        <div className="board-top">
          <div className="board-top-title">이번달 인기 게시물</div>
          <div className="board-top-item-list">
            {favoriteBoardTop3ForWeek.map((week) => (
              <BoardItem board={week} />
            ))}
          </div>
        </div>

        <div className="board-middle">
          <div className="board-middle-title">이번주 인기 게시물</div>
          <div className="board-middle-item-list">
            {favoriteBoardTop3ForMonth.map((month) => (
              <BoardItem board={month} />
            ))}
          </div>
        </div>

        <div className="board-bottom">
          <div className="board-bottom-title">오늘의 인기 게시물</div>
          <div className="board-bottom-item-list">
            {favoriteBoardTop3ForMonth.map((month) => (
              <BoardItem board={month} />
            ))}
          </div>
        </div>
      </div>

      <div className="main-bottom-box">
        <div className="board-bottom-title">최신 게시물</div>
        <div className="recent-board-item-list">
          {latestBoards.map((latest) => (
            <BoardItem2 board={latest} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Main;
