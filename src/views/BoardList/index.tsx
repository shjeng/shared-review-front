import React, { useEffect, useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { BOARD_WRITE } from "../../constant";
import { searchRequest } from "../../apis";
import ResponseDto from "../../apis/response/response.dto";
import GetBoardListResponseDto from "../../apis/response/board/get-board-list-response.dto";
import { Board, Category } from "../../types/interface";
import { useBoardSearchStore, useLoginUserStore } from "../../store";
import BoardItem2 from "../../components/BoardItem2";
import BoardItem3 from "../../components/BoardItem3";
import { BoardListResponse } from "../../apis/response/board";
import { ResponseUtil } from "../../utils";
import Pageable from "../../types/interface/pageable.interface";
import Pagination from "../../components/Pagination";
import usePagination from "../../hooks/pagination.hook";

const BoardList = () => {
  const countPerPage = 20;
  const { loginUser } = useLoginUserStore();
  const [category, setCategory] = useState<Category>();
  const { categoryId, searchWord, searchType } = useBoardSearchStore();
  const { setCategoryId, setSearchWord, setSearchType } = useBoardSearchStore();
  const navigator = useNavigate();
  const [requestParams, setRequestParams] = useState<Object>({});

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

  const onBoardWriteClickHandler = () => {
    navigator(BOARD_WRITE());
  };

  // 게시글 목록 요청
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    const params = {
      page: 0,
      categoryId: categoryId,
      searchKeyword: searchWord,
      searchType: searchType,
    };
    searchRequest(params).then(searchResponse);
    setRequestParams(params);
  }, []);
  const searchResponse = (
    responseBody: Pageable<Board> | ResponseDto | null
  ) => {
    if (ResponseUtil(responseBody)) {
      return;
    }
    const result = responseBody as Pageable<Board>;
    setBoards(result.content || []);
    setCurrentPage(result.pageable.pageNumber + 1);
    setTotalCount(result.totalElements);
    setCountPerItem(result.size);
    // setBoards(result.boardPage.content);
  };

  useEffect(() => {
    let params = {
      ...requestParams,
      categoryId: categoryId,
      searchKeyword: searchWord,
      searchType: searchType,
    };
    setRequestParams(params);
    searchRequest(params).then(searchResponse);
  }, [categoryId]);

  useEffect(() => {
    let params = {
      ...requestParams,
      searchKeyword: searchWord,
      searchType: searchType,
      categoryId: categoryId,
    };
    setRequestParams(params);
    console.log(params);
    searchRequest(params).then(searchResponse);
  }, [searchWord]);

  useEffect(() => {
    const params = {
      ...requestParams,
      categoryId: categoryId,
    };
    setRequestParams(params);
  }, [categoryId]);

  const getBoardListResponse = (
    responseBody: GetBoardListResponseDto | ResponseDto | null
  ) => {
    if (!responseBody) {
      alert("서버로부터 응답이 없습니다.");
      return;
    }

    const { code } = responseBody;
    if (code === "VF") alert("유효성 검사 실패");
    if (code === "DBE") alert("데이터베이스 오류");
    if (code !== "SU") {
      return;
    }
    const result = responseBody as GetBoardListResponseDto;
    setBoards(result.boardPage.content);
  };
  // useEffect(() => {
  //   searchRequest(searchWord, category).then(searchResponse);
  // }, [searchWord, searchType]);

  const pageButtonClick = (page: number) => {
    setCurrentPage(page);
    let params = {
      ...requestParams,
      page: page - 1,
    };
    setRequestParams(params);
    searchRequest(params).then(searchResponse);
  };
  return (
    <div id="board-list-wrap">
      <div className="board-list-top">
        <div className="list-write-title">게시물</div>
      </div>
      <div className="board-list-mid">
        {/* {boards && (
          <div>
            <h1>게시글이 없습니다.</h1>
          </div>
        )} */}

        {boards.map((board, index) => (
          <>
            <BoardItem2 board={board} />
          </>
        ))}
      </div>

      {loginUser && (
        <div className="board-list-bottom">
          <div className="list-write-btn" onClick={onBoardWriteClickHandler}>
            <div className="list-write-btn-icon"></div>
            작성하기
          </div>
        </div>
      )}

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
  );
};

export default BoardList;
