import { DropZone, LegacyStack, Modal, TextContainer, Text, Thumbnail, Toast, Link } from "@shopify/polaris";
import { useForm } from "react-hook-form";
import { BusinessCreateTypes } from "../../business-types";
import { useState, useCallback, useEffect } from "react";
import { NoteIcon } from "@shopify/polaris-icons";
import { FeedbackTypes } from "src/app/types";
import BusinessServices from "src/app/api/Business";

interface BusinessModalCreateProps {
  onCloseModal: () => void;
}

export default function BusinessModalCreate(props: BusinessModalCreateProps) {
    
    const [file, setFile] = useState<File>();
    const [feedback, setFeedback] = useState<FeedbackTypes>({ show: false, message: ''} as FeedbackTypes);
    const { register, handleSubmit, setValue, getValues } = useForm<BusinessCreateTypes>();



    

    function onSubmit(data: BusinessCreateTypes) {

        const validator = validators(data);
        if (!validator) {
          return;
        }


        BusinessServices.createBusiness(data).then((_: any) => {
            setFeedback({
                show: true,
                message: "Empresa criada com sucesso",
                type: "success",
            });
            setTimeout(() => {
              props.onCloseModal();
            })
        }).catch((error: any) => {
            setFeedback({
                show: true,
                message: error?.response?.data?.message ? error.response.data.message : "Erro ao criar empresa",
                type: "error",
            });
        }
        ).finally(() => {});
    }

    function validators(data: BusinessCreateTypes) {
        if (!!data.title && data.title.length < 3) {
          setFeedback({
            show: true,
            message: "O nome da empresa deve ter no mínimo 3 caracteres",
            type: "error",
          });
          return false;
        }

        if (!data.title) {
          setFeedback({
            show: true,
            message: "O nome da empresa é obrigatório",
            type: "error",
          });
          return false;
        }

        if (!data.cnpj) {
          setFeedback({
            show: true,
            message: "O CNPJ é obrigatório",
            type: "error",
          });
          return false;
        }

        if (!data.body_html) {
          setFeedback({
            show: true,
            message: "A descrição da empresa é obrigatória",
            type: "error",
          });
          return false;
        }

        if(file && file?.size > 1000000) {
          setFeedback({
            show: true,
            message: "A imagem da empresa deve ter no máximo 1MB",
            type: "error",
          });
          return false;
        }

        if (!data.imageUrl) {
          setFeedback({
            show: true,
            message: "A imagem da empresa é obrigatória",
            type: "error",
          });
          return false;
        }

        return true;
    }

     const handleDropZoneDrop = useCallback(
       (_dropFiles: File[], acceptedFiles: File[], _rejectedFiles: File[]) => 
         setFile(acceptedFiles[0]),
       []
     );

     useEffect(() => {
         if (!file) {
           return;
         }

         // Verifica se o arquivo é uma imagem
         if (!file.type.startsWith("image/")) {
           console.error("O arquivo não é uma imagem.");
           return;
         }

         const reader = new FileReader();

         reader.onload = (e) => {
           if (e.target?.result) {
             setValue("imageUrl", e.target?.result);
           }
         };

         reader.onerror = (error) => {
           console.error("Erro ao ler o arquivo: ", error);
         };
         reader.readAsDataURL(file);

     }, [file]);



    const validImageTypes = ["image/gif", "image/jpeg", "image/png"];

    const fileUpload = !file && <DropZone.FileUpload />;
    const uploadedFile = file && (
      <LegacyStack>
        <Thumbnail
          size="large"
          alt={file.name}
          source={
            validImageTypes.includes(file.type)
              ? window.URL.createObjectURL(file)
              : NoteIcon
          }
        />
        <div>
          {file.name}{" "}
          <Text variant="bodySm" as="p">
            {file.size} bytes
          </Text>
        </div>
      </LegacyStack>
    );

    const toastMarkup = feedback.show ? (
      <Toast
        content={feedback.message}
        error={feedback.type === "error"}
        onDismiss={() => setFeedback({ ...feedback, show: false })}
      />
    ) : null;
    
    return (
      <Modal
        instant
        size="large"
        open={true}
        onClose={() => props.onCloseModal()}
        title="Adicionar nova empresa"
        primaryAction={{
          content: "Adicionar",
          onAction: () => onSubmit(getValues()),
        }}
        secondaryActions={[
          {
            content: "Cancelar",
            onAction: () => props.onCloseModal(),
          },
        ]}
      >
        <Modal.Section>
          <TextContainer>
            {toastMarkup}
            <form
              className="block w-full"
              onSubmit={handleSubmit(onSubmit as any)}
              id="form-business-create"
            >
              <div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="">
                    <label htmlFor="title">Nome da Empresa (Fantasia):</label>
                    <input
                      type="text"
                      {...register("title", { required: true })}
                      id="title"
                      className="input-default"
                      maxLength={100}
                    />
                  </div>
                  <div className="">
                    <label htmlFor="title">CNPJ da empresa:</label>
                    <input
                      type="number"
                      {...register("cnpj", { required: true })}
                      id="cnpj"
                      className="input-default"
                      maxLength={100}
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <DropZone allowMultiple={false} onDrop={handleDropZoneDrop}>
                    {uploadedFile}
                    {fileUpload}
                  </DropZone>
                  <div className="flex flex-wrap gap-2 justify-between p-1">
                    <ul>
                      <li>Tamanho máximo de 1MB</li>
                      <li>Formatos aceitos: PNG, JPG, GIF</li>
                      <li>Dimensões máxima: 800x800px</li>
                    </ul>
                    <Link url="https://compressjpeg.com/pt/" target="_blank">
                      Comprimir imagem
                    </Link>
                    </div>
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="body_html">Descrição da empresa:</label>
                <textarea
                  className="input-default"
                  rows={4}
                  {...register("body_html")}
                  id="body_html"
                />
              </div>
            </form>
          </TextContainer>
        </Modal.Section>
      </Modal>
    );
}

