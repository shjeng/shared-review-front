import React, { useEffect, useRef, useState } from "react";
import "./style.css";

// interface: Input Box 컴포넌트 Properties
interface Props {
  columns: { label: string; field: string }[];
  onSearch: (inputValue: string, searchValue: string) => void;
}

const SearchInputBox = ({ columns, onSearch }: Props) => {
  const [searchDrop, setSearchDrop] = useState(false);
  const [search, setSearch] = useState<string>("검색기준");
  const [searchValue, setSearchValue] = useState<string>("");

  const [dropdownValue, setDropdownValue] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");

  const searchInputRef = useRef<any>(null);

  const toggleDropdown = () => {
    setSearchDrop(!searchDrop);
  };

  const onSearchClick = (label: string, field: string) => {
    setSearch(label);
    setSearchValue(field);
    setSearchDrop(false);
  };

  const onCategorySearch = () => {
    const inputValue = searchInputRef.current?.value || "";
    setInputValue(inputValue);
    if (search !== "검색기준" && inputValue.length === 0) {
      alert("검색어를 입력해주세요.");
      return;
    } else if (search == "검색기준") {
      alert("검색기준을 선택해주세요.");
      return;
    }
    onSearch(searchValue, inputValue);
  };

  //      event handler: 패스워드 인풋 키 다운 이벤트 처리      //
  const onSearchKeyDownHandler = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key !== "Enter") return;
    onSearchButtonClickHandler();
  };

  //      event handler: 검색 버튼 클릭 이벤트 처리 함수      //
  const onSearchButtonClickHandler = () => {
    onCategorySearch();
  };
  return (
    <>
      <div className="admin-categori-bottom-top">
        <div className="header-category">
          <div className="header-category-dropdown">
            <div className="dropdown-box" onClick={toggleDropdown}>
              <div className="dropdown_text">{search}</div>
              <div className="dropdown_icon"></div>
            </div>
            {searchDrop && (
              <div className="dropdown-content">
                {columns.map(({ label, field }) => (
                  <div
                    key={field}
                    className="board-dropdown-content-item"
                    onClick={() => onSearchClick(label, field)}
                  >
                    {label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="admin-search">
          <input
            type="text"
            placeholder="검색어 입력"
            ref={searchInputRef}
            onKeyDown={onSearchKeyDownHandler}
          />
          <div className="admin-search-img" onClick={onCategorySearch}></div>
        </div>
      </div>
    </>
  );
};

export default SearchInputBox;
