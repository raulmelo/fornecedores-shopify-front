import { useForm } from "react-hook-form";
import ImageLogo from "src/assets/img/logo-lorem.svg";

import Toastie from "src/app/utilities/Toastie";
import { useState } from "react";
import { AuthServices } from "src/app/api/Auth";
import { FormResetPasswordTokenTypes } from "../login/LoginTypes";
import { useNavigate, useParams } from "react-router-dom";

export default function ResetPasswordPageToken() {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = new Toastie();
  const { register, handleSubmit } = useForm();

  const [feedback, setFeedback] = useState<{
    type: string;
    message: string;
    show: boolean;
  }>({
    show: false,
    type: "success",
    message: "Login realizado com sucesso",
  });

  const onSubmit = (data: FormResetPasswordTokenTypes) => {
    setFeedback({
      show: false,
      type: "",
      message: "",
    });

    if(data.password !== data.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (!data.password || !data.confirmPassword) {
      toast.error("Preencha os campos corretamente");
      return;
    }

    if(data.password.length < 6 || data.password.length > 20) {
      setFeedback({
        show: true,
        type: "error",
        message: "A senha deve conter no mínimo 6 caracteres e no máximo 20",
      });
      return;
    }

    if(!id) { 
      return toast.error("Ocorreu um erro ao enviar o código");
    }

    console.log(id)

    AuthServices.resetPasswordToken(id, data.password, data.confirmPassword).then(
      () => {
        toast.success("Senha cadastrada com sucesso");
        navigate('/auth/login', { replace: true })
      },
      (error) => {
        const { data } = error.response;
        toast.error(
          data.message ? data.message : "Ocorrreu um erro ao enviar o código"
        );
        setFeedback({
          show: true,
          type: "error",
          message: data.message
            ? data.message
            : "Ocorrreu um erro ao enviar o código",
        });
      }
    );
  };

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <img
              className="w-[200px] h-[100px] mr-2"
              src={ImageLogo}
              alt="logo"
            />
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <div className="flex items-center justify-between">
                <a
                  href="/auth/login"
                  className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Voltar para login
                </a>
              </div>
              <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Cadastrar senha
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleSubmit(onSubmit as any)}
              >
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Nova senha
                  </label>
                  <input
                    type="password"
                    id="password"
                    {...register("password", {
                      required: true,
                      minLength: 6,
                      maxLength: 20,
                    })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirme a senha
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    {...register("confirmPassword", {
                      required: true,
                      minLength: 6,
                      maxLength: 20,
                    })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div>
                  <ul>
                    <li className="text-xs text-center">
                      A senha deve conter no mínimo 6 caracteres e no máximo 20
                    </li>
                  </ul>
                </div>
                {feedback.show && (
                  <div
                    className={`flex items-center justify-center py-3 mt-4 text-sm bg-primary-100`}
                  >
                    {feedback.message}{" "}
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Cadastrar senha
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
