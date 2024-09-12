import React, { useEffect, useState } from "react";
import "./style.css";
import { Comment } from "../../types/interface";
import loginUserStore from "../../store/login-user.store";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { USER_BOARD } from "../../constant";
import { deleteComment } from "../../apis";
import { useCookies } from "react-cookie";
import ResponseDto from "../../apis/response/response.dto";
import { ResponseUtil } from "../../utils";
import { AxiosResponse } from "axios";

interface Props {
  comment: Comment;
  reRenderComment: () => void;
}

const CommentItem = ({ comment, reRenderComment }: Props) => {
  const navigator = useNavigate();
  const [createDateTime, setCreateDateTime] = useState<string | null>("");
  const { loginUser } = loginUserStore();
  const [cookies, setCookies] = useCookies();

  const timeFormat = moment(comment.createDateTime).format(
    "YYYY. MM. DD HH:mm:ss"
  );

  useEffect(() => {
    setCreateDateTime(timeFormat);
  }, []);

  const userBoard = () => {
    navigator(USER_BOARD(comment.user.email));
  };
  const deleteCommentClick = () => {
    if (!loginUser) {
      return;
    }

    if (window.confirm("정말 삭제하시겠습니까?")) {
      deleteComment(comment.commentId, cookies.accessToken).then(
        deleteCommentResponse
      );
      alert("삭제되었습니다.");
      window.location.reload();
    }
  };
  const deleteCommentResponse = (
    response: AxiosResponse | ResponseDto | null
  ) => {
    if (!response) {
      return;
    }
    const result = response as AxiosResponse;
    if (result.status === 200) {
      reRenderComment();
    }
  };
  return (
    <div className="comment-item-wrap">
      <div className="comment-item-top">
        <div className="comment-user-box" onClick={userBoard}>
          {comment.user.profileImage ? (
            <div className="comment-profile-img-box pointer">
              <div
                className="profile-img"
                style={{ backgroundImage: `url(${comment.user.profileImage})` }}
              ></div>
            </div>
          ) : (
            <div className="board-detail-profile-img pointer"></div>
          )}
          <div className="comment-item-nickname pointer">
            {comment.user.nickname}
          </div>
        </div>
        <div className="height-line-box">
          <div className="height-line"></div>
        </div>
        <div className="comment-item-date">{createDateTime}</div>
        {loginUser?.email === comment.user.email && (
          <div
            className="comment-item-delete pointer"
            onClick={deleteCommentClick}
          ></div>
        )}
      </div>

      <div className="comment-item-detail">{comment.content}</div>
    </div>
  );
};

export default CommentItem;
