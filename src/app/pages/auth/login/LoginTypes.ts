export interface FormLoginTypes {
    email: string;
    password: string;
}

export interface FormResetPasswordTypes {
    email: string;
}

export interface FormResetPasswordTokenTypes {
    token?: string;
    password: string;
    confirmPassword: string;
}
