

export interface ProductsTypes {
  body_html: string
  description: string
  handle: string
  id: number
  image: any
  images: ImagesProductTypes[]
  options: any
  product_type:  string
  status: string
  tags: string
  title: string
  updated_at: string
  variants: ProductVariantTypes[]
  vendor: string
}

export interface ProductSimpleTypes extends Pick<ProductsTypes, 'title' | 'vendor' | 'body_html' | 'status'> {}


export interface ProductVariantTypes {
  admin_graphql_api_id: string;
  barcode: string;
  compare_at_price: string;
  created_at: string;
  fulfillment_service: string;
  grams: number;
  id: number;
  image_id: number | null;
  inventory_item_id: number;
  inventory_management: string;
  inventory_policy: string;
  inventory_quantity: number;
  old_inventory_quantity: number;
  option1: string;
  option2: string | null;
  option3: string | null;
  position: number;
  price: string;
  product_id: number;
  requires_shipping: boolean;
  sku: string;
  taxable: boolean;
  title: string;
  updated_at: string;
  weight: number;
  weight_unit: string;
}


export interface ImagesProductTypes {
  alt: string
  id: number
  position: number
  product_id: string
  src: string
}