import { ROLES_TYPES } from "src/app/constants/roles";


export interface RegisterUserTypes {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  cpf: string;
  role: ROLES_TYPES;
  businessId: string;
}

export interface TableFornecedorTypes {
  id: number | string;
  name: string
  email: string
  cpf: string
  notes: any
  role: ROLES_TYPES
}