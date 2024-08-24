import { Box, Center, Text } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";

import { allQuizzesState } from "../../../store/atoms/client/atoms";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

function Blocks() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [quizzes, setQuizzes] = useRecoilState(allQuizzesState);

  return (
    <Center width="100%">
      <Box width="100%">
        <Header />

        <Box minH="55rem" height="auto" bg="#f5f7fa" pb={10}>
          <Center width="100%">
            <Box width="70%" pt={5}>
              <Text
                color="#d54950 "
                pl={5}
                fontFamily="Montserrat"
                fontSize="2.25rem"
                fontWeight="700"
              >
                Выбрите блок теста{" "}
              </Text>
              <Box
                rowGap={10}
                width="100%"
                display="grid"
                gridTemplateColumns={[
                  "1fr",
                  "1fr 1fr",
                  "1fr 1fr 1fr",
                  "1fr 1fr 1fr",
                ]}
                columnGap={5}
                pt={5}
              >
                {quizzes?.map(({ title, thumbnail, _id }, index) => (
                  <Link to={`/tests/${_id}`} key={index}>
                    <Box
                      cursor="pointer"
                      position="relative"
                      bgSize="cover"
                      bgPos="center center"
                      bgImage={thumbnail}
                      height="12rem"
                      borderRadius="10"
                      border="3px solid #4f758a"
                      display="flex"
                      justifyContent="center"
                      alignContent="center"
                      alignItems="center"
                    >
                      <Box
                        height="100%"
                        width="100%"
                        bgColor="rgba(0,0,0,0.1)"
                        display="flex"
                        justifyContent="center"
                        alignContent="center"
                        alignItems="center"
                        p={3}
                      >
                        <Text
                          color="white"
                          fontSize="1.5rem"
                          letterSpacing="3px"
                          fontWeight="700"
                          fontFamily="Montserrat"
                          textAlign="center"
                          style={{
                            wordBreak: "break-all",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {title}
                        </Text>
                      </Box>
                    </Box>
                  </Link>
                ))}
              </Box>
            </Box>
          </Center>
        </Box>
        <Footer />
      </Box>
    </Center>
  );
}

export default Blocks;
