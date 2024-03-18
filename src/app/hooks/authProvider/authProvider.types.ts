import { ROLES_TYPES } from "src/app/constants/roles";
import { UserCommonTypes, UserTypes } from "src/app/types/User.types";

export type AuthState = {
  token: string | null;
  userInfo: UserCommonTypes
};

export type AuthContext = {
  authState: any | null;
  myUser: UserCommonTypes;
  isAuthenticated: () => boolean;
  roleUser: () => ROLES_TYPES | null;
  login: (token: string, user: UserTypes) => Promise<void>;
  logout: () => void;
};
