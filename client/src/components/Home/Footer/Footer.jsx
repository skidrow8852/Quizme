import { Box, Center, Image, Text } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

import telegram from "../../../assets/telegram.png";
import vk from "../../../assets/vk.png";

function Footer() {
  return (
    <Center height="10rem" bg="#4f758a" width="100%">
      <Box width={["95%", "85%"]} display="flex" columnGap={5}>
        <Box width="30%">
          <Link to="/">
            <Text
              cursor="pointer"
              color="white"
              fontSize={["0.9rem", "1.2rem"]}
              letterSpacing="3px"
              fontFamily="Montserrat"
            >
              Главная
            </Text>
          </Link>
          <Link to="/tests">
            <Text
              pt={2}
              cursor="pointer"
              color="white"
              fontSize={["0.9rem", "1.2rem"]}
              letterSpacing="3px"
              fontFamily="Montserrat"
            >
              Тесты
            </Text>
          </Link>
          <Box display="flex">
            <Text
              pt={2}
              cursor="pointer"
              color="white"
              fontSize={["0.9rem", "1.2rem"]}
              letterSpacing="3px"
              fontFamily="Montserrat"
              pr={5}
            >
              Мы в социальных сетях:
            </Text>
            <Image
              cursor="pointer"
              ml={1}
              src={vk}
              mt={[10, 0]}
              height={["2rem", "auto"]}
              width={["1.5rem", "2rem"]}
            />
            <Image
              cursor="pointer"
              ml={2}
              mt={[10, 0]}
              src={telegram}
              height={["2rem", "auto"]}
              width={["1.5rem", "2rem"]}
            />
          </Box>
        </Box>
        <Box>
          <Text
            cursor="pointer"
            color="white"
            fontSize={["0.9rem", "1.2rem"]}
            letterSpacing="3px"
            fontFamily="Montserrat"
          >
            Политика конфиденциальности
          </Text>
          <Text
            pt={2}
            cursor="pointer"
            color="white"
            fontSize={["0.9rem", "1.2rem"]}
            letterSpacing="3px"
            fontFamily="Montserrat"
          >
            Обратная связь
          </Text>
        </Box>
      </Box>
    </Center>
  );
}

export default Footer;
