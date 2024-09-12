import "./style.css";
import React, { useEffect, useState } from "react";
import { getUserBoard, getUserInfoRequest } from "../../apis";
import { useNavigate, useParams } from "react-router-dom";
import { Board, User } from "../../types/interface";
import { BoardListResponse } from "../../apis/response/board";
import ResponseDto from "../../apis/response/response.dto";
import { ResponseUtil } from "../../utils";
import BoardItem2 from "../../components/BoardItem2";
import Pagination from "../../components/Pagination";
import usePagination from "../../hooks/pagination.hook";
import { MAIN_PATH } from "../../constant";
import { GetUserResponseDto } from "../../apis/response/user";

const UserBoard = () => {
  const countPerPage = 15;
  const [boards, setBoards] = useState<Board[]>([]);
  const [user, setUser] = useState<User>();

  const {
    startPage,
    endPage,
    currentPage,
    pageList,
    currentSection,
    totalSection,
    setCurrentPage,
    setCurrentSection,
    setTotalCount,
    setCountPerItem,
  } = usePagination(countPerPage);
  const { userEmail } = useParams();
  const navigator = useNavigate();
  useEffect(() => {
    if (!userEmail) {
      alert("잘못된 접근입니다.");
      navigator(MAIN_PATH());
      return;
    }
    getUserInfo(userEmail);
    // getUser
    getBoards(userEmail, 1);
  }, []);

  // 유저 정보 불러오기
  const getUserInfo = (email: string) => {
    getUserInfoRequest(email).then(getUserInfoResponse);
  };
  const getUserInfoResponse = (
    response: GetUserResponseDto | ResponseDto | null
  ) => {
    const result = ResponseUtil(response);
    if (!result) {
      return;
    }
    const userInfoResult = result as GetUserResponseDto;
    setUser(userInfoResult.userDto);
  };

  // 게시물 불러오기
  const getBoards = (userEmail: string, currentPage: number) => {
    getUserBoard(userEmail, currentPage - 1).then(getUserBoardResponse);
  };
  const getUserBoardResponse = (
    response: BoardListResponse | ResponseDto | null
  ) => {
    console.log(response);
    const result = ResponseUtil(response);
    if (!result) {
      return;
    }
    const boardListResponse = result as BoardListResponse;
    setBoards(boardListResponse.boardPage.content);
    setTotalCount(boardListResponse.boardPage.totalElements);
    setCountPerItem(boardListResponse.boardPage.size);
    setCurrentPage(boardListResponse.boardPage.pageable.pageNumber + 1);
  };
  const userDefinedColumns = [
    { label: "글번호", field: "id" },
    { label: "제목", field: "title" },
    { label: "카테고리", field: "category" },
    { label: "작성날짜", field: "writeDateTime" },
  ];

  const pageButtonClick = () => {
    if (!userEmail) {
      return;
    }
    getBoards(userEmail, currentPage);
  };
  return (
    <div id="user-board-wrapper">
      <div className="user-board-main-bottom-box">
        <div className="user-bottom-title">"{user?.nickname}" 게시글</div>
        {/* <SearchInputBox columns={userDefinedColumns} /> */}
        <div className="user-board-item-list">
          {boards.map((board) => (
            <BoardItem2 board={board} />
          ))}
        </div>
        <div className="user-board-pagination">
          <Pagination
            currentPage={currentPage}
            currentSection={currentSection}
            setCurrentPage={setCurrentPage}
            totalSection={totalSection}
            countPerPage={countPerPage}
            pageList={pageList}
            pageClick={pageButtonClick}
          ></Pagination>
        </div>
      </div>
    </div>
  );
};

export default UserBoard;
