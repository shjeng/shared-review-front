import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import "./style.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteUserRequest,
  editUser,
  getLoginUser,
  getMyInfo,
  nicknameDuplChkRequest,
  passwordCheckRequest,
  saveTempImage,
  updateNickname,
  updatePassword,
} from "../../apis";
import { GetUserResponseDto } from "../../apis/response/user";
import ResponseDto from "../../apis/response/response.dto";
import { convertUrlToFile, ResponseUtil } from "../../utils";
import { User } from "../../types/interface";
import InputBox from "../../components/InputBox";
import { NicknameDupleChkResponseDto } from "../../apis/response/auth";
import { useCookies } from "react-cookie";
import { FileResponseDto } from "../../apis/response/file";
import { SignUpRequestDto } from "../../apis/request/auth";
import { useLoginUserStore } from "../../store";
import { MAIN_PATH } from "../../constant";

const UserPage = () => {
  const [authSuccess, setAuthSuccess] = useState<boolean>(false);
  type PageType =
    | "index"
    | "edit"
    | "passwordModify"
    | "nickNameModif"
    | "deleteUser";
  const [currentPage, setCurrentPage] = useState<PageType>("index");
  const { userEmail } = useParams();
  const [profileImage, setProfileImage] = useState<string>("");
  const [file, setFile] = useState<File | null>();
  const [userInfo, setUserInfo] = useState<User>();
  const [nickname, setNickname] = useState<string>("");
  const [originNickname, setOriginNickname] = useState<string>("");

  useEffect(() => {
    if (!userEmail) {
      return;
    }
    getLoginUser(userEmail).then(getMyInfoResponse);
    (async () => {
      const file = await convertUrlToFile(profileImage);
      setFile(file);
    })();
  }, [userEmail, currentPage]);
  const getMyInfoResponse = (
    response: GetUserResponseDto | ResponseDto | null
  ) => {
    if (!ResponseUtil(response)) {
      return;
    }
    const result = response as GetUserResponseDto;
    setUserInfo(result.userDto);
    setNickname(result.userDto.nickname);
    setOriginNickname(result.userDto.nickname);
    setProfileImage(result.userDto.profileImage);
  };
  const [cookies, setCookies, removeCookie] = useCookies();

  const EditPage = () => {
    const { setLoginUser } = useLoginUserStore();

    const navigate = useNavigate();
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const passwordCheckRef = useRef<HTMLInputElement | null>(null);
    const nicknameRef = useRef<HTMLInputElement | null>(null);
    const profileImageRef = useRef<HTMLInputElement | null>(null);

    const [nicknameError, setNicknameError] = useState<boolean>(false);
    const [nicknameErrorMessage, setNicknameErrorMessage] =
      useState<string>("");
    const [nicknameDupleCheck, setNicknameDupleCheck] =
      useState<boolean>(false);
    const [verifiedNickname, setVerifiedNickname] = useState<string>("");

    const [password, setPassword] = useState<string>("");
    const [passwordError, setPasswordError] = useState<boolean>(false);
    const [passwordErrorMessage, setPasswordErrorMessage] =
      useState<string>("");

    const [passwordCheck, setPasswordCheck] = useState<string>("");
    const [passwordCheckError, setPasswordCheckError] =
      useState<boolean>(false);
    const [passwordCheckErrorMessage, setPasswordCheckErrorMessage] =
      useState<string>("");

    const editImageIconClick = () => {
      if (!profileImageRef.current) {
        return;
      }
      profileImageRef.current.click();
    };
    const profileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }
      const url = URL.createObjectURL(file);
      setProfileImage(url);
      setFile(file);
    };
    const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setNickname(value);
      setNicknameError(false);
      setNicknameErrorMessage("");
      setNicknameDupleCheck(false);
    };
    // const nicknameDuplChk = () => {
    //   if (nickname.length === 0) return;
    //   nicknameDuplChkRequest(nickname).then(nicknameDuplChkResponse);
    // }

    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setPassword(value);
      setPasswordError(false);
      setPasswordErrorMessage("");
    };
    const onPasswordCheckChangeHandler = (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      const { value } = event.target;
      setPasswordCheck(value);
      setPasswordCheckError(false);
      setPasswordCheckErrorMessage("");
    };
    const editInfo = () => {
      let error = false;
      if (!nickname) {
        setNicknameError(true);
        setNicknameErrorMessage("닉네임을 입력해주세요.");
        return;
      }
      if (password.length === 0) {
        setPasswordError(true);
        setPasswordErrorMessage("비밀번호를 입력해주세요.");
        error = true;
      }
      if (passwordCheck !== password || !passwordCheck) {
        setPasswordCheckError(true);
        setPasswordCheckErrorMessage("비밀번호와 일치하지 않습니다.");
        error = true;
      }
      if (error) {
        return;
      }
      if (nickname !== originNickname) {
        nicknameDuplChkRequest(nickname).then(nicknameDuplChkResponse);
        if (!nicknameDupleCheck) {
          return;
        }
      }
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        saveTempImage(cookies.accessToken, formData).then(
          changeProfileImgResponse
        );
      } else {
      }
    };
    const nicknameDuplChkResponse = (
      responseBody: NicknameDupleChkResponseDto | ResponseDto | null
    ) => {
      setVerifiedNickname("");
      ResponseUtil(responseBody);
      const { code } = responseBody as ResponseDto;
      if (code === "DN") {
        setNicknameError(true);
        setNicknameErrorMessage("이미 존재하는 닉네임입니다.");
      }
      const getResponse = responseBody as NicknameDupleChkResponseDto;
      setVerifiedNickname(getResponse.nickname);
      setNicknameDupleCheck(true);
    };

    const changeProfileImgResponse = (
      responseBody: FileResponseDto | ResponseDto | null
    ) => {
      if (!responseBody) {
        alert("서버의 응답이 없습니다.");
        return;
      }
      const { code } = responseBody as ResponseDto;
      if (code) {
        alert("사진이 업로드가 되지 않았습니다.");
        return;
      }
      const result = responseBody as FileResponseDto;
      const requestBody: SignUpRequestDto = {
        email: "",
        profileImage: result.savedName,
        nickname: verifiedNickname,
        password: password,
        passwordCheck: passwordCheck,
      };
      editUser(cookies.accessToken, requestBody).then(editUserResponse);
    };
    const editUserResponse = (response: ResponseDto | null) => {
      ResponseUtil(response);
      const result = response as ResponseDto;
      setAuthSuccess(false);
      getMyInfo(cookies.accessToken).then(getLoginUserResponse);
    };
    const getLoginUserResponse = (
      responseBody: GetUserResponseDto | ResponseDto | null
    ) => {
      ResponseUtil(responseBody);
      if (!responseBody) return;
      const { userDto } = responseBody as GetUserResponseDto;
      setLoginUser(userDto);
    };

    const passwordModifyPage = () => {
      setCurrentPage("passwordModify");
    };

    const nickNameModify = () => {
      setCurrentPage("nickNameModif");
    };

    const deleteUserPage = () => {
      setCurrentPage("deleteUser");
    };

    return (
      <div id="user-page-content-wrap">
        <div className="user-page-main">
          <div className="top-left">
            <div className="top-left-item1">내프로필</div>
            <div className="top-left-item2">프로필 수정</div>
            <div className="top-left-item3">비밀번호 변경</div>
          </div>

          <div id="top-right">
            <div className="top-top">
              <div
                className={"top-top-image box-img"}
                style={{ backgroundImage: `url(${profileImage})` }}
              >
                <div className={"edit-btn"} onClick={editImageIconClick}></div>
                <input
                  type={"file"}
                  style={{ display: "none" }}
                  accept="image/*"
                  ref={profileImageRef}
                  onChange={profileImageChange}
                />
              </div>
              <div className={"top-top-infobox"}>
                <div className={"top-top-infobox-name"}>
                  {userInfo?.nickname}
                </div>
                <div className={"top-top-infobox-email"}>{userInfo?.email}</div>
                <div className={"top-top-infobox-email"}>
                  {userInfo?.admin === "NORMAL" && "일반회원"}
                  {userInfo?.admin === "MANAGER" && "관리자"}
                </div>
              </div>
            </div>

            <div className={"top-middle"}>
              <div className="my-profile-item1">
                <div className="my-profile-nickname">닉네임</div>

                <div className="my-profile-nickname-box">
                  <span className="my-profile-nickname-text">{nickname}</span>
                  <div
                    className="my-profile-modify-btn1"
                    onClick={nickNameModify}
                  >
                    수정
                  </div>
                </div>
              </div>

              <div className="my-profile-item2">
                <div className="my-profile-password">비밀번호</div>

                <div className="my-profile-password-box">
                  <span className="my-profile-password-text">●●●●●●●●</span>
                  <div
                    className="my-profile-modify-btn2"
                    onClick={passwordModifyPage}
                  >
                    수정
                  </div>
                </div>
              </div>
            </div>

            <div className={"top-bottom"}>
              <div className={"user-modify"} onClick={deleteUserPage}>
                회원탈퇴
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Index = () => {
    const [cookies, setCookies] = useCookies();

    const inputRef = useRef<HTMLInputElement | null>(null);
    const [password, setPassword] = useState<string>("");

    const passwordChange = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setPassword(value);
    };
    const passwordKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== "Enter") return;
      passwordCheck();
    };
    const passwordCheck = () => {
      passwordCheckRequest(cookies.accessToken, password).then(
        passwordCheckResponse
      );
    };
    const passwordCheckResponse = (response: ResponseDto | null) => {
      if (!response) {
        alert("서버 에러");
        return;
      }
      const { code } = response;
      if (code === "NU") {
        alert("비밀번호가 틀렸습니다.");
        return;
      }
      ResponseUtil(response);
      if (code === "SU") {
        // setAuthSuccess(true);
        setCurrentPage("edit");
      }
    };
    return (
      <div className={"user-info-box-wrap"}>
        <div className={"user-info-box"}>
          <div className={"user-info-title"}>본인확인</div>
          <div className={"user-info-input-box"}>
            <div className={"input-box"}>
              <input
                placeholder={"비밀번호를 입력해주세요."}
                onChange={passwordChange}
                onKeyDown={passwordKeydown}
                type={"password"}
                value={password}
                className={"password-input"}
                ref={inputRef}
              />
            </div>
            <div className={"button"} onClick={passwordCheck}>
              입력
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PassWordModify = () => {
    const [cookies, setCookies] = useCookies();

    const modafiyPasswordRef = useRef<HTMLInputElement | null>(null);
    const [modifyPassword, setModifyPassword] = useState<string>("");
    const [modifyPasswordError, setModifyPasswordError] =
      useState<boolean>(false);
    const [modifyPasswordErrorMessage, setModifyPasswordErrorMessage] =
      useState<string>("");

    const onModifyPasswordChangeHandler = (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      const { value } = event.target;
      setModifyPassword(value);
      setModifyPasswordError(false);
      setModifyPasswordErrorMessage("");
    };

    const passwordRef = useRef<HTMLInputElement | null>(null);
    const [password, setPassword] = useState<string>("");
    const [passwordError, setPasswordError] = useState<boolean>(false);
    const [passwordErrorMessage, setPasswordErrorMessage] =
      useState<string>("");

    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setPassword(value);
      setPasswordError(false);
      setPasswordErrorMessage("");
    };

    const modifyPasswordCheckRef = useRef<HTMLInputElement | null>(null);
    const [modifyPasswordCheck, setModifyPasswordCheck] = useState<string>("");
    const [modifyPasswordCheckError, setModifyPasswordCheckError] =
      useState<boolean>(false);

    const [
      modifyPasswordCheckErrorMessage,
      setModifyPasswordCheckErrorMessage,
    ] = useState<string>("");
    const onModifyPasswordCheckhangeHandler = (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      const { value } = event.target;
      setModifyPasswordCheck(value);
      setModifyPasswordCheckError(false);
      setModifyPasswordCheckErrorMessage("");
    };

    const back = () => {
      setCurrentPage("edit");
    };

    const passwordModify = async () => {
      let error = false;
      if (password.length === 0) {
        setPasswordError(true);
        setPasswordErrorMessage("사용중인 비밀번호를 입력해주세요.");
        error = true;
      }

      // 비밀번호가 입력된 경우 비밀번호 확인
      if (password.length > 0) {
        const response = await passwordCheckRequest(
          cookies.accessToken,
          password
        );

        if (response?.code === "NU") {
          setPasswordError(true);
          setPasswordErrorMessage("현재 비밀번호가 일치하지 않습니다.");
          error = true;
        }
      }

      if (modifyPassword === password) {
        setModifyPasswordError(true);
        setModifyPasswordErrorMessage(
          "현재 비밀번호와 변경하실 비밀번호가 같습니다."
        );
        error = true;
      }

      if (modifyPassword.length === 0) {
        setModifyPasswordError(true);
        setModifyPasswordErrorMessage("변경할 비밀번호를 입력해주세요.");
        error = true;
      }

      if (modifyPasswordCheck !== modifyPassword || !modifyPasswordCheck) {
        setModifyPasswordCheckError(true);
        setModifyPasswordCheckErrorMessage(
          "변경할 비밀번호와 일치하지 않습니다."
        );
        error = true;
      }

      if (error) {
        return;
      }

      if (!error) {
        updatePassword(cookies.accessToken, password, modifyPassword).then(
          updatePasswordResponse
        );
      }
    };

    const updatePasswordResponse = (response: ResponseDto | null) => {
      if (response?.code === "SU") {
        alert(response?.message);
        setCurrentPage("edit");
      } else {
        alert("오류");
        return;
      }
    };

    return (
      <div className={"passwordModify-wrap"}>
        <div className={"passwordModify-container"}>
          <div className={"passwordModify-top"}>
            <div className={"passwordModify-title"}>비밀번호 변경</div>
          </div>
          <div className={"passwordModify-mid"}>
            <InputBox
              ref={passwordRef}
              label="현재 비밀번호"
              type={"password"}
              placeholder="현재 사용중인 비밀번호를 입력해주세요."
              value={password}
              onChange={onPasswordChangeHandler}
              error={passwordError}
              message={passwordErrorMessage}
            />

            <InputBox
              ref={modafiyPasswordRef}
              label="새 비밀번호"
              type={"password"}
              placeholder="변경할 비밀번호를 입력해주세요."
              value={modifyPassword}
              onChange={onModifyPasswordChangeHandler}
              error={modifyPasswordError}
              message={modifyPasswordErrorMessage}
            />
            <InputBox
              ref={modifyPasswordCheckRef}
              label="새 비밀번호 확인"
              type={"password"}
              placeholder="변경할 비밀번호 확인을 위해 다시 입력해주세요."
              value={modifyPasswordCheck}
              onChange={onModifyPasswordCheckhangeHandler}
              error={modifyPasswordCheckError}
              message={modifyPasswordCheckErrorMessage}
            />
          </div>

          <div className={"passwordModify-bottom"}>
            <div className={"passwordModify-btn"} onClick={passwordModify}>
              수정
            </div>
            <div className={"passwordModify-cancel"} onClick={back}>
              이전
            </div>
          </div>
        </div>
      </div>
    );
  };

  interface NickNameModifyProps {
    userInfo?: User;
  }
  const NickNameModify: React.FC<NickNameModifyProps> = ({ userInfo }) => {
    const { loginUser, setLoginUser } = useLoginUserStore();
    const [cookies, setCookies] = useCookies();

    const modafiyNicknameRef = useRef<HTMLInputElement | null>(null);
    const [modifyNickname, setModifyNickname] = useState<string>("");
    const [modifyNicknamedError, setModifyNicknamedError] =
      useState<boolean>(false);
    const [modifyNicknameErrorMessage, setModifyNicknameErrorMessage] =
      useState<string>("");

    const onModifyNicknameChangeHandler = (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      const { value } = event.target;
      setModifyNickname(value);
      setModifyNicknamedError(false);
      setModifyNicknameErrorMessage("");
    };

    const passwordRef = useRef<HTMLInputElement | null>(null);
    const [password, setPassword] = useState<string>("");
    const [passwordError, setPasswordError] = useState<boolean>(false);
    const [passwordErrorMessage, setPasswordErrorMessage] =
      useState<string>("");

    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setPassword(value);
      setPasswordError(false);
      setPasswordErrorMessage("");
    };

    const back = () => {
      setCurrentPage("edit");
    };

    const nicknameModify = async () => {
      let error = false;
      if (modifyNickname.length === 0) {
        setModifyNicknamedError(true);
        setModifyNicknameErrorMessage("변경하실 닉네임을 입력해주세요.");
        error = true;
      }

      if (modifyNickname === originNickname) {
        setModifyNicknamedError(true);
        setModifyNicknameErrorMessage(
          "현재 닉네임과 변경하실 닉네임이 같습니다."
        );
        error = true;
      }

      if (password.length === 0) {
        setPasswordError(true);
        setPasswordErrorMessage("현재 사용중인 비밀번호를 입력해주세요.");
        error = true;
      }

      if (error) {
        return;
      }

      if (!error) {
        updateNickname(cookies.accessToken, password, modifyNickname).then(
          updateNicknameResponse
        );
      }
    };

    const updateNicknameResponse = (response: ResponseDto | null) => {
      if (response?.code === "SU") {
        if (loginUser) {
          setLoginUser({
            ...loginUser,
            nickname: modifyNickname,
          });
        }
        alert(response?.message);
        setCurrentPage("edit");
      }

      if (response?.code === "NU") {
        setPasswordError(true);
        setPasswordErrorMessage(response?.message);
      }
    };

    return (
      <div className={"nicknameModify-wrap"}>
        <div className={"nicknameModify-container"}>
          <div className={"nicknameModify-top"}>
            <div className={"nicknameModify-title"}>닉네임 변경</div>
          </div>
          <div className={"nicknameModify-mid"}>
            <InputBox
              ref={modafiyNicknameRef}
              label="닉네임"
              type={"text"}
              placeholder="변경할 닉네임을 입력해주세요."
              value={modifyNickname}
              onChange={onModifyNicknameChangeHandler}
              error={modifyNicknamedError}
              message={modifyNicknameErrorMessage}
            />

            <InputBox
              ref={passwordRef}
              label="현재 비밀번호"
              type={"password"}
              placeholder="현재 사용중인 비밀번호를 입력해주세요."
              value={password}
              onChange={onPasswordChangeHandler}
              error={passwordError}
              message={passwordErrorMessage}
            />
          </div>

          <div className={"nicknameModify-bottom"}>
            <div className={"nicknameModify-btn"} onClick={nicknameModify}>
              수정
            </div>
            <div className={"nicknameModify-cancel"} onClick={back}>
              이전
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DeleteUser = () => {
    const [cookies, setCookies] = useCookies();
    const navigate = useNavigate();

    const modafiyPasswordRef = useRef<HTMLInputElement | null>(null);
    const [modifyPassword, setModifyPassword] = useState<string>("");
    const [modifyPasswordError, setModifyPasswordError] =
      useState<boolean>(false);
    const [modifyPasswordErrorMessage, setModifyPasswordErrorMessage] =
      useState<string>("");

    const onModifyPasswordChangeHandler = (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      const { value } = event.target;
      setModifyPassword(value);
      setModifyPasswordError(false);
      setModifyPasswordErrorMessage("");
    };

    const passwordRef = useRef<HTMLInputElement | null>(null);
    const [password, setPassword] = useState<string>("");
    const [passwordError, setPasswordError] = useState<boolean>(false);
    const [passwordErrorMessage, setPasswordErrorMessage] =
      useState<string>("");

    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setPassword(value);
      setPasswordError(false);
      setPasswordErrorMessage("");
    };

    const deleteUserEmailRef = useRef<HTMLInputElement | null>(null);
    const [deleteUserEmail, setDeleteUserEmail] = useState<string>("");
    const [deleteUserEmailError, setDeleteUserEmailError] =
      useState<boolean>(false);

    const [deleteUserEmailErrorMessage, setDeleteUserEmailErrorMessage] =
      useState<string>("");
    const onDeleteUserEmailHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setDeleteUserEmail(value);
      setDeleteUserEmailError(false);
      setDeleteUserEmailErrorMessage("");
    };

    const back = () => {
      setCurrentPage("edit");
    };

    const deleteUser = async () => {
      let error = false;

      // 비밀번호가 입력되지 않았을 경우
      if (password.length === 0) {
        setPasswordError(true);
        setPasswordErrorMessage("사용중인 비밀번호를 입력해주세요.");
        error = true;
      }

      // 비밀번호가 입력된 경우. 비밀번호 일치한지 api
      if (password.length > 0) {
        const response = await passwordCheckRequest(
          cookies.accessToken,
          password
        );

        if (response?.code === "NU") {
          setPasswordError(true);
          setPasswordErrorMessage("현재 비밀번호가 일치하지 않습니다.");
          error = true;
        }
      }

      // 이메일을 입력하지 않았을 경우
      if (deleteUserEmail.length === 0) {
        setDeleteUserEmailError(true);
        setDeleteUserEmailErrorMessage("변경할 비밀번호를 입력해주세요.");
        error = true;
      }

      if (error) {
        return;
      }

      // 에러가 없는 경우 회원탈퇴 api 실행
      if (!error) {
        // 회원탈퇴 api가 들어갈 부분
        if (window.confirm("정말 탈퇴하시겠습니까?")) {
          const response = await deleteUserRequest(
            cookies.accessToken,
            deleteUserEmail
          );
          alert(response?.message);

          removeCookie("accessToken", { path: "/" });
          removeCookie("refreshToken", { path: "/" });
          // 탈퇴 완료 페이지로 이동하는거 추가. 일단 메인으로 가는거로 작성
          navigate(MAIN_PATH());
        }
      }
    };

    const updatePasswordResponse = (response: ResponseDto | null) => {
      if (response?.code === "SU") {
        alert(response?.message);
        setCurrentPage("edit");
      } else {
        alert("오류");
        return;
      }
    };

    const [deleteUserPage, setDeleteUserPage] = useState(1);

    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setIsChecked(event.target.checked);
    };

    const handlePageTransitionToPage2 = () => {
      // 페이지 전환 로직
      setDeleteUserPage(2);
    };

    const warnIfNotChecked = () => {
      alert("회원탈퇴 시 유의사항을 확인하고 동의에 체크해주세요.");
    };

    return (
      <>
        {deleteUserPage === 1 && (
          <div className="delete-user-page1-wrap">
            <div className="delete-user-page1-container">
              <div className="delete-user-page1-top">
                <div className="delete-user-page1-top-item1">
                  <div className="delete-user-page1-top-title">회원탈퇴</div>
                  <div>
                    회원탈퇴 전에 반드시 유의사항을 확인하고 진행해 주세요.
                  </div>
                </div>
              </div>
              <hr className="delete-user-page1-hr" />

              <div className="delete-user-page1-mid">
                <div className="delete-user-page1-mid-item1">
                  <div className="delete-user-page1-mid-title">
                    개인정보 및 서비스 이용 기록 삭제
                  </div>
                  <div>
                    개인정보 및 개인화 서비스 이용기록이 모두 삭제 되며, 삭제된
                    데이터는 복구되지 않습니다. 필요한 데이터는 미리 백업해
                    주시기 바랍니다.
                  </div>
                </div>

                <div className="delete-user-page1-mid-item2">
                  <div className="delete-user-page1-mid-title">
                    소셜 계정 연결 정보 삭제
                  </div>
                  <div>
                    이메일 ID에 소셜 계정을 연결한 경우 탈퇴 시 연결 정보도 함께
                    삭제됩니다.
                  </div>
                </div>

                <div className="delete-user-page1-mid-item3">
                  <div className="delete-user-page1-mid-title">
                    커뮤니티 서비스 등록 게시물 유지
                  </div>
                  <div>
                    회원가입 이후 등록하신 게시물들은 회원탈퇴 후에도 삭제 되지
                    않고 유지됩니다. 삭제를 원하는 경우에는 직접 삭제하신 후
                    회원탈퇴를 진행하시기 바랍니다.
                  </div>
                </div>

                <div className="delete-user-page1-mid-item4">
                  <div className="delete-user-page1-mid-title">
                    개인정보 보관
                  </div>
                  <div>
                    회원 탈퇴 시 일부 개인정보는 개인정보처리방침에 따라
                    탈퇴일로부터 30일간 보관되며, 그 이후 관계법령에 필요한
                    경우에는 별도 보관합니다.
                  </div>
                </div>

                <div className="delete-user-page1-mid-item5">
                  <div className="delete-user-page1-mid-title">
                    탈퇴 후 제한
                  </div>
                  <div>
                    탈퇴 처리된 이메일 ID는 30일동안 재가입이 불가합니다.
                  </div>
                </div>
              </div>

              <hr className="delete-user-page1-hr" />

              <div className="delete-user-page1-bottem">
                <div className="delete-user-page1-bottem-item1">
                  <label className="custom-checkbox">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                    />
                    <span className="checkmark"></span>
                  </label>
                  <div>
                    회원탈퇴 시 유의사항을 확인하였으며, 모두 동의합니다.
                  </div>
                </div>
                <div className="delete-user-page1-bottem-item2">
                  <div
                    className="delete-user-page1-bottem-item2-cancel"
                    onClick={back}
                  >
                    비동의
                  </div>

                  {isChecked === true ? (
                    <div
                      className={
                        "delete-user-page1-bottem-item2-confirm checked"
                      }
                      onClick={handlePageTransitionToPage2}
                    >
                      동의
                    </div>
                  ) : (
                    <div
                      className={"delete-user-page1-bottem-item2-confirm"}
                      onClick={warnIfNotChecked}
                    >
                      동의
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {deleteUserPage === 2 && (
          <div className={"delete-user-page2-wrap"}>
            <div className={"delete-user-page2-centainer"}>
              <div className={"delete-user-page2-top"}>
                <div className={"delete-user-page2-title"}>회원탈퇴</div>
              </div>
              <div className={"delete-user-page2-mid"}>
                <InputBox
                  ref={deleteUserEmailRef}
                  label="이메일"
                  type={"text"}
                  placeholder="본인 확인을 위해 이메일을 입력해주세요."
                  value={deleteUserEmail}
                  onChange={onDeleteUserEmailHandler}
                  error={deleteUserEmailError}
                  message={deleteUserEmailErrorMessage}
                />

                <InputBox
                  ref={passwordRef}
                  label="비밀번호"
                  type={"password"}
                  placeholder="본인 확인을 위해 현재 사용중인 비밀번호를 입력해주세요."
                  value={password}
                  onChange={onPasswordChangeHandler}
                  error={passwordError}
                  message={passwordErrorMessage}
                />
              </div>

              <div className={"delete-user-page2-bottom"}>
                <div className={"delete-user-page2-btn"} onClick={deleteUser}>
                  탈퇴
                </div>
                <div className={"delete-user-page2-cancel"} onClick={back}>
                  이전
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      {currentPage === "index" && <Index />}
      {currentPage === "edit" && <EditPage />}
      {currentPage === "passwordModify" && <PassWordModify />}
      {currentPage === "nickNameModif" && (
        <NickNameModify userInfo={userInfo} />
      )}
      {currentPage === "deleteUser" && <DeleteUser />}
    </>
  );
};

export default UserPage;
