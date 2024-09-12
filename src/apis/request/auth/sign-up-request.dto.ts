export default interface SignUpRequestDto{
  email: string | null | undefined;
  profileImage: string | null | undefined,
  nickname: string;
  password: string;
  passwordCheck: string | null | undefined
}