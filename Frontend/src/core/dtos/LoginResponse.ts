export default interface LoginResponse {
  message: string;
  data: {
    username: string;
    token: string;
    id: number;
    profile_image: string;
  };
}
