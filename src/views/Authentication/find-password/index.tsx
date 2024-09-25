import { ChangeEvent, useRef, useState } from "react";
import "./style.css";
import InputBox from "../../../components/InputBox";
import { useNavigate } from "react-router-dom";
import {
  nonTokenUpdatePassword,
  sendEmailAuthNumber,
  sendEmailRequest,
} from "../../../apis";
import ResponseDto from "../../../apis/response/response.dto";
import { SIGN_IN_PATH } from "../../../constant";

const FindPassword = () => {
  //        function: 네비게이트 함수     //
  const navigate = useNavigate();

  //        function: 뒤로 이동 함수     //
  const back = () => {
    navigate(-1);
  };

  // event handler: 비밀번호 변경 요청      //
  const onFindPasswordBtnClickHandler = async () => {
    let error = false;

    if (userEmail.length === 0) {
      setUserEmailError(true);
      setUserEmailErrorMessage("찾을 이메일을 입력해주세요.");
      error = true;
    } else if (!emailReadonlyState) {
      setUserEmailError(true);
      setUserEmailErrorMessage("이메일 인증버튼을 눌러주세요.");
      error = true;
    }

    if (authNumber.length === 0) {
      setAuthNumberError(true);
      setAuthNumberErrorMessage("인증번호를 입력해주세요.");
      error = true;
    } else if (!authNumReadonlyState) {
      setAuthNumberError(true);
      setAuthNumberErrorMessage("인증 버튼을 눌러주세요.");
      error = true;
    }

    if (modifyPassword.length === 0) {
      setModifyPasswordError(true);
      setModifyPasswordErrorMessage("변경할 비밀번호를 입력해주세요.");
      error = true;
    }

    if (modifyPasswordCheck.length === 0) {
      setModifyPasswordCheckError(true);
      setModifyPasswordCheckErrorMessage(
        "변경할 비밀번호를 다시 입력해주세요."
      );
      error = true;
    }

    if (modifyPassword !== modifyPasswordCheck) {
      setModifyPasswordError(true);
      setModifyPasswordErrorMessage("");
      setModifyPasswordCheckError(true);
      setModifyPasswordCheckErrorMessage("비밀번호가 일치하지 않습니다.");
      error = true;
    }

    if (error) {
      return;
    }

    if (!error) {
      nonTokenUpdatePassword(userEmail, modifyPassword).then(
        nonTokenUpdatePasswordResponse
      );
    }
  };
  const nonTokenUpdatePasswordResponse = (response: ResponseDto | null) => {
    if (response?.code === "SU") {
      alert(response?.message);
      navigate(SIGN_IN_PATH());
    } else {
      alert(response?.message);
      return;
    }
  };

  // ================ 이메일
  //        state: 이메일 에러 상태      //
  const [userEmailError, setUserEmailError] = useState<boolean>(false);
  //        state: 이메일 readonly 상태      //
  const [emailReadonlyState, setEmailReadonlyState] = useState<boolean>(false);
  //        state: 이메일 에러 메세지 상태      //
  const [userEmailErrorMessage, setUserEmailErrorMessage] =
    useState<string>("");
  //        state: 이메일 요소 참조 상태      //
  const userEmailRef = useRef<HTMLInputElement | null>(null);
  //        state: 이메일 상태          //
  const [userEmail, setUserEmail] = useState<string>("");

  //        function: 이메일 정규식 처리 함수       //
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  //      event handler: 이메일 변경 이벤트 처리 함수      //
  const onUserEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUserEmail(value);
    setUserEmailError(false);
    setUserEmailErrorMessage("");
  };

  // event handler: 이메일 인증번호 보내기      //
  const emailSend = async () => {
    const clientEmail = userEmailRef.current!.value;

    // 이메일 형식 검사
    if (!validateEmail(clientEmail)) {
      alert("올바른 이메일 형식이 아닙니다.");
      return;
    }

    const success = await sendEmailRequest(clientEmail);
    if (success) {
      setEmailReadonlyState(true);
      setUserEmailError(false);
      setUserEmailErrorMessage("");
    }
  };
  // ================인증번호=================================
  //        state: 인증번호 요소 참조 상태      //
  const authNumberRef = useRef<HTMLInputElement | null>(null);

  //        state: 인증번호 readonly 상태      //
  const [authNumReadonlyState, setAuthNumReadonlyState] =
    useState<boolean>(false);
  //        state: 인증번호 상태      //
  const [authNumber, setAuthNumber] = useState<string>("");
  //        state: 인증번호 에러 상태      //
  const [authNumberError, setAuthNumberError] = useState<boolean>(false);
  //        state: 인증번호 에러 메세지 상태      //
  const [authNumberErrorMessage, setAuthNumberErrorMessage] =
    useState<string>("");

  //      event handler: 인증번호 변경 이벤트 처리 함수      //
  const onAuthNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setAuthNumber(value);
    setAuthNumberError(false);
    setAuthNumberErrorMessage("");
  };

  // event handler: 인증번호 일치 확인      //
  const handleVerifyEmailClickHandler = async () => {
    const emailAuthNumber = authNumberRef.current!.value;
    console.log("입력한 인증번호" + emailAuthNumber);

    const success = await sendEmailAuthNumber(emailAuthNumber);
    console.log("인증번호 인증 버튼 결과 : " + success);
    if (success) {
      setAuthNumReadonlyState(true);
      setAuthNumberError(false);
      setAuthNumberErrorMessage("");
    }
  };

  // ============================변경 비밀번호
  //        state: 새로운 비밀번호 요소 참조 상태      //
  const modafiyPasswordRef = useRef<HTMLInputElement | null>(null);
  //        state: 새로운 비밀번호 상태      //
  const [modifyPassword, setModifyPassword] = useState<string>("");
  //        state: 새로운 비밀번호 에러 상태      //
  const [modifyPasswordError, setModifyPasswordError] =
    useState<boolean>(false);
  //        state: 새로운 비밀번호 에러 메세지 상태      //
  const [modifyPasswordErrorMessage, setModifyPasswordErrorMessage] =
    useState<string>("");
  // event handler: 새로운 비밀번호 변경 이벤트 처리 함수      //
  const onModifyPasswordChangeHandler = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setModifyPassword(value);
    setModifyPasswordError(false);
    setModifyPasswordErrorMessage("");
    setModifyPasswordCheckError(false);
    setModifyPasswordCheckErrorMessage("");
  };

  // ====================변경 비밀번호 확인
  //        state: 새로운 비밀번호 확인 요소 참조 상태      //
  const modifyPasswordCheckRef = useRef<HTMLInputElement | null>(null);
  //        state: 새로운 비밀번호 확인 상태      //
  const [modifyPasswordCheck, setModifyPasswordCheck] = useState<string>("");
  //        state: 새로운 비밀번호 확인 에러 상태      //
  const [modifyPasswordCheckError, setModifyPasswordCheckError] =
    useState<boolean>(false);
  //        state: 새로운 비밀번호 확인 에러 메세지 상태      //
  const [modifyPasswordCheckErrorMessage, setModifyPasswordCheckErrorMessage] =
    useState<string>("");
  // event handler: 새로운 비밀번호 확인 변경 이벤트 처리 함수      //
  const onModifyPasswordCheckhangeHandler = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setModifyPasswordCheck(value);
    setModifyPasswordCheckError(false);
    setModifyPasswordCheckErrorMessage("");
    setModifyPasswordError(false);
    setModifyPasswordErrorMessage("");
  };

  return (
    <div className={"find-passwordModify-wrap"}>
      <div className={"find-passwordModify-container"}>
        <div className={"find-passwordModify-top"}>
          <div className={"find-passwordModify-title"}>비밀번호 찾기</div>
        </div>
        <div className={"find-passwordModify-mid"}>
          <div
            className={"find-passwordModify-mid-auth-container"}
            style={{
              borderBottom: emailReadonlyState
                ? "none"
                : "1px solid rgba(0, 0, 0, 0.143)",
            }}
          >
            <InputBox
              ref={userEmailRef}
              label="이메일"
              type={"text"}
              placeholder="이메일을 입력해주세요."
              value={userEmail}
              onChange={onUserEmailChangeHandler}
              error={userEmailError}
              message={userEmailErrorMessage}
              readonly={emailReadonlyState}
            />

            {emailReadonlyState ? (
              <div className="find-passwordModify-mid-auth-btn-off">인증</div>
            ) : (
              <div
                className="find-passwordModify-mid-auth-btn-on"
                onClick={emailSend}
              >
                인증
              </div>
            )}
          </div>

          <div
            className={"find-passwordModify-mid-auth-container"}
            style={{
              borderBottom: authNumReadonlyState
                ? "none"
                : "1px solid rgba(0, 0, 0, 0.143)",
            }}
          >
            <InputBox
              ref={authNumberRef}
              label="인증번호"
              type={"text"}
              placeholder="인증번호를 입력해주세요."
              value={authNumber}
              onChange={onAuthNumberChangeHandler}
              error={authNumberError}
              message={authNumberErrorMessage}
              readonly={authNumReadonlyState}
            />

            {authNumReadonlyState ? (
              <div className="find-passwordModify-mid-auth-btn-off">인증</div>
            ) : (
              <div
                className="find-passwordModify-mid-auth-btn-on"
                onClick={handleVerifyEmailClickHandler}
              >
                인증
              </div>
            )}
          </div>

          <InputBox
            ref={modafiyPasswordRef}
            label="새로운 비밀번호"
            type={"password"}
            placeholder="새로운 비밀번호를 입력해주세요."
            value={modifyPassword}
            onChange={onModifyPasswordChangeHandler}
            error={modifyPasswordError}
            message={modifyPasswordErrorMessage}
          />
          <InputBox
            ref={modifyPasswordCheckRef}
            label="새로운 비밀번호 확인"
            type={"password"}
            placeholder="확인을 위해 다시 입력해주세요."
            value={modifyPasswordCheck}
            onChange={onModifyPasswordCheckhangeHandler}
            error={modifyPasswordCheckError}
            message={modifyPasswordCheckErrorMessage}
          />
        </div>

        <div className={"find-passwordModify-bottom"}>
          <div
            className={"find-passwordModify-btn"}
            onClick={onFindPasswordBtnClickHandler}
          >
            변경
          </div>
          <div className={"find-passwordModify-cancel"} onClick={back}>
            이전
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindPassword;
