export interface BusinessResponseType {
  body_html: string;
  cnpj: string;
  id: string | number;
  idShopify: string | number;
  imageUrl: string;
  title: string;
  disabled: boolean;
  users?: UserBusinessType[];
}

export interface UserBusinessType {
    cpf: string;
    email: string;  
    id: string | number;
    name: string;
}