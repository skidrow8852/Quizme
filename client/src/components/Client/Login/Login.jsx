import {
  Box,
  Button,
  Center,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { AiOutlineEye } from "react-icons/ai";
import { FaExclamationCircle } from "react-icons/fa";
import { IoMdClose, IoMdCloseCircle } from "react-icons/io";
import { MdLockOutline, MdOutlineMail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

import image from "../../../assets/login-1.png";
import { loginClient } from "../../../services/client/client";
import Footer from "../../Home/Footer/Footer";
import Header from "../../Home/Header/Header";

function Login() {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [incorrectEmail, setIncorrectEmail] = React.useState(false);
  const [incorrectPassword, setIncorrectPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const toast = useToast();
  /// Check if the entered value is a valid email
  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  const checkLogin = async () => {
    try {
      setIncorrectEmail(false);
      setIncorrectPassword(false);
      setIsLoading(true);
      if (email?.length > 3 && password?.length > 7 && isValidEmail(email)) {
        let data = await loginClient({ email, password });

        if (data?.data?.status == "incorrect email") {
          setIsLoading(false);
          setIncorrectEmail(true);
        } else if (data?.data?.status == "incorrect password") {
          setIsLoading(false);
          setIncorrectPassword(true);
        } else if (data?.data?.status == "error") {
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
                <Text
                  textAlign="center"
                  fontFamily="Montserrat"
                  fontWeight="400"
                >
                  Произошла ошибка. Пожалуйста, повторите попытку позже
                </Text>
                <Box ml={4} onClick={onClose} cursor="pointer">
                  <IoMdClose size="1.5rem" />
                </Box>
              </Flex>
            ),
          });
        } else {
          let vals = data?.data;

          localStorage.setItem("client", JSON.stringify(vals));
          window.location.href = `${import.meta.env.VITE_WEB_HOST}/client/dashboard`;
        }
      } else if (password?.length < 7) {
        setIsLoading(false);
        toast({
          position: "top-right",
          render: ({ onClose }) => (
            <Flex
              bg="rgba(39, 51, 55, 1)"
              borderRadius="10"
              color="white"
              p={3.5}
              textAlign="center"
              align="center"
              justifyContent="center"
              alignItems="center"
            >
              <Box mr={3.5}>
                <FaExclamationCircle size="1.5rem" />
              </Box>
              <Text textAlign="center" fontFamily="Montserrat" fontWeight="400">
                Пароль не может быть менее 8 символов
              </Text>
              <Box ml={4} onClick={onClose} cursor="pointer">
                <IoMdClose size="1.5rem" />
              </Box>
            </Flex>
          ),
        });
      } else if (!isValidEmail(email)) {
        setIsLoading(false);
        toast({
          position: "top-right",
          render: ({ onClose }) => (
            <Flex
              bg="rgba(39, 51, 55, 1)"
              borderRadius="10"
              color="white"
              p={3.5}
              textAlign="center"
              align="center"
              justifyContent="center"
              alignItems="center"
            >
              <Box mr={3.5}>
                <FaExclamationCircle size="1.5rem" />
              </Box>
              <Text textAlign="center" fontFamily="Montserrat" fontWeight="400">
                Введите, пожалуйста, действительный email
              </Text>
              <Box ml={4} onClick={onClose} cursor="pointer">
                <IoMdClose size="1.5rem" />
              </Box>
            </Flex>
          ),
        });
      } else {
        setIsLoading(false);
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
    } catch (e) {
      setIsLoading(false);
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
  };

  const navigate = useNavigate();

  React.useEffect(() => {
    if (
      localStorage.getItem("client") !== null &&
      localStorage.getItem("client") !== "null" &&
      localStorage.getItem("client") !== undefined &&
      localStorage.getItem("client") !== "undefined"
    ) {
      navigate("/client/dashboard");
    }
  }, []);
  return (
    <Center width="100%">
      <Box width="100%">
        <Header />
        <Box bg="#f5f7fa" minH="42.9rem" width="100%" display="flex" pl={18}>
          <Box
            display={["none", "none", "block", "block"]}
            width="50%"
            height="42.9rem"
            bgImage={image}
            bgSize="cover"
            bgPos="center center"
          ></Box>
          <Center width={["100%", "100%", "50%", "50%"]} textAlign="center">
            <Box height="80%" width={["90%", "90%", "50%", "50%"]} pt={10}>
              <Text
                pb={10}
                color="#4f758a"
                fontSize="1.5rem"
                fontFamily="Montserrat"
                letterSpacing="3px"
                fontWeight="700"
              >
                Авторизация{" "}
              </Text>
              <InputGroup pb={3}>
                <InputLeftElement
                  pt={6}
                  pl={1}
                  // eslint-disable-next-line react/no-children-prop
                  children={<MdOutlineMail color="grey" size="1.5rem" />}
                />
                <Input
                  border="1px solid black"
                  bg="white"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setIncorrectEmail(false);
                  }}
                  required
                  placeholder="Email"
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
              </InputGroup>
              <InputGroup>
                <InputLeftElement
                  pt={6}
                  pl={1}
                  // eslint-disable-next-line react/no-children-prop
                  children={<MdLockOutline color="grey" size="1.5rem" />}
                />
                <Input
                  border="1px solid black"
                  bg="white"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setIncorrectPassword(false);
                  }}
                  placeholder="Пароль"
                  pb={1}
                  borderColor="black"
                  color="black"
                  fontFamily="Montserrat"
                  fontWeight="500"
                  type={show ? "text" : "password"}
                  mt={2}
                  h="3.2rem"
                  borderRadius="15px"
                />
                <InputRightElement
                  onClick={handleClick}
                  cursor="pointer"
                  pt={6}
                  pr={1}
                  // eslint-disable-next-line react/no-children-prop
                  children={
                    <AiOutlineEye
                      color={show ? "grey" : "black"}
                      size="1.5rem"
                    />
                  }
                />
              </InputGroup>

              {incorrectEmail && (
                <Text
                  pt={4}
                  fontSize="1rem"
                  fontWeight="500"
                  color="#FF8383"
                  fontFamily="Montserrat"
                >
                  Неверный Email
                </Text>
              )}
              {incorrectPassword && (
                <Text
                  pt={4}
                  fontSize="1rem"
                  fontWeight="500"
                  color="#FF8383"
                  fontFamily="Montserrat"
                >
                  Неверный пароль
                </Text>
              )}

              <Button
                isLoading={isLoading}
                onClick={checkLogin}
                isDisabled={password?.length < 8 || email?.length < 5}
                _hover={{ color: "white", bg: "#47697c" }}
                pt={6}
                pb={6}
                letterSpacing="3px"
                mt={10}
                bg="#47697c"
                color="white"
                pl={10}
                pr={10}
                borderRadius="15"
              >
                Войти
              </Button>

              <Text
                fontSize="0.9rem"
                color="#4f758a"
                fontFamily="Montserrat"
                fontWeight="400"
                letterSpacing="3px"
                textAlign="left"
                display="flex"
                mt={10}
              >
                У вас нет Аккаунта? &nbsp;{" "}
                <span
                  style={{
                    fontFamily: "Montserrat",
                    fontWeight: "700",
                    fontSize: "0.8rem",
                    paddingLeft: "5px",
                    WebkitBackgroundClip: "text",
                    color: "black",
                  }}
                >
                  <Link to="/register">Зарегистрироваться</Link>
                </span>
              </Text>
            </Box>
          </Center>
        </Box>
        <Footer />
      </Box>
    </Center>
  );
}

export default Login;
