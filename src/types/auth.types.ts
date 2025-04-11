export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    avatar?: string;
    address?: string;
    birthday?: string;
    points: number;
    isEmailVerified?: boolean;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    verificationCode: string | null;
}

export enum AuthActionTypes {
    LOGIN_REQUEST = 'LOGIN_REQUEST',
    LOGIN_SUCCESS = 'LOGIN_SUCCESS',
    LOGIN_FAILURE = 'LOGIN_FAILURE',
    REGISTER_REQUEST = 'REGISTER_REQUEST',
    REGISTER_SUCCESS = 'REGISTER_SUCCESS',
    REGISTER_FAILURE = 'REGISTER_FAILURE',
    LOGOUT = 'LOGOUT',
    VERIFY_EMAIL_REQUEST = 'VERIFY_EMAIL_REQUEST',
    VERIFY_EMAIL_SUCCESS = 'VERIFY_EMAIL_SUCCESS',
    VERIFY_EMAIL_FAILURE = 'VERIFY_EMAIL_FAILURE',
    RESEND_VERIFICATION_CODE = 'RESEND_VERIFICATION_CODE',
    UPDATE_USER_PROFILE = 'UPDATE_USER_PROFILE',
    CHANGE_PASSWORD = 'CHANGE_PASSWORD',
    CLEAR_ERROR = 'CLEAR_ERROR'
}

interface LoginRequestAction {
    type: AuthActionTypes.LOGIN_REQUEST;
}

interface LoginSuccessAction {
    type: AuthActionTypes.LOGIN_SUCCESS;
    payload: User;
}

interface LoginFailureAction {
    type: AuthActionTypes.LOGIN_FAILURE;
    payload: string;
}

interface RegisterRequestAction {
    type: AuthActionTypes.REGISTER_REQUEST;
}

interface RegisterSuccessAction {
    type: AuthActionTypes.REGISTER_SUCCESS;
    payload: User;
}

interface RegisterFailureAction {
    type: AuthActionTypes.REGISTER_FAILURE;
    payload: string;
}

interface LogoutAction {
    type: AuthActionTypes.LOGOUT;
}

interface VerifyEmailRequestAction {
    type: AuthActionTypes.VERIFY_EMAIL_REQUEST;
}

interface VerifyEmailSuccessAction {
    type: AuthActionTypes.VERIFY_EMAIL_SUCCESS;
    payload: User;
}

interface VerifyEmailFailureAction {
    type: AuthActionTypes.VERIFY_EMAIL_FAILURE;
    payload: string;
}

interface ResendVerificationCodeAction {
    type: AuthActionTypes.RESEND_VERIFICATION_CODE;
    payload: string;
}

interface UpdateUserProfileAction {
    type: AuthActionTypes.UPDATE_USER_PROFILE;
    payload: Partial<User>;
}

interface ChangePasswordAction {
    type: AuthActionTypes.CHANGE_PASSWORD;
}

interface ClearErrorAction {
    type: AuthActionTypes.CLEAR_ERROR;
}

export type AuthAction =
    | LoginRequestAction
    | LoginSuccessAction
    | LoginFailureAction
    | RegisterRequestAction
    | RegisterSuccessAction
    | RegisterFailureAction
    | LogoutAction
    | VerifyEmailRequestAction
    | VerifyEmailSuccessAction
    | VerifyEmailFailureAction
    | ResendVerificationCodeAction
    | UpdateUserProfileAction
    | ChangePasswordAction
    | ClearErrorAction; 