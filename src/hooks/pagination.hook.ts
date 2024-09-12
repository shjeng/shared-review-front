import {useEffect, useState} from "react";

// countPerPage : 한페이지당 몇개 보여줄지
const usePagination = (countPerPage: number) => {
    //  state: 전체 item 수    //
    const [countPerItem, setCountPerItem] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [currentSection, setCurrentSection] = useState<number>(0);
    const [totalSection, setTotalSection] = useState<number>(0);
    const [startPage, setStartPage] = useState<number>(0);
    const [endPage, setEndPage] = useState<number>(1);
    const [pageList, setPageList] = useState<number[]>([]);
    const [totalPage, setTotalPage] = useState<number>(0);
    //  state: 현재 페이지 번호 상태   //
    // 지금 몇번째 페이지에 있는지에 대한걸 저장할 상태
    /*
    *
    * */

    const setSectionFunction = () => {
        const CURRENT_SECTION = Math.floor(currentPage / countPerPage) + 1;
        setCurrentSection(CURRENT_SECTION);
    }
    const setStartAndEnd = () => {
        const FRIST_PAGE = countPerPage * (currentSection - 1) + 1;
        setStartPage(FRIST_PAGE);
    }
    const totalCountFunction = () => {
        const TOTAL_PAGE = Math.ceil(totalCount / countPerItem);
        const END_PAGE = Math.min(countPerPage * currentSection, TOTAL_PAGE);
        setEndPage(END_PAGE);
        setTotalPage(TOTAL_PAGE);
    }
    const setPageNumber = () => {
        const pages = Array.from({length: endPage - startPage + 1}, (_, index) => startPage + index);
        setPageList(pages);
    }
    useEffect(setSectionFunction, [currentPage]);
    useEffect(setStartAndEnd, [currentSection]);
    useEffect(totalCountFunction, [totalCount]);
    useEffect(setPageNumber,[totalPage]);
    return {
        startPage,
        endPage,
        currentPage,
        currentSection,
        totalSection,
        setCurrentPage,
        setCurrentSection,
        setTotalCount,
        setCountPerItem,
        pageList,

    }

}


export default usePagination;
