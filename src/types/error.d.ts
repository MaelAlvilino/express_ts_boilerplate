export interface ErrorResponse {
  error: string;
}
export interface postalCodeInterface {
  data: {
    cep: string;
    state: string;
    city: string;
    neighborhood: string;
    street: string;
    service: string;
    address: string;
  };
}
