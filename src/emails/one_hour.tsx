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

export default function DraftReminderEmail({ timeRemaining }: DraftReminderEmailProps) {
  return (
    <Html>
      <Head />
      <Body>
        <Text>Draft Pick Reminder </Text>
        <Text>You have {timeRemaining} left to make you player selection.</Text>

        <Button
          href={`http://localhost:3000/league/draft`}
        >
        Draft Here
        </Button>

      </Body>
    </Html>
  );
};