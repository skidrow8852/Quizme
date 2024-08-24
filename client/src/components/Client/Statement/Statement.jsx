import {
  Box,
  Button,
  Center,
  Image,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { saveAs } from "file-saver";
import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import * as XLSX from "xlsx";

import blocks from "../../../assets/blocks.jpg";
import notaken from "../../../assets/notaken.jpg";
import users from "../../../assets/users.jpg";
import { getClientStatements } from "../../../services/client/statement";
import { clientStatementsState } from "../../../store/atoms/client/atoms";

function Statement() {
  const { id } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [statements, setStatements] = useRecoilState(clientStatementsState);
  const client = JSON.parse(localStorage.getItem("client"));
  const [statementData, setStatementData] = React.useState({});
  const [copy, setCopy] = React.useState("");
  const [isNotFound, setIsNotFound] = React.useState(false);

  const ExportToExcelButton = ({ tableData }) => {
    const exportToExcel = () => {
      const worksheet = XLSX.utils.json_to_sheet(tableData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const data = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      saveAs(data, "table_data.xlsx");
    };

    return (
      <Button
        onClick={exportToExcel}
        colorScheme="blue"
        mt={4}
        borderRadius="15px"
      >
        Скачать таблицу
      </Button>
    );
  };

  const Copy = ({ textValue }) => {
    return (
      <CopyToClipboard text={textValue} onCopy={() => setCopy(textValue)}>
        <Box>
          <Button
            _hover={{ bg: "#4f758a", color: "white" }}
            p={6}
            border="1px solid rgb(255,255,255,0.4)"
            color="white"
            borderRadius="15px"
            fontSize="0.9rem"
            bg="#4f758a"
          >
            Скопировать
          </Button>
        </Box>
      </CopyToClipboard>
    );
  };

  const Copyied = ({ textValue }) => {
    return (
      <CopyToClipboard text={textValue} onCopy={() => setCopy("")}>
        <Box>
          <Button
            p={6}
            border="1px solid rgb(255,255,255,0.4)"
            color="white"
            borderRadius="15px"
            _hover={{ bg: "#4f758a", color: "white" }}
            bg="#4f758a"
            fontSize="0.9rem"
          >
            ✔ Скопировано
          </Button>
        </Box>
      </CopyToClipboard>
    );
  };

  const getAllStatementsData = async () => {
    try {
      if (statements?.length == 0) {
        let data = await getClientStatements(client?.id);
        if (data?.data && data?.status == 200 && Array.isArray(data?.data)) {
          setStatements(data?.data);
          setStatementData(
            data?.data?.find(
              (ds) => ds?._id?.toLowerCase() == id?.toLowerCase(),
            ) || {},
          );
        } else {
          setIsNotFound(true);
        }
      } else {
        let sts =
          statements?.find(
            (ds) => ds?._id?.toLowerCase() == id?.toLowerCase(),
          ) || {};
        setStatementData(sts);
        if (Object.keys(sts)?.length < 3) {
          setIsNotFound(true);
        }
      }
    } catch (e) {
      setIsNotFound(true);
      console.error(e);
    }
  };
  console.log(statementData);
  console.log(isNotFound);

  React.useEffect(() => {
    getAllStatementsData();
  }, [id]);

  return (
    <Center width="100%" height="auto" overflowY="auto" bg="#f5f7fa">
      <Box width="100%">
        {!isNotFound || Object.keys(statementData)?.length > 3 ? (
          <Center width="100%" pb={10} pt={16}>
            <Box width="80%" height="auto" minH="60vh">
              <Text
                pt={5}
                fontSize="2.25rem"
                fontWeight="500"
                fontFamily="Montserrat"
                letterSpacing="3px"
                color="#4f758a"
                textAlign="center"
                pb={16}
              >
                Обшая Статистика
              </Text>
              <Box
                display="grid"
                gridTemplateColumns="1fr 1fr 1fr"
                columnGap={8}
              >
                <Box
                  height="16rem"
                  border="2px dashed #4f758a"
                  borderRadius="30"
                  rowGap={5}
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignContent="center"
                  alignItems="center"
                >
                  <Image src={blocks} width="5rem" />
                  <Text
                    fontSize="2.25rem"
                    letterSpacing="3px"
                    color="#4f758a"
                    fontWeight="600"
                  >
                    {statementData?.quizId?.length}
                  </Text>
                  <Text
                    fontSize="1.125rem"
                    letterSpacing="3px"
                    fontFamily="Montserrat"
                  >
                    количество блоков
                  </Text>
                </Box>
                <Box
                  height="16rem"
                  border="2px dashed #4f758a"
                  borderRadius="30"
                  rowGap={5}
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignContent="center"
                  alignItems="center"
                >
                  <Image src={notaken} width="5rem" />
                  <Text
                    fontSize="2.25rem"
                    letterSpacing="3px"
                    color="#4f758a"
                    fontWeight="600"
                  >
                    {statementData?.attendants?.length}
                  </Text>
                  <Text
                    fontSize="1.125rem"
                    letterSpacing="3px"
                    fontFamily="Montserrat"
                  >
                    Количество пользователей
                  </Text>
                </Box>

                <Box
                  height="16rem"
                  border="2px dashed #4f758a"
                  borderRadius="30"
                  rowGap={5}
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignContent="center"
                  alignItems="center"
                >
                  <Image src={users} width="5rem" />
                  <Text
                    fontSize="2.25rem"
                    letterSpacing="3px"
                    color="#4f758a"
                    fontWeight="600"
                  >
                    {
                      statementData?.attendants?.filter((ds) => ds?.isFinished)
                        ?.length
                    }
                  </Text>
                  <Text
                    fontSize="1.125rem"
                    letterSpacing="3px"
                    fontFamily="Montserrat"
                  >
                    Пользователей прошедших тесты
                  </Text>
                </Box>
              </Box>

              <Box display="flex" pt={12}>
                <Text
                  ontSize="2.25rem"
                  fontWeight="700"
                  fontFamily="Montserrat"
                  letterSpacing="3px"
                  color="#4f758a"
                  textAlign="center"
                >
                  Ссылка на тест :{" "}
                </Text>
                <Text
                  pl={6}
                  ontSize="1.5rem"
                  fontWeight="500"
                  fontFamily="Montserrat"
                  letterSpacing="3px"
                  color="#4f758a"
                  textDecoration="underline"
                  textDecorationThickness="2px"
                  textUnderlineOffset="6px"
                  textAlign="center"
                >
                  {`${import.meta.env.VITE_WEB_HOST}/user/test/${id}`}
                </Text>
                <Box pl={5}>
                  {copy?.length > 5 ? (
                    <Copyied
                      textValue={`${import.meta.env.VITE_WEB_HOST}/user/test/${id}`}
                    />
                  ) : (
                    <Copy
                      textValue={`${import.meta.env.VITE_WEB_HOST}/user/test/${id}`}
                    />
                  )}
                </Box>
              </Box>

              <Box width="100%" minH="45rem" height="auto">
                <Box display="flex" pt={10}>
                  <Text
                    pr={5}
                    fontSize="2.25rem"
                    fontWeight="500"
                    fontFamily="Montserrat"
                    letterSpacing="3px"
                    color="#4f758a"
                  >
                    Результат
                  </Text>
                  <ExportToExcelButton
                    tableData={statementData?.attendants?.map(
                      ({ username, password, lastScore }, index) => ({
                        Номер: index + 1,
                        Логин: username,
                        Пароль: password,
                        "Название блоков": statementData?.quizId
                          ?.map(({ title }, index) => `${index + 1}. ${title} `)
                          .join(","),
                        Баллы: lastScore.map(({ score }) => score).join(","),
                        Результат: lastScore
                          .map(({ result }) => result)
                          .join(","),
                      }),
                    )}
                  />
                </Box>
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
                          width="15%"
                        >
                          Логин
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
                          Пароль
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
                          Баллы
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
                      {statementData?.attendants?.map((value, index) => (
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
                            width="5%"
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
                            width="15%"
                            style={{
                              wordBreak: "break-all",
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {value?.username}
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
                            width="15%"
                            style={{
                              wordBreak: "break-all",
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {value?.password}
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
                            {statementData?.quizId?.map((data, index) => (
                              <>
                                {index + 1}. {data?.title}
                                <br />
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
                            {value?.lastScore?.map((data) => (
                              <>
                                {data?.score}
                                <br />
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
                            width="15%"
                          >
                            {value?.lastScore?.map((data, index) => (
                              <>
                                {index + 1}. {data?.result}
                                <br />
                              </>
                            ))}
                          </Th>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </Center>
        ) : (
          <Box minH="40rem" textAlign="center">
            <Text
              fontSize="4rem"
              fontFamily="Montserrat"
              letterSpacing="3px"
              color="black"
              textAlign="center"
            >
              {" "}
              НЕ НАЙДЕН
            </Text>
          </Box>
        )}
      </Box>
    </Center>
  );
}

export default Statement;
