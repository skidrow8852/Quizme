import {
  Box,
  Button,
  Center,
  FormControl,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

import email1 from "../../../assets/email1.png";
import home from "../../../assets/home.png";
import images2 from "../../../assets/images-2.png";
import images7 from "../../../assets/images-7.png";
import { getallQuizzes } from "../../../services/client/quizzes";
import { allQuizzesState } from "../../../store/atoms/client/atoms";

function HeaderClient() {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [description, setDescription] = React.useState("");
  const handleDescription = (e) => {
    setDescription(e.target.value);
  };

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

  const navigate = useNavigate();
  return (
    <Center
      width="100%"
      height="9rem"
      bg="white"
      borderBottom="2px solid #4f758a"
    >
      <Box width="80%" display="flex" alignContent="center" alignItems="center">
        <Box
          onClick={() => navigate("/client/dashboard")}
          display="flex"
          flexDir="column"
          alignContent="center"
          alignItems="center"
          textAlign="center"
          cursor="pointer"
        >
          <Image src={home} width="3rem" />
          <Text
            pt={2}
            w="100%"
            fontSize="0.875rem"
            fontWeight="300"
            fontFamily="Montserrat"
            color="black"
          >
            Дом
          </Text>
        </Box>

        <Box
          display="flex"
          flexDir="column"
          alignContent="center"
          alignItems="center"
          textAlign="center"
          onClick={onOpen}
          cursor="pointer"
        >
          <Image src={images7} width="3rem" />
          <Text
            pt={2}
            w="60%"
            fontSize="0.875rem"
            fontWeight="300"
            fontFamily="Montserrat"
            color="black"
          >
            Отправить сообщение
          </Text>
        </Box>

        <Box color="#4f758a">
          ********************************************************************************************************************************************************
        </Box>
        <Box
          pl={8}
          cursor="pointer"
          onClick={() => {
            localStorage.removeItem("client");
            navigate("/login");
          }}
          display="flex"
          flexDir="column"
          alignContent="center"
          alignItems="center"
          textAlign="center"
        >
          <Image src={images2} width="3rem" />
          <Text
            pt={2}
            w="100%"
            fontSize="0.875rem"
            fontWeight="300"
            fontFamily="Montserrat"
            color="black"
          >
            Выйти
          </Text>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="4xl" p={0}>
        <ModalOverlay />
        <ModalContent borderRadius="20" bg="#f5f7fa">
          <ModalCloseButton
            color="white"
            bgColor="#0b39ca"
            borderRadius="50%"
            mt={1}
            mr={1}
            border="1px solid rgba(100, 96, 117, 1)"
            onClick={() => {
              onClose();
            }}
          />
          <ModalBody borderRadius="20" bg="#f5f7fa" pt={10} pb={0} minH="70vh">
            <Box
              width="100%"
              display="flex"
              justifyContent="center"
              alignContent="center"
            >
              <Text
                fontWeight="500"
                color="#0b39ca"
                fontSize="2.25rem"
                fontFamily="Montserrat"
              >
                Связаться с нами
              </Text>
            </Box>
            <Box pt={24} width="100%" display="flex">
              <Box width="40%">
                <Image src={email1} />
              </Box>
              <Box
                width="60%"
                display="flex"
                justifyContent="center"
                alignContent="center"
                alignItems="center"
                pl={10}
              >
                <Box width="100%">
                  <Text
                    pt={5}
                    fontSize="1.3rem"
                    fontWeight="500"
                    fontFamily="Montserrat"
                    color="#0b39ca"
                  >
                    Сообщение
                  </Text>
                  <FormControl pt={5}>
                    <Textarea
                      onChange={handleDescription}
                      value={description}
                      fontSize="1rem"
                      placeholder="Введите сообщение"
                      size="md"
                      color="black"
                      fontFamily="Montserrat"
                      fontWeight="500"
                      resize="none"
                      border="1px solid black"
                      bg="white"
                      height="12rem"
                      borderRadius="15px"
                    />
                  </FormControl>

                  <Button
                    _hover={{ bg: "#0b39ca", color: "white" }}
                    borderRadius="10"
                    mt={8}
                    pl={10}
                    pr={10}
                    pt={6}
                    pb={6}
                    bg="#0b39ca"
                    color="white"
                    fontFamily="Montserrat"
                  >
                    Отправить
                  </Button>
                </Box>
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Center>
  );
}

export default HeaderClient;
