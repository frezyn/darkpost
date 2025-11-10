import {
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface Props {
  request: Request;
  url?: string;
}

export default async function TemplateMagicLink({ url, request }: Props) {
  const data: Record<string, string> = await request?.json();


  return (
    <Html>
      <Head />
      <Preview>Link para acessar sua conta</Preview>
      <Container
        style={{
          backgroundColor: "#f5f5f5",
          fontFamily: "Arial, sans-serif",
          margin: 0,
          padding: "40px 0",
        }}
      >
        <Container
          style={{
            borderRadius: 8,
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            padding: "40px",
            background: "#fff",
            maxWidth: 500,
          }}
        >
          {/* Logo */}
          <Section style={{ textAlign: "center", justifyContent: "center", display: "flex", alignContent: "center", marginBottom: "20px" }}>
            <Img
              src="https://noob.exchange/images/logo.png"
              width={60}
              height={60}
              alt="Noob Exchange Logo"
              style={{
                borderRadius: "50%",
              }}
            />
          </Section>

          {/* Título principal */}
          <Heading
            style={{
              fontSize: 24,
              fontWeight: "600",
              textAlign: "center",
              color: "#000",
              marginBottom: 30,
            }}
          >
            Seu Link de Acesso
          </Heading>

          {/* Texto de boas-vindas */}
          <Text
            style={{
              fontSize: 16,
              textAlign: "left",
              color: "#333",
              marginBottom: 20,
              lineHeight: "1.5",
            }}
          >
            Olá, {data?.email?.replace(/@.*?$/, "") ?? "usuário"}!
          </Text>

          <Text
            style={{
              fontSize: 16,
              textAlign: "left",
              color: "#333",
              marginBottom: 30,
              lineHeight: "1.5",
            }}
          >
            Clique no botão abaixo para fazer login na sua conta.
          </Text>

          {/* Botão de acesso */}
          <Section style={{ textAlign: "center", margin: "30px 0" }}>
            <Button
              style={{
                backgroundColor: "#000",
                color: "#fff",
                borderRadius: 6,
                padding: "12px 30px",
                fontSize: 16,
                fontWeight: "bold",
                textDecoration: "none",
                display: "inline-block",
              }}
              href={url}
            >
              Acessar Conta
            </Button>
          </Section>

          {/* Instruções para dispositivos móveis */}
          <Text
            style={{
              fontSize: 14,
              textAlign: "left",
              color: "#555",
              margin: "20px 0",
              lineHeight: "1.5",
            }}
          >
            Se você está em um dispositivo móvel, pode também copiar o link abaixo e
            colá-lo no navegador de sua preferência.
          </Text>

          {/* Link como texto */}
          <Section
            style={{
              backgroundColor: "#f9f9f9",
              padding: "15px",
              borderRadius: "4px",
              margin: "20px 0",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: "#6e6e6e",
                wordBreak: "break-all",
                margin: 0,
              }}
            >
              {url || "https://noob.exchange/login?token=xxxxx"}
            </Text>
          </Section>

          {/* Mensagem de segurança */}
          <Text
            style={{
              fontSize: 14,
              textAlign: "left",
              color: "#555",
              marginTop: 20,
            }}
          >
            Se você não solicitou este email, pode ignorá-lo com segurança.
          </Text>

          {/* Separador */}
          <Section style={{ borderTop: "1px solid #e6e6e6", margin: "30px 0 20px" }} />

          {/* Rodapé */}
          <Text
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "#888",
            }}
          >
            © 2025 Noob Exchange | noob.exchange
          </Text>
        </Container>
      </Container>
    </Html>
  );
}

