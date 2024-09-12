import { useNavigate } from "react-router-dom";
import "./style.css";
import {
  ADMIN_BOARD_LIST,
  CATEGORI_MANAGE_PATH,
  MAIN_PATH,
  SIGN_IN_PATH,
  USER_MANAGE_PATH,
  USER_PAGE_PATH,
} from "../../../constant";
import { useEffect, useRef, useState } from "react";
import {
  checkAccessTokenValidity,
  deleteCategory,
  getAdminCategorySearchReqeust,
  getAdminCategorysReqeust,
  postCategotyAdd,
  refreshAccessToken,
  signOutRequest,
} from "../../../apis";
import ResponseDto from "../../../apis/response/response.dto";
import CategorieList from "../../../types/interface/admin-categorie.interface";
import GetAdminCategorysResponseDto from "../../../apis/response/board/get-admin-categorys-response.dto";
import SearchInputBox from "../../../components/SearchInputBox";
import { useLoginUserStore } from "../../../store";
import { useCookies } from "react-cookie";
import CategoryWriteRequestDto from "../../../apis/request/board/category-write-reqeust.dto";
import { ResponseCode } from "../../../types/enum";

const AdminCategories = () => {
  const { loginUser, resetLoginUser } = useLoginUserStore();

  //        function: 네비게이트 함수     //
  const navigate = useNavigate();
  const onUserListClickHandler = () => {
    navigate(USER_MANAGE_PATH());
  };
  const onCategoriesClickHandler = () => {
    navigate(CATEGORI_MANAGE_PATH());
  };
  const onAdminBoardListClickHandler = () => {
    navigate(ADMIN_BOARD_LIST());
  };

  // ===================================================
  // 백엔드 통신
  const [adminCategorys, setAdminCategorys] = useState<CategorieList[]>([]);
  useEffect(() => {
    getAdminCategorysReqeust().then(getAdminCategorysResponse);
  }, []);
  const getAdminCategorysResponse = (
    responseBody: GetAdminCategorysResponseDto | ResponseDto | null
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
    const result = responseBody as GetAdminCategorysResponseDto;

    setAdminCategorys(result.categorys);
  };
  // ===================================================

  // 전체 선택/해제 함수
  const [selectAll, setSelectAll] = useState<boolean>();

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    const updatedBoards = adminCategorys.map((category) => ({
      ...category,
      selected: !selectAll,
    }));
    setAdminCategorys(updatedBoards);
  };
  // 개별 체크박스 선택 함수
  const toggleSelectUser = (index: number) => {
    const updatedBoards = [...adminCategorys];
    updatedBoards[index].selected = !updatedBoards[index].selected;
    setAdminCategorys(updatedBoards);
    const allChecked = updatedBoards.every((board) => board.selected);
    setSelectAll(allChecked);
  };

  const userDefinedColumns = [
    { label: "카테고리", field: "categoryName" },
    { label: "작성자", field: "userNickname" },
    { label: "작성날짜", field: "writeDateTime" },
  ];

  const getAdminCategorySearchResponse = (
    responseBody: GetAdminCategorysResponseDto | ResponseDto | null
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
    const result = responseBody as GetAdminCategorysResponseDto;
    if (result.categorys.length === 0) {
      alert("일치하는 데이터가 없습니다.");
      return;
    }
    setAdminCategorys(result.categorys);
  };

  const handleSearch = (searchValue: string, inputValue: string) => {
    if (searchValue === "전체") {
      getAdminCategorysReqeust().then(getAdminCategorysResponse);
      return;
    }
    getAdminCategorySearchReqeust(searchValue, inputValue).then(
      getAdminCategorySearchResponse
    );
  };

  const userInfo = (categoryId: string | bigint) => {
    // categoryId와 일치하는 카테고리 찾기
    const matchedCategory = adminCategorys.find(
      (category) => category.categoryId === categoryId
    );

    // 찾은 카테고리의 userEmail 값을 추출
    const userEmail = matchedCategory?.userEmail;

    if (userEmail) {
      navigate(USER_PAGE_PATH(userEmail));
    }
  };

  const addInputRef = useRef<HTMLInputElement>(null);
  const [cookies, setCookie, removeCookie] = useCookies();

  //==================================================================
  const checkAccessTokenValidityResponse = (responseBody: {
    code: ResponseCode;
    token?: string;
  }) => {
    console.log("responseBody : ", responseBody);
    if (!responseBody) {
      alert("서버로부터 응답이 없습니다.");
      return;
    }
    const { code } = responseBody;
    if (code === "VF") alert("유효성 검사 실패");
    if (code === "DBE") alert("데이터베이스 오류");
    if (code === "NU") alert("회원 정보 확인");
    if (code === "TE") {
      refreshAccessToken(cookies.refreshToken).then(refreshAccessTokenResponse);
    }
    if (code !== "SU") {
      return;
    }
  };

  const refreshAccessTokenResponse = (responseBody: {
    code: ResponseCode;
    token?: string;
  }) => {
    console.log("responseBody : ", responseBody);
    if (!responseBody) {
      alert("서버로부터 응답이 없습니다.");
      return;
    }
    const { code } = responseBody;
    if (code === "VF") alert("유효성 검사 실패");
    if (code === "DBE") alert("데이터베이스 오류");
    if (code === "NU") alert("회원 정보 확인");
    if (code === "TE") {
      alert("다시 로그인 해주세요.");
      resetLoginUser();
      navigate(SIGN_IN_PATH());
    }
    if (code !== "SU") {
      return;
    }

    if (code === "SU") {
      setCookie("accessToken", responseBody.token, { path: MAIN_PATH() });

      alert("엑세스 토큰 재발급 성공");

      const categoryName = addInputRef.current?.value || "";
      const reqeustBody: CategoryWriteRequestDto = {
        categoryName,
      };

      console.log("엑세스 토큰 발급 후 다시 보낼 categoryName", categoryName);
      console.log("발급받은 토큰 바꾼 후 : ", cookies.accessToken);

      // 카테고리 추가
      postCategotyAdd(reqeustBody, cookies.accessToken).then(postResponse);
    }
  };

  //==================================================================

  const onCategoryAdd = () => {
    console.log("loginUser : ", loginUser);
    console.log("cookies.accessToken : ", cookies.accessToken);

    if (!cookies.accessToken) {
      console.log("로그인해달라고 알림");

      alert("로그인을 해주세요");
      navigate(SIGN_IN_PATH());
    } else if (cookies.accessToken) {
      console.log("유효성검사 시도");
      console.log("보내는 accessToken : ", cookies.accessToken);
      console.log("보내는 refreshToken : ", cookies.refreshToken);

      checkAccessTokenValidity(cookies.accessToken).then(
        checkAccessTokenValidityResponse
      );

      if (loginUser) {
        if (loginUser.admin == "NORMAL") {
          console.log("권한 없음 알림");

          alert("권한이 없습니다.");
          return;
          // navigate(MAIN_PATH());
        } else if (loginUser.admin == "MANAGER") {
          console.log("add 시도");

          const categoryName = addInputRef.current?.value || "";
          const reqeustBody: CategoryWriteRequestDto = {
            categoryName,
          };

          console.log(reqeustBody, cookies.accessToken);
          postCategotyAdd(reqeustBody, cookies.accessToken).then(postResponse);
        }
      }
    }
  };

  const postResponse = (responseBody: { code: ResponseCode }) => {
    console.log("responseBody : ", responseBody);
    if (!responseBody) {
      alert("서버로부터 응답이 없습니다.");
      return;
    }
    const { code } = responseBody;
    if (code === "VF") alert("유효성 검사 실패");
    if (code === "DBE") alert("데이터베이스 오류");
    if (code === "NU") alert("회원 정보 확인");
    if (code !== "SU") {
      return;
    }
    alert("추가되었습니다.");
    window.location.reload();
  };

  const onCategoryDelete = (categoryId: string | bigint) => {
    const userConfirmed = window.confirm("정말로 삭제하시겠습니까?");
    if (userConfirmed) {
      deleteCategory(categoryId, cookies.accessToken).then(deleteResponse);
    } else {
      alert("취소되었습니다.");
    }
  };
  const deleteResponse = (responseBody: ResponseDto | null) => {
    if (!responseBody) {
      alert("서버로부터 응답이 없습니다.");
      return;
    }
    const { code } = responseBody;
    if (code === "VF") alert("유효성 검사 실패");
    if (code === "DBE") alert("데이터베이스 오류");
    if (code === "NU") alert("회원 정보 확인");
    if (code !== "SU") {
      alert(responseBody.message);
      return;
    }

    alert("삭제되었습니다.");
    window.location.reload();
  };

  return (
    <div id="admin-categori-wrap">
      <div className="admin-categori-top">
        <div className="admin-categori-title">카테고리</div>
      </div>
      <div className="admin-categori-mid">
        <div className="admin-categori-mid-left">
          <div className="admin-menu-userList" onClick={onUserListClickHandler}>
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
            className="admin-menu-category-bold"
            onClick={onCategoriesClickHandler}
          >
            카테고리
          </div>
        </div>

        <div className="admin-categori-mid-right">
          <div className="admin-categori-mid-right-top">
            <div className="admin-categori-feature-container">
              <SearchInputBox
                columns={userDefinedColumns}
                onSearch={(searchValue, inputValue) =>
                  handleSearch(searchValue, inputValue)
                }
              />

              <div className="admin-categori-add-container">
                <input
                  type="text"
                  placeholder="추가할 카테고리 입력"
                  ref={addInputRef}
                />
                <div className="admin-categori-add" onClick={onCategoryAdd}>
                  추가하기
                </div>
              </div>
            </div>
            <div className="admin-categori-classification">
              <div className="admin-categori-item-check-box">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                />
              </div>
              <div className="categori-classification-categoryId">ID</div>
              <div className="categori-classification-categoryName">
                카테고리명
              </div>
              <div className="categori-classification-userNickname">작성자</div>
              <div className="categori-classification-writeDateTime">
                작성날짜
              </div>

              {/* {userDefinedColumns.map(({ label, field }) => (
                <div key={field} className={`categori-classification-${field}`}>
                  {label}
                </div>
              ))} */}

              <div className="admin-categori-actions">action</div>
            </div>

            <div className="admin-categori-Item-box">
              {adminCategorys.map((category, index) => (
                <div key={index} className="userList-Item">
                  <div className="checkBox">
                    <input
                      type="checkbox"
                      checked={category.selected || false}
                      onChange={() => toggleSelectUser(index)}
                    />
                  </div>
                  <div className="admin-categori-item-id">
                    {category.categoryId.toString()}
                  </div>
                  <div className="admin-categori-item-title">
                    {category.categoryName}
                  </div>
                  <div
                    className="admin-categori-item-nickName"
                    onClick={() => userInfo(category.categoryId)}
                  >
                    {category.userNickname}
                  </div>
                  <div className="admin-categori-item-writerDate">
                    {
                      new Date(category.writeDateTime)
                        .toISOString()
                        .split("T")[0]
                    }
                  </div>

                  <div className="admin-categori-item-action">
                    <div
                      className="actions-icon-img"
                      onClick={() => onCategoryDelete(category.categoryId)}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-categori-mid-right-bottom">
            <div className="admin-categori-delete-btn">삭제</div>
          </div>
        </div>
      </div>

      <div className="admin-categori-bottom"></div>

      {/* <SearchResultsPage /> */}
    </div>
  );
};

export default AdminCategories;
