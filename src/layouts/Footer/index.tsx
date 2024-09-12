import React from "react";
import "./style.css";

const Footer = () => {
  return (
    <div id="footer-wrap">
      <div className="footer-top-box">
        <div className="footer-top-box-left">
          <div className="footer-top-box-left-item1">
            <div className="footer-left-item1-title">서비스</div>
            <div>기능</div>
            <div>보안</div>
            <div>이용요금</div>
            <div>도입사례</div>
          </div>
          <div className="footer-top-box-left-item2">
            <div className="footer-left-item2-title">업종별 활용</div>
            <div>도소매업</div>
            <div>미용업</div>
            <div>몰류 운송업</div>
            <div>건설업</div>
          </div>
        </div>
        <div className="footer-top-box-right">
          <div className="footer-top-box-right-title">고객센터 1234-5678</div>
          <div>운영시간 평일 10:00 - 18:00</div>
          <div>점심시간 평일 13:00 - 14:00</div>
          <div>1:1문의하기는 앱에서만 가능합니다.</div>
          <div className="footer-question-box">자주 묻는 질문</div>
        </div>
      </div>
      {/* <div className="footer-bottom-box"></div> */}
    </div>
  );
};

export default Footer;
