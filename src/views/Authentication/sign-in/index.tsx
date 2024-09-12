import React, { ChangeEvent, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import SignInResponseDto from "../../../apis/response/auth/sign-in.response.dto";
import ResponseDto from "../../../apis/response/response.dto";
import { MAIN_PATH, SIGN_IN_PATH, SIGN_UP_PATH } from "../../../constant";
import SignInRequestDto from "../../../apis/request/auth/sign-in-request.dto";
import { signInRequest } from "../../../apis";
import InputBox from "../../../components/InputBox";
import "./style.css";
import { useLoginUserStore } from "../../../store";

const SignIn = () => {
  const test = () => {};

  //        function: 네비게이트 함수     //
  const navigate = useNavigate();

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

    const { token, refreshToken, expirationTime } =
      responseBody as SignInResponseDto;
    const now = new Date().getTime();
    const expires = new Date(now + expirationTime * 1000);
    // 유효시간 : 현재시간 + 백엔드에서 설정한 시간(60분) * 1000
    setCookie("accessToken", token, { expires, path: MAIN_PATH() });
    setCookie("refreshToken", refreshToken, { expires, path: MAIN_PATH() });
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
  const [isPasswordNotEmpty, setIsPasswordNotEmpty] = useState<boolean>(false);

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
    signInRequest(requestBody).then(signInResponse);
  };

  //      event handler: 회원가입 페이지 이동 핸들러       //
  const onLoginClickHandler = () => {
    navigate(SIGN_UP_PATH());
  };

  //      event handler: 패스워드 인풋 키 다운 이벤트 처리      //
  const onPasswordKeyDownHandler = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key !== "Enter") return;
    onSignInButtonClickHandler();
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
          onKeyDown={onPasswordKeyDownHandler}
        />

        <div className="auth-card-bottom">
          {error && (
            <div className="auth-sign-in-error-box">
              <div className="auth-sign-in-error-message">
                {"이메일 주소 또는 비밀번호를 잘못 입력했습니다."}
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
                onClick={onLoginClickHandler}
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

export default SignIn;
