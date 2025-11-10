import { render } from "@react-email/render";
import { sendEmail } from "../sendEmail";
import TemplateMagicLink from "./email";

type props = {
  url: string;
  to: string;
  provider: any;
  request: Request;
};

export const sendMagicLink = async ({ to, url, provider, request }: props) =>
  sendEmail({
    identifier: to,
    subject: "Fazer login em noob",
    provider,
    html: await render(await TemplateMagicLink({ url, request })),
  });
