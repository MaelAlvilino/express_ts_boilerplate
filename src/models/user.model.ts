import { postalCodeInterface } from '../types/error';

export interface User {
  name: string;
  email: string;
  password: string;
  login: string;
  postalCode: string;
  street: string;
  neighborhood: string;
  state: string;
}
