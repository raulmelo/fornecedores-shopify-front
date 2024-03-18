import { Button, ProgressBar, Text } from '@shopify/polaris';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import ProductsServices from 'src/app/api/Products';
import { ProductSimpleTypes, ProductsTypes } from 'src/app/types/Products.types';

export interface propsModel {
  vendor: string
  idShopify: string | number

}

const CreateProduct = (props: propsModel) => {

  const { register, handleSubmit } = useForm<ProductSimpleTypes>();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('Criando produto...');
  const [product, setProduct] = useState<ProductsTypes>({} as ProductsTypes);


    

  const onSubmit = (data: ProductSimpleTypes) => {
    setProgress(0);
    setLoading(true);
    sendProduct(data);
    
  }

  async function sendProduct(data: ProductSimpleTypes) {
    setProgress(10);
     const newData: ProductSimpleTypes = {
      ...data,
      status: 'archived',
      vendor: props.vendor
    }
    ProductsServices.createProduct(newData).then( async (response) => {
      await delay(5000)
      setProgress(25);
      setProgressText('Adicionando Título na plataform...');
      await delay(5000)
      setProgress(50);
      setProgressText('Adicionando Descrição na plataform...');
      await delay(5000)
      setProgress(75);
      setProgressText('Adicionando Criando inventário...');
      await delay(5000)
      setProgress(100);
      setProgressText('Produto criado com sucesso!');
      setLoading(false);
      setProduct(response.product);
    }).catch((err: any) => {
      console.log(err);
    })
  }

  async function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  if(product && product?.id) { 
    return (
      <div className='flex flex-col justify-center items-center gap-4'>
        <Text as="h5" variant='headingLg'> 
          {progressText}
        </Text>
        <Link 
          className='bg-green-500 text-white px-4 py-2 rounded-lg'
          to={`/produtos/${props.idShopify}/edit/${product.id}`}
          key="emerald-silk-gown"
          state={{ product: product, vendor: props.vendor, vendorId: props.idShopify}}
        > 
        Avançar
      </Link>
      </div>
    )
  }

return (
  <form onSubmit={handleSubmit(onSubmit)}>
    <div className='mb-4'>
      <label htmlFor="title">Título</label>
      <input 
        type="text"
        className='input-default' 
        {...register("title", { required: true })}
      />
    </div>
    <div className='mb-4'>
      <label htmlFor="body_html">Descrição inicial</label>
      <input 
        type="text"
        className='input-default' 
        {...register("body_html", { required: true })}
      />
    </div>
    {loading && ( 
     <div className='flex flex-col justify-normal mb-4'>
      <Text as="h5" variant='headingMd'> 
        {progressText}
      </Text>
      <ProgressBar
        animated
        size='large'
        progress={progress} 
      />
    </div>
    )}
    <div>
      <Button
        loading={loading}
        variant='primary' submit
      >Salvar</Button>
    </div>
  </form>
)
 
}

export default CreateProduct
