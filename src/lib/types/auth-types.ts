export interface VerifyEmailTypes {
  auth_id: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  userType: string | null;
  otp: string;
}

export interface ResetPasswordTypes {
  password: string;
  refreshToken: string | null;
}
