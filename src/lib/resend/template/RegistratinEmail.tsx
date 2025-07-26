import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Link,
} from '@react-email/components';

export default function RegistrationEmail({ email }: {email: string}) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Registration Successfull on YouTubeLayer.</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Registration Successfull on YouTubeLayer.</Preview>
      <Section>
        <Row>
          <Heading as="h2">Hello {email},</Heading>
        </Row>
        <Row>
          <Text>
            Thank you for registering. Currently no need for verification. Please <Link href='https://youtubelayer.in/auth' target='_blank'>Login</Link> to continue your journey.
          </Text>
        </Row>
      </Section>
    </Html>
  );
}