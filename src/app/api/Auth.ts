import Api from ".";
import { FormLoginTypes } from "../pages/auth/login/LoginTypes";
import { RegisterUserTypes } from "../pages/fornecedores/Fornecedor-types";
import { UserCommonTypes, UserTypes } from "../types/User.types";
import Cookie from "../utilities/Cookie";

  const login = async (data: FormLoginTypes) => {
    const response = await Api.post("/auth/login", {
      email: data.email,
      password: data.password,
    });

    return response.data;
  }

  const resetPassword = async (email: string) => {
    const response = await Api.post("/auth/reset-password", { email: email });
    return response.data
  }


  const getUserMe = async () => {
    const response = await Api.get<{ user: { email: string; role: string; id: string } }>("/auth/me");
    return response.data;
  }

  const getUsers = async () => {
    const reponse = await Api.get<{ result: UserCommonTypes[], status: string }>("/users");
    return reponse.data;
  }

  const resetPasswordToken = async (
    token: string,
    password: string,
    confirmPassword: string
  ) => {
    const response = await Api.patch(`/auth/reset-password/${token}`, {
      password: password,
      confirmPassword: confirmPassword,
    });
    return response.data;
  }


  const register = async (data: RegisterUserTypes) => {
    const response = await Api.post("/auth/register", data);
    return response.data;
  }

  const userDelete = async (id: string) => {
    const response = await Api.delete(`/users/${id}`);
    return response.data;
  }


  const setLogin = (token: string, user: UserTypes) => {
    const userString = JSON.stringify(user);
    Cookie.setCookie("tokenmy_project", token, 1);
    Cookie.setCookie("user", userString, 1);
    window.location.reload();
  }

  const logout = () => {
    Cookie.eraseCookie("tokenmy_project");
    Cookie.eraseCookie("user");
    window.location.reload();
  }

export const AuthServices = {
  login,
  resetPassword,
  getUserMe,
  getUsers,
  resetPasswordToken,
  register,
  setLogin,
  logout,
  userDelete,
} as const;
