import { Button, ButtonGroup, CalloutCard, Layout, LegacyCard, Modal, Page, ProgressBar, Toast } from "@shopify/polaris";
import { useForm } from "react-hook-form";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { ProductsTypes } from "src/app/types/Products.types";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useEffect, useState } from "react";
import ProductsImagesForms from "./subComponents/formImages";
import VariantePreco from "src/app/components/VariantePreco/VariantePreco";
import { useAuth } from "src/app/hooks/authProvider";
import ProductsServices from "src/app/api/Products";
import { FeedbackTypes } from 'src/app/types';
import { Text} from '@shopify/polaris';

export default function ProductFormPage() {
  const { state } = useLocation();
  const { productId } = useParams();
  const { roleUser } = useAuth();

  const role = roleUser();
  const modePage = productId ? "edit" : "create";
  const title = modePage === "edit" ? "Editar produto" : "Criar produto";

  
  const [loading, setLoading] = useState(true);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [progressText, setProgressText] = useState('Aguarde...');
  const [progress, setProgress] = useState(0);
  const { register, setValue, getValues } = useForm<ProductsTypes>();
  const [feedback, setFeedback] = useState<FeedbackTypes>({ show: false, message: ''} as FeedbackTypes);
  const [imagesBase64, setImagesBase64] = useState<{src: string, name: string}[]>([]);

  /// 
  const [modalType, setModalType] = useState<{ show: boolean, description: string, type: string, title: string }>({} as any);
  
  useEffect(() => {
    if (state?.product) {
      setValue("variants", state.product.variants);
      setValue("product_type", state.product.product_type);
      setValue("title", state.product.title);
      setValue("body_html", state.product.body_html);
      setValue('images', state.product.images);
      setValue('status', state.product.status);
    }
    setLoading(false);
  }, []);


  function saveOnProduct(option = 'archived') { 
    setFeedback({...feedback, show: false});
    const data = getValues();
    let perfilHasPublish = role === 'FORNECEDOR' ? 'archived' : 'active';

    if(role === 'ADMIN' || role === 'MASTER') {
      perfilHasPublish = option;
    }


    if(modePage === "edit" && productId) {
      setProgress(0);

      const newData = {
        ...data,
        status: perfilHasPublish,
        vendor: state.vendor
      }
      setLoadingRequest(true);
      setProgress(10);
      ProductsServices.updateProduct(productId, newData).then(async () => {
        setProgress(25);
        await delay(1000)
        setProgressText('Atualizando Produto...');
        await deleteImagesId(newData);
        await delay(1000)
        setProgressText('Tratando imagens...');
        setProgress(50);
        await delay(1000)
        await addNewImages(productId);
        await delay(2000)
        setProgressText('Atualizando estoque...');
        await invetoryUpdate();
        setProgressText('Seu produto foi atualizado com sucesso!');
        setProgress(100);
      }).catch(() => {
        setLoadingRequest(false);
        setFeedback({
          show: true,
          message: "Ocorreu um erro ao atualizar o produto.",
          type: "error",
        });
      })
    }
  }

  async function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async function addNewImages(idProduct: string) {
    if(imagesBase64.length === 0) {
      return
    }
    await imagesBase64.forEach(async (image) => {
      return await ProductsServices.updateImagesProducts(idProduct, image).then(() => {
        setFeedback({
          show: true,
          message: "Imagens atualizadas com sucesso.",
          type: "success",
        });
        return true
        
      }).catch(() => {
        setFeedback({
          show: true,
          message: "Ocorreu um erro ao atualizar as imagens.",
          type: "error",
        });
        return false
      })
    })
  }

  async function invetoryUpdate() {
    const productsVariants = getValues('variants') as any;
    const productsVariantsState = state?.product?.variants || [];

    if(productsVariantsState === 0 || productsVariantsState.length === 0) {
      return 
    }


    productsVariantsState.forEach(async (variant: any) => {
      const variantState = productsVariants.find((v: any) => v.id === variant.id);
      if(variantState) {
        if(variantState.inventory_quantity !== variant.inventory_quantity) {
          await ProductsServices.updateInventoryProduct({
            inventory_item_id: variant.inventory_item_id,
            available_adjustment: variantState.inventory_quantity
          }).then(() => {
            setFeedback({
              show: true,
              message: "Estoque atualizado com sucesso.",
              type: "success",
            });
            return true
            
          }).catch(() => {
            setFeedback({
              show: true,
              message: "Ocorreu um erro ao atualizar o estoque.",
              type: "error",
            });
            return false
          })
        }
      }
    })

  }

  async function deleteImagesId (data: ProductsTypes) {
    const productImagesStates = state?.product?.images || [];

    if(productImagesStates.length === 0) return;

    const idsList = productImagesStates.map((image: any) => image.id).filter((id: any) => {
      return !data.images?.some((image: any) => image.id === id)
    });
    console.log('idsList', idsList)
    if(!productId || !idsList || idsList.length === 0) {
      return 
    }


    idsList.forEach(async (id: any) => {
      return await ProductsServices.deleteImageProduct(productId, id).then(() => {
        setFeedback({
          show: true,
          message: "Imagens deletadas com sucesso.",
          type: "success",
        });
        return true
      }).catch(() => {
        return false
      })
    })
  }


  if(!state?.vendorId || !state?.vendor || !state?.product.id) {
    return <Navigate to="/empresas/list" />;
  }

  if (modePage === "edit" && !state?.product) {
    return <Navigate to="/empresas/list" />;
  }

  if (loading) {
    return <div>Carregando...</div>;
  }

  const toastMarkup = feedback.show ? (
    <Toast
      content={feedback.message}
      error={feedback.type === "error"}
      onDismiss={() => setFeedback({ ...feedback, show: false })}
    />
  ) : null;

  return (
    <Page
      backAction={{ content: "Voltar", url: `/empresas/list` }}
      title={title}
      fullWidth
    >
      <form>
        <Layout>
          <Layout.Section>
            <LegacyCard sectioned>
              <div className="mb-4">
                <label htmlFor="title">Título:</label>
                <input
                  type="text"
                  {...register("title", { required: true })}
                  id="title"
                  className="input-default"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description">Descrição:</label>
                <CKEditor
                  editor={
                    ClassicEditor as any
                  }
                  data={getValues("body_html")}
                  onChange={(_, editor: any) => {
                    const data = editor.getData();
                    if (data) setValue("body_html", data);
                  }}
                />
              </div>
            </LegacyCard>
            <LegacyCard sectioned>
                <div className="block w-full">
                <VariantePreco 
                  output={ (e: any) => setValue('variants', e)}
                  valueV={getValues('variants') as any} />
              </div>
            </LegacyCard>
            <LegacyCard sectioned>
                <div className="block w-full">
                <ProductsImagesForms 
                  setImages={state?.product?.images || []} 
                  outputImages={(e) => setImagesBase64(e) }
                  onRemoveImages={(e) => setValue('images', e)}
                />
              </div>
            </LegacyCard>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <LegacyCard  sectioned >
                <ButtonGroup fullWidth>
                   <Button 
                    fullWidth
                    variant="primary"
                    tone="critical"
                    onClick={() => setModalType({
                      show: true,
                      description: "Deseja realmente deletar esse produto?",
                      type: "delete",
                      title: "Deletar produto"
                    })}
                  >
                    Deletar
                  </Button>
                  <Button 
                    fullWidth
                    variant="primary"
                    onClick={() => {
                      if(role === 'ADMIN' || role === 'MASTER') {
                        setModalType({
                          show: true,
                          description: "Deseja realmente atualizar esse produto?",
                          type: "update",
                          title: "Atualizar produto"
                        })
                      }
                      if(role === 'FORNECEDOR') {
                        saveOnProduct()
                      }
                    }} 
                    loading={loadingRequest}
                  >
                    Salvar produto
                  </Button>
              </ButtonGroup>
            </LegacyCard>
            <LegacyCard  sectioned>
              <div className="mb-4">
                <label htmlFor="title">Tipo de produto:</label>
                <input
                  type="text"
                  {...register("product_type", { required: true })}
                  id="product_type"
                  className="input-default"
                />
              </div>
            </LegacyCard>
          </Layout.Section>
        </Layout>
      </form>
       <Modal 
        open={loadingRequest}
        noScroll
        title="Atualizando produto"
        onClose={() => {}}
      >
        <Modal.Section>
          <div className='flex flex-col justify-normal mb-4'>
            <Text as="h5" variant='headingMd'> 
              {progressText}
            </Text>
            <div className="py-3"></div>
            {progress !== 100  ? (
            <ProgressBar
              animated
              size='large'
              progress={progress} 
            />
            ) : (
              <Button 
                variant="primary"
                fullWidth
                url={`produtos/${state?.vendorId}`}
              >Voltar para produtos</Button>
            )}
          </div>
        </Modal.Section>
      </Modal>
      <Modal
        open={modalType.show}
        title={modalType.title + ": " + state?.product?.title}
        onClose={() => setModalType({} as any)}
      >
        <Modal.Section>
            {modalType.type === 'delete' && (
            <CalloutCard
              title="Atenção"
              illustration="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              primaryAction={
                {
                  content: 'Estou ciente, quero deletar',
                  destructive: true,
                  onAction: () => {
                    alert('Deletar produto')
                  }
                } as any}
              >
              {modalType.description}
            </CalloutCard>
            )}
            {modalType.type === 'update' && (
            <CalloutCard
              title="Escolha uma opção"
              illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
              primaryAction={
                {
                  content: 'Publicar e liberar para venda',
                  variant: 'primary',
                  onAction: () => {
                    setModalType({
                      show: false,
                      description: "",
                      type: "",
                      title: ""
                    } as any);
                    saveOnProduct('active')
                  }
                } as any
              }
              secondaryAction={
                {
                  content: 'Salvar e não liberar para venda',
                  outline: true,
                  onAction: () => {
                    setModalType({
                      show: false,
                      description: "",
                      type: "",
                      title: ""
                    } as any);
                    saveOnProduct('archived')
                  }
                } as any
              }
              >
              <div className="bg-slate-50 p-1">
                <ul>
                  <li>* Antes de publicar para venda, verifique se o <strong>produto está correto.</strong></li>
                  <li>* Imagens claras e com boa qualidade.</li>
                  <li>* Descrição do produto.</li>
                  <li>* Preço do produto.</li>
                  <li>* Estoque do produto.</li>
                </ul>
              </div>
              <div className="bg-slate-800 text-slate-50 p-4 rounded-lg mb-5">
                <Text as="h5" variant='headingMd'> 
                  Atualize o valor do produto para venda final com taxas, impostos e frete.
                </Text>
              </div>
            </CalloutCard>
            )}

        </Modal.Section>
      </Modal>
       {toastMarkup}
    </Page>
  );
}
