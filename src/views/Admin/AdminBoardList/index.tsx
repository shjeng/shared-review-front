import {useNavigate} from "react-router-dom";
import "./style.css";
import {ADMIN_BOARD_LIST, BOARD_DETAIL, CATEGORI_MANAGE_PATH, USER_MANAGE_PATH,} from "../../../constant";
import {useEffect, useState} from "react";
import {getAdminBoardListRequest, getAdminBoardSearchReqeust,} from "../../../apis";
import ResponseDto from "../../../apis/response/response.dto";
import GetAdminBoardResponseDto from "../../../apis/response/board/get-admin-board-list-response.dto";
import AdminBoard from "../../../types/interface/admin-board.interface";
import SearchInputBox from "../../../components/SearchInputBox";

const AdminBoardList = () => {
  const [boards, setBoards] = useState<AdminBoard[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>();

  //        function: 네비게이트 함수     //
  const navigate = useNavigate();

  //      event handler: 로고 클릭 이벤트 처리 함수       //
  const onUserListClickHandler = () => {
    navigate(USER_MANAGE_PATH());
  };

  //      event handler: 카테고리 클릭 이벤트 처리 함수       //
  const onCategoriesClickHandler = () => {
    navigate(CATEGORI_MANAGE_PATH());
  };

  const onAdminBoardListClickHandler = () => {
    navigate(ADMIN_BOARD_LIST());
  };

  const onBoardTitleClickHandler = (boardId: number) => {
    navigate(BOARD_DETAIL(boardId as unknown as bigint));
  };

  // 관리자 페이지(게시글목록) - 게시글 목록 요청
  useEffect(() => {
    getAdminBoardListRequest().then(getAdminBoardListResponse);
  }, []);
  const getAdminBoardListResponse = (
    responseBody: GetAdminBoardResponseDto | ResponseDto | null
  ) => {
    if (!responseBody) {
      alert("서버로부터 응답이 없습니다.");
      return;
    }

    const { code } = responseBody;
    console.log("BoardList code 값 : ", JSON.stringify(code, null, 2));

    if (code === "VF") alert("유효성 검사 실패");
    if (code === "DBE") alert("데이터베이스 오류");
    if (code !== "SU") {
      return;
    }
    const result = responseBody as GetAdminBoardResponseDto;
    console.log("result : ", JSON.stringify(result, null, 2)); // 객체의 구조를 확인

    setBoards(result.boards);
  };

  // =========================================================

  // 전체 선택/해제 함수
  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    const updatedBoards = boards.map((board) => ({
      ...board,
      selected: !selectAll,
    }));
    setBoards(updatedBoards);
  };
  // 개별 체크박스 선택 함수
  const toggleSelectUser = (index: number) => {
    const updatedBoards = [...boards];
    updatedBoards[index].selected = !updatedBoards[index].selected;
    setBoards(updatedBoards);
    const allChecked = updatedBoards.every((board) => board.selected);
    setSelectAll(allChecked);
  };

  const userDefinedColumns = [
    { label: "ID", field: "id" },
    { label: "제목", field: "title" },
    { label: "닉네임", field: "nickName" },
    { label: "작성일", field: "writerDate" },
  ];

  const handleSearch = (searchValue: string, inputValue: string) => {
    if (searchValue === "전체") {
      getAdminBoardListRequest().then(getAdminBoardListResponse);
      return;
    }
    getAdminBoardSearchReqeust(searchValue, inputValue).then(
      getAdminBoardSearchResponse
    );
  };
  const getAdminBoardSearchResponse = (
    responseBody: GetAdminBoardResponseDto | ResponseDto | null
  ) => {
    if (!responseBody) {
      alert("서버로부터 응답이 없습니다.");
      return;
    }

    const { code } = responseBody;
    console.log("BoardList code 값 : ", JSON.stringify(code, null, 2));

    if (code === "VF") alert("유효성 검사 실패");
    if (code === "DBE") alert("데이터베이스 오류");
    if (code !== "SU") {
      return;
    }
    const result = responseBody as GetAdminBoardResponseDto;
    console.log("result : ", JSON.stringify(result, null, 2)); // 객체의 구조를 확인

    setBoards(result.boards);
  };

  return (
    <div id="admin-wrap">
      <div className="admin-top">
        <div className="admin-title">게시글목록</div>
      </div>
      <div className="admin-mid">
        <div className="admin-mid-left">
          <div className="admin-menu-userList" onClick={onUserListClickHandler}>
            회원목록
          </div>
          {/* <div className="admin-menu-announcement">공지사항</div> */}
          <div
            className="admin-menu-post-bold"
            onClick={onAdminBoardListClickHandler}
          >
            게시글목록
          </div>
          <div
            className="admin-menu-category"
            onClick={onCategoriesClickHandler}
          >
            카테고리
          </div>
        </div>

        <div className="admin-mid-right">
          <div className="admin-mid-right-top">
            <SearchInputBox
              columns={userDefinedColumns}
              onSearch={(searchValue, inputValue) =>
                handleSearch(searchValue, inputValue)
              }
            />

            <div className="admin-classification">
              <div className="admin-item-check-box">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                />
              </div>
              {userDefinedColumns.map(({ label, field }) => (
                <div key={field} className={`classification-${field}`}>
                  {label}
                </div>
              ))}

              <div className="classification-actions">action</div>
            </div>

            <div className="admin-Item-box">
              {boards.map((board, index) => (
                <div key={index} className="admin-Item">
                  <div className="checkBox">
                    <input
                      type="checkbox"
                      checked={board.selected || false}
                      onChange={() => toggleSelectUser(index)}
                    />
                  </div>
                  <div className="admin-item-id">{board.boardId}</div>
                  <div
                    className="admin-item-title"
                    onClick={() => onBoardTitleClickHandler(board.boardId)}
                  >
                    {board.title}
                  </div>
                  <div className="admin-item-nickName">
                    {board.user.nickname}
                  </div>
                  <div className="admin-item-writerDate">
                    {board.writeDateTime
                      ? new Date(board.writeDateTime)
                          .toISOString()
                          .split("T")[0]
                      : "Invalid Date"}
                  </div>
                  <div className="admin-item-action">
                    <div className="actions-icon-img"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-mid-right-bottom">
            <div className="admin-delete-btn">삭제</div>
          </div>
        </div>
      </div>

      <div className="admin-bottom"></div>
    </div>
  );
};

export default AdminBoardList;
