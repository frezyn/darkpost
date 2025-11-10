type Props = {
  identifier: string;
  provider: any;
  subject: string;
  html: string;
};
export const sendEmail = async ({
  identifier: to,
  subject,
  provider,
  html,
}: Props) => {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${provider.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: provider.from,
        to,
        subject: subject,
        html: html,
      }),
    });

    if (!res.ok) {
      throw new Error(
        `Error in send Email to user, more info${JSON.stringify(await res.json())}`,
      );
    }
  } catch (err) {
    console.error(`Error in send email: ${err}`);
  }
};
