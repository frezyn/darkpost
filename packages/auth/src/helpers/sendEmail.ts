import { sendMagicLink } from "@workspace/email";

type Props = {
  identifier: string;
  provider: any;
  url: string;
  request: Request;
};

export async function sendVerificationRequest(props: Props) {
  try {
    await sendMagicLink({
      to: props.identifier,
      ...props,
    });
  } catch (err) {
    console.error(err);
  }
}
