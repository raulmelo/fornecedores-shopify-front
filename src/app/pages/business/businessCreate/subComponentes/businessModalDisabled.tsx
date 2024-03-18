import { Button, Spinner, Toast, Text, ButtonGroup, Divider } from "@shopify/polaris";
import { BusinessResponseType } from "src/app/types/Business.types";
import BusinessServices from "src/app/api/Business";
import { FeedbackTypes } from "src/app/types";
import { useState } from "react";

interface ModalBusinessAddUserProps {
  id: number | string;
  business: BusinessResponseType;
  updateList: () => void;
  onCanceled: () => void;
}


export default function ModalBusinessDisabled(props: ModalBusinessAddUserProps) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackTypes>({
    show: false,
    message: "",
    type: "success",
  });


  function setBusinessDisabled() {
    BusinessServices.disabledBusiness(props.id).then((_: any) => {
      setFeedback({ show: true, message: "Empresa desabilitada com sucesso", type: "success" });
      props.onCanceled();
    }).finally(() => {
      setLoading(false);
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
        <Spinner accessibilityLabel="Spinner example" size="large" />
      </div>
    );
  }

  return (
    <>
      <div className="block">{toastMarkup}</div>
      <div>
        <Text variant="bodyLg" as="h3">
          Você tem certeza que deseja desativar a empresa{" "}
          <strong>{props.business.title} </strong>?
        </Text>
        <div className="flex my-2"></div>
        <Divider borderColor="border" />
        <div className="flex my-2"></div>
        <div className="flex flex-end justify-end">
          <ButtonGroup>
            <Button onClick={() => props.onCanceled()}>
              Cancelar
            </Button>
            <Button onClick={ () => setBusinessDisabled() } variant="primary" tone="critical">
              Disabilitar empresa
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </>
  );
}
