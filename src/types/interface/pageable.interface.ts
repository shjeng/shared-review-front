export default interface Pageable<T> {
    content: T[];
    pageable:{
        pageNumber: number; // 현재 페이지
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        },
        offset: number,
        unpaged: boolean,
        paged: boolean;
    };
    pageSize: number; // 페이지 사이즈?
    totalElements: number,
    size: number; // 한번에 보여줄 데이터 수

}