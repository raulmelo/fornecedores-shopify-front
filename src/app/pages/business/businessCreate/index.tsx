import {
  Button,
  Card,
  Layout,
  Modal,
  Page,
  SkeletonBodyText,
  SkeletonPage,
  Toast,
  Text
} from "@shopify/polaris";
import { useEffect, useState } from 'react';
import BusinessServices from "src/app/api/Business";
import { BusinessResponseType } from "src/app/types/Business.types";
import "../business-styles.scss";
import BusinessCard from "./subComponentes/businessCard";
import ModalBusinessAddUser from "./subComponentes/businessModalAction";
import ModalBusinessDisabled from "./subComponentes/businessModalDisabled";
import BusinessModalCreate from "./subComponentes/businessModalCreate";
import { useAuth } from "src/app/hooks/authProvider";


interface BusinessModalTypes {
  type: "add" | "edit" | "disabled" | 'create';
  id: number | null | string;
  data: BusinessResponseType;
  show: boolean;
}

export default function BusinessCreatePage() {
  const { roleUser, myUser } = useAuth();

  const role = roleUser() || 'VISUALIZADOR';
  const [loading, setLoading] = useState(true);
  const [dataTable, setDataTable] = useState<BusinessResponseType[]>([]);
  const [modal, setModal] = useState<BusinessModalTypes>({
    type: "add",
    id: null,
    show: false,
    data: {} as BusinessResponseType,
  });



  const [feedback, setFeedback] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });

  


  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    setLoading(true);
    try {
      const data = ['MASTER', 'ADMIN'].includes(role) ? await BusinessServices.getBusiness() : await BusinessServices.getBusinessByUser(myUser?.id);
      setDataTable(data);
      setLoading(false);
    } catch (error: any) {
      setFeedback({ show: true, message: error?.message ? error.message : 'Não foi possível carregar os dados' });
      setDataTable([]);
      setLoading(false);
    }
  };

  function modalAddUser(id: number | string, business: BusinessResponseType) {
    setModal({
      type: "add",
      id: id,
      show: true,
      data: business,
    });
  }




  const toastMessage = feedback.show ? (
    <Toast
      content={feedback.message}
      onDismiss={() => setFeedback({ ...feedback, show: false })}
    />
  ) : null;

    

  const renderCell = () => {

    if(!loading && dataTable.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-3">
          <img
            src={"/images/empty-figure.svg"}
            style={{ maxWidth: 500 }}
            alt=""
          />
          <Text variant="heading2xl" as="h2">
            Nenhuma empresa encontrada
          </Text>
        </div>
      );
    }


    return dataTable.map((item: BusinessResponseType, index: number) => {
      return (
        <BusinessCard
          business={item}
          key={index}
          role={role}
          onDisabledBusiness={(id: number | string) => {
            setModal({
              type: "disabled",
              id: id,
              show: true,
              data: item,
            });
          }}
          onAddUser={(id: number | string) => {
            modalAddUser(id, item);
          }}
          onUpdatedBusiness={() => initialize()}
        />
      );
    });
  };

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
      title="Empresas cadastradas"
      primaryAction={
        ['MASTER', 'ADMIN'].includes(role) ? (
          <Button onClick={
            () => setModal({ ...modal, show: true, type: 'create' })
          } variant="primary">Adicionar empresa</Button>
        ) : <></>
      }
    >
      <Layout>
        <Layout.Section>{renderCell()}</Layout.Section>
      </Layout>
      <Modal
        open={!!modal.show}
        title={
          modal.type === "add"
            ? "Adicionar usuário"
            : modal.type === "disabled"
            ? "Empresa"
            : "Deletar empresa"
        }
        onClose={() => {
          setModal({ ...modal, show: false });
          initialize();
        }}
      >
        <Modal.Section>
          {modal.type === "add" ? (
            modal.id &&
            modal.data && (
              <ModalBusinessAddUser
                updateList={() => initialize()}
                id={modal.id}
                business={modal.data}
              />
            )
          ) : modal.type === "disabled" ? (
            modal.id &&
            modal.data && (
              <ModalBusinessDisabled
                id={modal.id}
                business={modal.data}
                updateList={() => initialize()}
                onCanceled={() => {
                  setModal({ ...modal, show: false });
                  initialize();
                }}
              />
            )
          ) : modal.type === "create" ? (
            <BusinessModalCreate onCloseModal={ () => {
              setModal({ ...modal, show: false });
              initialize();
            }} />  
          ) : null }
        </Modal.Section>
      </Modal>
      {toastMessage}
    </Page>
  );
}
