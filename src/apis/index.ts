import axios from "axios";
import SignInRequestDto from "./request/auth/sign-in-request.dto";
import SignInResponseDto from "./response/auth/sign-in.response.dto";
import ResponseDto from "./response/response.dto";
import { SignUpRequestDto } from "./request/auth";
import SignUpResponseDto from "./response/auth/sign-up-response.dto";
import { NicknameDupleChkResponseDto } from "./response/auth";
import { GetUserResponseDto } from "./response/user";
import { BoardWriteRequestDto, CommentWriteRequestDto } from "./request/board";
import {
  BoardListResponse,
  CommentResponseDto,
  GetCategorysResponseDto,
  PostBoardWriteResponseDto,
} from "./response/board";
import GetBoardDetailResponseDto from "./response/board/get-board-detail.response.dto";
import GetAdminCategorysResponseDto from "./response/board/get-admin-categorys-response.dto";
import GetAdminBoardResponseDto from "./response/board/get-admin-board-list-response.dto";
import GetUserListResponseDto from "./response/user/get-user-list-response.dto";
import IncreaseViewCountResponseDto from "./response/board/increase-view-count.response.dto";
import CategoryWriteRequestDto from "./request/board/category-write-reqeust.dto";
import { FileResponseDto } from "./response/file";
import { Board } from "../types/interface";
import Pageable from "../types/interface/pageable.interface";

// const DOMAIN = "http://54.180.152.3:8080";
const DOMAIN = process.env.REACT_APP_API_DOMAIN;
// const DOMAIN = "http://127.0.0.1:8080";
const API_DOMAIN = `${DOMAIN}/api`;
export const BACK_DOMAIN = () => DOMAIN;
const authorication = (accessToken: string) => {
  return { headers: { Authorization: `Bearer ${accessToken}` } };
};
const pageParam = (page: number) => {
  return { params: { page: page } };
};
const tokenAndPageConfig = {
  token: (accessToken: string) => {
    return authorication(accessToken);
  },
  page: (page: number) => {
    return pageParam(page);
  },
  multipart: () => {
    return { headers: { "Content-Type": "multipart/form-data" } };
  },
  multipartAndToken: (accessToken: string) => {
    return {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    };
  },
};

const AUTH_NUMBER_URL = () => `${API_DOMAIN}/auth/sign-up/verify-email`;

// ===  Get  ===
const SEARCH_URL = () => `${API_DOMAIN}/board/search`;
export const searchRequest = async (params: {}) => {
  return await axios
    .get(SEARCH_URL(), { params: { ...params } })
    .then((response) => {
      const responseBody: Pageable<Board> = response.data;
      return responseBody;
    })
    .catch((error) => {
      return errorResponse(error);
    });
};

// 로그인 요청
const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;
export const signInRequest = async (requestBody: SignInRequestDto) => {
  // await : 응답이 올 때까지 기다리겠다., requestBody: 어떤 데이터를 넣을 것인지
  const result = await axios
    .post(SIGN_IN_URL(), requestBody) // 서버에 post요청
    .then((response) => {
      const responseBody: SignInResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      if (!error.response.data) return null;
      const responseBody: ResponseDto = error.response.data;
      return responseBody;
    });
  return result;
};

// 로그인 회원 정보 가져오기
const GET_MY_INFO = () => `${API_DOMAIN}/user/get-login-user`;
export const getMyInfo = async (accessToken: string) => {
  const result = await axios
    .get(GET_MY_INFO(), authorication(accessToken))
    .then((response) => {
      const responseBody: GetUserResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      if (!error) return null;
      const responseBody: ResponseDto = error.response.data;
      return responseBody;
    });
  return result;
};
const GET_USER_URL = (userEmail: string) =>
  `${API_DOMAIN}/user/get-login-user/${userEmail}`;
export const getLoginUser = async (userEmail: string) => {
  const result = await axios
    .get(GET_USER_URL(userEmail))
    .then((response) => {
      const responseBody: GetUserResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      if (!error) return null;
      const responseBody: ResponseDto = error.response.data;
      return responseBody;
    });
  return result;
};

// 닉네임 중복 확인
const NICKNAME_DUPL_CHK = (nickname: string) =>
  `${API_DOMAIN}/auth/nickname-chk?nickname=${nickname}`;
export const nicknameDuplChkRequest = async (nickname: string) => {
  const result = await axios
    .get(NICKNAME_DUPL_CHK(nickname))
    .then((response) => {
      const responseBody: NicknameDupleChkResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      return errorResponse(error);
    });
  return result;
};

// 비밀번호 확인
const PASSWORD_CHECK_URL = () => `${API_DOMAIN}/user/password-check`;
export const passwordCheckRequest = async (
  accessToken: string,
  password: string
) => {
  return await axios
    .post(
      PASSWORD_CHECK_URL(),
      { password: password },
      { ...tokenAndPageConfig.token(accessToken) }
    )
    .then((response) => {
      // console.log(
      //   "서버에서 받아온 response값 : ",
      //   JSON.stringify(response, null, 2)
      // );
      return response.data as ResponseDto;
    })
    .catch((error) => {
      return errorResponse(error);
    });
};
// 회원정보 수정
const EDIT_USER_INFO = () => `${API_DOMAIN}/user`;
export const editUser = async (
  accessToken: string,
  requestBody: SignUpRequestDto
) => {
  return await axios
    .patch(EDIT_USER_INFO(), requestBody, {
      ...tokenAndPageConfig.token(accessToken),
    })
    .then((response) => {
      return response.data as ResponseDto;
    })
    .catch((error) => {
      return errorResponse(error);
    });
};
// 카테고리 목록 불러오기
const GET_CATEGORYS = () => `${API_DOMAIN}/board/get-categorys`;
export const getCategorysReqeust = async () => {
  const result = await axios
    .get(GET_CATEGORYS())
    .then((response) => {
      const responseBody: GetCategorysResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      if (!error.response.data) return null;
      return errorResponse(error);
    });
  return result;
};
// 카테고리 게시물 목록 가져오기
const GET_CATEGORY_BOARDS = (categoryId: bigint | string) =>
  `${API_DOMAIN}/board/category/${categoryId}`;
export const getCategoryBoards = (categoryId: bigint | string) => {
  return axios
    .get(GET_CATEGORY_BOARDS(categoryId))
    .then((response) => {
      return response.data as BoardListResponse;
    })
    .catch((error) => {
      return errorResponse(error);
    });
};
// 관리자 페이지 카테고리 목록 불러오기
const GET_ADMIN_CATEGORYS = () => `${API_DOMAIN}/board/admin/get-categorys`;
export const getAdminCategorysReqeust = async () => {
  const result = await axios
    .get(GET_ADMIN_CATEGORYS())
    .then((response) => {
      const responseBody: GetAdminCategorysResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      if (!error.response.data) return null;
      const responseBody: ResponseDto = error.response.data;
      return responseBody;
    });
  return result;
};

// 관리자 페이지 카테고리 검색
const GET_ADMIN_CATEGORYS_SEARCH = (searchValue: string, inputValue: string) =>
  `${API_DOMAIN}/board/admin/get-category/${searchValue}/${inputValue}`;
export const getAdminCategorySearchReqeust = async (
  searchValue: string,
  inputValue: string
) => {
  const result = await axios
    .get(GET_ADMIN_CATEGORYS_SEARCH(searchValue, inputValue))
    .then((response) => {
      const responseBody: GetAdminCategorysResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      if (!error.response.data) return null;
      const responseBody: ResponseDto = error.response.data;
      return responseBody;
    });
  return result;
};

// 게시글 불러오기
const GET_BOARD = (boardId: bigint | string) =>
  `${API_DOMAIN}/board/${boardId}`;
export const getBoardRequest = async (boardId: string | bigint) => {
  const result = await axios
    .get(GET_BOARD(boardId))
    .then((response) => {
      const responseBody: GetBoardDetailResponseDto = response.data;
      // console.log(
      //   "서버에서 받아온 responseBody값 : ",
      //   JSON.stringify(responseBody, null, 2)
      // );
      return responseBody;
    })
    .catch((error) => {
      if (!error) return null;
      const responseBody: ResponseDto = error.response.data;
      return responseBody;
    });
  return result;
};
// 최신 게시물 불러오기
const GET_BOARD_LATEST_LIST = () => `${API_DOMAIN}/board/latest`;
export const getBoardLatestList = async () => {
  const result = await axios
    .get(GET_BOARD_LATEST_LIST())
    .then((response) => {
      const responseBody: BoardListResponse = response.data;
      return responseBody;
    })
    .catch((error) => {
      return errorResponse(error);
    });
  return result;
};
const GET_FAVORITE_BOARD_TOP3 = () => `${API_DOMAIN}/board/favoriteTop3`;
export const getFavoriteBoardTop3 = async (date: string) => {
  const result = await axios
    .get(GET_FAVORITE_BOARD_TOP3(), { params: { dateCondition: date } })
    .then((response) => {
      const responseBody: BoardListResponse = response.data;
      return responseBody;
    })
    .catch((error) => {
      return errorResponse(error);
    });
  return result;
};

// 관리자 페이지(회원목록) - 회원 리스트 요청
const USER_LIST_URL = () => `${API_DOMAIN}/user/get-user-list`;
export const getUserList = async () => {
  const result = await axios
    .get(USER_LIST_URL())
    .then((response) => {
      const responseBody: GetUserListResponseDto = response.data;
      console.log("responseBody값 : ", JSON.stringify(responseBody, null, 2));
      return responseBody;
    })
    .catch((error) => {
      return errorResponse(error);
    });
  return result;
};

// 관리자 페이지 유저 검색
const GET_ADMIN_USER_SEARCH = (searchValue: string, inputValue: string) =>
  `${API_DOMAIN}/user/get-user-list/${searchValue}/${inputValue}`;
export const getAdminUserSearchReqeust = async (
  searchValue: string,
  inputValue: string
) => {
  const result = await axios
    .get(GET_ADMIN_USER_SEARCH(searchValue, inputValue))
    .then((response) => {
      const responseBody: GetUserListResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      if (!error.response.data) return null;
      const responseBody: ResponseDto = error.response.data;
      return responseBody;
    });
  return result;
};

// 관리자 페이지(게시글목록) - 게시글 목록 요청
const ADMIN_BOARD_LIST = () => `${API_DOMAIN}/board/admin/board-list`;
export const getAdminBoardListRequest = async () => {
  const result = await axios
    .get(ADMIN_BOARD_LIST())
    .then((response) => {
      const responseBody: GetAdminBoardResponseDto = response.data;
      console.log(
        "responseBody 구조 확인 : ",
        JSON.stringify(responseBody, null, 2)
      ); // 객체의 구조를 확인
      return responseBody;
    })
    .catch((error) => {
      return errorResponse(error);
    });
  return result;
};

// 관리자 페이지 게시글 검색
const GET_ADMIN_BOARD_SEARCH = (searchValue: string, inputValue: string) =>
  `${API_DOMAIN}/board/admin/board-list/${searchValue}/${inputValue}`;
export const getAdminBoardSearchReqeust = async (
  searchValue: string,
  inputValue: string
) => {
  const result = await axios
    .get(GET_ADMIN_BOARD_SEARCH(searchValue, inputValue))
    .then((response) => {
      const responseBody: GetAdminBoardResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      if (!error.response.data) return null;
      const responseBody: ResponseDto = error.response.data;
      return responseBody;
    });
  return result;
};

// 유저 페이지
const INCREASE_VIEW_COUNT_REQUEST = (boardId: string | bigint) =>
  `${API_DOMAIN}/board/increase-view-count/${boardId}`;
export const increaseViewCountRequest = async (boardId: string | bigint) => {
  return await axios
    .get(INCREASE_VIEW_COUNT_REQUEST(boardId))
    .then((response) => {
      const responseBody: IncreaseViewCountResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      return errorResponse(error);
    });
};
// 유저 게시물 가져오기
const USER_BOARD = (userEmail: string) =>
  `${API_DOMAIN}/user/${userEmail}/board`;
// const USER_BOARD = (userEmail: string) => `${API_DOMAIN}/user/${userEmail}`;
export const getUserBoard = async (userEmail: string, currentPage: number) => {
  return await axios
    .get(USER_BOARD(userEmail), pageParam(currentPage))
    .then((response) => {
      return response.data as BoardListResponse;
    })
    .catch((error) => {
      return errorResponse(error);
    });
};
// 유저 정보 가져오기
const USER_INFO = (userEmail: string) => `${API_DOMAIN}/user/${userEmail}`;
export const getUserInfoRequest = async (userEmail: string) => {
  return await axios
    .get(USER_INFO(userEmail))
    .then((response) => {
      return response.data as GetUserResponseDto;
    })
    .catch((error) => {
      return errorResponse(error);
    });
};

// ===  post  ==== //
// 회원가입 요청
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;
export const signUpRequest = async (requestBody: SignUpRequestDto) => {
  const result = await axios
    .post(SIGN_UP_URL(), requestBody)
    .then((response) => {
      const responseBody: SignUpResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      if (!error.response.data) return null;
      const responseBody: ResponseDto = error.response.data;
      return responseBody;
    });
  return result;
};
// 인증 이메일 발송
const CHECK_MAIL_URL = () => `${API_DOMAIN}/auth/sign-up/Checkmail`;
export const sendEmailRequest = async (clientEmail: string) => {
  console.log("넘어온 데이터" + clientEmail);
  try {
    const response = await axios.post(CHECK_MAIL_URL(), {
      u_mail: clientEmail,
    });
    alert("인증번호가 발송되었습니다.");
    console.log("성공", response.data);
    return true;
  } catch (error) {
    alert("인증번호 발송에 실패하였습니다.");
    console.error("실패", error);
  }
};
// 인증 번호 확인
export const sendEmailAuthNumber = async (emailAuthNumber: string) => {
  // 인증번호 확인 버튼 클릭 이벤트 처리 함수
  try {
    const response = await axios.post(AUTH_NUMBER_URL(), {
      authNumber: emailAuthNumber,
    });
    alert("이메일 인증에 성공했습니다.");
    console.log("성공", response.data);
    return true;
  } catch (error) {
    alert("인증번호가 일치하지 않습니다.");
    console.error("실패", error);
  }
};
// 게시글 작성
const POST_BOARD = () => `${API_DOMAIN}/board/write`;
export const postBoard = async (
  requestBody: BoardWriteRequestDto,
  accessToken: string
) => {
  const result = await axios
    .post(POST_BOARD(), requestBody, authorication(accessToken))
    .then((response) => {
      const responseBody: PostBoardWriteResponseDto = response.data;
      console.log("responseBody : ", responseBody);

      return responseBody;
    })
    .catch((error) => {
      if (!error) return null;
      const responseBody: ResponseDto = error.response.data;
      return responseBody;
    });
  return result;
};
// 댓글 작성
const COMMENT_WRITE = () => `${API_DOMAIN}/board/comment`;
export const commentWrite = async (
  requestBody: CommentWriteRequestDto,
  accessToken: string
) => {
  const result = await axios
    .post(COMMENT_WRITE(), requestBody, {
      ...tokenAndPageConfig.token(accessToken), // token 함수를 호출하여 반환된 객체를 전개
      ...tokenAndPageConfig.page(0),
    })
    // .post(COMMENT_WRITE(), requestBody, authorication(accessToken))
    .then((response) => {
      const responseBody: CommentResponseDto = response.data;

      JSON.stringify("받아온 데이터 : " + responseBody, null, 2);
      return responseBody;
    })
    .catch((error) => {
      return errorResponse(error);
    });
  return result;
};
// 댓글 불러오기
const GET_COMMENTS = (boardId: bigint | string) =>
  `${API_DOMAIN}/board/comments/${boardId}`;
export const getComments = async (page: number, boardId: string | bigint) => {
  const result = await axios
    .get(GET_COMMENTS(boardId), pageParam(page))
    .then((response) => {
      const responseBody: CommentResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      return errorResponse(error);
    });
  return result;
};

// patch
const FAVORITE = (boardId: string | bigint) =>
  `${API_DOMAIN}/board/favorite/${boardId}`;
export const favoriteBoard = async (
  boardId: string | bigint,
  requestDto: {
    favoriteCheck: boolean;
  },
  accessToken: string
) => {
  const result = await axios
    .patch(FAVORITE(boardId), requestDto, tokenAndPageConfig.token(accessToken))
    .then((response) => {
      JSON.stringify("받아온 데이터 : " + response, null, 2);
      console.log(response);

      const responseBody: GetBoardDetailResponseDto = response.data;

      return responseBody;
    })
    .catch((error) => {
      return errorResponse(error);
    });
  return result;
};

// delete
const DELETE_BOARD = (boardId: string | bigint) =>
  `${API_DOMAIN}/board/${boardId}`;
export const deleteBoard = async (
  boardId: string | bigint,
  accessToken: string
) => {
  const result = await axios
    .delete(DELETE_BOARD(boardId), { ...tokenAndPageConfig.token(accessToken) })
    .then((response) => {
      const responseBody: ResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      return errorResponse(error);
    });
  return result;
};
const DELETE_COMMENT = (commentId: bigint | string) =>
  `${API_DOMAIN}/board/comment/${commentId}`;
export const deleteComment = async (
  commentId: bigint | string,
  accessToken: string
) => {
  const result = await axios
    .delete(DELETE_COMMENT(commentId), {
      ...tokenAndPageConfig.token(accessToken),
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return errorResponse(error);
    });
  return result;
};

const DELETE_CATEGORY = (categoryId: string | bigint) =>
  `${API_DOMAIN}/board/category/${categoryId}`;
export const deleteCategory = async (
  categoryId: string | bigint,
  accessToken: string
) => {
  const result = await axios
    .delete(DELETE_CATEGORY(categoryId), {
      ...tokenAndPageConfig.token(accessToken),
    })
    .then((response) => {
      const responseBody: ResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      return errorResponse(error);
    });
  return result;
};

// 관리자페이지 카테고리 추가 기능
const CATEGORY_ADD = () => `${API_DOMAIN}/board/admin/category/create`;
// const CATEGORY_ADD = () => `${API_DOMAIN}/board/admin/category-add`;
export const postCategotyAdd = async (
  responseBody: CategoryWriteRequestDto,
  accessToken: string
) => {
  const result = await axios
    .post(CATEGORY_ADD(), responseBody, authorication(accessToken))
    .then((response) => {
      const responseBody = response.data;
      return responseBody;
    })
    .catch((error) => {
      if (!error) return null;
      const responseBody: ResponseDto = error.response.data;
      return responseBody;
    });
  return result;
};

// 로그아웃 요청
const SIGN_OUT_URL = () => `${API_DOMAIN}/auth/sign-out`;
export const signOutRequest = async (token: string) => {
  const result = await axios
    .post(SIGN_OUT_URL(), null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      const responseBody: ResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      if (!error.response.data) return null;
      const responseBody: ResponseDto = error.response.data;
      return responseBody;
    });

  return result;
};

const errorResponse = (error: null | any) => {
  if (!error) return null;
  const responseBody: ResponseDto = error.response.data;
  return responseBody;
};

const TOKEN_URL = () => `${API_DOMAIN}/auth/validate-token`;
export const checkAccessTokenValidity = async (
  accessToken: string
  // refreshToken: string
) => {
  const result = await axios
    .post(
      TOKEN_URL(),
      {},
      {
        headers: {
          Authorization: accessToken,
          // refresh: refreshToken,
        },
      }
    )
    .then((response) => {
      const responseBody = response.data;
      return responseBody;
    })
    .catch((error) => {
      if (!error) return null;
      const responseBody: ResponseDto = error.response.data;
      return responseBody;
    });
  return result;
};

const REFRESH_ACCESS_TOKEN_URL = () => `${API_DOMAIN}/auth/refreshAccessToken`;
export const refreshAccessToken = async (refreshToken: string) => {
  const result = await axios
    .post(
      REFRESH_ACCESS_TOKEN_URL(),
      {},
      {
        headers: {
          Authorization: refreshToken,
        },
      }
    )
    .then((response) => {
      const responseBody = response.data;
      return responseBody;
    })
    .catch((error) => {
      if (!error) return null;
      const responseBody: ResponseDto = error.response.data;
      return responseBody;
    });
  return result;
};

// 토큰o 비밀번호 변경
const UPDATE_PASSWORD_URL = () => `${API_DOMAIN}/user/update-password`;
export const updatePassword = async (
  accessToken: string,
  password: string,
  modifyPassword: string
) => {
  return await axios
    .post(
      UPDATE_PASSWORD_URL(),
      { password: password, modifyPassword: modifyPassword },
      { ...tokenAndPageConfig.token(accessToken) }
    )
    .then((response) => {
      return response.data as ResponseDto;
    })
    .catch((error) => {
      return errorResponse(error);
    });
};

// 닉네임 변경
const UPDATE_NICKNAME_URL = () => `${API_DOMAIN}/user/update-nickname`;
export const updateNickname = async (
  accessToken: string,
  password: string,
  modifyNickname: string
) => {
  return await axios
    .post(
      UPDATE_NICKNAME_URL(),
      { password: password, modifyNickname: modifyNickname },
      { ...tokenAndPageConfig.token(accessToken) }
    )
    .then((response) => {
      return response.data as ResponseDto;
    })
    .catch((error) => {
      return errorResponse(error);
    });
};

// 회원탈퇴
const EMAIL_CHECK_URL = () => `${API_DOMAIN}/user/delete-user`;
export const deleteUserRequest = async (
  accessToken: string,
  deleteUserEmail: string
) => {
  return await axios
    .post(
      EMAIL_CHECK_URL(),
      { deleteUserEmail: deleteUserEmail },
      { ...tokenAndPageConfig.token(accessToken) }
    )
    .then((response) => {
      return response.data as ResponseDto;
    })
    .catch((error) => {
      return errorResponse(error);
    });
};

// 토큰x 비밀번호 변경
const NT_UPDATE_PASSWORD_URL = () => `${API_DOMAIN}/user/nt-update-password`;
export const nonTokenUpdatePassword = async (
  userEmail: string,
  modifyPassword: string
) => {
  return await axios
    .post(NT_UPDATE_PASSWORD_URL(), {
      userEmail: userEmail,
      modifyPassword: modifyPassword,
    })
    .then((response) => {
      return response.data as ResponseDto;
    })
    .catch((error) => {
      return errorResponse(error);
    });
};
