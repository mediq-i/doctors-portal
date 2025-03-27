export interface VerifyEmailTypes {
  auth_id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  userType: string;
  otp: string;
}

export interface ResetPasswordTypes {
  password: string;
  refreshToken: string | null;
}
