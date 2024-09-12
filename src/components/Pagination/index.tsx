import React, { Dispatch, SetStateAction } from "react";
import "./style.css";

//      interface: 페이지네이션 컴포넌트 Properties       //
interface Props {
  currentPage: number;
  currentSection: number;
  countPerPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  totalSection: number;
  pageList: number[];
  pageClick: (page: number) => void;
}

//      component: 페이지네이션 컴포넌트      //
const Pagination = (props: Props) => {
  //          state: Properties         //
  const { currentPage, currentSection, totalSection, countPerPage, pageList } =
    props;
  const { setCurrentPage, pageClick } = props;

  //          event handler: 이전 클릭 이벤트 클릭       //
  const onPreviousClickHandler = () => {
    if (currentSection === 1) return;
    setCurrentPage((currentSection - 1) * countPerPage + 1);
  };
  //          event handler: 다음 클릭 이벤트 클릭       //
  const onNextClickHandler = () => {
    if (currentSection === totalSection) return;
    setCurrentPage(currentSection * countPerPage + 1);
  };
  //          render: 게시물 상세 하단 컴포넌트 렌더링    //
  return (
    <div id="pagination-wrapper">
      {currentSection > 1 && (
        <>
          <div className="pagination-change-link-box">
            <div className="icon-box-small">
              <div className="icon expand-left-icon"></div>
            </div>
            <div
              className="pagination-change-link-text"
              onClick={onPreviousClickHandler}
            >
              {"이전"}
            </div>
          </div>
          <div className="pagination-divider">{"|"}</div>
        </>
      )}
      {pageList.map((page) => page === currentPage ? (<div className="pagination-text-active">{page}</div>) : (
          <div className="pagination-text" onClick={() => pageClick(page)}>
            {page}
          </div>
        )
      )}
      {currentSection < totalSection && (
        <>
          <div className="pagination-divider">{"|"}</div>
          <div className="pagination-change-link-box">
            <div
              className="pagination-change-link-text"
              onClick={onNextClickHandler}
            >
              {"다음"}
            </div>
            <div className="icon-box-small">
              <div className="icon expand-right-icon"></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Pagination;
