import { Box, Center, Image, Text } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";

import logo from "../../../assets/logo.jpg";
import user from "../../../assets/user.png";
import { getallQuizzes } from "../../../services/client/quizzes";
import { allQuizzesState } from "../../../store/atoms/client/atoms";

function Header() {
  const [quizzes, setQuizzes] = useRecoilState(allQuizzesState);

  const getAllQuizzesData = async () => {
    try {
      if (quizzes?.length < 1) {
        let data = await getallQuizzes();
        if (data?.data) {
          setQuizzes(data?.data);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    getAllQuizzesData();
  }, []);

  return (
    <Center width="100%">
      <Box
        width="90%"
        height="6rem"
        display="flex"
        justifyContent="space-between"
        bg="white"
        alignContent="center"
        alignItems="center"
      >
        <Box cursor="pointer">
          <Link to="/">
            <Image src={logo} width="4rem" />
          </Link>
        </Box>
        <Text
          fontWeight="500"
          letterSpacing="7px"
          textTransform="uppercase"
          fontFamily="Montserrat, sans-serif"
          fontSize={["1rem", "1.87rem"]}
          color="#d54950"
        >
          Оценка склонности к рискам
        </Text>
        <Box cursor="pointer">
          <Link to="/client/dashboard">
            <Image src={user} width="3.5rem" />
          </Link>
        </Box>
      </Box>
    </Center>
  );
}

export default Header;
