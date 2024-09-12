import { useNavigate } from "react-router-dom";
import "./style.css";
import {
  ADMIN_BOARD_LIST,
  CATEGORI_MANAGE_PATH,
  MAIN_PATH,
  USER_MANAGE_PATH,
} from "../../constant";
import { useEffect, useState } from "react";
import { getAdminCategorysReqeust, getCategorysReqeust } from "../../apis";
import ResponseDto from "../../apis/response/response.dto";
import CategorieList from "../../types/interface/admin-categorie.interface";
import GetAdminCategorysResponseDto from "../../apis/response/board/get-admin-categorys-response.dto";
import SearchInputBox from "../../components/SearchInputBox";
import { useLoginUserStore } from "../../store";

const SearchResultsPage = () => {
  const { loginUser } = useLoginUserStore();

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
    // if (!loginUser) {
    //   alert("잘못된 접근입니다.");
    //   navigate(MAIN_PATH());
    //   return;
    // }
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
    console.log(
      "result.categorys : ",
      JSON.stringify(result.categorys, null, 2)
    ); // 객체의 구조를 확인
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
    { label: "ID", field: "categoryId" },
    { label: "카테고리", field: "categoryName" },
    { label: "작성자", field: "userNickname" },
    { label: "작성날짜", field: "writeDateTime" },
  ];

  const handleSearch = (inputValue: string, searchValue: string) => {
    // 검색 로직을 구현합니다.
    // console.log("Input Value:", inputValue);
    console.log("Search Value:", searchValue);

    const filteredCategories = adminCategorys.filter((category) =>
      category[searchValue as keyof CategorieList]
        ?.toString()
        .includes(inputValue)
    );

    console.log(
      "filteredCategories : ",
      JSON.stringify(filteredCategories, null, 2)
    );
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
          <div className="admin-menu-announcement">공지사항</div>
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
                onSearch={(inputValue, searchValue) =>
                  handleSearch(inputValue, searchValue)
                }
              />

              <div className="admin-categori-add-container">
                <input type="text" placeholder="추가 내용 입력" />
                <div className="admin-categori-add">추가하기</div>
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
              {/* <div className="admin-categori-id">ID</div>
              <div className="admin-categori-name">카테고리명</div>
              <div className="admin-categori-email">작성자</div>
              <div className="admin-categori-writerDate">작성날짜</div> */}

              {userDefinedColumns.map(({ label, field }) => (
                <div key={field} className={`categori-classification-${field}`}>
                  {label}
                </div>
              ))}

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
                  <div className="admin-categori-item-nickName">
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
                    <div className="actions-icon-img"></div>
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

export default SearchResultsPage;
