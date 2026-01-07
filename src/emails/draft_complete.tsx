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

type DraftCompleteEmailProps = {
  pickNumber: number;
  teamName: string;
  playerName: string;
  pickingTeam: string;
};

export default function DraftCompleteEmail({ pickNumber, teamName, playerName, pickingTeam }: DraftCompleteEmailProps) {
  return (
    <Html>
      <Head />
      <Body>
        <Text>The 2026 MiL Draft has Completed</Text>
        <Text>Up next is the MaL Draft!</Text>
      </Body>
    </Html>
  );
};