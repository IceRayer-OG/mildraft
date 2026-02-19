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

type DraftStartEmailProps = {
  pickingTeam: string;
};

export default function DraftStartEmail({ pickingTeam }: DraftStartEmailProps) {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>2026 MiL Draft Underway</Preview>
        <Body>
          <Container className='h-full'>
            <Section className='bg-[#12026d] text-green-500 place-content-center rounded-t-xl h-20'>
              <Row>
                <Column className='w-[10%] p-2'>
                  <img
                    src="https://fantasy-media.cbssports.com/baseball/siliconvalley/ealsm1LqkKSOqPRQ.jpg"
                    className="size-10 rounded-lg align-middle"
                  />
                </Column>
                <Column className='w-[80%] text-center'>
                  <Heading className='text-green-500 text-3xl'>2026 MiL Draft has Started</Heading>
                </Column>
                <Column className='w-[10%] p-2'>
                </Column>
              </Row>
            </Section>
              
            <Text className='text-lg text-center'>Time to see who has the best eye for talent and who's just drafting based on cool last names.</Text>
            
            <Hr className='border-pink-950 border-t-2'/>

            <Section>
              <Row>
                <Text className='text-lg text-center'><span className='font-bold underline'>{pickingTeam}</span> is on the Clock!</Text>
              </Row>
              <Row>
                <Column align='center'>
                  <Button
                    href={`http://siliconvalleybaseball.com/league/draft`}
                    className='bg-black text-white text-lg rounded-lg w-1/2 text-center pt-4 pb-4 px-2.5 py-2.5'
                  >
                    Draft Room
                  </Button>
                </Column>
              </Row>
            </Section>
            <Section className='h-20% fixed bottom-0 left-0 pb-1 text-center'>
              <Row>
                <Text className='text-sm text-black'>This email was sent by the Silicon Valley Baseball League Draft App.</Text>
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};