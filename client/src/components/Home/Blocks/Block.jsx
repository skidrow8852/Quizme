import { Box, Center, Text } from "@chakra-ui/react";
import React from "react";
import { AiOutlineLeftCircle } from "react-icons/ai";
import { Link, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";

import image from "../../../assets/bloc-0.jpg";
import { allQuizzesState } from "../../../store/atoms/client/atoms";
import Footer from "../Footer/Footer";

function Block() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [quizzes, setQuizzes] = useRecoilState(allQuizzesState);
  const [selectedQuiz, setSelectedQuiz] = React.useState({});
  const { id } = useParams();

  const getQuizData = () => {
    setSelectedQuiz(
      quizzes?.find((quiz) => quiz?._id?.toLowerCase() == id?.toLowerCase()) ||
        {},
    );
  };

  React.useEffect(() => {
    getQuizData();
  }, [id]);

  return (
    <Center width="100%">
      <Box width="100%">
        <Box
          width="100%"
          height="10rem"
          bgImage={selectedQuiz?.thumbnail || image}
          bgPos="center"
          bgSize="cover"
          display="flex"
          justifyContent="space-between"
        >
          <Box
            cursor="pointer"
            pl={5}
            display="flex"
            justifyContent="center"
            alignContent="center"
            alignItems="center"
          >
            <Link to="/tests">
              <AiOutlineLeftCircle size="4rem" color="#4f758a" />
            </Link>
          </Box>

          <Text
            textAlign="right"
            width="70%"
            fontWeight="700"
            textTransform="uppercase"
            fontSize="3rem"
            lineHeight="1.4"
            letterSpacing="3px"
            fontFamily="Montserrat"
            color="#666666"
          >
            {selectedQuiz?.title || ""}
          </Text>
        </Box>
        <Center minH="50rem" bg="#f5f7fa" width="100%">
          <Box width="70%">
            <Box
              display="flex"
              alignContent="center"
              alignItems="center"
              justifyContent="space-between"
              pb={10}
            >
              <Box display="flex" alignContent="center" alignItems="center">
                <Box
                  width="8rem"
                  height="8rem"
                  border="2px solid #4f758a"
                  borderRadius="50%"
                  display="flex"
                  justifyContent="right"
                  alignContent="center"
                  alignItems="center"
                >
                  <Box
                    width="4rem"
                    height="4rem"
                    border="2px solid #d54950"
                    borderRadius="50%"
                  >
                    <Text
                      textAlign="right"
                      fontFamily="Montserrat"
                      letterSpacing="normal"
                      textTransform="uppercase"
                      fontSize="2.25rem"
                      fontWeight="500"
                      color="#666666"
                    >
                      О
                    </Text>
                  </Box>
                </Box>
                <Text
                  pl={2}
                  fontFamily="Montserrat"
                  letterSpacing="normal"
                  textTransform="uppercase"
                  fontSize="2.25rem"
                  fontWeight="500"
                  color="#666666"
                >
                  блоке
                </Text>
              </Box>

              <Box
                position="relative"
                width="30rem"
                display="flex"
                justifyContent="center"
                padding={5}
                borderRadius="30"
                borderTop="2px solid #4f758a"
                borderLeft="2px solid #4f758a"
                borderRight="2px solid #4f758a"
              >
                <Text
                  color="#d54950"
                  fontFamily="Montserrat"
                  lineHeight="1.6"
                  fontSize="1rem"
                  fontWeight="400"
                >
                  {selectedQuiz?.intro || ""}
                </Text>
                <Box
                  position="absolute"
                  left={6}
                  bottom={-3.5}
                  height="1rem"
                  borderTop="2px solid #4f758a"
                  width="30%"
                ></Box>
                <Box
                  position="absolute"
                  right={6}
                  bottom={-3.5}
                  height="1rem"
                  borderTop="2px solid #4f758a"
                  width="52%"
                ></Box>
                <Box
                  position="absolute"
                  left="28.3%"
                  bottom={-8}
                  height="1rem"
                  transform="rotate(90deg)"
                  borderTop="2px solid #4f758a"
                  width="10%"
                ></Box>
                <Box
                  position="absolute"
                  right="55.5%"
                  bottom={-7}
                  height="1rem"
                  transform="rotate(130deg)"
                  borderTop="2px solid #4f758a"
                  width="13.4%"
                ></Box>
              </Box>
            </Box>
            <Box
              mt={5}
              padding={5}
              minH="22rem"
              border="3px solid #4f758a"
              borderRadius="30"
              width="70%"
            >
              <Text
                color="#666666"
                fontFamily="Montserrat"
                fontWeight="500"
                fontSize="1.25rem"
                lineHeight="1.8"
                letterSpacing="2px"
              >
                {selectedQuiz?.description || ""}
              </Text>
            </Box>
          </Box>
        </Center>
        <Footer />
      </Box>
    </Center>
  );
}

export default Block;
