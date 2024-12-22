export interface User {
    id: string;
    login: string;
    firstName: string;
    lastName: string;
}

export interface LoginCredentials {
    login: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    firstName: string;
    lastName: string;
}
export interface AuthResponse {
    token: string;
    user: {
        id: string;
        login: string;
        firstName: string;
        lastName: string;
    };
}

export interface ApiError {
    message: string;
}
export interface RegisterFormData {
    login: string;
    password: string;
}
