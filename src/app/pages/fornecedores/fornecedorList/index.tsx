import { useCallback, useEffect, useState } from 'react';
  import  './FornecedorListpage.scss'
import { Badge, Button, Card, IndexTable, Layout,  Modal,  Page, SkeletonBodyText, SkeletonPage, TextContainer, Text, Toast } from '@shopify/polaris';
import { AuthServices }  from 'src/app/api/Auth';
import { TableFornecedorTypes } from '../Fornecedor-types';

export default function FornecedorListPage() {

  const [loading, setLoading] = useState(true);
  const [dataTable, setDataTable] = useState<any>([]);
  const [idDeleteConfirm, setIdDeleteConfirm] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });

   const handleChange = useCallback(
     (id: number | null) => setIdDeleteConfirm(id),
     [idDeleteConfirm]
   );


  useEffect(() => {
    setLoading(true);
    AuthServices.getUsers().then(( data: any ) => {
      setDataTable(data.result);
      setLoading(false);
    });
  }, []);

  const userData: TableFornecedorTypes = idDeleteConfirm ? dataTable.find((item: TableFornecedorTypes) => item.id === idDeleteConfirm) : null;


  const deleteUser = () => {
    AuthServices.userDelete(String(idDeleteConfirm)).then((data: any) => {
      if (data.status === 'ok') {
        const newData = dataTable.filter(
          (item: TableFornecedorTypes) => item.id !== idDeleteConfirm
        );
        setDataTable(newData);
        handleChange(null);
        setFeedback({ show: true, message: "Usuário deletado com sucesso" });
      }
    });
  }


  const toastMessage = feedback.show ? (
    <Toast content={feedback.message} onDismiss={ () => setFeedback({ ...feedback, show: false }) } />
  ) : null;
  


  
  const renderCell = () => {
    return dataTable.map((item: TableFornecedorTypes, index: number) => {
      return (
        <IndexTable.Row key={item.id} id={String(item.id)} position={index}>
          <IndexTable.Cell>{item.name}</IndexTable.Cell>
          <IndexTable.Cell>{item.email}</IndexTable.Cell>
          <IndexTable.Cell>{item.cpf}</IndexTable.Cell>
          <IndexTable.Cell>{item.role}</IndexTable.Cell>
          <IndexTable.Cell>
            <button onClick={() => handleChange(Number(item.id))}>
              <Badge tone="critical">Remover</Badge>
            </button>
          </IndexTable.Cell>
        </IndexTable.Row>
      );
    });
  }
  

  if (loading) {
    return (
      <SkeletonPage>
        <Layout>
          <Layout.Section>
            <Card>
              <SkeletonBodyText />
            </Card>
          </Layout.Section>
        </Layout>
      </SkeletonPage>
    );
  }

  return (
    <Page
      title="Todos fornecedores"
      backAction={{
        content: "Voltar",
        accessibilityLabel: "Voltar",
        url: "/fornecedores/list",
      }}
      primaryAction={
        <Button url="/fornecedores/create" variant="primary">
          Adicionar novo fornecedor
        </Button>
      }
    >
      <Layout>
        <Layout.Section>
          <Card>
            <Button variant="tertiary">Fornecedores</Button>
            <div className="py-3">
              <hr />
            </div>
            <IndexTable
              hasZebraStriping
              selectable={false}
              headings={[
                { title: "Nome" },
                { title: "Email" },
                { title: "CPF" },
                { title: "Tipo" },
                { title: "Ações" },
              ]}
              itemCount={3}
            >
              {renderCell()}
            </IndexTable>
          </Card>
        </Layout.Section>
      </Layout>
      <Modal
        open={!!idDeleteConfirm}
        title="Atentção ao excluir um fornecedor"
        onClose={() => handleChange(null)}
        primaryAction={{
          content: "Deletar usuário",
          destructive: true,
          onAction: () => deleteUser(),
        }}
        secondaryActions={[
          {
            content: "Cancelar",
            onAction: () => {
              handleChange(null);
            },
          },
        ]}
      >
        <Modal.Section>
          <TextContainer>
            <Text variant="headingLg" as="h2">
              <strong>{userData && userData.name}</strong>
            </Text>
            <Text variant="headingSm" as="h2">
              {userData && userData.cpf}
            </Text>
            <p>
              <span className="py-2"></span>
              Ao excluir um fornecedor, você perderá todas as informações
              relacionadas a ele, todos os dados serão apagados e ele não tera
              mais acesso a plataforma.
            </p>
          </TextContainer>
        </Modal.Section>
      </Modal>
      {toastMessage}
    </Page>
  );
}
