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
import { useNavigate } from "react-router-dom";

import image from "../../../assets/admin-login.png";
import { loginAdmin } from "../../../services/admin/admin";
import Footer from "../../Home/Footer/Footer";
import Header from "../../Home/Header/Header";

function AdminLogin() {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  /// Check if the entered value is a valid email
  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  const checkLogin = async () => {
    try {
      setIsLoading(true);
      if (email?.length > 3 && password?.length > 7 && isValidEmail(email)) {
        let data = await loginAdmin({ username: email, password });

        if (data?.data?.username) {
          let vals = data?.data;

          localStorage.setItem("admin", JSON.stringify(vals));
          window.location.href = `${import.meta.env.VITE_WEB_HOST}/admin/dashboard`;
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
                  Не верный логин или пароль
                </Text>
                <Box ml={4} onClick={onClose} cursor="pointer">
                  <IoMdClose size="1.5rem" />
                </Box>
              </Flex>
            ),
          });
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
      setIsLoading(false);
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

  React.useEffect(() => {
    if (localStorage.getItem("admin")) {
      navigate("/admin/dashboard");
    }
  }, []);

  return (
    <Center width="100%">
      <Box width="100%">
        <Header />
        <Box bg="#f5f7fa" minH="42.9rem" width="100%" display="flex" pl={18}>
          <Box
            width="50%"
            display={["none", "none", "block", "block"]}
            height="42.9rem"
            bgImage={image}
            bgSize="cover"
            bgPos="center center"
          ></Box>
          <Center width={["100%", "100%", "50%", "50%"]} textAlign="center">
            <Box height="80%" width={["90%", "90%", "50%", "50%"]} pt={10}>
              <Text
                pb={10}
                pt={16}
                color="#4f758a"
                fontSize="1.5rem"
                fontFamily="Montserrat"
                letterSpacing="3px"
                fontWeight="700"
              >
                Авторизация Админа
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

              <Button
                isLoading={isLoading}
                onClick={checkLogin}
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
            </Box>
          </Center>
        </Box>
        <Footer />
      </Box>
    </Center>
  );
}

export default AdminLogin;
