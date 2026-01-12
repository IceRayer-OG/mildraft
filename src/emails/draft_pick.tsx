import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
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
      <Tailwind>
        <Preview>Draft Pick Completed</Preview>
        <Body>
          <Container>
            <Heading className='text-center'>Draft Pick Made
              
            </Heading>
            <Text>With the {pickNumber} pick in the 2026 draft.</Text>
            <Text>{teamName} selects {playerName}</Text>
            <Hr className='border-pink-950 border-t-2'/>
          
            <Section className='w-full flex justify-center'>
              <Text>{pickingTeam} is on the Clock!</Text>
              <Row>
                <Button
                  href={`http://siliconvalleybaseball.com/league/draft`}
                  className='bg-black text-white rounded-lg pt-4 pb-4 px-2.5 py-2.5'
                  // style={{ background: "#000", color: "#fff", padding: "12px 20px", borderRadius: "6px" }}
                >
                  Draft Room
                </Button>
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};