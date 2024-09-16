export interface ResetForgottenPasswordDTO {
    userId: string;
    token: string;
    newPassword: string;
}
