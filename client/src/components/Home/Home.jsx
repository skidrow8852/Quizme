/* eslint-disable no-irregular-whitespace */
/* eslint-disable react/no-unescaped-entities */
import { Box, Button, Center, Image, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React from "react";
import { AiOutlineLeftCircle, AiOutlineRightCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

import analytics from "../../assets/analytics.png";
import arrow from "../../assets/arrow.png";
import computer from "../../assets/computer.png";
import email from "../../assets/email.png";
import image1 from "../../assets/image1.jpg";
import image2 from "../../assets/image2.jpg";
import shap1 from "../../assets/shap1.png";
import shape from "../../assets/shape.png";
import shap2 from "../../assets/shape2.png";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";

function Home() {
  const [selected, setSelected] = React.useState(1);
  const intervalRef = React.useRef(null);
  const navigate = useNavigate();

  const startInterval = () => {
    intervalRef.current = setInterval(() => {
      Next();
    }, 6000);
  };

  const stopInterval = () => {
    clearInterval(intervalRef.current);
  };

  const Next = () => {
    setSelected((prevSelected) => (prevSelected === 1 ? 2 : 1));
  };

  React.useEffect(() => {
    startInterval();

    return () => {
      if (intervalRef.current) {
        stopInterval();
      }
    };
  }, []);

  const handleLeftArrowClick = () => {
    stopInterval();
    setSelected(selected === 1 ? 2 : 1);
    startInterval();
  };

  const handleRightArrowClick = () => {
    stopInterval();
    setSelected(selected === 2 ? 1 : 2);
    startInterval();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ width: "100%", height: "auto" }}
    >
      <Header />

      <Center width="100%">
        <Box height="35rem" width="100%" pos="relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("${selected === 1 ? image1 : image2}")`,
              backgroundSize: "cover",
              backgroundPosition: "center center",
            }}
          >
            <Center width="100%" height="100%">
              <Box cursor="pointer" onClick={handleLeftArrowClick}>
                <AiOutlineLeftCircle size="5rem" color="#B3B3B3" />
              </Box>
              <Box
                width="90%"
                display="flex"
                justifyContent="center"
                alignContent="center"
                alignItems="center"
              >
                {selected === 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{ textAlign: "center" }}
                  >
                    <Text
                      fontFamily="Montserrat"
                      color="white"
                      letterSpacing="3px"
                      fontSize={["1.2rem", "3rem"]}
                      textAlign="center"
                    >
                      Проветите тестирование своих <br />
                      сотрудников
                    </Text>
                    <Button
                      _hover={{ border: "2px solid red", color: "red" }}
                      position="absolute"
                      bottom={24}
                      left="45%"
                      bg="white"
                      paddingLeft={8}
                      paddingRight={8}
                      pt={6}
                      onClick={() => navigate("/tests")}
                      pb={6}
                      letterSpacing="3px"
                      fontWeight="500"
                      textTransform="uppercase"
                      color="#4f758a"
                      border="1.5px solid #4f758a"
                      borderRadius="15"
                    >
                      Выбрать тест
                    </Button>
                  </motion.div>
                )}
                {selected === 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      textAlign: "center",
                      justifyContent: "center",
                      alignContent: "center",
                      width: "100%",
                      display: "flex",
                    }}
                  >
                    <Text
                      w="75%"
                      fontFamily="Montserrat"
                      color="white"
                      letterSpacing="3px"
                      fontSize={["1.2rem", "3rem"]}
                      textAlign="center"
                    >
                      Наша цель - помочь вам стать более финансово грамотными и
                      уверенными в своих финансовых решениях
                    </Text>
                    <Button
                      _hover={{ border: "2px solid red", color: "red" }}
                      position="absolute"
                      bottom={14}
                      left="43%"
                      onClick={() => navigate("/register")}
                      bg="white"
                      paddingLeft={8}
                      paddingRight={8}
                      pt={6}
                      pb={6}
                      letterSpacing="3px"
                      fontWeight="500"
                      textTransform="uppercase"
                      color="#4f758a"
                      border="1.5px solid #4f758a"
                      borderRadius="15"
                    >
                      ЗАРЕГИСТРИРОВАТЬСЯ
                    </Button>
                  </motion.div>
                )}
              </Box>
              <Box cursor="pointer" onClick={handleRightArrowClick}>
                <AiOutlineRightCircle size="5rem" color="#B3B3B3" />
              </Box>
            </Center>
          </motion.div>
        </Box>
      </Center>
      <Center width="100%">
        <Box width="65%" pt={5}>
          <Text
            fontWeight="700"
            color="#4f758a"
            fontFamily="Montserrat"
            textTransform="uppercase"
            letterSpacing="7px"
            fontSize="1.5rem"
          >
            Как работать с платформой?
          </Text>
          <Box display="flex" pt={10}>
            <Box pt={16} pl={10}>
              <Box
                bgImage={shape}
                width="22rem"
                height="22rem"
                bgSize="cover"
                bgPosition="top center"
                pt={20}
                pl={8}
              >
                <Image src={arrow} w="4rem" />
                <Text
                  fontFamily="Montserrat"
                  letterSpacing="7px"
                  fontWeight="700"
                  pt={5}
                  color="#4f758a"
                >
                  Зарегистрироваться
                </Text>
              </Box>
            </Box>
            <Box
              mt={28}
              ml={16}
              width="100%"
              height="16rem"
              border="2px solid #4f758a"
              borderRadius="10"
              padding={8}
            >
              <ul style={{ marginLeft: "10px", listStyleType: "none" }}>
                <li
                  style={{
                    color: "#4f758a",
                    fontSize: "1.12rem",
                    letterSpacing: "2px",
                    paddingBottom: "15px",
                  }}
                >
                  <span style={{ fontSize: "0.85rem", color: "#4f758a" }}>
                    &#9675;
                  </span>{" "}
                  перейдите на главную страницу сайта и нажмите на кнопку
                  "Зарегистрироваться"{" "}
                </li>
                <li
                  style={{
                    color: "#4f758a",
                    fontSize: "1.12rem",
                    letterSpacing: "2px",
                    paddingBottom: "15px",
                  }}
                >
                  <span style={{ fontSize: "0.85rem", color: "#4f758a" }}>
                    &#9675;
                  </span>{" "}
                  заполните все необходимые поля{" "}
                </li>
                <li
                  style={{
                    color: "#4f758a",
                    fontSize: "1.12rem",
                    letterSpacing: "2px",
                    paddingBottom: "15px",
                  }}
                >
                  <span style={{ fontSize: "0.85rem", color: "#4f758a" }}>
                    &#9675;
                  </span>{" "}
                  если у вас возникнут вопросы или проблемы при регистрации, вы
                  всегда можете написать нам{" "}
                </li>
              </ul>
            </Box>
          </Box>
          <Box display="flex" pt={5}>
            <Box
              mt={28}
              ml={16}
              width="100%"
              height="12rem"
              border="2px solid #4f758a"
              borderRadius="10"
              padding={8}
            >
              <ul style={{ marginLeft: "10px", listStyleType: "none" }}>
                <li
                  style={{
                    color: "#4f758a",
                    fontSize: "1.12rem",
                    letterSpacing: "2px",
                    paddingBottom: "15px",
                  }}
                >
                  <span style={{ fontSize: "0.85rem", color: "#4f758a" }}>
                    &#9675;
                  </span>{" "}
                  перейдите в личный кабинет, нажмите кнопку "оставить заявку"{" "}
                </li>
                <li
                  style={{
                    color: "#4f758a",
                    fontSize: "1.12rem",
                    letterSpacing: "2px",
                    paddingBottom: "15px",
                  }}
                >
                  <span style={{ fontSize: "0.85rem", color: "#4f758a" }}>
                    &#9675;
                  </span>{" "}
                  заполните заявку{" "}
                </li>
                <li
                  style={{
                    color: "#4f758a",
                    fontSize: "1.12rem",
                    letterSpacing: "2px",
                    paddingBottom: "15px",
                  }}
                >
                  <span style={{ fontSize: "0.85rem", color: "#4f758a" }}>
                    &#9675;
                  </span>{" "}
                  нажмите на кнопку "отправить заявку"{" "}
                </li>
              </ul>
            </Box>
            <Box pt={16} pl={10}>
              <Box
                style={{
                  backgroundColor: "rgba(213, 73, 80, 0.4)",
                  width: "17rem",
                  height: "17rem",
                  borderRadius: "50%",
                  backgroundSize: "cover",
                  backgroundPosition: "top center",
                  paddingTop: 20,
                  paddingLeft: 8,
                }}
              >
                <Box
                  width="100%"
                  display="flex"
                  justifyContent="right"
                  pr={12}
                  pt={5}
                >
                  <Image src={email} w="4rem" />
                </Box>
                <Text
                  fontFamily="Montserrat"
                  letterSpacing="7px"
                  fontWeight="700"
                  pt={5}
                  color="#4f758a"
                >
                  Оставить заявку
                </Text>
              </Box>
            </Box>
          </Box>
          <Box display="flex" pt={5}>
            <Box pt={16} pl={10}>
              <Box
                bgImage={shap1}
                width="25rem"
                height="22rem"
                bgSize="cover"
                bgPosition="top center"
                pt={20}
                pl={8}
              >
                <Image src={computer} w="6rem" />
                <Text
                  fontFamily="Montserrat"
                  letterSpacing="7px"
                  fontWeight="700"
                  pt={5}
                  color="#4f758a"
                >
                  Провести тестирование
                </Text>
              </Box>
            </Box>
            <Box
              mt={28}
              ml={16}
              width="100%"
              height="16rem"
              border="2px solid #4f758a"
              borderRadius="10"
              paddingLeft={8}
              paddingTop={5}
            >
              <ul style={{ marginLeft: "10px", listStyleType: "none" }}>
                <li
                  style={{
                    color: "#4f758a",
                    fontSize: "1.12rem",
                    letterSpacing: "2px",
                    paddingBottom: "15px",
                  }}
                >
                  <span style={{ fontSize: "0.85rem", color: "#4f758a" }}>
                    &#9675;
                  </span>{" "}
                  раздайте персональные пароли каждому сотруднику
                </li>
                <li
                  style={{
                    color: "#4f758a",
                    fontSize: "1.12rem",
                    letterSpacing: "2px",
                    paddingBottom: "15px",
                  }}
                >
                  <span style={{ fontSize: "0.85rem", color: "#4f758a" }}>
                    &#9675;
                  </span>{" "}
                  перейдите на сайт, введите ключ идентификации
                </li>
                <li
                  style={{
                    color: "#4f758a",
                    fontSize: "1.12rem",
                    letterSpacing: "2px",
                    paddingBottom: "15px",
                  }}
                >
                  <span style={{ fontSize: "0.85rem", color: "#4f758a" }}>
                    &#9675;
                  </span>{" "}
                  нажмите кнопку "пройти тест"
                </li>
                <li
                  style={{
                    color: "#4f758a",
                    fontSize: "1.12rem",
                    letterSpacing: "2px",
                    paddingBottom: "15px",
                  }}
                >
                  <span style={{ fontSize: "0.85rem", color: "#4f758a" }}>
                    &#9675;
                  </span>{" "}
                  не забудьте в конце нажать на кнопку "отправить результат"
                </li>
              </ul>
            </Box>
          </Box>
          <Box display="flex" pt={5}>
            <Box
              mt={28}
              ml={16}
              width="60%"
              height="10rem"
              border="2px solid #4f758a"
              borderRadius="10"
              padding={8}
            >
              <ul style={{ marginLeft: "10px", listStyleType: "none" }}>
                <li
                  style={{
                    color: "#4f758a",
                    fontSize: "1.12rem",
                    letterSpacing: "2px",
                    paddingBottom: "15px",
                  }}
                >
                  <span style={{ fontSize: "0.85rem", color: "#4f758a" }}>
                    &#9675;
                  </span>{" "}
                  авторизируйтесь, войдите в личный кабинет, там появится
                  результат по всем сотрудкам, которые проходили тестирование
                </li>
              </ul>
            </Box>
            <Box
              pt={16}
              pl={10}
              width="40%"
              display="flex"
              justifyContent="right"
            >
              <Box
                style={{
                  backgroundImage: `url(${shap2})`,
                  width: "25rem",
                  height: "20rem",
                  backgroundSize: "cover",
                  backgroundPosition: "center center",
                  paddingTop: 20,
                  paddingLeft: 8,
                }}
              >
                <Box
                  width="100%"
                  display="flex"
                  justifyContent="right"
                  pr={12}
                  pt={5}
                >
                  <Image src={analytics} w="5rem" />
                </Box>
                <Text
                  fontFamily="Montserrat"
                  letterSpacing="7px"
                  fontWeight="700"
                  pt={5}
                  color="#4f758a"
                  textAlign="right"
                  pr={10}
                >
                  Получить резул​ьтаты
                </Text>
              </Box>
            </Box>
          </Box>
          <Box pt={5} pl={12} pb={16}>
            <Text
              color="#d54950"
              fontFamily="Montserrat"
              textTransform="uppercase"
              fontSize="1.5rem"
              letterSpacing="7px"
              fontWeight="700"
            >
              Кому полезна наша платформа?
            </Text>
            <Box
              width="26%"
              mt={3}
              borderTop="2px solid #d54950"
              height="1rem"
            ></Box>
            <Text
              pt={5}
              fontFamily="Montserrat"
              fontSize="1.25rem"
              lineHeight="2"
              letterSpacing="3px"
            >
              Цифровая платформа для оценки склонности к финансовым и
              компьютерным рискам - это мощный инструмент, который может быть
              полезен для различных групп лиц. В первую очередь, она
              предназначена для руководителей компаний, которые стремятся
              эффективно управлять рисками в своей организации. Позволяя
              проводить оценку склонности сотрудников к различным видам рисков,
              эта платформа помогает руководству принимать информированные
              решения и разрабатывать стратегии по минимизации потенциальных
              угроз.
            </Text>
          </Box>
        </Box>
      </Center>
      <Footer />
    </motion.div>
  );
}

export default Home;
