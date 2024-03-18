import { useCallback, useEffect, useState } from 'react';
  import './VariantePreco.scss'
import { ActionList, Button, Divider, Popover, Text } from '@shopify/polaris';
import { PriceVariantTypes } from './variantePrecoTypes';
import CurrencyInput from 'react-currency-input-field';

export interface propsModel {
  valueV: PriceVariantTypes[];
  output: (value: PriceVariantTypes[]) => void;
}

const VariantePreco = (props: propsModel) => {
  const [popoverActive, setPopoverActive] = useState(false);
  const [listVariant, setListVariant] = useState<PriceVariantTypes[]>([]);


  useEffect(() => {
    const values = props.valueV.map( (item: any) => {
      return {
        ...item,
        option1: item.option1,
        current_inventory_quantity: item.inventory_quantity,
        inventory_quantity: 0,
        price: parseFloat(item.price).toString(),
      } as PriceVariantTypes  
    })
    setListVariant([...values]);
  }, []);

  useEffect(() => {
    props.output(listVariant);
  }, [listVariant]);


  const addVariant = (option: any) => {

    const newValue: PriceVariantTypes  = {
      option1: option,
      price: '',
      sku: '',
      fulfillment_service: 'manual',
      old_inventory_quantity: 0,
      compare_at_price: null,
      inventory_quantity: 0,
      inventory_management: 'shopify',
    }
    const newList = [...listVariant, newValue];
    setListVariant(newList);
  }

  const setValue = (element: string, position: number, value: any ) => {
    const newList = [...listVariant];
    newList[position][element] = value;
    setListVariant(newList);
  }

  const removeVariant = (position: number) => {
    const list = listVariant.filter((_, index) => index !== position);
    setListVariant(list);
  }


  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );


  const activator = (
    <Button onClick={togglePopoverActive} disclosure>
      Adicionar Preço
    </Button>
  );


return (
  <div className="VariantePreco items-start justify-start text-left w-full block bg-slate-100 p-3 rounded-md" >
    <div className='flex gap-2 justify-between'>
      <div>
        <Text variant="headingMd" as="h5">
          Variantes de preço:
        </Text>
        <Text variant="bodySm" as="p">
          Para adicionar o preço de uma variante, selecione a variante e adicione o preço.
        </Text>
      </div>
        <Popover
          active={popoverActive}
          activator={activator}
          autofocusTarget="first-node"
          onClose={togglePopoverActive}
        >
        <Popover.Pane fixed>
          <Popover.Section>
            <p>Selecione uma opção:</p>
          </Popover.Section>
        </Popover.Pane>
        <ActionList
          actionRole="menuitem"
          onActionAnyItem={togglePopoverActive}
          items={[
            {content: 'Comum', onAction: () => addVariant('comum')},
            {content: 'Cores', onAction: () => addVariant('color')},
            {content: 'Tamanho', onAction: () => addVariant('size')},
            {content: 'Material', onAction: () => addVariant('material')},
          ]
          }
        />
      </Popover>
    </div>
    <div>
      <>{listVariant.map((variant: PriceVariantTypes, index: number) => {
      return <div key={index}>
        <div className="flex items-center flex-wrap gap-2 mt-2">
          <div className="">
            <label htmlFor="sku">Nome da opção:</label>
            <input
              type="text"
              value={variant.option1}
              onChange={(e) => setValue('option1', index, e.target.value)}
              id="sku"
              className="input-default"
            />
          </div>
          <div className="">
            <label htmlFor="price2">Preço:</label>
            <CurrencyInput
              id="input-valor"
              name="input-valor"
              placeholder="R$"
              defaultValue={0}
              decimalsLimit={2}
              value={variant.price}
              onValueChange={(value) => setValue('price', index, value)}
              prefix="R$ "
              className='input-default'
              intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
            />
          </div>
          <div className="">
            <label htmlFor="sku">SKU:</label>
            <input
              type="text"
              value={variant.sku}
              onChange={(e) => setValue('sku', index, e.target.value)}
              id="sku"
              className="input-default"
            />
          </div>
          <Button 
            tone='critical'
            variant='primary'
            onClick={() => removeVariant(index) } >Remover</Button>
        </div>
        <div className="bg-slate-50 border rounded-md p-1 mt-6 grid grid-cols-[2fr 1fr] gap-2 w-full text-center items-center">
          <Text as='h6' tone='success' variant='headingMd' >Estoque atual: <strong>{variant.current_inventory_quantity ? variant.current_inventory_quantity : 0}</strong></Text>
          <div className='w-full'>
            <label htmlFor="inventory_quantity">Aumente o volume no estoque:</label>
            <input
              type="number"
              value={variant.inventory_quantity}
              onChange={(e) => setValue('inventory_quantity', index, e.target.value)}
              id="inventory_quantity"
              className="input-default"
            />
          </div>
        </div>
        <div className='py-12'>
          <Divider borderColor="border" />
        </div>
      </div>
      })
      }</>
    </div>
  </div>
)}

export default VariantePreco
