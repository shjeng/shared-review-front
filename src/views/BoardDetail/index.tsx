import "./style.css";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  commentWrite,
  favoriteBoard,
  getBoardRequest,
  getComments,
  increaseViewCountRequest,
} from "../../apis";
import {
  CommentResponseDto,
  GetBoardDetailResponseDto,
  IncreaseViewCountResponseDto,
} from "../../apis/response/board";
import {
  BOARD_LIST,
  MAIN_PATH,
  USER_BOARD,
  USER_PAGE_PATH,
} from "../../constant";

import ResponseDto from "../../apis/response/response.dto";
import { ResponseCode } from "../../types/enum";
import loginUserStore from "../../store/login-user.store";
import { Comment, Favorite, Tag, User } from "../../types/interface";
import { ResponseUtil } from "../../utils";
import { CommentWriteRequestDto } from "../../apis/request/board";
import { useCookies } from "react-cookie";
import CommentItem from "../../components/CommentItem";
import Pagination from "../../components/Pagination";
import Pageable from "../../types/interface/pageable.interface";
import usePagination from "../../hooks/pagination.hook";
import { marked } from "marked";

const BoardDetail = () => {
  const countPerPage = 5;
  const { boardId } = useParams();
  const navigator = useNavigate();
  const { loginUser } = loginUserStore();
  const [cookies, setCookies] = useCookies();

  const commentRef = useRef<HTMLTextAreaElement | null>(null);

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [viewCount, setViewCount] = useState<number>(0);
  const [updateDateTime, setUpdateDateTime] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [commentCount, setCommentCount] = useState<number>(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [favoriteCount, setFavoriteCount] = useState<number>(0);
  const [writer, setWriter] = useState<User>();
  const [tags, setTags] = useState<Tag[]>([]);
  const [isMyPost, setIsMyPost] = useState<boolean>(false);
  const [favoriteCheck, setFavoriteCheck] = useState<boolean>(false);
  const [nicknameDrop, setNicknameDrop] = useState<boolean>(false);

  const [comment, setComment] = useState<string | null>();
  const [commentError, setCommentError] = useState<boolean>(false);

  const [pageable, setPageable] = useState<Pageable<any> | undefined>();
  const [contentMarkdown, setContentMarkdown] = useState<string>("");

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

  useEffect(() => {
    if (!boardId) return;
    if (effectFlag) {
      effectFlag = false;
      return;
    }
    increaseViewCountRequest(boardId).then(increaseViewCountResponse);
  }, [boardId]);
  const increaseViewCountResponse = (
    response: IncreaseViewCountResponseDto | ResponseDto | null
  ) => {
    const result = ResponseUtil(response);
    if (!result) {
      return;
    }
    const increaseViewCountResult = result as IncreaseViewCountResponseDto;
    setViewCount(increaseViewCountResult.viewCount);
  };

  //  처름 렌더링 될 때
  useEffect(() => {
    if (!boardId) {
      alert("잘못된 접근입니다.");
      navigator(MAIN_PATH());
      return;
    }
    getBoardRequest(boardId).then((response) => {
      console.log("Board Content:", response);
      getBoardResponse(response);
    });
  }, [boardId, loginUser]);
  const getBoardResponse = (
    responseBody: GetBoardDetailResponseDto | ResponseDto | null
  ) => {
    if (!responseBody) {
      alert("네트워크 오류");
      navigator(MAIN_PATH());
      return;
    }
    const { code } = responseBody;
    if (code === ResponseCode.NOT_EXISTED_BOARD) {
      alert("존재하지 않는 게시물입니다.");
    }
    if (code !== ResponseCode.SUCCESS) {
      navigator(MAIN_PATH());
    }
    const result = responseBody as GetBoardDetailResponseDto;
    setTitle(result.boardDetail.title);
    setContent(result.boardDetail.content);
    setViewCount(result.boardDetail.viewCount);
    setUpdateDateTime(result.boardDetail.updateDateTime);
    setCategory(result.boardDetail.category.categoryName);
    setComments(result.comments.content);
    setFavorites(result.favorites);
    const fCheck =
      result.favorites.findIndex(
        (favorite) => favorite.userEmail === loginUser?.email
      ) !== -1;
    setFavoriteCheck(fCheck);
    setWriter(result.user);
    setTags(result.tags);
    setTotalCount(result.comments.totalElements);
    setCountPerItem(result.comments.size);
    setCurrentPage(result.comments.pageable.pageNumber + 1);
    setCommentCount(result.comments.totalElements);
    setFavoriteCount(result.favorites.length);
    if (result.user.email === loginUser?.email) {
      setIsMyPost(true);
    }

    setContentMarkdown(result.boardDetail.content);
  };

  // 닉네임 클릭 이벤트
  const writerClickEvent = () => {
    setNicknameDrop(!nicknameDrop);
  };
  const userInfo = () => {
    if (!writer) {
      return;
    }
    navigator(USER_PAGE_PATH(writer.email));
  };
  const userBoard = () => {
    if (!writer) {
      return;
    }
    navigator(USER_BOARD(writer.email));
  };

  const commentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setComment(value);
    setCommentError(false);
  };
  const commentSubmitBtnClick = () => {
    if (!comment) {
      setCommentError(true);
      return;
    }
    const requestBody: CommentWriteRequestDto = {
      boardId: boardId,
      content: comment,
    };
    setComment("");
    commentWrite(requestBody, cookies.accessToken).then(commentWriteResponse);
  };
  const commentWriteResponse = (
    response: CommentResponseDto | ResponseDto | null
  ) => {
    const result = ResponseUtil(response);
    if (!result) {
      return;
    }
    const commentWriteResponse = result as CommentResponseDto;
    console.log(result);
    setComments(commentWriteResponse.comments.content);
    setCurrentPage(commentWriteResponse.comments.pageable.pageNumber + 1);
    setTotalCount(commentWriteResponse.comments.totalElements);
    setCommentCount(commentWriteResponse.comments.totalElements);
  };
  //      event handler: 게시글 목록 클릭 이벤트 처리 함수       //
  const onBoardListClickHandler = () => {
    navigator(BOARD_LIST());
  };

  const pageButtonClick = (page: number) => {
    if (!boardId) {
      return;
    }
    getComments(page - 1, boardId).then(pageButtonClickResponse);
  };
  const pageButtonClickResponse = (
    response: CommentResponseDto | ResponseDto | null
  ) => {
    const result = ResponseUtil(response);
    if (!result) {
      return;
    }
    const commentResponse = result as CommentResponseDto;
    setComments(commentResponse.comments.content);
    setCurrentPage(commentResponse.comments.pageable.pageNumber + 1);
    setTotalCount(commentResponse.comments.totalElements);
  };

  let effectFlag = true;

  const favoriteBtnClick = () => {
    if (!boardId) {
      return;
    }
    if (!loginUser) {
      alert("로그인이 필요합니다.");
      return;
    }
    const requestDto = { favoriteCheck: favoriteCheck };
    favoriteBoard(boardId, requestDto, cookies.accessToken).then(
      favoriteBtnClickResponse
    );
  };
  const favoriteBtnClickResponse = (
    response: GetBoardDetailResponseDto | ResponseDto | null
  ) => {
    // response
    if (!ResponseUtil(response)) {
      return;
    }
    const result = response as GetBoardDetailResponseDto;
    // alert(result.favoriteCount);
    setFavoriteCheck(result.favoriteCheck);
    setFavoriteCount(result.favoriteCount);
  };
  const deleteComment = () => {
    pageButtonClick(currentPage);
  };

  const [renderedContent, setRenderedContent] = useState<string>("");

  // 본문(마크다운 형식)의 데이터를 html형식으로 바꿔줌
  useEffect(() => {
    const renderMarkdown = async () => {
      const rendered = await marked(contentMarkdown);
      setRenderedContent(rendered);
    };

    renderMarkdown();
  }, [contentMarkdown]);

  //
  const renderContent = () => {
    return { __html: renderedContent };
  };

  return (
    <div id="board-detail-wrap">
      <div className="board-detail-content">
        <div className="board-detail-top">
          <div className="board-detail-top-left">
            <div className="board-detail-title">{title}</div>
            <div className="board-detail-category">{category}</div>
          </div>

          {/* <div className="board-detail-mid-left"> */}
          <div className="board-detail-top-right" onClick={writerClickEvent}>
            {writer?.profileImage ? (
              <div className="board-detail-profile-img-box">
                <div
                  className="profile-img"
                  style={{ backgroundImage: `url(${writer.profileImage})` }}
                ></div>
              </div>
            ) : (
              <div className="board-detail-profile-img"></div>
            )}
            <div className="board-detail-profile-name">{writer?.nickname}</div>
            {nicknameDrop && (
              <>
                <div className="user-information-box">
                  <div
                    className="user-information-box-child"
                    onClick={userBoard}
                  >
                    유저 글
                  </div>
                  <div
                    className="user-information-box-child"
                    onClick={userInfo}
                  >
                    유저 정보
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="board-detail-mid">
          <div
            className="board-detail"
            dangerouslySetInnerHTML={renderContent()}
          ></div>
          <div className="border-detail-tag">
            {tags.map((tag) => (
              <div className="border-detail-tag-item" onClick={() => {}}>
                #{tag.name}
              </div>
            ))}
          </div>

          <div className="board-detail-info">
            <div className="board-detail-info-left">
              <div className="board-detail-create-date">
                {new Date(updateDateTime).toLocaleString()}
                {/* {updateDateTime} */}
              </div>
            </div>
            <div className="board-detail-info-right">
              <div className="board-detail-views-icon"></div>
              <div className="board-detail-views-count">{viewCount}</div>
            </div>
          </div>
        </div>

        <div className="board-detail-bottom">
          <div className="board-detail-interactions">
            <div className="board-detail-like">
              {favoriteCheck ? (
                <div
                  className="board-deatil-like-on-icon"
                  onClick={favoriteBtnClick}
                ></div>
              ) : (
                <div
                  className="board-deatil-like-off-icon"
                  onClick={favoriteBtnClick}
                ></div>
              )}
              <div className="board-deatil-like-count">{favoriteCount}</div>
            </div>

            <div className="board-detail-comment">
              <div className="board-detail-comment-icon"></div>
              <div className="board-detail-comment-count">{commentCount}</div>
            </div>
          </div>

          {loginUser && (
            <>
              <div className="board-detail-comment-write">
                <div className="board-detail-comment-write-box">
                  <textarea
                    className={
                      "board-detail-comment-textarea" +
                      (commentError ? " error" : "")
                    }
                    placeholder="댓글을 입력해주세요."
                    maxLength={255}
                    rows={4}
                    ref={commentRef}
                    onChange={commentChange}
                    value={comment ? comment : ""}
                  />

                  <div className="board-detail-comment-write-bottom-box">
                    {comment ? (
                      <div
                        className="comment-write-btn-on"
                        onClick={commentSubmitBtnClick}
                      ></div>
                    ) : (
                      <div
                        className="comment-write-btn-off"
                        onClick={commentSubmitBtnClick}
                      ></div>
                    )}
                  </div>
                </div>
              </div>
              {commentError && (
                <div className={"error-msg"}>댓글을 입력해주세요.</div>
              )}
            </>
          )}

          <div className="board-detail-comment-list">
            {comments.map((comment) => (
              <>
                <CommentItem
                  comment={comment}
                  reRenderComment={deleteComment}
                />
              </>
            ))}
          </div>
          {comments.length !== 0 && (
            <Pagination
              currentPage={currentPage}
              currentSection={currentSection}
              setCurrentPage={setCurrentPage}
              totalSection={totalSection}
              countPerPage={countPerPage}
              pageList={pageList}
              pageClick={pageButtonClick}
            ></Pagination>
          )}
        </div>
      </div>
      <div className="board-list-btn-container">
        {isMyPost && (
          <>
            <div
              className="del-btn board-list-btn"
              onClick={onBoardListClickHandler}
            >
              게시글 삭제
            </div>
            <div
              className="update-btn board-list-btn"
              onClick={onBoardListClickHandler}
            >
              게시글 수정
            </div>
          </>
        )}
        <div className="board-list-btn" onClick={onBoardListClickHandler}>
          목록으로
        </div>
      </div>
    </div>
  );
};

export default BoardDetail;
