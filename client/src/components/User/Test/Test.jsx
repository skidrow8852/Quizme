import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  Text,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaRegCheckCircle,
} from "react-icons/fa";
import { IoMdClose, IoMdCloseCircle } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";

import images2 from "../../../assets/images-2.png";
import welcome from "../../../assets/welcome.png";
import { getQuizDataValues, submitQuiz } from "../../../services/user/test";

function Test() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem(`user:${id}`));
  const [tab, setTab] = React.useState(1);
  const [quizData, setQuizData] = React.useState({});
  const [isError, setIsError] = React.useState(false);
  const [answers, setAnswers] = React.useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = React.useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [points, setPoints] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const toast = useToast();

  // Function to check if the user has answered all questions for all quiz IDs
  const isAllQuestionsAnswered = () => {
    // Iterate over each quiz ID
    for (const quiz of quizData.quizId || []) {
      // Iterate over each question in the current quiz
      for (const question of quizData.quizId.find((ds) => ds._id === quiz?._id)
        ?.questions || []) {
        // Check if the user has not selected an answer for any question
        if (
          !answers.some(
            (answerItem) =>
              answerItem.quizId === quiz?._id &&
              answerItem.questionId === question.id,
          )
        ) {
          return false; // If any question is unanswered, return false
        }
      }
    }
    return true; // Return true if all questions are answered for all quiz IDs
  };

  const submitQuizData = async () => {
    try {
      setIsLoading(true);
      if (isAllQuestionsAnswered()) {
        let data = await submitQuiz(id, {
          username: user?.username,
          quizId: id,
          answers,
        });
        if (data?.data?.status == "success") {
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
                  Тест успешно пройден!
                </Text>
                <Box ml={4} onClick={onClose} cursor="pointer">
                  <IoMdClose size="1.5rem" />
                </Box>
              </Flex>
            ),
          });
          setTab(3);
        } else {
          toast({
            position: "top-center",
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
        }
      } else {
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
                Вам нужно ответить на все вопросы
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
        position: "top-center",
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

  const handleAnswerSelection = (quizId, questionId, selectedAnswer) => {
    const updatedAnswers = [...answers];
    const answerIndex = updatedAnswers.findIndex(
      (answer) => answer.quizId === quizId && answer.questionId === questionId,
    );

    const answerObject = {
      quizId,
      questionId,
      selectedAnswer: selectedAnswer,
      points: selectedAnswer.points || 0,
    };

    if (answerIndex !== -1) {
      updatedAnswers[answerIndex] = answerObject;
    } else {
      updatedAnswers.push(answerObject);
    }

    // Update answers state with the array of answers
    setAnswers(updatedAnswers);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex >= 5) {
      setCurrentQuestionIndex(currentQuestionIndex - 5);
    } else if (currentQuestionIndex === 0 && currentQuizIndex > 0) {
      setCurrentQuizIndex(currentQuizIndex - 1);
      setCurrentQuestionIndex(
        Math.max(0, quizData.quizId[currentQuizIndex - 1].questions.length - 5),
      );
    }
  };

  const getQuizData = async () => {
    try {
      let data = await getQuizDataValues(id, user?.username);
      if (data?.data?.status == "success" && data?.data?.quiz) {
        setQuizData(data?.data?.quiz);
        if (
          data?.data?.quiz?.attendants?.findIndex(
            (ds) =>
              ds?.username?.toLowerCase() == user?.username?.toLowerCase() &&
              ds?.isFinished,
          ) !== -1
        ) {
          setTab(3);
        }
      } else {
        setIsError(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleNextQuestion = (quiz) => {
    // You can add logic here to handle moving to the next question
    if (currentQuestionIndex < quiz?.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 5);
    } else {
      // Handle end of quiz logic here, e.g., show quiz results
      console.log("End of quiz reached!");
    }
  };

  const handleNextQuiz = () => {
    setPoints(0);
    // You can add logic here to handle moving to the next quiz
    if (currentQuizIndex < quizData?.quizId?.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setCurrentQuestionIndex(0); // Reset question index for the new quiz
    } else {
      // Handle end of quizzes logic here, e.g., show final results
      console.log("End of all quizzes reached!");
    }
  };

  React.useEffect(() => {
    if (!localStorage.getItem(`user:${id}`)) {
      navigate(`/user/test/${id}`);
    }
    getQuizData();
  }, []);
  return (
    <Center width="100%" bg="#f5f7fa" height="auto" overflowY="auto">
      {isError ? (
        <Center width="80%" minH="100vh" bg="#f5f7fa">
          <Text
            textAlign="center"
            color="black"
            fontSize="4.5rem"
            fontFamily="Montserrat"
            letterSpacing="3px"
          >
            НЕ НАЙДЕН
          </Text>
        </Center>
      ) : (
        <>
          <Box
            width="80%"
            minH="100vh"
            bg="#f5f7fa"
            pb={20}
            justifyContent="center"
            display="flex"
          >
            {tab == 1 && (
              <Box>
                <Center height="10rem" width="100%">
                  <Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignContent="center"
                      alignItems="center"
                    >
                      <Text
                        fontWeight="500"
                        fontFamily="Montserrat"
                        textAlign="center"
                        fontSize="4.5rem"
                        color="#4f758a"
                      >
                        Добро пожаловать!{" "}
                      </Text>

                      <Box
                        pl={24}
                        cursor="pointer"
                        onClick={() => {
                          localStorage.removeItem(`user:${user?.quizId}`);
                          window.location.href = `${import.meta.env.VITE_WEB_HOST}/user/test/${id}`;
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
                  </Box>
                </Center>

                <Box pt={10} display="flex" justifyContent="center">
                  <Image src={welcome} />
                </Box>
                <Center pt={16}>
                  <Button
                    onClick={() => setTab(2)}
                    _hover={{ bg: "#4f758a", color: "white" }}
                    bg="#4f758a"
                    color="white"
                    borderRadius="15px"
                    p={6}
                  >
                    Начать тестирование
                  </Button>
                </Center>
              </Box>
            )}
            {tab == 2 && (
              <Box width="80%" minH="100vh" bg="#f5f7fa" height="auto">
                {quizData.quizId?.map((quiz, index) => (
                  <>
                    {currentQuizIndex === index && (
                      <Box key={index}>
                        <Center height="auto" pt={5} width="100%">
                          <Text
                            fontWeight="500"
                            fontFamily="Montserrat"
                            textAlign="center"
                            fontSize="4rem"
                            color="#4f758a"
                          >
                            {index + 1}. {quiz.title}
                          </Text>
                          <Box
                            pl={24}
                            cursor="pointer"
                            onClick={() => {
                              localStorage.removeItem(`user:${user?.quizId}`);
                              window.location.href = `${import.meta.env.VITE_WEB_HOST}/user/test/${id}`;
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
                        </Center>

                        {quiz.questions
                          .slice(currentQuestionIndex, currentQuestionIndex + 5)
                          .map((question, index) => (
                            <Box key={question.id} mt={10}>
                              <Text
                                fontSize="1.5rem"
                                color="#333"
                                fontWeight="bold"
                              >
                                {index + 1}. {question.title}
                              </Text>
                              <Box pt={10}>
                                <Box
                                  display="flex"
                                  flexDirection="column"
                                  rowGap={5}
                                >
                                  {question.answers.map((answer) => {
                                    const isAnswerSelected = answers.some(
                                      (answerItem) =>
                                        answerItem.quizId ===
                                          quizData.quizId[currentQuizIndex]
                                            ?._id &&
                                        answerItem.questionId === question.id &&
                                        answerItem.selectedAnswer === answer,
                                    );

                                    return (
                                      <Box key={answer.key}>
                                        <Button
                                          p={6}
                                          borderRadius="10px"
                                          key={answer.key}
                                          variant="outline"
                                          colorScheme="blue"
                                          onClick={() =>
                                            handleAnswerSelection(
                                              quiz?._id,
                                              question.id,
                                              answer,
                                            )
                                          }
                                          bg={
                                            isAnswerSelected
                                              ? "black"
                                              : undefined
                                          }
                                          color={
                                            isAnswerSelected
                                              ? "white"
                                              : undefined
                                          }
                                        >
                                          {answer.value}
                                        </Button>
                                      </Box>
                                    );
                                  })}
                                </Box>
                              </Box>
                            </Box>
                          ))}

                        <Box
                          pt={16}
                          display="flex"
                          justifyContent="center"
                          alignContent="center"
                          alignItems="center"
                          columnGap={10}
                        >
                          {currentQuestionIndex >= 5 ||
                            (currentQuestionIndex <= quiz?.questions?.length &&
                              currentQuizIndex !== 0 && (
                                <Button
                                  onClick={handlePreviousQuestion}
                                  fontFamily="Montserrat"
                                  fontSize="1.125rem"
                                  letterSpacing="2px"
                                  color="white"
                                  bg="black"
                                  _hover={{ bg: "black", color: "white" }}
                                  p={6}
                                  borderRadius="15px"
                                >
                                  Назад
                                </Button>
                              ))}
                          {currentQuizIndex < quizData.quizId.length - 1 ? (
                            <Button
                              p={6}
                              borderRadius="15px"
                              onClick={handleNextQuiz}
                              fontFamily="Montserrat"
                              fontSize="1.125rem"
                              letterSpacing="2px"
                              color="white"
                              bg="#4f758a"
                              _hover={{ bg: "#4f758a", color: "white" }}
                            >
                              Следующий блок
                            </Button>
                          ) : (
                            <Button
                              p={6}
                              isLoading={isLoading}
                              borderRadius="15px"
                              fontFamily="Montserrat"
                              fontSize="1.125rem"
                              letterSpacing="2px"
                              color="white"
                              bg="#4f758a"
                              _hover={{ bg: "#4f758a", color: "white" }}
                              onClick={
                                currentQuizIndex ===
                                  quizData.quizId.length - 1 &&
                                currentQuestionIndex ===
                                  quizData.quizId[currentQuizIndex].questions
                                    .length -
                                    1
                                  ? () => handleNextQuestion(quiz)
                                  : submitQuizData
                              }
                            >
                              {currentQuizIndex < quizData.quizId.length - 1
                                ? "Дале"
                                : "Отправить"}
                            </Button>
                          )}
                        </Box>
                      </Box>
                    )}
                  </>
                ))}
              </Box>
            )}
            {tab == 3 && (
              <Center height="100vh">
                <Box>
                  <Box display="flex" justifyContent="center">
                    <FaCheckCircle size="20rem" color="green" />
                  </Box>
                  <Text
                    pt={5}
                    fontWeight="500"
                    fontFamily="Montserrat"
                    textAlign="center"
                    fontSize="2rem"
                    color="#4f758a"
                  >
                    Вы успешно прошлт тест
                  </Text>
                </Box>
                <Box
                  pl={24}
                  cursor="pointer"
                  onClick={() => {
                    localStorage.removeItem(`user:${user?.quizId}`);
                    window.location.href = `${import.meta.env.VITE_WEB_HOST}/user/test/${id}`;
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
              </Center>
            )}
          </Box>
        </>
      )}
    </Center>
  );
}

export default Test;
