import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import {
  BOARD_LIST,
  BOARD_WRITE,
  MAIN_PATH,
  SIGN_IN_PATH,
  SIGN_UP_PATH,
  USER_MANAGE_PATH,
  USER_PAGE_PATH,
} from "../../constant";
import { useBoardSearchStore, useLoginUserStore } from "../../store";
import { useCookies } from "react-cookie";
import { getCategorysReqeust, searchRequest } from "../../apis";
import {
  BoardListResponse,
  GetCategorysResponseDto,
} from "../../apis/response/board";
import ResponseDto from "../../apis/response/response.dto";
import { Category } from "../../types/interface";
import useOutsideClick from "../../hooks/useOutsideClick.hook"; // 추가된 부분

const Header = () => {
  //      state: 드롭다운 상태      //
  const [searchCategoryDrop, setSearchCategoryDrop] = useState(false);
  const [profileDrop, setProfileDrop] = useState(false);
  const { loginUser } = useLoginUserStore();
  const {
    categoryId,
    searchType,
    setCategoryId,
    setSearchWord,
    setSearchType,
  } = useBoardSearchStore();
  const [cookies, setCookies, removeCookie] = useCookies();
  const searchDropRef = useRef<any>(null);
  const [categorys, setCategorys] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category | undefined>();
  // const [keyword, setKeyword] = useState<string>("");
  //        function: 네비게이트 함수     //
  const navigate = useNavigate();

  const searchTypeClick = (searchType: string) => {
    setSearchType(searchType);
    setSearchCategoryDrop(false);
  };

  // 커스텀 훅 사용
  useOutsideClick(searchDropRef, () => {
    if (searchCategoryDrop) {
      setSearchCategoryDrop(false);
    }
  });

  // 헤더 검색 부분 드롭다운
  const toggleDropdown = () => {
    setSearchCategoryDrop(!searchCategoryDrop);
  };

  // Effect: 처음 렌더링 시 카테고리를 가져와줌.
  useEffect(() => {
    setSearchType("all");
    getCategorysReqeust().then(getCategorysResponse);
  }, []);
  const getCategorysResponse = (
    responseBody: GetCategorysResponseDto | ResponseDto | null
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
    const result = responseBody as GetCategorysResponseDto;
    setCategorys(result.categorys);
  };

  // 카테고리로 게시물 목록 불러오기
  const categoryBoardList = (category: Category) => {
    setCategoryId(category.categoryId);
    setSearchWord("");
    setSearchType("all");
    toggleCategoryDropdown();
    navigate(BOARD_LIST());
  };
  // const categoryBoardList

  // =========== 오른쪽 상단 프로필 영역==============
  const profileDropRef = useRef<any>(null);

  // 커스텀 훅 사용
  useOutsideClick(profileDropRef, () => {
    if (profileDrop) {
      setProfileDrop(false);
    }
  });

  const profileDropdown = () => {
    setProfileDrop(!profileDrop);
  };
  // =========== 오른쪽 상단 프로필 영역==============

  const myPage = () => {
    if (!loginUser) {
      return;
    }
    const targetPath = USER_PAGE_PATH(loginUser.email);
    if (window.location.pathname === targetPath) {
      window.location.reload();
    } else {
      navigate(targetPath);
    }
  };
  //      event handler: 로고 클릭 이벤트 처리 함수       //
  const onLogoClickHandler = () => {
    const targetUrl = "http://localhost:3000/";
    if (window.location.href === targetUrl) {
      window.location.reload(); // 페이지 새로고침
    } else {
      navigate(MAIN_PATH());
    }
  };

  //      event handler: 로그인 클릭 이벤트 처리 함수       //
  const onLoginClickHandler = () => {
    navigate(SIGN_IN_PATH());
  };

  //      event handler: 로그인 클릭 이벤트 처리 함수       //
  const onSignUpClickHandler = () => {
    navigate(SIGN_UP_PATH());
  };

  const [inputValue, setInputValue] = useState<string>("");

  const searchInputRef = useRef<any>(null);

  const onCategorySearch = () => {
    const inputValue = searchInputRef.current?.value;
    setInputValue(inputValue);
    if (!inputValue.length) {
      alert("검색어를 입력해주세요.");
      return;
    }
    setSearchWord(inputValue);
    setCategoryId(category?.categoryId);
    navigate(BOARD_LIST());
  };

  const keywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onCategorySearch();
    }
  };
  const onSignOutButtonClickHandler = () => {
    if (cookies.accessToken) {
      removeCookie("accessToken", { path: "/" });
      removeCookie("refreshToken", { path: "/" });
      alert("로그아웃 되었습니다.");
      navigate(MAIN_PATH());
    }
  };

  const [categoryDrop, setCategoryDrop] = useState(false);
  const categoryDropRef = useRef<any>(null);

  // 커스텀 훅 사용
  useOutsideClick(categoryDropRef, () => {
    if (categoryDrop) {
      setCategoryDrop(false);
    }
  });

  const toggleCategoryDropdown = () => {
    setCategoryDrop(!categoryDrop);
  };

  return (
    <div id="header-wrap">
      <div className="header-top-box">
        <div className="header-left-box" onClick={onLogoClickHandler}>
          <div className="header-icon"></div>
          <div className="header-logo-right">
            <div className="header-logo">
              <span style={{ color: "black" }}>S</span>hared
            </div>
            <div className="header-logo">
              <span style={{ color: "black" }}>R</span>eview
            </div>
          </div>
        </div>

        <div className="header-menu-box" ref={categoryDropRef}>
          <div
            className="header-menu-navigation"
            onClick={toggleCategoryDropdown}
          >
            <div className="header-category-box">{"CATEGORY"}</div>

            <div className="category-drop-icon"></div>
          </div>

          {categoryDrop && (
            <div className="category-dropdown-content">
              {categorys.map((category, index) => (
                <div
                  className="category-dropdown-item"
                  onClick={() => categoryBoardList(category)}
                >
                  {category.categoryName}
                </div>
              ))}
            </div>
          )}

          {/* <div className="category-dropdown-content">
            {categorys.map((category, index) => (
              <div
                className="category-dropdown-item"
                onClick={() => categoryBoardList(category)}
              >
                {category.categoryName}
              </div>
            ))}
          </div> */}
        </div>

        <div className="header-middle-box">
          <div className="header-category">
            <div className="header-category-dropdown" ref={searchDropRef}>
              <div className="dropdown-box" onClick={toggleDropdown}>
                {searchType === "all"
                  ? "전체"
                  : searchType === "title"
                  ? "제목"
                  : searchType === "content"
                  ? "내용"
                  : "작성자"}
                <div className="dropdown_icon"></div>
              </div>
              {searchCategoryDrop && (
                <div className="dropdown-content">
                  <div
                    className="board-dropdown-content-item"
                    onClick={() => searchTypeClick("all")}
                  >
                    전체
                  </div>
                  <div
                    className="board-dropdown-content-item"
                    onClick={() => searchTypeClick("title")}
                  >
                    제목
                  </div>
                  <div
                    className="board-dropdown-content-item"
                    onClick={() => searchTypeClick("content")}
                  >
                    내용
                  </div>
                  <div
                    className="board-dropdown-content-item"
                    onClick={() => searchTypeClick("writer")}
                  >
                    작성자
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="header-search">
            <input
              type="text"
              placeholder="검색어 입력"
              ref={searchInputRef}
              onKeyDown={keywordKeyDown}
            />
            <div className="header-search-img" onClick={onCategorySearch}></div>
          </div>
        </div>
        {loginUser ? (
          <>
            <div
              className="header-right-box"
              onClick={profileDropdown}
              ref={profileDropRef}
            >
              <div className="profile-dropdown-box">
                {loginUser.profileImage ? (
                  <div
                    className="header-right-box-img"
                    style={{
                      backgroundImage: `url(${loginUser.profileImage})`,
                    }}
                  ></div>
                ) : (
                  <div className="header-right-box-img-default"></div>
                )}

                <div className="header-right-box-nickName">
                  {loginUser.nickname}
                </div>
                <div className="header-right-box-drop"></div>
              </div>

              {profileDrop && (
                <div className="profile-dropdown-content">
                  <div
                    className="profile-dropdown-content-item"
                    onClick={myPage}
                  >
                    마이페이지
                  </div>
                  <div
                    className="profile-dropdown-content-item"
                    onClick={() => navigate(BOARD_WRITE())}
                  >
                    글작성
                  </div>

                  {loginUser.admin === "MANAGER" && (
                    <div
                      className="profile-dropdown-content-item"
                      onClick={() => navigate(USER_MANAGE_PATH())}
                    >
                      관리자페이지
                    </div>
                  )}

                  <div
                    className="profile-dropdown-content-item"
                    onClick={onSignOutButtonClickHandler}
                  >
                    로그아웃
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="header-right-box">
            <div
              className="header-right-box-login"
              onClick={onLoginClickHandler}
            >
              <div className="header-login-button-login-icon"></div>
              <div className="header-login-button">{"LOGIN"}</div>
            </div>

            <div
              className="header-right-box-signUp"
              onClick={onSignUpClickHandler}
            >
              <div className="header-login-button-signUp-icon"></div>
              <div className="header-login-button">{"SIGN UP"}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
