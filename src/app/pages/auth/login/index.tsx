import { useForm } from 'react-hook-form';
import ImageLogo from 'src/assets/img/logo-lorem.svg'
import  './Loginpage.scss'

import { FormLoginTypes } from './LoginTypes';
import Toastie from 'src/app/utilities/Toastie';
import { useState } from 'react';
import { AuthServices }  from 'src/app/api/Auth';
import { UserTypes } from 'src/app/types/User.types';
import { useAuth } from 'src/app/hooks/authProvider';

export default function LoginPage() {
    const toast = new Toastie()
    const { login, isAuthenticated } = useAuth();
    const { register, handleSubmit} = useForm();

    const [feedback, setFeedback] = useState<{type: string, message: string, show: boolean}>({
        show: false,
        type: 'success',
        message: 'Login realizado com sucesso'
    })

    const onSubmit = (data: FormLoginTypes) => {
        setFeedback({
            show: false,
            type: '',
            message: ''
        })

        if(!data.email || !data.password) {
            toast.error('Preencha os campos corretamente')
            return
        }
        AuthServices.login(data).then(
          (response: any) => {
            const { result: { user, token } } = response;

            login(token, user as UserTypes);
            toast.success("Login realizado com sucesso");
            setFeedback({
              show: true,
              type: "success",
              message: "Login realizado com sucesso",
            });
          },
          (error) => {
            const { data } = error.response;
            toast.error(data.message ? data.message : "Erro ao realizar login");
            setFeedback({
              show: true,
              type: "error",
              message: data.message ? data.message : "Erro ao realizar login",
            });
          }
        );
    }

    if (isAuthenticated()) {
      window.location.href = "/";
    }

  return <>
   <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
              <img className="w-[200px] h-[100px] mr-2" src={ImageLogo} alt="logo"/>
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                      Acesse sua conta
                  </h1>
                  <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit as any)}> 
                      <div>
                          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seu email</label>
                          <input type="email" id="email" autoComplete='email'  {...register("email", { required: true })} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" />
                      </div>
                      <div>
                          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha</label>
                          <input type="password"  {...register("password", { required: true })} id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                      </div>
                      <div className="flex items-center justify-between">
                          <a href="/auth/reset-password" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Esqueceu sua senha?</a>
                      </div>
                      {feedback.show && <div className={`flex items-center justify-center py-3 mt-4 text-sm bg-primary-100`}> {feedback.message} </div>}
                      <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Acessar</button>
                  </form>
              </div>
          </div>
      </div>
    </section>
  </>
}
