import { useNavigate } from "react-router-dom";
import "./style.css";
import {
  ADMIN_BOARD_LIST,
  CATEGORI_MANAGE_PATH,
  USER_MANAGE_PATH,
} from "../../../constant";
import { useEffect, useState } from "react";
import { getAdminUserSearchReqeust, getUserList } from "../../../apis";
import GetUserListResponseDto from "../../../apis/response/user/get-user-list-response.dto";
import ResponseDto from "../../../apis/response/response.dto";
import UserList from "../../../types/interface/user-list.interface";
import SearchInputBox from "../../../components/SearchInputBox";

const AdminUserList = () => {
  const [users, setUsers] = useState<UserList[]>([]);
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

  // 관리자 페이지(회원목록) - 회원목록 요청
  useEffect(() => {
    getUserList().then(getAdminUserListResponse);
  }, []);
  const getAdminUserListResponse = (
    responseBody: GetUserListResponseDto | ResponseDto | null
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
    const result = responseBody as GetUserListResponseDto;
    setUsers(result.userList);
  };

  // 전체 선택/해제 함수
  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    const updatedUsers = users.map((user) => ({
      ...user,
      selected: !selectAll,
    }));
    setUsers(updatedUsers);
  };

  // 개별 체크박스 선택 함수
  const toggleSelectUser = (index: number) => {
    const updatedUsers = [...users];
    updatedUsers[index].selected = !updatedUsers[index].selected;
    setUsers(updatedUsers);
    const allChecked = updatedUsers.every((user) => user.selected);
    setSelectAll(allChecked);
  };

  const userDefinedColumns = [
    { label: "ID", field: "id" },
    { label: "닉네임", field: "nickName" },
    { label: "이메일", field: "email" },
    { label: "가입일", field: "writerDate" },
    { label: "권한", field: "authority" },
  ];

  const handleSearch = (searchValue: string, inputValue: string) => {
    if (searchValue === "전체") {
      getUserList().then(getAdminUserListResponse);
      return;
    }
    getAdminUserSearchReqeust(searchValue, inputValue).then(
      getAdminUserSearchResponse
    );
  };
  const getAdminUserSearchResponse = (
    responseBody: GetUserListResponseDto | ResponseDto | null
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
    const result = responseBody as GetUserListResponseDto;
    setUsers(result.userList);
  };

  return (
    <div id="userList-wrap">
      <div className="userList-top">
        <div className="userList-title">회원목록</div>
      </div>
      <div className="userList-mid">
        <div className="userList-mid-left">
          <div
            className="admin-menu-userList-bold"
            onClick={onUserListClickHandler}
          >
            회원목록
          </div>
          {/* <div className="admin-menu-announcement">공지사항</div> */}
          <div
            className="admin-menu-post"
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

        <div className="userList-mid-right">
          <div className="userList-mid-right-top">
            <SearchInputBox
              columns={userDefinedColumns}
              onSearch={(searchValue, inputValue) =>
                handleSearch(searchValue, inputValue)
              }
            />

            <div className="userList-classification">
              <div className="userList-item-check-box">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                />
              </div>
              {/* <div className="classification-id">ID</div>
              <div className="classification-nickName">닉네임</div>
              <div className="classification-email">이메일</div>
              <div className="classification-writerDate">가입일</div>
              <div className="classification-authority">권한</div> */}

              {userDefinedColumns.map(({ label, field }) => (
                <div key={field} className={`classification-${field}`}>
                  {label}
                </div>
              ))}

              <div className="classification-actions">action</div>
            </div>

            <div className="userList-Item-box">
              {users.map((user, index) => (
                <div key={index} className="userList-Item">
                  <div className="checkBox">
                    <input
                      type="checkbox"
                      checked={user.selected || false}
                      onChange={() => toggleSelectUser(index)}
                    />
                  </div>
                  <div className="userList-item-id">{user.id}</div>
                  <div className="userList-item-nickName">{user.nickname}</div>
                  <div className="userList-item-email">{user.email}</div>
                  <div className="userList-item-writerDate">
                    {new Date(user.writeDateTime).toISOString().split("T")[0]}
                    {/* 날짜형식 백에서 처리하기 */}
                  </div>
                  <div className="userList-item-authority">{user.admin}</div>
                  <div className="userList-item-action">
                    <div className="actions-icon-img"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="userList-mid-right-bottom">
            <div className="userList-delete-btn">삭제</div>
          </div>
        </div>
      </div>

      <div className="userList-bottom"></div>
    </div>
  );
};

export default AdminUserList;
