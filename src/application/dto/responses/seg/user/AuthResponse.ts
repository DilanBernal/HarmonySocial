type AuthResponse = {
  id?: number;
  username: string;
  token: string;
  profile_image: string;
  roles?: string[];
};

export default AuthResponse;
