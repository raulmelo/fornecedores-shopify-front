import { Button, Spinner, Toast } from "@shopify/polaris";
import { useEffect, useState } from "react";
import { AuthServices } from "src/app/api/Auth";
import { BusinessResponseType } from "src/app/types/Business.types";
import { UserCommonTypes } from "src/app/types/User.types";
import { PlusIcon, DeleteIcon } from "@shopify/polaris-icons";
import BusinessServices from "src/app/api/Business";

interface ModalBusinessAddUserProps {
    id: number | string;
    business: BusinessResponseType;
    updateList: () => void;
}

interface UserCardTypes extends UserCommonTypes {
  register: boolean;
}


export default function ModalBusinessAddUser(props: ModalBusinessAddUserProps) {

  const [ loading, setLoading ] = useState(true);
  const [ sendingLoading, setSendingLoading ] = useState<number | string | null>(null);
  const [users, setUsers] = useState<UserCardTypes[]>([]);
  const [feedback, setFeedback] = useState<{ show: boolean; message: string, type: 'success' | 'error' }>({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    initialize();
  }, []);



  const initialize = () => {
    setLoading(true);
    AuthServices.getUsers()
      .then((data: { result: UserCommonTypes[]; status: string }) => {
        if (data.status === "ok") {
          const users: any = props.business.users
          const regitredIds = users.map((item: any) => item.id);
          const list = data.result.map((item: UserCommonTypes) => {
            return { ...item, register: regitredIds.includes(item.id)};
          });
          setUsers(list);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  function updateBusiness() {
    BusinessServices.getBusinessById(props.id).then( (data: any) => {
      const usersUpdateds = users.map((item: any) => {
        const findUser = data.users.find((user: any) => user.id === item.id);
        return {
          ...item,
          register: findUser ? true : false,
        };
      });
      setUsers(usersUpdateds);
    }
    );
  }

  function onDeletedUser(id: number | string) {
    setSendingLoading(id);
    BusinessServices.removeUserBusiness(props.id, id).then((_: any) => {
      setFeedback({
        show: true,
        message: "Usuário removido com sucesso",
        type: "success",
      });
      updateBusiness();
    }).catch((error: any) => {
      const { data } = error.response;
      setFeedback({
        show: true,
        message: data.message ? data.message : "Erro ao remover usuário",
        type: "error",
      });
    }).finally(() => {
      setSendingLoading(null);
    })

  }

  function onAddUser(id: number | string) {
    setSendingLoading(id);
    BusinessServices.addUserBusiness(props.id, id).then(() => {
      setFeedback({ show: true, message: "Usuário adicionado com sucesso", type: "success" });
      updateBusiness()
    })
    .catch((_: any) => {
      setFeedback({ show: true, message: "Erro ao adicionar usuário", type: "error" });
    })
    .finally(() => {
      initialize();
      setSendingLoading(null);
    })
  }

  const toastMarkup = feedback.show ? (
    <Toast
      content={feedback.message}
      error={feedback.type === "error"}

      onDismiss={() => setFeedback({ ...feedback, show: false })}
    />
  ) : null;


  if (loading) {
    return (
      <div className="flex items-center justify-center py-3">
        <Spinner accessibilityLabel="Spinner example" size="large"  />
      </div>
    );
  }

    return (
      <>
        <div className="flex flex-col">
          {toastMarkup}
          {users.map((item: UserCardTypes) => (
            <div key={item.id} className="flex hover:bg-slate-50 flex-row items-center justify-between py-2 px-4 border-b border-gray-200">
              <div className="flex flex-col">
                <p className="text-lg font-medium">
                  <strong> {item.name}</strong>
                </p>
                <p className="text-xs text-gray-400">{item.email}</p>
              </div>
              <div className="flex flex-row">
                {!item.register && (
                  <Button
                    variant="primary"
                    icon={PlusIcon}
                    loading={sendingLoading === item.id}
                    onClick={() => onAddUser(item.id)}
                  >
                    Adicionar
                  </Button>
                )}
                {item.register && (
                  <Button
                    variant="primary"
                    tone="critical"
                    icon={DeleteIcon}
                    loading={sendingLoading === item.id}
                    onClick={() => onDeletedUser(item.id)}
                  >
                    Remover
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </>
    );
}

