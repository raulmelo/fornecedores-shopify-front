import { useEffect, useState } from 'react';
  import  './ProductListpage.scss'
import { Page, Button, Layout, Toast, LegacyCard, EmptyState, Text, Modal } from '@shopify/polaris';
import {  useParams } from 'react-router-dom';
import { useAuth } from 'src/app/hooks/authProvider';
import { LoadingStatusComponent } from './subComponentes/status';

import ProductsServices from 'src/app/api/Products';
import { AxiosError } from 'axios';
import { FeedbackTypes } from 'src/app/types';
import { ProductsTypes } from 'src/app/types/Products.types';
import TableProducts from './subComponentes/tableProducts';
import { BusinessResponseType } from 'src/app/types/Business.types';
import CreateProduct from './subComponentes/CreateProduct';

type BusinessTypes = Pick<BusinessResponseType, 'title' | 'imageUrl'> 

export default function ProductListPage() {
  const { roleUser  } = useAuth();
  



  const { userId } = useParams();
  const [permission, setPermission] = useState(false);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<FeedbackTypes>({ show: false, message: ''} as FeedbackTypes);
  const [business, setBusiness] = useState<BusinessTypes>({ title: '', imageUrl: '' } as BusinessTypes);
  const [products, setProducts] = useState<ProductsTypes[]>([] as ProductsTypes[]);

  useEffect(() => {
    initialize()
  }, []);

  async function initialize() {
    setLoading(true);

    if(!userId) {
      setPermission(false);
      setLoading(false);
      return;
    }
    
    if(roleUser() === 'MASTER' || roleUser() === 'ADMIN') {
      setPermission(true) 
      getProducts();
      return 
    }

    if (roleUser() === "FORNECEDOR" && userId) {
      setPermission(true) 
      getProducts();
      return;
    }
  }

  function getProducts() {
      if(!userId) {
        return;
      }
    
      ProductsServices.getProducts(userId).then((data: { products: ProductsTypes[], businesses: BusinessResponseType }) => {
        console.log(data);
        setBusiness(data.businesses);
        setProducts(data.products);
        setPermission(true);
      })
      .catch((err: AxiosError<any>) => {
        const { message = 'Ocorreu um erro.' } = err?.response?.data || {};
        setPermission(false);
        setFeedback({
          show: true,
          message: message,
          type: "error",
        });
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


 if(loading) {
    return <LoadingStatusComponent />
  }

  const RenderNotPermission  = () => {
    return <>
      <LegacyCard sectioned>
        <EmptyState
          heading="Não encontramos nenhum produto cadastrado."
          action={{
            content: 'Volta para lojas',
            onAction: () => window.location.href = '/empresas/list'
          }}
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          fullWidth
        >
          <p>
            Entre em contato com o administrador do sistema.
          </p>
        </EmptyState>
      </LegacyCard>
    </>
  }

  return  <Page
        title="Produtos"
        primaryAction={
          permission && <Button onClick={() => setModal(true)} variant="primary">Adicionar produto</Button>
        }
      >
      <Layout>
        <Layout.Section>
          {toastMarkup}
          {permission && (
            <div className='bg-slate-50 rounded-lg gap-4 p-4 mb-3 w-full min-h-8 flex items-center'>
              <img src={business.imageUrl} width={100} height={200} className='object-contain' alt="" />
              <div className='w-1 opacity-5 bg-slate-600 h-4'></div>
              <Text variant='headingLg' as='h1'><strong> {business.title}</strong></Text>
              <div className='flex-1'></div>
            </div>
          )}
          {!permission ? <RenderNotPermission /> : 
            products.length > 0 && userId ? <TableProducts 
              vendor={business.title} 
              idShopify={userId} 
              products={products} 
              roleUser={roleUser()}
            /> : <RenderNotPermission />
          }
        </Layout.Section>
      </Layout>
       <Modal
        open={modal}
        title={"Adicionar produto"}
        onClose={() => {
          setModal(false);
          initialize();
        }}
      >
        <Modal.Section>
          { userId && 
            <CreateProduct 
              idShopify={userId}
              vendor={business.title} 
            />
          }
        </Modal.Section>
        
      </Modal>
  </Page>
}
