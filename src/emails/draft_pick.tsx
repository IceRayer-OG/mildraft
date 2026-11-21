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
} from 'react-email';

type DraftPickEmailProps = {
  pickNumber: number;
  teamName: string;
  playerName: string;
  pickingTeam: string;
};

export default function DraftPickEmail({ pickNumber, teamName, playerName, pickingTeam }: DraftPickEmailProps) {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>Draft Pick Completed</Preview>
        <Body>
          <Container className='h-full max-w-xl mx-auto'>
            <Section className='bg-[#12026d] text-green-500 place-content-center rounded-t-xl h-20'>
              <Row>
                <Column className='w-[10%] p-2'>
                  <Img
                    src="https://fantasy-media.cbssports.com/baseball/siliconvalley/ealsm1LqkKSOqPRQ.jpg"
                    alt="Silicon Valley Baseball Logo"
                    width="40"
                    height="40"
                    className="rounded-lg align-middle"
                  />
                </Column>
                <Column className='w-[80%] text-center'>
                  <Heading className='text-green-500 text-3xl'>Draft Pick Made</Heading>
                </Column>
                <Column className='w-[10%] p-2'>
                </Column>
              </Row>
            </Section>
              
            <Text className='text-lg'>With the <span className='font-bold underline'>#{pickNumber} pick</span> in the 2026 draft.</Text>
            <Text className='text-lg'>
              <span className='font-bold'>{teamName} </span> selects <span className='font-bold underline'>{playerName}</span>
            </Text>
            
            <Hr className='border-pink-950 border-t-2'/>

            <Section>
              <Row>
                <Text className='text-lg text-center'><span className='font-bold underline'>{pickingTeam}</span> is on the Clock!</Text>
              </Row>
              <Row>
                <Column align='center'>
                  <Button
                    href="https://siliconvalleybaseball.com/league/draft"
                    className='bg-black text-white text-lg rounded-lg w-1/2 text-center pt-4 pb-4 px-2.5 py-2.5'
                  >
                    Draft Room
                  </Button>
                </Column>
              </Row>
            </Section>

            <Hr className='border-gray-200 border-t my-6'/>

            <Section className='text-center pt-2 pb-6'>
              <Row>
                <Text className='text-xs text-stone-500 m-0'>
                  This email was sent by the Silicon Valley Baseball League Draft App.
                </Text>
                <Text className='text-xs text-stone-400 m-0 mt-1'>
                  Questions or issues? Contact the administrator at{" "}
                  <Link href="mailto:admin@siliconvalleybaseball.com" className="text-sky-600 underline">
                    admin@siliconvalleybaseball.com
                  </Link>
                </Text>
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};