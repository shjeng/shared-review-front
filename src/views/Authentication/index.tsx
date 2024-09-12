import React, { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import "./style.css";
import InputBox from "../../components/InputBox";
import SignInRequestDto from "../../apis/request/auth/sign-in-request.dto";
import { signInRequest, signUpRequest } from "../../apis";
import SignInResponseDto from "../../apis/response/auth/sign-in.response.dto";
import ResponseDto from "../../apis/response/response.dto";
import { MAIN_PATH } from "../../constant";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { SignUpRequestDto } from "../../apis/request/auth";
import SignUpResponseDto from "../../apis/response/auth/sign-up-response.dto";

const Authentication = () => {
  //          state: 화면 상태        //
  const [view, setView] = useState<"sign-in" | "sign-up">("sign-in");

  const test = () => {};

  const onSignUpLinkClickHandler = () => {
    setView("sign-up");
  };

  //        function: 네비게이트 함수     //
  const navigate = useNavigate();

  const SignIn = () => {
    // state: 이메일 요소 참조 상태 //
    const emailRef = useRef<HTMLInputElement | null>(null);

    // state: 비밀번호 요소 참조 상태 //
    const passwordRef = useRef<HTMLInputElement | null>(null);

    //      state: 패스워드 타입 상태      //
    //      패스워드 가시성을 제어하기 위한(기본적으로 ***.. 아이콘을 누르면 입력한 비밀번호가 보임. 그렇기 때문에 하드코딩으로 password를 입력하지 않고 {passwordType}을 사용해 동적으로 처리)      //
    const [passwordType, setPasswordType] = useState<"text" | "password">(
      "password"
    );

    //      state: 에러 상태      //
    const [error, setError] = useState<boolean>(false);

    //      state: 이메일 상태        //
    const [email, setEmail] = useState<string>("");

    //      state: 패스워드 상태      //
    const [password, setPassword] = useState<string>("");

    //          state: 쿠키 상태        //
    const [cookies, setCookie] = useCookies();

    //      function: sign in response 처리 함수    //
    const signInResponse = (
      responseBody: SignInResponseDto | ResponseDto | null
    ) => {
      if (!responseBody) {
        alert("네트워크 이상입니다.");
        return;
      }
      const { code } = responseBody;
      if (code === "VF") alert("모두 입력하세요.");
      if (code === "DBE") alert("데이터베이스 오류입니다.");
      if (code === "SF" || code === "VF") setError(true);
      if (code !== "SU") return;

      const { token, expirationTime } = responseBody as SignInResponseDto;
      const now = new Date().getTime();
      const expires = new Date(now + expirationTime * 1000);
      // 유효시간 : 현재시간 + 백엔드에서 설정한 시간(60분) * 1000
      setCookie("accessToken", token, { expires, path: MAIN_PATH() });
      // 'accessToken' : 이름, token 설정, path : 유효경로(MAIN_PATH() 이하의 모든 경로에서 유효함)
      navigate(MAIN_PATH());
    };

    //      event handler: 이메일 변경 이벤트 처리 함수      //
    // input에 value가 있을때랑 없을때랑 스타일 변화를 위한
    const [isEmailNotEmpty, setIsEmailNotEmpty] = useState<boolean>(false);
    const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      setError(false);
      const { value } = event.target;
      setIsEmailNotEmpty(!!value);
      setEmail(value);
    };

    //      event handler: 비밀번호 변경 이벤트 처리 함수      //
    // input에 value가 있을때랑 없을때랑 스타일 변화를 위한
    const [isPasswordNotEmpty, setIsPasswordNotEmpty] =
      useState<boolean>(false);

    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      setError(false);
      const { value } = event.target;
      setIsPasswordNotEmpty(!!value);
      setPassword(value);
    };

    //      event handler: 패스워드 버튼 클릭 이벤트 처리 함수      //
    const onPasswordButtonClickHandler = () => {
      if (passwordType === "text") {
        setPasswordType("password");
      } else {
        setPasswordType("text");
      }
    };

    //      event handler: 로그인 버튼 클릭 이벤트 처리 함수      //
    const onSignInButtonClickHandler = () => {
      const requestBody: SignInRequestDto = { email, password };
      // signInRequest(resquestBody) == result
      signInRequest(requestBody).then(signInResponse);
    };

    return (
      <div id="sign-in-wrap">
        <div className="auth-sign-in-top">
          <div className="sign-in-title">{"로그인"}</div>
          <InputBox
            ref={emailRef}
            label="이메일 주소"
            type="text"
            placeholder="이메일 주소를 입력해주세요."
            value={email}
            error={error}
            onChange={onEmailChangeHandler}
          />

          <InputBox
            ref={passwordRef}
            label="패스워드"
            type={passwordType}
            placeholder="비밀번호를 입력해주세요."
            error={error}
            value={password}
            onChange={onPasswordChangeHandler}
            onButtonClick={onPasswordButtonClickHandler}
          />

          <div className="auth-card-bottom">
            {error && (
              <div className="auth-sign-in-error-box">
                <div className="auth-sign-in-error-message">
                  {
                    "이메일 주소 또는 비밀번호를 잘못 입력했습니다. \n입력하신 내용을 다시 확인해주세요."
                  }
                </div>
              </div>
            )}

            {/* 로그인 버튼 */}
            {isEmailNotEmpty && isPasswordNotEmpty ? (
              <div
                className={"login_button_on"}
                onClick={onSignInButtonClickHandler}
              >
                {"로그인"}
              </div>
            ) : (
              <div className={"login_button_off"}>{"로그인"}</div>
            )}
          </div>
        </div>

        <hr />

        <div className="auth-sign-in-bottom">
          <div className="sign-in-access-options">
            <ul>
              <li>
                <div className="auth-description-link" onClick={test}>
                  {"이메일 찾기"}
                </div>
              </li>
              <li>
                <div className="auth-description-link" onClick={test}>
                  {"비밀번호 찾기"}
                </div>
              </li>
              <li>
                <div
                  className="auth-description-link"
                  onClick={onSignUpLinkClickHandler}
                >
                  {"회원가입"}
                </div>
              </li>
            </ul>
          </div>

          <div className="social_login_box">
            <div className="social_login_image-box-g">
              <div className="social_login_image-g"></div>
              <div className="social_login_title">구글 로그인</div>
            </div>
            <div className="social_login_image-box-k">
              <div className="social_login_image-k"></div>
              <div className="social_login_title">카카오 로그인</div>
            </div>
            <div className="social_login_image-box-n">
              <div className="social_login_image-n"></div>
              <div className="social_login_title">네이버 로그인</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SignUp = () => {
    //        state: 이메일 요소 참조 상태      //
    const emailRef = useRef<HTMLInputElement | null>(null);

    //        state: 이메일 인증번호 요소 참조 상태      //
    const emailCertifiedRef = useRef<HTMLInputElement | null>(null);

    //        state: 이메일 상태            //
    const [email, setEmail] = useState<string>("");

    //        state: 이메일 에러 상태       //
    const [isEmailError, setEmailError] = useState<boolean>(false);

    //        state: 이메일 에러 메세지 상태       //
    const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");

    //        state: 이메일 인증번호 상태            //
    const [emailCertified, setEmailCertified] = useState<string>("");

    //        state: 패스워드 요소 참조 상태     //
    const passwordRef = useRef<HTMLInputElement | null>(null);

    //        state: 패스워드 타입 상태       //
    const [passwordType, setPasswordType] = useState<"text" | "password">(
      "password"
    );

    //        state: 패스워드 상태          //
    const [password, setPassword] = useState<string>("");

    //        state: 패스워드 에러 상태       //
    const [isPasswordError, setPasswordError] = useState<boolean>(false);
    //        state: 패스워드 에러 메세지 상태       //
    const [passwordErrorMessage, setPasswordErrorMessage] =
      useState<string>("");

    //        state: 패스워드 확인 요소 참조 상태      //
    const passwordCheckRef = useRef<HTMLInputElement | null>(null);

    //        state: 패스워드 확인 타입 상태       //
    const [passwordCheckType, setPasswordCheckType] = useState<
      "text" | "password"
    >("password");

    //        state: 패스워드 확인 상태          //
    const [passwordCheck, setPasswordCheck] = useState<string>("");

    //        state: 패스워드 확인 에러 상태       //
    const [isPasswordCheckError, setPasswordCheckError] =
      useState<boolean>(false);

    //        state: 패스워드 확인 에러 메세지 상태       //
    const [passwordCheckErrorMessage, setPasswordCheckErrorMessage] =
      useState<string>("");

    //        state: 닉네임 요소 참조 상태      //
    const nicknameRef = useRef<HTMLInputElement | null>(null);

    //        state: 닉네임 상태           //
    const [nickname, setNickname] = useState<string>("");

    //        state: 닉네임 에러 상태       //
    const [isNicknameError, setNicknameError] = useState<boolean>(false);

    //        state: 닉네임 에러 메세지 상태       //
    const [nicknameErrorMessage, setNicknameErrorMessage] =
      useState<string>("");

    //        function: sign up response 처리 함수       //
    const signUpResponse = (
      responseBody: SignUpResponseDto | ResponseDto | null
    ) => {
      if (!responseBody) {
        alert("네트워크 이상입니다.");
        return;
      }
      const { code } = responseBody;
      if (code === "DE") {
        setEmailError(true);
        setEmailErrorMessage("이미 존재하는 이메일 주소입니다.");
      }
      if (code === "DN") {
        setNicknameError(true);
        setNicknameErrorMessage("이미 존재하는 닉네임입니다.");
      }
      if (code === "VF") alert("모든 값을 입력하세요.");
      if (code === "DBE") alert("데이터베이스 오류입니다.");
      if (code !== "SU") return;
      setView("sign-in");
    };

    // event handler: 이메일 변경 이벤트 처리     //
    const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setEmailError(false);
      setEmail(value);
      setEmailErrorMessage("");
    };

    // event handler: 패스워드 변경 이벤트 처리     //
    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setPasswordError(false);
      setPassword(value);
      setPasswordErrorMessage("");
    };

    // event handler: 패스워드 확인 변경 이벤트 처리     //
    const onPasswordCheckChangeHandler = (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      const { value } = event.target;
      setPasswordCheck(value);
      setPasswordCheckError(false);
      setPasswordCheckErrorMessage("");
    };

    // event handler: 핸드폰 번호 변경 이벤트 처리      //
    const onTelNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setNickname(value);
      setNicknameError(false);
      setNicknameErrorMessage("");
    };

    // event handler: 회원가입 버튼 클릭 이벤트 처리      //
    const onSignUpButtonClickHandler = () => {
      // 닉네임
      const hasNickname = nickname.trim().length !== 0;
      if (!hasNickname) {
        setNicknameError(true);
        setNicknameErrorMessage("닉네임을 입력해주세요.");
        nicknameRef.current?.focus();
        return;
      }

      // 이메일
      const hasEmail = nickname.trim().length !== 0;
      if (!hasEmail) {
        setEmailError(true);
        setEmailErrorMessage("이메일을 입력해주세요.");
        emailRef.current?.focus();
        return;
      }

      // 패스워드
      const hasPassword = password.trim().length !== 0;
      if (!hasPassword) {
        setPasswordError(true);
        setPasswordErrorMessage("비밀번호를 입력해주세요.");
        passwordRef.current?.focus();
        return;
      }

      const requestBody: SignUpRequestDto = {
        email,
        password,
        nickname,
        passwordCheck: "",
        profileImage: "",
      };

      signUpRequest(requestBody).then(signUpResponse);
    };
    return (
      <div id="sign-up-wrap">
        <div className="auth-sign-up-top">
          <div className="sign-up-title">회원가입</div>
          <div className="join_input_box">
            <div className="join-Certified-Input-Box">
              <InputBox
                ref={emailRef}
                label="이메일"
                type="text"
                placeholder="이메일을 입력해주세요."
                value={email}
                onChange={onEmailChangeHandler}
                error={isEmailError}
                message={emailErrorMessage}
              />
              <div className="email-certification-btn">{"인증번호 발송"}</div>
            </div>

            <div className="join-Certified-Input-Box">
              <InputBox
                ref={emailCertifiedRef}
                label="인증번호"
                type="text"
                placeholder="인증번호를 입력해주세요."
                value={emailCertified}
                onChange={onEmailChangeHandler}
                error={isEmailError}
                message={emailErrorMessage}
              />
              <div className="email-certification-btn">{"인증번호 확인"}</div>
            </div>
            <InputBox
              ref={passwordRef}
              label="비밀번호"
              type={passwordType}
              placeholder="비밀번호를 입력해주세요."
              value={password}
              onChange={onPasswordChangeHandler}
              error={isPasswordError}
              message={passwordErrorMessage}
            />
            <InputBox
              ref={passwordCheckRef}
              label="비밀번호 확인"
              type={passwordCheckType}
              placeholder="비밀번호를 다시 입력해주세요."
              value={passwordCheck}
              onChange={onPasswordCheckChangeHandler}
              error={isPasswordCheckError}
              message={passwordCheckErrorMessage}
            />

            <div className="join-Certified-Input-Box">
              <InputBox
                ref={nicknameRef}
                label="닉네임"
                type="text"
                placeholder="사용하실 닉네임을 입력해주세요."
                value={nickname}
                onChange={onTelNumberChangeHandler}
                error={isNicknameError}
                message={nicknameErrorMessage}
              />
              <div className="email-certification-btn">{"중복확인"}</div>
            </div>
          </div>
        </div>

        <div className="auth-join-bottom">
          <div
            className="black-large-full-button"
            onClick={onSignUpButtonClickHandler}
          >
            {"가입"}
          </div>

          <div className="auth-cancel-button">{"취소"}</div>
        </div>
      </div>
    );
  };

  return (
    <div id="auth-wrapper">
      <div className="auth-body-box">
        {view === "sign-in" && <SignIn />}
        {view === "sign-up" && <SignUp />}
      </div>
    </div>
  );
};

export default Authentication;
