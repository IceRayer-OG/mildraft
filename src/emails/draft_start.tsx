import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

type DraftStartEmailProps = {

  pickingTeam: string;
};

export default function DraftStartEmail({ pickingTeam }: DraftStartEmailProps) {
  return (
    <Html>
      <Head />
      <Body>
        <Text>SiliconValley Baseball Mil Draft</Text>
        <Text>The 2026 MiL Draft is Live</Text>
        <Text>{pickingTeam} is on the Clock!</Text>

        <Button
          href={`http://localhost:3000/league/draft`}
          style={{ background: "#000", color: "#fff", padding: "12px 20px", borderRadius: "6px" }}
        >
        Draft Here
        </Button>

      </Body>
    </Html>
  );
};