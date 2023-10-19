export interface IUser {
  email: string;
  password: string;
  returnSecureToken?: boolean;
}

export interface IFireBaseAuthResponse {
  idToken: string;
  expiresIn: string;
}
