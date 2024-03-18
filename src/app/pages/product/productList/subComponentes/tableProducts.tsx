import {
  LegacyCard,
  Text,
  Badge,
  DataTable,
  Button,
  ButtonGroup,
} from '@shopify/polaris';
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROLES_TYPES } from 'src/app/constants/roles';
import { ProductVariantTypes, ProductsTypes } from 'src/app/types/Products.types';

interface TableProductsTypes {
  products: ProductsTypes[]
  idShopify: string | number
  vendor: string
  roleUser: ROLES_TYPES
}


export default function TableProducts(props: TableProductsTypes) {
  const initialOrder = props.roleUser === 'FORNECEDOR' ? 'all' : 'disabled';

  const optionsText = {
    active: {
      description: 'Acesse seus produtos e gerencie-os',
    },
    disabled: {
      description: 'Produtos em análise, esperando aprovação para aparecer na plataforma',
    },
    all: {
      description: 'Todos os produtos',
    },
  }

  const [filter, setFilter] = useState<'all' | 'active' | 'disabled'>(initialOrder);
  const textDescription = optionsText[filter].description;

  const totalPrice = (variants: ProductVariantTypes[]) => {
    let total = 0;
    variants.forEach((variant) => {total += variant.inventory_quantity});
    return total;
  }  

  const handleButtonClick = useCallback( (status: 'all' | 'active' | 'disabled') => {
    setFilter(status);
  }, [filter]);


  const listOrder = () => {

    if(filter === 'all') {
      return props.products;
    }
    if(filter === 'active') {
      const newList = props.products.filter((product) => product.status === 'active');
      return newList;
    }

    if(filter === 'disabled') {
      const newList = props.products.filter((product) => product.status === "archived");
      return newList;
    }
    return []
  }


  const rowMarkup: any[] = listOrder().map(( product: ProductsTypes) => {
    return [
      (!!product.image?.src && <img src={product.image.src} width="50" />),
      <Link 
        className='text-blue-500 hover:text-blue-600'
          to={`/produtos/${props.idShopify}/edit/${product.id}`}
          key="emerald-silk-gown"
          state={{ 
            product: product, vendor: props.vendor, vendorId: props.idShopify 
          }}
      >
        {product.title}
      </Link>,
      <Badge>{product.status === 'active' ? 'Ativo' : 'Em análise'}</Badge>,
      <Text as="p">{totalPrice(product.variants)}</Text>,
      <Text as="p">{product.tags ? product.tags : '--'}</Text>,
    ]
  });

  return (
    <LegacyCard>
      <div className='p-5 flex flex-col gap-2 items-center justify-center w-full'>
      <ButtonGroup 
        variant="segmented"
        fullWidth
      >
        <Button
          pressed={filter === 'all'}
          onClick={() => handleButtonClick('all')}
        >
          Todos
        </Button>
        <Button
          pressed={filter === 'active'}
          onClick={() => handleButtonClick('active')}
        >
          Ativos
        </Button>
        <Button
          pressed={filter === 'disabled'}
          onClick={() => handleButtonClick('disabled')}
        >
          Para análise
        </Button>
      </ButtonGroup>
      <Text as="p" variant='headingMd'>{textDescription}</Text>
      </div>
      <DataTable
       columnContentTypes={[
            'text',
            'text',
            'text',
            'text',
            'text',
        ]}
        headings={[
          'Foto',
          'Produto',
          'Status',
          'Estoque',
          'Categoria',
        ]}
        rows={rowMarkup}
      >
      </DataTable>
    </LegacyCard>
  );
}