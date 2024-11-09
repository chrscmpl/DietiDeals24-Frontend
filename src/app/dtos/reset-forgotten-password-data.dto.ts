export interface ResetForgottenPasswordDTO {
    userId: string;
    authToken: string;
    newPassword: string;
}
