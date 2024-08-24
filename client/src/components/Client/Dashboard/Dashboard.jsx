import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Center,
  Flex,
  Image,
  Input,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import {
  FaAngleDown,
  FaAngleUp,
  FaExclamationCircle,
  FaRegCheckCircle,
} from "react-icons/fa";
import { IoMdClose, IoMdCloseCircle } from "react-icons/io";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

import alfa from "../../../assets/Alfa-Bank.png";
import centerinvest from "../../../assets/centerinvest.png";
import sberbank from "../../../assets/sberbank.png";
import stat from "../../../assets/stat.png";
import tinkoffbank from "../../../assets/tinkoffbank.png";
import { getClientProfile } from "../../../services/client/client";
import {
  createNewClientStatement,
  getClientStatements,
} from "../../../services/client/statement";
import {
  allQuizzesState,
  clientState,
  clientStatementsState,
} from "../../../store/atoms/client/atoms";
import Footer from "../../Home/Footer/Footer";
import Statement from "../Statement/Statement";
import HeaderClient from "./HeaderClient";

function Dashboard() {
  const navigate = useNavigate();
  const client = JSON.parse(localStorage.getItem("client"));
  const [clientData, setClientData] = useRecoilState(clientState);
  const [step1, setStep1] = React.useState("");
  const [step2, setStep2] = React.useState(5);
  const [step3, setStep3] = React.useState([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [quizzes, setQuizzes] = useRecoilState(allQuizzesState);
  const [value, setValue] = React.useState(850);
  const [persons, setPersons] = React.useState(5);
  const [blocks, setBlocks] = React.useState(1);
  const [statements, setStatements] = useRecoilState(clientStatementsState);
  const [isLoading, setIsLoading] = React.useState(false);
  const toast = useToast();
  const getClientProfileData = async () => {
    try {
      if (Object?.keys(clientData)?.length < 2) {
        const data = await getClientProfile(client?.id);
        if (Object.keys(data?.data)?.length > 2) {
          setClientData(data?.data);
        } else {
          localStorage.removeItem("client");
          navigate("/login");
        }
      }
    } catch (e) {
      localStorage.removeItem("client");
      navigate("/login");
    }
  };

  const getAllStatementsData = async () => {
    try {
      if (statements?.length == 0) {
        let data = await getClientStatements(client?.id);
        if (data?.data && data?.status == 200 && Array.isArray(data?.data)) {
          setStatements(data?.data);
        } else {
          setStatements([]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addNewStatement = async () => {
    try {
      setIsLoading(true);
      if (step1?.length < 2) {
        toast({
          position: "top-center",
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
                Наименование организации должно состаять из как минимум 2
                символов
              </Text>
              <Box ml={4} onClick={onClose} cursor="pointer">
                <IoMdClose size="1.5rem" />
              </Box>
            </Flex>
          ),
        });
      } else if (isNaN(step2)) {
        toast({
          position: "top-center",
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
                Количество человек должно быть числом
              </Text>
              <Box ml={4} onClick={onClose} cursor="pointer">
                <IoMdClose size="1.5rem" />
              </Box>
            </Flex>
          ),
        });
      } else if (step3?.length == 0) {
        toast({
          position: "top-center",
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
                выберете как минимум один блок
              </Text>
              <Box ml={4} onClick={onClose} cursor="pointer">
                <IoMdClose size="1.5rem" />
              </Box>
            </Flex>
          ),
        });
      } else {
        let data = await createNewClientStatement(clientData?._id, {
          quizId: step3,
          numOfUsers: parseInt(step2),
          companyName: step1,
        });
        if (data?.status == 200 && data?.data) {
          setStatements([...statements, data?.data]);
          setStep1("");
          setStep2(5);
          setStep3([]);
          toast({
            position: "top-center",
            render: ({ onClose }) => (
              <Flex
                bg="#48904d"
                borderRadius="10"
                color="white"
                p={3.5}
                textAlign="center"
                align="center"
                justifyContent="center"
                alignItems="center"
              >
                <Box mr={3.5}>
                  <FaRegCheckCircle size="1.5rem" />
                </Box>
                <Text
                  textAlign="center"
                  fontFamily="Montserrat"
                  fontWeight="400"
                >
                  Заявка успешно оформлена!
                </Text>
                <Box ml={4} onClick={onClose} cursor="pointer">
                  <IoMdClose size="1.5rem" />
                </Box>
              </Flex>
            ),
          });
          setTimeout(() => {
            navigate("/client/dashboard");
          }, 3000);
        }
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
    if (!localStorage.getItem("client")) {
      navigate("/login");
    }
    getClientProfileData();
    getAllStatementsData();
  }, []);

  return (
    <Center width="100%" height="auto" overflowY="auto" bg="#f5f7fa">
      <Box width="100%">
        <HeaderClient />
        <Routes>
          <Route
            exact
            path="/"
            element={
              <>
                <Center width="100%" height="auto">
                  <Box height="auto" pt={10} width="80%">
                    <Box width="100%" display="flex">
                      <Box width="50%">
                        <Box
                          width="100%"
                          padding={5}
                          borderRadius="50"
                          border="2px solid #4f758a"
                          display="flex"
                        >
                          <Text
                            pl={5}
                            fontSize="1.5rem"
                            fontFamily="Montserrat"
                            fontWeight="600"
                          >
                            ФИО :
                          </Text>
                          <Text
                            pl={5}
                            fontSize="1.5rem"
                            fontFamily="Montserrat"
                            fontWeight="600"
                            color="#4f758a"
                          >
                            {clientData?.fullName || ""}
                          </Text>
                        </Box>

                        <Box
                          width="100%"
                          padding={5}
                          borderRadius="50"
                          mt={5}
                          border="2px solid #4f758a"
                          display="flex"
                        >
                          <Text
                            pl={5}
                            fontSize="1.5rem"
                            fontFamily="Montserrat"
                            fontWeight="600"
                          >
                            EMAIL :
                          </Text>

                          <Text
                            pl={5}
                            fontSize="1.5rem"
                            fontFamily="Montserrat"
                            fontWeight="600"
                            color="#4f758a"
                          >
                            {clientData?.email || ""}
                          </Text>
                        </Box>
                      </Box>
                      <Box
                        cursor="pointer"
                        ml={16}
                        width="12rem"
                        height="12rem"
                        borderRadius="30"
                        onClick={() =>
                          navigate("/client/dashboard/create-statement")
                        }
                        border="2px dashed #4f758a"
                        display="flex"
                        justifyContent="center"
                        flexDirection="column"
                        rowGap={3}
                        alignContent="center"
                        alignItems="center"
                      >
                        <Image src={stat} width="5rem" />
                        <Text
                          fontFamily="Montserrat"
                          color="#4f758a"
                          fontSize="1.2rem"
                          fontWeight="500"
                        >
                          Создать заявку{" "}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                </Center>

                <Center
                  pt={16}
                  pb={10}
                  width="100%"
                  display="flex"
                  height="auto"
                  alignContent="center"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Box width="80%" minH="45rem" height="auto">
                    <Text
                      pt={5}
                      fontSize="2.25rem"
                      fontWeight="500"
                      fontFamily="Montserrat"
                      letterSpacing="3px"
                      color="#4f758a"
                    >
                      Оставленные заявки
                    </Text>
                    <TableContainer
                      w="100%"
                      maxW="100%"
                      color="white"
                      pt={5}
                      minH="40rem"
                      overflowX="hidden"
                      borderRadius="35"
                      mb={10}
                    >
                      <Table size="sm" className="table-tiny" width="100%">
                        <Thead bg="#4f758a" width="100%">
                          <Tr width="100%">
                            <Th
                              textAlign="center"
                              pt={5}
                              pb={5}
                              borderBottom="1px solid rgb(34,37,49)"
                              borderColor="rgb(34,37,49)"
                              borderTop="1px solid rgb(34,37,49)"
                              color="white"
                              fontFamily="Montserrat"
                              width="5%"
                            >
                              Номер
                            </Th>
                            <Th
                              textAlign="center"
                              pt={5}
                              pb={5}
                              borderBottom="1px solid rgb(34,37,49)"
                              borderColor="rgb(34,37,49)"
                              borderTop="1px solid rgb(34,37,49)"
                              color="white"
                              fontFamily="Montserrat"
                              fontWeight="700"
                              width="10%"
                            >
                              Орг
                            </Th>
                            <Th
                              textAlign="left"
                              pt={5}
                              pb={5}
                              borderBottom="1px solid rgb(34,37,49)"
                              borderColor="rgb(34,37,49)"
                              borderTop="1px solid rgb(34,37,49)"
                              color="white"
                              fontFamily="Montserrat"
                              fontWeight="700"
                              width="10%"
                            >
                              Клво. человек
                            </Th>

                            <Th
                              textAlign="center"
                              pt={5}
                              pb={5}
                              borderBottom="1px solid rgb(34,37,49)"
                              borderColor="rgb(34,37,49)"
                              borderTop="1px solid rgb(34,37,49)"
                              color="white"
                              fontFamily="Montserrat"
                              fontWeight="700"
                              width="40%"
                            >
                              Название блоков
                            </Th>
                            <Th
                              textAlign="center"
                              pt={5}
                              pb={5}
                              borderBottom="1px solid rgb(34,37,49)"
                              borderColor="rgb(34,37,49)"
                              borderTop="1px solid rgb(34,37,49)"
                              color="white"
                              fontFamily="Montserrat"
                              fontWeight="700"
                              width="10%"
                            >
                              Цена
                            </Th>
                            <Th
                              textAlign="center"
                              pt={5}
                              pb={5}
                              borderBottom="1px solid rgb(34,37,49)"
                              borderColor="rgb(34,37,49)"
                              borderTop="1px solid rgb(34,37,49)"
                              color="white"
                              fontFamily="Montserrat"
                              fontWeight="700"
                              width="15%"
                            >
                              Статус
                            </Th>
                            <Th
                              textAlign="left"
                              pt={5}
                              pb={5}
                              borderBottom="1px solid rgb(34,37,49)"
                              borderColor="rgb(34,37,49)"
                              borderTop="1px solid rgb(34,37,49)"
                              color="white"
                              fontFamily="Montserrat"
                              fontWeight="700"
                              width="15%"
                            >
                              Результат
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody width="100%">
                          {statements?.map((value, index) => (
                            <Tr width="100%" key={index}>
                              <Th
                                textAlign="center"
                                pt={5}
                                pb={5}
                                borderBottom="1px solid rgb(34,37,49)"
                                borderColor="rgb(34,37,49)"
                                borderTop="1px solid rgb(34,37,49)"
                                color="black"
                                fontFamily="Montserrat"
                                width="10%"
                              >
                                {index + 1}
                              </Th>

                              <Th
                                textAlign="center"
                                pt={5}
                                pb={5}
                                borderBottom="1px solid rgb(34,37,49)"
                                borderColor="rgb(34,37,49)"
                                borderTop="1px solid rgb(34,37,49)"
                                color="black"
                                fontFamily="Montserrat"
                                fontWeight="700"
                                width="10%"
                              >
                                {value?.companyName}
                              </Th>

                              <Th
                                textAlign="center"
                                pt={5}
                                pb={5}
                                borderBottom="1px solid rgb(34,37,49)"
                                borderColor="rgb(34,37,49)"
                                borderTop="1px solid rgb(34,37,49)"
                                color="black"
                                fontFamily="Montserrat"
                                fontWeight="700"
                                width="10%"
                              >
                                {value?.numOfUsers}
                              </Th>

                              <Th
                                textAlign="center"
                                pt={5}
                                pb={5}
                                borderBottom="1px solid rgb(34,37,49)"
                                borderColor="rgb(34,37,49)"
                                borderTop="1px solid rgb(34,37,49)"
                                color="black"
                                fontFamily="Montserrat"
                                fontWeight="700"
                                width="40%"
                                maxW="40%"
                                textTransform="none"
                                style={{
                                  wordBreak: "break-all",
                                  whiteSpace: "pre-wrap",
                                }}
                              >
                                {value?.quizId?.map((data, index) => (
                                  <>
                                    {index + 1}. {data?.title} <br />
                                  </>
                                ))}
                              </Th>

                              <Th
                                textAlign="center"
                                pt={5}
                                pb={5}
                                borderBottom="1px solid rgb(34,37,49)"
                                borderColor="rgb(34,37,49)"
                                borderTop="1px solid rgb(34,37,49)"
                                color="black"
                                fontFamily="Montserrat"
                                fontWeight="700"
                                width="10%"
                              >
                                {value?.price}
                              </Th>
                              <Th
                                textAlign="center"
                                pt={5}
                                pb={5}
                                borderBottom="1px solid rgb(34,37,49)"
                                borderColor="rgb(34,37,49)"
                                borderTop="1px solid rgb(34,37,49)"
                                color={
                                  value?.isApproved ? "#48904d" : "#f7cd36"
                                }
                                fontFamily="Montserrat"
                                fontWeight="700"
                                width="15%"
                              >
                                {value?.isApproved ? "Разрешен" : "Не Разрешен"}
                              </Th>
                              <Th
                                onClick={() => {
                                  if (value?.isApproved) {
                                    navigate(
                                      `/client/dashboard/statement/${value?._id}`,
                                    );
                                  }
                                }}
                                textAlign="left"
                                pt={5}
                                cursor="pointer"
                                pb={5}
                                borderBottom="1px solid rgb(34,37,49)"
                                borderColor="rgb(34,37,49)"
                                borderTop="1px solid rgb(34,37,49)"
                                color="black"
                                fontFamily="Montserrat"
                                fontWeight="700"
                                textDecoration="underline"
                                textDecorationStyle="solid"
                                textTransform="none"
                                textDecorationColor="green"
                                textDecorationLine=""
                                textUnderlineOffset="7px"
                                textDecorationThickness="1px"
                              >
                                {value?._id}
                              </Th>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Center>
              </>
            }
          />
          <Route
            exact
            path="/create-statement"
            element={
              <Center width="100%" pb={10}>
                <Box width="80%" height="auto" minH="60vh">
                  <Text
                    pt={10}
                    textAlign="center"
                    fontSize="4.5rem"
                    letterSpacing="3px"
                    fontWeight="500"
                    fontFamily="Montserrat"
                    color="#4f758a "
                  >
                    Оформление заявки
                  </Text>
                  <Box pb={16}>
                    <Box
                      display="flex"
                      alignContent="center"
                      alignItems="center"
                    >
                      <Box
                        width="5rem"
                        height="5rem"
                        borderRadius="50%"
                        border="1.5px dashed #4f758a "
                        display="flex"
                        fontSize="1.875rem"
                        fontFamily="Montserrat"
                        fontWeight="700"
                        justifyContent="center"
                        alignItems="center"
                        alignContent="center"
                        textAlign="center"
                        color="#4f758a "
                      >
                        1
                      </Box>
                      <Text
                        fontFamily="Montserrat"
                        color="#4f758a "
                        fontSize="1.875rem"
                        fontWeight="600"
                        letterSpacing="3px"
                        pl={8}
                      >
                        ШАГ
                      </Text>
                    </Box>
                    <Text
                      pt={8}
                      pb={3}
                      fontSize="1.5rem"
                      fontWeight="500"
                      fontFamily="Montserrat"
                      color="#4f758a "
                    >
                      {" "}
                      Укажите наименование вашей организации{" "}
                    </Text>
                    <Input
                      fontSize="1.3rem"
                      fontFamily="Montserrat"
                      fontWeight="500"
                      value={step1}
                      onChange={(e) => setStep1(e.target.value)}
                      _focus={{
                        boxShadow: "none",
                        borderBottom: "1px solid #4f758a",
                      }}
                      _active={{
                        boxShadow: "none",
                        borderBottom: "1px solid #4f758a",
                      }}
                      _selected={{
                        boxShadow: "none",
                        borderBottom: "1px solid #4f758a",
                      }}
                      _placeholder={{
                        border: "none",
                        borderBottom: "1px solid #4f758a",
                      }}
                      type="text"
                      placeholder="---"
                      border="none"
                      borderBottom="1px solid #4f758a"
                    />
                  </Box>

                  <Box pt={16} pb={16}>
                    <Box
                      display="flex"
                      alignContent="center"
                      alignItems="center"
                    >
                      <Box
                        width="5rem"
                        height="5rem"
                        borderRadius="50%"
                        border="1.5px dashed #4f758a "
                        display="flex"
                        fontSize="1.875rem"
                        fontFamily="Montserrat"
                        fontWeight="700"
                        justifyContent="center"
                        alignItems="center"
                        alignContent="center"
                        textAlign="center"
                        color="#4f758a "
                      >
                        2
                      </Box>
                      <Text
                        fontFamily="Montserrat"
                        color="#4f758a "
                        fontSize="1.875rem"
                        fontWeight="600"
                        letterSpacing="3px"
                        pl={8}
                      >
                        ШАГ
                      </Text>
                    </Box>
                    <Text
                      pt={8}
                      pb={3}
                      fontSize="1.5rem"
                      fontWeight="500"
                      fontFamily="Montserrat"
                      color="#4f758a "
                    >
                      {" "}
                      Пожалуйста, укажите, сколько человек Вы планируете
                      протестировать
                    </Text>
                    <Input
                      fontSize="1.3rem"
                      fontFamily="Montserrat"
                      fontWeight="500"
                      value={step2}
                      onChange={(e) => setStep2(e.target.value)}
                      _focus={{
                        boxShadow: "none",
                        borderBottom: "1px solid #4f758a",
                      }}
                      _active={{
                        boxShadow: "none",
                        borderBottom: "1px solid #4f758a",
                      }}
                      _selected={{
                        boxShadow: "none",
                        borderBottom: "1px solid #4f758a",
                      }}
                      _placeholder={{
                        border: "none",
                        borderBottom: "1px solid #4f758a",
                      }}
                      type="number"
                      placeholder="5"
                      border="none"
                      borderBottom="1px solid #4f758a"
                    />
                  </Box>

                  <Box pt={16} width="100%" pb={16}>
                    <Box
                      display="flex"
                      alignContent="center"
                      alignItems="center"
                    >
                      <Box
                        width="5rem"
                        height="5rem"
                        borderRadius="50%"
                        border="1.5px dashed #4f758a "
                        display="flex"
                        fontSize="1.875rem"
                        fontFamily="Montserrat"
                        fontWeight="700"
                        justifyContent="center"
                        alignItems="center"
                        alignContent="center"
                        textAlign="center"
                        color="#4f758a "
                      >
                        3
                      </Box>
                      <Text
                        fontFamily="Montserrat"
                        color="#4f758a "
                        fontSize="1.875rem"
                        fontWeight="600"
                        letterSpacing="3px"
                        pl={8}
                      >
                        ШАГ
                      </Text>
                    </Box>
                    <Text
                      pt={8}
                      pb={3}
                      fontSize="1.5rem"
                      fontWeight="500"
                      fontFamily="Montserrat"
                      color="#4f758a "
                    >
                      {" "}
                      Пожалуйста, выберите блоки, которые вы хотели бы
                      использовать
                    </Text>

                    <Box
                      pt={10}
                      pl={[2, 2, 2, 2, 0, 0]}
                      pr={[2, 2, 2, 2, 0, 0]}
                    >
                      <Accordion
                        allowToggle
                        display="grid"
                        gridTemplateColumns="1fr 1fr 1fr"
                        columnGap={8}
                        width="100%"
                        rowGap={16}
                      >
                        {quizzes?.map((data, index) => (
                          <AccordionItem
                            key={index}
                            mb={3}
                            p={4}
                            bg={
                              step3?.includes(data?._id)
                                ? "rgba(31, 29, 40, 1)"
                                : "white"
                            }
                            borderRadius="25px"
                            border="1px solid rgba(31, 29, 40, 1)"
                          >
                            {({ isExpanded }) => (
                              <>
                                <Box>
                                  <AccordionButton>
                                    <Box flex="1" textAlign="left">
                                      <Box
                                        display="flex"
                                        alignItems="center"
                                        alignContent="center"
                                      >
                                        <Text
                                          pr={2}
                                          color={
                                            step3?.includes(data?._id)
                                              ? "white"
                                              : "#4f758a"
                                          }
                                          fontSize={[
                                            "1rem",
                                            "1.1em",
                                            "1.1em",
                                            "1.1em",
                                          ]}
                                          fontWeight="500"
                                          fontFamily="Montserrat"
                                          style={{
                                            wordBreak: "break-all",
                                            whiteSpace: "pre-wrap",
                                          }}
                                        >
                                          {data?.title}
                                        </Text>
                                      </Box>
                                    </Box>
                                    {isExpanded ? (
                                      <Box
                                        p={3}
                                        borderRadius="50%"
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        bg={
                                          step3?.includes(data?._id)
                                            ? "rgba(0, 3, 11, 1)"
                                            : "#4f758a"
                                        }
                                        border="1px solid rgba(61, 58, 75, 1)"
                                      >
                                        <FaAngleUp
                                          size="1rem"
                                          color={
                                            step3?.includes(data?._id)
                                              ? "rgba(152, 151, 156, 1)"
                                              : "white"
                                          }
                                        />
                                      </Box>
                                    ) : (
                                      <Box
                                        p={3}
                                        borderRadius="50%"
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        bg={
                                          step3?.includes(data?._id)
                                            ? "rgba(0, 3, 11, 1)"
                                            : "#4f758a"
                                        }
                                        border="1px solid rgba(61, 58, 75, 1)"
                                      >
                                        <FaAngleDown
                                          size="1rem"
                                          color={
                                            step3?.includes(data?._id)
                                              ? "rgba(152, 151, 156, 1)"
                                              : "white"
                                          }
                                        />
                                      </Box>
                                    )}
                                  </AccordionButton>
                                </Box>
                                <AccordionPanel pb={4}>
                                  {data?.questions?.map((question, index) => (
                                    <>
                                      <Text
                                        style={{
                                          wordBreak: "break-all",
                                          whiteSpace: "pre-wrap",
                                        }}
                                        key={index}
                                        fontFamily="Montserrat"
                                        fontWeight="500"
                                        fontSize="1.1rem"
                                        color={
                                          step3?.includes(data?._id)
                                            ? "white"
                                            : "black"
                                        }
                                      >
                                        {index + 1}.&nbsp; {question?.title}
                                      </Text>
                                    </>
                                  ))}
                                  <Center>
                                    {step3?.includes(data?._id) ? (
                                      <Button
                                        onClick={() =>
                                          setStep3(
                                            step3?.filter(
                                              (st) => st !== data?._id,
                                            ),
                                          )
                                        }
                                        mt={8}
                                        color="white"
                                        _hover={{
                                          color: "white",
                                          bg: "red",
                                        }}
                                        bg="red"
                                        fontFamily="Montserrat"
                                        pl={8}
                                        pr={8}
                                        pt={6}
                                        pb={6}
                                        fontSize="1rem"
                                        borderRadius="15"
                                      >
                                        Отобрать
                                      </Button>
                                    ) : (
                                      <Button
                                        onClick={() =>
                                          setStep3((st) => [...st, data?._id])
                                        }
                                        mt={8}
                                        color="white"
                                        _hover={{
                                          color: "white",
                                          bg: "#4f758a",
                                        }}
                                        bg="#4f758a"
                                        fontFamily="Montserrat"
                                        pl={8}
                                        pr={8}
                                        pt={6}
                                        pb={6}
                                        fontSize="1rem"
                                        borderRadius="15"
                                      >
                                        Выбрать
                                      </Button>
                                    )}
                                  </Center>
                                </AccordionPanel>
                              </>
                            )}
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </Box>
                  </Box>

                  <Box pt={16} pb={16}>
                    <Box
                      display="flex"
                      alignContent="center"
                      alignItems="center"
                    >
                      <Box
                        width="5rem"
                        height="5rem"
                        borderRadius="50%"
                        border="1.5px dashed #4f758a "
                        display="flex"
                        fontSize="1.875rem"
                        fontFamily="Montserrat"
                        fontWeight="700"
                        justifyContent="center"
                        alignItems="center"
                        alignContent="center"
                        textAlign="center"
                        color="#4f758a "
                      >
                        4
                      </Box>
                      <Text
                        fontFamily="Montserrat"
                        color="#4f758a "
                        fontSize="1.875rem"
                        fontWeight="600"
                        letterSpacing="3px"
                        pl={8}
                      >
                        ШАГ
                      </Text>
                    </Box>
                    <Text
                      pt={8}
                      pb={3}
                      fontSize="1.5rem"
                      fontWeight="500"
                      fontFamily="Montserrat"
                      color="#4f758a "
                    >
                      {" "}
                      Отправте заявку
                    </Text>

                    <Center pt={5}>
                      <Button
                        onClick={addNewStatement}
                        isLoading={isLoading}
                        mt={5}
                        color="white"
                        _hover={{
                          color: "white",
                          bg: "#4f758a",
                        }}
                        bg="#4f758a"
                        fontFamily="Montserrat"
                        pl={8}
                        pr={8}
                        pt={6}
                        fontWeight="400"
                        letterSpacing="3px"
                        pb={6}
                        fontSize="1rem"
                        borderRadius="15"
                      >
                        ОТПРАВИТЬ
                      </Button>
                    </Center>
                  </Box>

                  <Box
                    width="100%"
                    border="2px solid #4f758a"
                    padding={5}
                    borderRadius="20"
                    mt={10}
                  >
                    <Text
                      fontSize="1.875rem"
                      letterSpacing="3px"
                      fontWeight="500"
                      fontFamily="Montserrat"
                      color="#4f758a"
                      textAlign="center"
                    >
                      Расчитайте стоимость услуги
                    </Text>
                    <Box
                      display="flex"
                      width="100%"
                      pt={16}
                      justifyContent="center"
                      alignContent="center"
                      alignItems="center"
                    >
                      <Box width="60%">
                        <Box display="flex" width="100%">
                          <Text
                            color="#4f758a"
                            fontSize="1.125rem"
                            fontFamily="Montserrat"
                            width="100%"
                            textAlign="center"
                          >
                            Количество человек
                          </Text>
                          <Input
                            value={persons}
                            onChange={(e) => setPersons(e.target.value)}
                            type="number"
                            border="1px solid black"
                          />
                        </Box>

                        <Box display="flex" width="100%" mt={8}>
                          <Text
                            color="#4f758a"
                            fontSize="1.125rem"
                            fontFamily="Montserrat"
                            width="100%"
                            textAlign="center"
                          >
                            Количество выбранных блоков
                          </Text>
                          <Input
                            value={blocks}
                            onChange={(e) => setBlocks(e.target.value)}
                            type="number"
                            border="1px solid black"
                          />
                        </Box>

                        <Box
                          display="flex"
                          width="100%"
                          mt={1}
                          justifyContent="right"
                        >
                          <Button
                            mt={8}
                            onClick={() =>
                              setValue(persons * 100 + blocks * 350)
                            }
                            color="white"
                            _hover={{
                              color: "white",
                              bg: "#4f758a",
                            }}
                            bg="#4f758a"
                            fontFamily="Montserrat"
                            pl={8}
                            pr={8}
                            pt={6}
                            pb={6}
                            fontSize="1rem"
                            borderRadius="15"
                          >
                            Расчитать
                          </Button>
                        </Box>
                      </Box>
                      <Box
                        width="40%"
                        display="flex"
                        justifyContent="center"
                        height="100%"
                        alignContent="center"
                        alignItems="center"
                      >
                        <Box
                          height="10rem"
                          width="10rem"
                          border="2px dashed #4f758a"
                          borderRadius="25"
                          justifyContent="center"
                          alignContent="center"
                          fontSize="2rem"
                          fontFamily="Montserrat"
                          fontWeight="500"
                          alignItems="center"
                          textAlign="center"
                        >
                          {value}
                        </Box>
                      </Box>
                    </Box>

                    <Box pt={16} pb={16}>
                      <Text
                        pl={20}
                        fontSize="1.125rem"
                        fontFamily="Montserrat"
                        color="#b3b3b3"
                        textAlign="left"
                      >
                        * cтоимость на одного человека{" "}
                        <span style={{ color: "#f1b7ba" }}>100</span> рублей
                      </Text>
                      <Text
                        pt={3}
                        pl={20}
                        fontSize="1.125rem"
                        fontFamily="Montserrat"
                        color="#b3b3b3"
                        textAlign="left"
                      >
                        * стоимость одного блока
                        <span style={{ color: "#f1b7ba" }}> 350</span> рублей
                      </Text>
                    </Box>
                  </Box>

                  <Text
                    fontSize="1.875rem"
                    letterSpacing="3px"
                    fontWeight="500"
                    pt={16}
                    fontFamily="Montserrat"
                    color="#4f758a"
                    textAlign="center"
                  >
                    Банки, с которыми мы сотрудничаем
                  </Text>

                  <Box
                    columnGap={8}
                    width="100%"
                    display="grid"
                    gridTemplateColumns="1fr 1fr 1fr 1fr"
                    justifyContent="center"
                    alignContent="center"
                    alignItems="center"
                  >
                    <Image src={sberbank} width="12rem" />
                    <Image src={alfa} width="12rem" />
                    <Image src={tinkoffbank} width="12rem" />
                    <Image src={centerinvest} width="12rem" />
                  </Box>
                </Box>
              </Center>
            }
          />
          <Route path="/statement/:id" element={<Statement />} />
        </Routes>

        <Footer />
      </Box>
    </Center>
  );
}

export default Dashboard;
