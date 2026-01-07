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

type DraftPickEmailProps = {
  pickNumber: number;
  teamName: string;
  playerName: string;
  pickingTeam: string;
};

export default function DraftPickEmail({ pickNumber, teamName, playerName, pickingTeam }: DraftPickEmailProps) {
  return (
    <Html>
      <Head />
      <Body>
        <Text>Draft Pick Email</Text>
        <Text>With the {pickNumber} pick in the 2026 draft.</Text>
        <Text>{teamName} selects {playerName}</Text>
        <Text>{pickingTeam} is on the Clock!</Text>

        <Button
          href={`http://localhost:3000/league/draft`}
          style={{ background: "#000", color: "#fff", padding: "12px 20px", borderRadius: "6px" }}
        >
        Draft 
        </Button>

      </Body>
    </Html>
  );
};