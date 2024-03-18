export interface PriceVariantTypes {
  price: string
  sku: string
  compare_at_price: number | string | null
  inventory_management: string
  inventory_quantity: number
  option1: string | number
  option2?: string | number | null
  option3?: string | number | null
  weight?: number
  weight_unit?: string
  requires_shipping?: boolean
  taxable?: boolean
  barcode?: string | number | null
  image_id?: number | null
  inventory_item_id?: number | null
  inventory_policy?: string
  fulfillment_service?: string
  inventory_item_quantity?: number
  old_inventory_quantity?: number
  title?: string
  priceNumber?: number
  compare_at_priceNumber?: number
  weightNumber?: number
  inventory_quantityNumber?: number
  inventory_item_quantityNumber?: number
  old_inventory_quantityNumber?: number
  current_inventory_quantity?: number
  [key: string]: any
}