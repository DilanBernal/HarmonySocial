export default interface LoginResponse {
  user: {
    id: number;
    full_name: string;
    email: string;
    username: string;
    profile_image: string;
    learning_points: number;
    favorite_instrument: string;
    is_artist: boolean;
  };
  token: string;
}
