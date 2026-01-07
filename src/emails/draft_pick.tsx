import {
  Body,
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
import tailwindConfig from "../../tailwind.config.js";

export const DraftPickEmail = ({}) => {
  return (
    <Html>
      <Head />
      <Tailwind config={tailwindConfig}>
      <Body>
        <Text>Draft Pick Email</Text>
      </Body>
      </Tailwind>
    </Html>
  );
};

export default DraftPickEmail;