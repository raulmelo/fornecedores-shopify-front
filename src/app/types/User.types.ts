import { ROLES_TYPES } from "../constants/roles";

export interface UserTypes {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
}

export interface UserToken {
    token: string;
}

export interface UserCommonTypes {
    cpf: string;
    email: string;
    id: string;
    name: string;
    role: ROLES_TYPES | null | undefined;
    notes?: string;
}