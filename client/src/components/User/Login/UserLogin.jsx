import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { IoMdClose, IoMdCloseCircle } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";

import login from "../../../assets/user-login.png";
import { checkStatementId, loginUser } from "../../../services/user/test";

function UserLogin() {
  const { id } = useParams();
  const [password, setPassword] = React.useState("");
  const [loginState, setLoginState] = React.useState("");
  const [isNotFound, setIsNotFound] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const user = JSON.parse(localStorage.getItem(`user:${id}`));
  const toast = useToast();
  const navigate = useNavigate();
  const checkStatement = async () => {
    try {
      let data = await checkStatementId(id);
      if (!data?.data?.msg == "success") {
        setIsNotFound(true);
      }
    } catch (e) {
      setIsNotFound(true);
      console.error(e);
    }
  };

  const checkLogin = async () => {
    try {
      setIsLoading(true);
      let data = await loginUser({
        username: loginState,
        password: password,
        quizId: id,
      });
      if (data?.data?.token && data?.data?.quizId) {
        localStorage.setItem(`user:${id}`, JSON.stringify(data?.data));

        window.location.href = `${import.meta.env.VITE_WEB_HOST}/user/statement/${data?.data?.quizId}`;
      } else {
        toast({
          position: "top-right",
          render: ({ onClose }) => (
            <Flex
              bg="rgba(220, 76, 79, 1)"
              borderRadius="10"
              color="white"
              p={3.5}
              textAlign="center"
              align="center"
              justifyContent="center"
              alignItems="center"
            >
              <Box mr={3.5}>
                <IoMdCloseCircle size="1.5rem" />
              </Box>
              <Text textAlign="center" fontFamily="Montserrat" fontWeight="400">
                Произошла ошибка. Пожалуйста, повторите попытку позже
              </Text>
              <Box ml={4} onClick={onClose} cursor="pointer">
                <IoMdClose size="1.5rem" />
              </Box>
            </Flex>
          ),
        });
      }

      setIsLoading(false);
    } catch (e) {
      toast({
        position: "top-right",
        render: ({ onClose }) => (
          <Flex
            bg="rgba(220, 76, 79, 1)"
            borderRadius="10"
            color="white"
            p={3.5}
            textAlign="center"
            align="center"
            justifyContent="center"
            alignItems="center"
          >
            <Box mr={3.5}>
              <IoMdCloseCircle size="1.5rem" />
            </Box>
            <Text textAlign="center" fontFamily="Montserrat" fontWeight="400">
              Произошла ошибка. Пожалуйста, повторите попытку позже
            </Text>
            <Box ml={4} onClick={onClose} cursor="pointer">
              <IoMdClose size="1.5rem" />
            </Box>
          </Flex>
        ),
      });
      setIsLoading(false);
      console.error(e);
    }
  };
  React.useEffect(() => {
    if (user?.quizId) {
      navigate(`/user/statement/${user?.quizId}`);
    }
    checkStatement();
  }, [id]);
  return (
    <Center width="100%" bg="#f5f7fa">
      {!isNotFound ? (
        <Box width="80%" minH="100vh" bg="#f5f7fa">
          <Text
            pt={16}
            pb={10}
            textAlign="center"
            color="#6457fe"
            fontSize={["2rem", "2rem", "3.75rem", "3.75rem"]}
            letterSpacing="3px"
            fontWeight="500"
            fontFamily="Montserrat"
          >
            Авторизация
          </Text>
          <Center w="100%" height="100%">
            <Box display="flex" height="80%" width="100%">
              <Box
                display={["none", "none", "flex", "flex"]}
                width="50%"
                pt={14}
                height="100%"
                justifyContent="center"
                alignContent="center"
                alignItems="center"
              >
                <Image src={login} />
              </Box>
              <Center
                pl={[0, 0, 10, 10]}
                width={["100%", "100%", "50%", "50%"]}
              >
                <Box
                  h="50%"
                  width={["90%", "90%", "50%", "50%"]}
                  justifyContent="center"
                  display="flex"
                  alignContent="center"
                  alignItems="center"
                >
                  <Box w="100%">
                    <Text
                      fontSize="1.3rem"
                      fontWeight="500"
                      fontFamily="Montserrat"
                      color="grey"
                    >
                      Логин
                    </Text>
                    <Input
                      width="100%"
                      border="1px solid black"
                      bg="white"
                      value={loginState}
                      onChange={(e) => {
                        setLoginState(e.target.value);
                      }}
                      placeholder="Введите логин"
                      pb={1}
                      borderColor="black"
                      color="black"
                      fontFamily="Montserrat"
                      fontWeight="500"
                      type="text"
                      mt={2}
                      h="3.2rem"
                      borderRadius="15px"
                    />

                    <Text
                      pt={5}
                      fontSize="1.3rem"
                      fontWeight="500"
                      fontFamily="Montserrat"
                      color="grey"
                    >
                      Пароль
                    </Text>
                    <Input
                      width="100%"
                      border="1px solid black"
                      bg="white"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      placeholder="Введите пароль"
                      pb={1}
                      borderColor="black"
                      color="black"
                      fontFamily="Montserrat"
                      fontWeight="500"
                      type="password"
                      mt={2}
                      h="3.2rem"
                      borderRadius="15px"
                    />

                    <Button
                      isDisabled={
                        loginState?.length < 4 || password?.length < 4
                      }
                      onClick={checkLogin}
                      isLoading={isLoading}
                      _hover={{ bg: "#6457fe", color: "white" }}
                      borderRadius="10"
                      mt={8}
                      pl={10}
                      pr={10}
                      pt={6}
                      pb={6}
                      bg="#6457fe"
                      color="white"
                      fontFamily="Montserrat"
                    >
                      Войти
                    </Button>
                  </Box>
                </Box>
              </Center>
            </Box>
          </Center>
        </Box>
      ) : (
        <Center width="80%" minH="100vh" bg="#f5f7fa">
          <Text
            textAlign="center"
            fontSize="4.2rem"
            color="black"
            fontFamily="Montserrat"
          >
            НЕ НАЙДЕН
          </Text>
        </Center>
      )}
    </Center>
  );
}

export default UserLogin;
