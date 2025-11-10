import { Payment } from "mercadopago";

export const payment = new Payment({
  accessToken: process.env.MP_TOKEN as string //dps adiciono um pacote para gerenciar os env,
});
