import React, { ChangeEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SignUpResponseDto from "../../../apis/response/auth/sign-up-response.dto";
import ResponseDto from "../../../apis/response/response.dto";
import { SIGN_IN_PATH } from "../../../constant";
import { SignUpRequestDto } from "../../../apis/request/auth";
import {
  nicknameDuplChkRequest,
  sendEmailAuthNumber,
  sendEmailRequest,
  signUpRequest,
} from "../../../apis";
import InputBox from "../../../components/InputBox";
import "./style.css";
import { NicknameDupleChkResponseDto } from "../../../apis/response/auth";

const SignUp = () => {
  const test = () => {};

  //        function: 네비게이트 함수     //
  const navigate = useNavigate();

  //        state: 이메일 요소 참조 상태      //
  const emailRef = useRef<HTMLInputElement | null>(null);
  //        state: 이메일 상태            //
  const [email, setEmail] = useState<string>("");
  //        state: 이메일 에러 상태       //
  const [isEmailError, setEmailError] = useState<boolean>(false);
  //        state: 이메일 에러 메세지 상태       //
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");
  // ============================================================================
  //        state: 이메일 인증번호 요소 참조 상태      //
  const emailCertifiedRef = useRef<HTMLInputElement | null>(null);

  //        state: 이메일 인증번호 상태            //
  const [emailCertified, setEmailCertified] = useState<string>("");

  //        state: 이메일 에러 상태       //
  const [isEmailCertifiedError, setIsEmailCertifiedError] =
    useState<boolean>(false);

  //        state: 이메일 에러 메세지 상태       //
  const [emailCertifiedErrorMessage, setEmailCertifiedErrorMessage] =
    useState<string>("");

  //        state: 이메일 인증 상태       //
  const [verifiedEmail, setVerifiedEmail] = useState<boolean>(false);
  // ============================================================================
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
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>("");
  // ============================================================================
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
  // ============================================================================
  //        state: 닉네임 요소 참조 상태      //
  const nicknameRef = useRef<HTMLInputElement | null>(null);

  //        state: 닉네임 상태           //
  const [nickname, setNickname] = useState<string>("");
  const [verifiedNickname, setVerifiedNickname] = useState<string>(""); // 검증된 이메일
  //        state: 닉네임 에러 상태       //
  const [isNicknameError, setNicknameError] = useState<boolean>(false);

  //        state: 닉네임 에러 메세지 상태       //
  const [nicknameErrorMessage, setNicknameErrorMessage] = useState<string>("");
  // ==========================================================================
  //        state: 이메일 readonly 상태      //
  const [emailReadonlyState, setEmailReadonlyState] = useState<boolean>(false);

  //        state: 인증번호 readonly 상태      //
  const [authNumReadonlyState, setAuthNumReadonlyState] =
    useState<boolean>(false);

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
    navigate(SIGN_IN_PATH());
  };

  //        function: 이메일 정규식 처리 함수       //
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
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
    // 이메일
    const hasEmail = email.trim().length !== 0;
    if (!hasEmail) {
      setEmailError(true);
      setEmailErrorMessage("이메일을 입력해주세요.");
      emailRef.current?.focus();
      return;
    }

    // 이메일 인증
    if (verifiedEmail) {
      setIsEmailCertifiedError(true);
      setEmailCertifiedErrorMessage("이메일 인증을 해주세요");
      emailCertifiedRef.current?.focus();
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

    // 닉네임
    const hasNickname = nickname.trim().length !== 0;
    if (!hasNickname) {
      setNicknameError(true);
      setNicknameErrorMessage("닉네임을 입력해주세요.");
      nicknameRef.current?.focus();
      return;
    }
    if (nickname !== verifiedNickname && verifiedNickname.length === 0) {
      setNicknameError(true);
      setNicknameErrorMessage("닉네임 중복 체크를 확인해주세요.");
      return;
    }
    const requestBody: SignUpRequestDto = {
      email: email,
      password: password,
      nickname: nickname,
      passwordCheck: '',
      profileImage: ''
    };

    signUpRequest(requestBody).then(signUpResponse);
  };
  // event handler: 닉네임 중복체크
  const nicknameDuplChk = () => {
    if (nickname.length === 0) return;
    nicknameDuplChkRequest(nickname).then(nicknameDuplChkResponse);
  };
  const nicknameDuplChkResponse = (
    responseBody: NicknameDupleChkResponseDto | ResponseDto | null
  ) => {
    if (!responseBody) {
      alert("네트워크 이상입니다.");
      return;
    }
    const { code } = responseBody;
    if (code === "DN") {
      setNicknameError(true);
      setNicknameErrorMessage("이미 존재하는 닉네임입니다.");
    }
    if (code === "DBE") alert("데이터베이스 오류입니다.");
    if (code !== "SU") return;
    alert("중복 확인!");
    const getResponse = responseBody as NicknameDupleChkResponseDto;
    setVerifiedNickname(getResponse.nickname); // 검증 받은 이메일 저장.
  };

  // event handler: 이메일 인증번호 보내기      //
  const emailSend = async () => {
    const clientEmail = emailRef.current!.value;
    console.log("입력한 메일" + clientEmail);

    // 이메일 형식 검사
    if (!validateEmail(clientEmail)) {
      alert("올바른 이메일 형식이 아닙니다.");
      return;
    }

    const success = await sendEmailRequest(clientEmail);
    if (success) {
      setEmailReadonlyState(true);
    }
  };

  // event handler: 이메일 인증 변경 이벤트 처리     //
  const handleVerificationCodeChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    // 이메일 인증 코드 입력값 변경 이벤트 처리 함수
    setEmailCertified(event.target.value);
    setEmailError(false); // 에러 상태 초기화
    setEmailErrorMessage(""); // 에러 메시지 초기화
  };

  // event handler: 이메일 인증번호 일치 확인      //
  const handleVerifyEmail = async () => {
    const emailAuthNumber = emailCertifiedRef.current!.value;
    console.log("입력한 인증번호" + emailAuthNumber);

    const success = await sendEmailAuthNumber(emailAuthNumber);
    if (success) {
      setAuthNumReadonlyState(true);
    }
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
              readonly={emailReadonlyState}
            />
            {emailReadonlyState ? (
              <div className={"email-certification-btn-off"}>
                {"인증번호 발송"}
              </div>
            ) : (
              <div className={"email-certification-btn"} onClick={emailSend}>
                {"인증번호 발송"}
              </div>
            )}
          </div>

          <div className="join-Certified-Input-Box">
            <InputBox
              ref={emailCertifiedRef}
              label="인증번호"
              type="text"
              placeholder="인증번호를 입력해주세요."
              value={emailCertified}
              onChange={handleVerificationCodeChange}
              error={isEmailError}
              message={emailErrorMessage}
              readonly={authNumReadonlyState}
            />

            {authNumReadonlyState ? (
              <div className="email-certification-btn-off">
                {"인증번호 확인"}
              </div>
            ) : (
              <div
                className="email-certification-btn"
                onClick={handleVerifyEmail}
              >
                {"인증번호 확인"}
              </div>
            )}
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
            <div
              className="nickname-certification-btn"
              onClick={nicknameDuplChk}
            >
              {"중복확인"}
            </div>
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

export default SignUp;
