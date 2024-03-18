import { useState } from 'react';
  import  './FornecedorCreatepage.scss'
import {
  Card,
  FormLayout,
  Layout,
  Page,
  BlockStack,
  Text,
  InlineGrid,
  Button,
} from "@shopify/polaris";
import { Controller, useForm } from 'react-hook-form';
import { RegisterUserTypes } from '../Fornecedor-types';
import InputMask from 'react-input-mask';
import { ROLES, ROLES_TYPES } from 'src/app/constants/roles';
import Toastie from 'src/app/utilities/Toastie';
import { AuthServices }  from 'src/app/api/Auth';
import { useNavigate } from 'react-router-dom';

export default function FornecedorCreatePage() {
  const navigate = useNavigate();
  const toast = new Toastie();
  const { register, handleSubmit, control, setValue} =
    useForm<RegisterUserTypes>();


  const [roleIn, setRoleIn] = useState<ROLES_TYPES>(ROLES.FORNECEDOR);
  
  const onSubmit = (data: RegisterUserTypes) => {

    if(data.password !== data.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    AuthServices.register(data).then((data: any) => {
      if (data.status === 'ok') {
        toast.success("Fornecedor criado com sucesso");
        return navigate("/fornecedores/list");
      } else {
        toast.error('Não foi possível criar o usuário');
      }
    });
  };

  const generatorPassword = () => {
    return 'my_project_' + Math.random().toString(36).slice(-8) + '@2024__temp';
  }

  return (
    <>
      <Page
        title="Criar fornecedor"
        backAction={{
          content: "Voltar",
          accessibilityLabel: "Voltar",
          url: "/fornecedores/list",
        }}
        primaryAction={
          <Button onClick={handleSubmit(onSubmit as any)} variant="primary">
            Salvar
          </Button>
        }
      >
        <Layout>
          <form
            className="block w-full"
            onSubmit={handleSubmit(onSubmit as any)}
          >
            <Layout.Section>
              <Card>
                <FormLayout>
                  <Text as="h2" variant="headingMd">
                    Dados do fornecedor
                  </Text>
                  <div>
                    <label htmlFor="name">Nome Completo:</label>
                    <input
                      type="text"
                      {...register("name", { required: true })}
                      id="name"
                      className="input-default"
                    />
                  </div>
                  <div className="mt-4">
                    <label htmlFor="email">Email:</label>
                    <input
                      type="email"
                      {...register("email", { required: true })}
                      id="email"
                      className="input-default"
                    />
                  </div>
                  <div className="mt-4">
                    <label htmlFor="cpf">CPF:</label>
                    <Controller
                      name="cpf"
                      defaultValue=""
                      control={control}
                      render={({ field }) => (
                        <InputMask
                          {...field}
                          mask="999.999.999-99"
                          maskChar=" "
                          className="input-default"
                        />
                      )}
                    />
                  </div>
                </FormLayout>
              </Card>
            </Layout.Section>
            <Layout.Section>
              <Card>
                <Text as="h2" variant="headingMd">
                  Permissão de acesso
                </Text>
                <Text as="p" variant="bodySm">
                  Selecione as permissões de acesso para o usuário. <br />
                  Cuidado com as permissões de acesso, pois elas podem
                  comprometer a segurança do sistema.
                </Text>
                <div className="mt-4">
                  <label htmlFor="role">Permissão:</label>
                  <select
                    {...register("role", { required: true })}
                    id="role"
                    onChange={(value: any) => {
                      if (value.target.value !== roleIn) {
                        setRoleIn(value.target.value);
                      }
                    }}
                    className="input-default"
                    defaultValue={ROLES.FORNECEDOR}
                  >
                    <option value={ROLES.MASTER}>
                      Permissão geral de tudo
                    </option>
                    <option value={ROLES.ADMIN}>
                      Administrador da plataforma
                    </option>
                    <option value={ROLES.FORNECEDOR}>Fornecedor</option>
                    <option value={ROLES.VISUALIZADOR}>Apenas visualiza</option>
                  </select>
                </div>
              </Card>
            </Layout.Section>
            <Layout.Section>
              <Card>
                <BlockStack gap={"050"}>
                  <InlineGrid columns={"1fr auto"}>
                    <div>
                      <Text as="h2" variant="headingMd">
                        Criar uma senha inicial
                      </Text>
                      <Text as="p" variant="bodySm">
                        A senha pode ser alterada depois.
                      </Text>
                      <div className="mt-2"></div>
                    </div>
                    <Button
                      variant="plain"
                      onClick={() => {
                        const value = generatorPassword();
                        setValue("password", value);
                        setValue("confirmPassword", value);
                      }}
                      accessibilityLabel="Gerar senha"
                    >
                      Gerar senha
                    </Button>
                  </InlineGrid>
                </BlockStack>
                <FormLayout>
                  <FormLayout.Group>
                    <div>
                      <label htmlFor="password">Senha:</label>
                      <input
                        type="text"
                        {...register("password", { required: true })}
                        id="password"
                        className="input-default"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword">Confirma senha:</label>
                      <input
                        type="confirmPassword"
                        {...register("confirmPassword", { required: true })}
                        id="confirmPassword"
                        className="input-default"
                      />
                    </div>
                  </FormLayout.Group>
                </FormLayout>
              </Card>
            </Layout.Section>
          </form>
        </Layout>
      </Page>
    </>
  );
}
