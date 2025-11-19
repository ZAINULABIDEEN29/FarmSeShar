import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
} from "@react-email/components";
interface VerificationEmailProps {
  username: string;
  otp: string;
}
export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <Html lang="en">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
        />
      </Head>
      <Preview>Your OTP Code: {otp}</Preview>
      <Section>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>
        <Row>
          <Text>
            Use the OTP below to complete your email verification:
          </Text>
        </Row>
        <Row>
          <Text style={{ fontSize: "24px", fontWeight: "bold", letterSpacing: "2px" }}>
            {otp}
          </Text>
        </Row>
        <Row>
          <Text>If you did not request this email, you can ignore it.</Text>
        </Row>
      </Section>
    </Html>
  );
}
