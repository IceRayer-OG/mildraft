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

type DraftReminderEmailProps = {
  timeRemaining: number;
};

export default function DraftReminderEmail(
  // { timeRemaining }: DraftReminderEmailProps
) {
  return (
 <Html>
      <Tailwind>
        <Head />
        <Preview>Caution: One Hour Remaining</Preview>
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
                  <Heading className='text-red-700 text-3xl'><span className="font-bold underline">Warning:</span> One Hour Remaining</Heading>
                </Column>
                <Column className='w-[10%] p-2'>
                </Column>
              </Row>
            </Section>
              
            <Section>
              <Row>
                <Text className='text-lg text-center'>You currently have 1 hour remaining to make your player selection.</Text>
                <Text className='text-lg text-center'>The button below will take you to the Draft Room.</Text>
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