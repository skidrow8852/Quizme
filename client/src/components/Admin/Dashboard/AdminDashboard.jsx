/* eslint-disable no-irregular-whitespace */
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import Dropzone from "react-dropzone";
import { FaExclamationCircle, FaRegCheckCircle } from "react-icons/fa";
import {
  IoMdAddCircleOutline,
  IoMdClose,
  IoMdCloseCircle,
} from "react-icons/io";
import { MdUpload } from "react-icons/md";
import { RiEditBoxFill } from "react-icons/ri";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

import email1 from "../../../assets/email1.png";
import home from "../../../assets/home.png";
import images1 from "../../../assets/images-1.png";
import images2 from "../../../assets/images-2.png";
import images3 from "../../../assets/images-3.png";
import images4 from "../../../assets/images-4.png";
import images5 from "../../../assets/images-5.png";
import images6 from "../../../assets/images-6.png";
import images7 from "../../../assets/images-7.png";
import {
  addQuiz,
  checkAdmin,
  getClients,
  getQuizzes,
  getStatements,
  modifyQuiz,
  modifyStatement,
  removeQuiz,
  uploadImage,
} from "../../../services/admin/admin";
import {
  clientsState,
  quizzesState,
  statementsState,
} from "../../../store/atoms/admin/atoms";
import Footer from "../../Home/Footer/Footer";
function AdminDashboard() {
  const admin = JSON.parse(localStorage.getItem("admin"));
  const navigate = useNavigate();
  const { onOpen, isOpen, onClose } = useDisclosure();
  const {
    onOpen: openBlock,
    isOpen: isBlockOpen,
    onClose: onBlockClose,
  } = useDisclosure();
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();
  const [email, setEmail] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [intro, setIntro] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [imageUpload, setImageUpload] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [quizzes, setQuizzes] = useRecoilState(quizzesState);
  const [statements, setStatements] = useRecoilState(statementsState);
  const [selectedQuiz, setSelectedQuiz] = React.useState({});
  const [id, setId] = React.useState("");
  const [clients, setClients] = useRecoilState(clientsState);
  const [imageUrl, setImageUrl] = React.useState("");
  const [isEdit, setIsEdit] = React.useState(false);
  const cancelRef = React.useRef();
  const toast = useToast();
  const [quizData, setQuizData] = React.useState({
    results: [],
    questions: [],
  });

  const isValidAdmin = async () => {
    try {
      const data = await checkAdmin(admin?.username);

      if (!data?.data?.status == "success") {
        localStorage.removeItem("admin");
        navigate("/admin/login");
      }
    } catch (e) {
      localStorage.removeItem("admin");
      navigate("/admin/login");
    }
  };

  const location = useLocation();

  const handleDropImage = (acceptedFiles) => {
    try {
      setImageUpload(acceptedFiles[0]);
    } catch (e) {
      console.error(e);
    }

    return acceptedFiles[0];
  };

  const getDataOfStatements = async () => {
    try {
      if (statements == null) {
        let data = await getStatements(admin?.id);
        if (data?.data) {
          setStatements(data?.data);
        } else {
          setStatements([]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getDataOfClients = async () => {
    try {
      if (clients?.length < 1) {
        let data = await getClients(admin?.id);
        if (data?.data) {
          setClients(data?.data);
        } else {
          setClients([]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getQuizzesData = async () => {
    try {
      if (quizzes?.length < 1) {
        let data = await getQuizzes(admin?.id);
        if (data?.data) {
          setQuizzes(data?.data);
        } else {
          setQuizzes([]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    getDataOfStatements();
    getDataOfClients();
    getQuizzesData();
  }, []);

  const questionsChanged = () => {
    return !quizData?.questions?.every((quizQuestion, index) => {
      const selectedQuestion = selectedQuiz?.questions[index];

      // Compare question title, answers, and points
      return (
        quizQuestion?.title === selectedQuestion?.title &&
        JSON.stringify(quizQuestion.answers) ===
          JSON.stringify(selectedQuestion.answers) &&
        quizQuestion.points === selectedQuestion.points
      );
    });
  };

  const resultsChanged = () => {
    return !quizData?.results?.every((quizResult, index) => {
      const selectedResult = selectedQuiz?.results[index];

      // Compare result properties
      return (
        quizResult?.message === selectedResult?.message &&
        quizResult?.range === selectedResult?.range
        // Add more properties to compare as needed
      );
    });
  };

  React.useEffect(() => {
    try {
      if (
        imageUpload != null &&
        !(
          imageUpload.type === "image/png" ||
          imageUpload.type === "image/jpg" ||
          imageUpload.type === "image/jpeg" ||
          imageUpload.type === "image/webp"
        )
      ) {
        toast({
          title: `Only image files are allowed`,
          position: "top",
          isClosable: true,
          status: "error",
        });
        setImageUpload(null);
      }
    } catch (e) {
      console.error(e);
    }
  }, [imageUpload]);

  const handleDropAvatarImage = async () => {
    let formData = new FormData();
    formData.append("file", imageUpload);
    let values = await uploadImage(admin?.id, formData);
    if (values?.data?.success) {
      return `${import.meta.env.VITE_SERVER_HOST}/uploads/${values.data.fileName}`;
    } else {
      return "";
    }
  };

  const addNewQuiz = async () => {
    try {
      setIsLoading(true);
      if (title?.length < 5) {
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
                Название блока должена быть длиной не менее 5 символов
              </Text>
              <Box ml={4} onClick={onClose} cursor="pointer">
                <IoMdClose size="1.5rem" />
              </Box>
            </Flex>
          ),
        });
      } else if (description?.length < 5) {
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
                Описание блока должена быть длиной не менее 5 символов
              </Text>
              <Box ml={4} onClick={onClose} cursor="pointer">
                <IoMdClose size="1.5rem" />
              </Box>
            </Flex>
          ),
        });
      } else if (imageUpload == null) {
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
                Требуется изображение
              </Text>
              <Box ml={4} onClick={onClose} cursor="pointer">
                <IoMdClose size="1.5rem" />
              </Box>
            </Flex>
          ),
        });
      } else if (quizData?.questions?.length < 1) {
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
                Блок должен содержать хотя бы 1 вопрос
              </Text>
              <Box ml={4} onClick={onClose} cursor="pointer">
                <IoMdClose size="1.5rem" />
              </Box>
            </Flex>
          ),
        });
      } else {
        let image = await handleDropAvatarImage(imageUpload);
        let data = await addQuiz({
          admin: admin?.id,
          intro: intro,
          title: title,
          description: description,
          thumbnail:
            image?.length > 2
              ? image
              : imageUrl?.length > 5
                ? imageUrl
                : "https://marketplace.canva.com/EAFCO6pfthY/1/0/1600w/canva-blue-green-watercolor-linktree-background-F2CyNS5sQdM.jpg",
          results: quizData?.results,
          questions: quizData?.questions,
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
                  Блок успешно создан!
                </Text>
                <Box ml={4} onClick={onClose} cursor="pointer">
                  <IoMdClose size="1.5rem" />
                </Box>
              </Flex>
            ),
          });
          setQuizzes((prev) => [...prev, data?.data?.quizzes]);
          onBlockClose();
          setTitle("");
          setDescription("");
          setIntro("");
          setImageUpload(null);
          setQuizData({
            results: [],
            questions: [],
          });
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
      }

      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
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
    }
  };

  const addResult = () => {
    setQuizData((prevState) => ({
      ...prevState,
      results: [
        ...prevState.results,
        {
          range: "",
          message: "",
        },
      ],
    }));
  };

  const updateResult = (index, field, value) => {
    setQuizData((prevState) => ({
      ...prevState,
      results: prevState.results.map((result, i) =>
        i === index ? { ...result, [field]: value } : result,
      ),
    }));
  };

  const removeResult = (index) => {
    setQuizData((prevState) => ({
      ...prevState,
      results: prevState.results.filter((result, i) => i !== index),
    }));
  };

  const addQuestion = () => {
    setQuizData((prevState) => ({
      ...prevState,
      questions: [
        ...prevState.questions,
        {
          id: prevState.questions.length + 1,
          title: "",
          answers: [{ key: 1, value: "", points: 1 }],
        },
      ],
    }));
  };

  const updateQuestionTitle = (questionId, value) => {
    setQuizData((prevState) => ({
      ...prevState,
      questions: prevState.questions.map((question) =>
        question.id === questionId ? { ...question, title: value } : question,
      ),
    }));
  };

  const addAnswer = (questionId) => {
    setQuizData((prevState) => ({
      ...prevState,
      questions: prevState.questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              answers: [
                ...question.answers,
                { key: question.answers.length + 1, value: "", points: 1 },
              ],
            }
          : question,
      ),
    }));
  };

  const removeAnswer = (questionId, answerKey) => {
    setQuizData((prevState) => ({
      ...prevState,
      questions: prevState.questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              answers: question.answers.filter(
                (answer) => answer.key !== answerKey,
              ),
            }
          : question,
      ),
    }));
  };

  const updateAnswer = (questionId, answerKey, field, value) => {
    setQuizData((prevState) => ({
      ...prevState,
      questions: prevState.questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              answers: question.answers.map((answer) =>
                answer.key === answerKey
                  ? {
                      ...answer,
                      [field]: value,
                    }
                  : answer,
              ),
            }
          : question,
      ),
    }));
  };

  const removeQuestion = (questionId) => {
    setQuizData((prevState) => ({
      ...prevState,
      questions: prevState.questions.filter(
        (question) => question.id !== questionId,
      ),
    }));
  };

  const handleDescription = (e) => {
    setDescription(e.target.value);
  };

  const approveStatement = async (id, numOfUsers) => {
    try {
      let data = await modifyStatement(id, {
        admin: admin?.id,
        isApproved: true,
        numOfUsers,
      });

      if (data?.data) {
        setStatements((prevstats) => {
          return prevstats.map((stat) =>
            stat._id == id ? { ...stat, isApproved: true } : stat,
          );
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const disApproveStatement = async (id, attendents) => {
    try {
      let data = await modifyStatement(id, {
        admin: admin?.id,
        isApproved: false,
        numOfUsers: 0,
        attendents: attendents,
      });

      if (data?.data) {
        setStatements((prevstats) => {
          return prevstats.map((stat) =>
            stat._id == id ? { ...stat, isApproved: false } : stat,
          );
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveEdit = async () => {
    setIsLoading(true);
    try {
      let values = {};
      if (title !== selectedQuiz?.title) {
        values["title"] = title;
      }
      if (description !== selectedQuiz?.description) {
        values["description"] = description;
      }

      if (intro !== selectedQuiz?.intro) {
        values["intro"] = intro;
      }

      if (imageUpload !== null) {
        let result = await handleDropAvatarImage();
        values["thumbnail"] = result?.length > 5 ? result : imageUrl;
      }
      if (resultsChanged()) {
        values["results"] = quizData?.results;
      }

      if (questionsChanged()) {
        values["questions"] = quizData?.questions;
      }

      if (Object.keys(values)?.length > 0) {
        let data = await modifyQuiz({
          ...values,
          admin: admin?.id,
          quizId: selectedQuiz?._id,
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
                  Блок успешно изменен!
                </Text>
                <Box ml={4} onClick={onClose} cursor="pointer">
                  <IoMdClose size="1.5rem" />
                </Box>
              </Flex>
            ),
          });
          setQuizzes((prevQuizzes) => {
            return prevQuizzes.map((quiz) =>
              quiz._id == selectedQuiz?._id
                ? { ...quiz, ...data?.data?.quiz }
                : quiz,
            );
          });
          onBlockClose();
          setIsEdit(false);
          setTitle("");
          setDescription("");
          setIntro("");
          setImageUpload(null);
          setImageUrl("");
          setQuizData({
            results: [],
            questions: [],
          });
        } else if (data?.data?.status == "nothing updated") {
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
                <Text
                  textAlign="center"
                  fontFamily="Montserrat"
                  fontWeight="400"
                >
                  Блок Данных не изменилься
                </Text>
                <Box ml={4} onClick={onClose} cursor="pointer">
                  <IoMdClose size="1.5rem" />
                </Box>
              </Flex>
            ),
          });
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
      }

      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
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
    }
  };

  const deleteQuiz = async () => {
    try {
      let data = await removeQuiz(id, admin?.id);
      if (data.status == 200 && data?.data?.msg == "success") {
        setQuizzes(
          quizzes?.filter((qu) => qu?._id?.toLowerCase() !== id?.toLowerCase()),
        );
        onAlertClose();
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
              <Text textAlign="center" fontFamily="Montserrat" fontWeight="400">
                Блок успешно удален!
              </Text>
              <Box ml={4} onClick={onClose} cursor="pointer">
                <IoMdClose size="1.5rem" />
              </Box>
            </Flex>
          ),
        });
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
                <IoMdCloseCircle size="1.5em" />
              </Box>
              <Text textAlign="center" fontFamily="Montserrat" fontWeight="400">
                Произошла ошибка. Пожалуйста, повторите попытку позже
              </Text>
              <Box ml={4} onClick={onClose} cursor="pointer">
                <IoMdClose size="1.5em" />
              </Box>
            </Flex>
          ),
        });
      }
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
              <IoMdCloseCircle size="1.5em" />
            </Box>
            <Text textAlign="center" fontFamily="Montserrat" fontWeight="400">
              Произошла ошибка. Пожалуйста, повторите попытку позже
            </Text>
            <Box ml={4} onClick={onClose} cursor="pointer">
              <IoMdClose size="1.5em" />
            </Box>
          </Flex>
        ),
      });
    }
  };

  React.useEffect(() => {
    if (!localStorage.getItem("admin")) {
      navigate("/admin/login");
    }
    isValidAdmin();
  }, []);

  return (
    <Center width="100%" height="auto" overflowY="auto" bg="#f5f7fa">
      <Box width="100%">
        <Center
          width="100%"
          height="9rem"
          bg="white"
          borderBottom="2px solid #4f758a"
        >
          <Box
            width="80%"
            display="flex"
            alignContent="center"
            alignItems="center"
          >
            {location.pathname === "/admin/dashboard" ||
            location.pathname === "/admin/dashboard/" ? (
              <Box
                onClick={() => navigate("/admin/dashboard/quizzes")}
                display="flex"
                flexDir="column"
                alignContent="center"
                alignItems="center"
                textAlign="center"
                cursor="pointer"
              >
                <Image src={images6} width="3rem" />
                <Text
                  pt={2}
                  w="100%"
                  fontSize="0.875rem"
                  fontWeight="300"
                  fontFamily="Montserrat"
                  color="black"
                >
                  Блоки
                </Text>
              </Box>
            ) : (
              <Box
                onClick={() => navigate("/admin/dashboard")}
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
            )}
            <Box
              display="flex"
              flexDir="column"
              alignContent="center"
              alignItems="center"
              textAlign="center"
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
                Сообщение от пользователя
              </Text>
            </Box>

            <Box
              cursor="pointer"
              onClick={onOpen}
              pr={5}
              display="flex"
              flexDir="column"
              alignContent="center"
              alignItems="center"
              textAlign="center"
            >
              <Image src={images1} width="3rem" />
              <Text
                pt={2}
                w="70%"
                fontSize="0.875rem"
                fontWeight="300"
                fontFamily="Montserrat"
                color="black"
              >
                Пригласить админестратора
              </Text>
            </Box>

            <Box color="#4f758a">
              ******************************************************************************************************
            </Box>
            <Box
              cursor="pointer"
              onClick={() => {
                localStorage.removeItem("admin");
                navigate("/admin/login");
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
                w="60%"
                fontSize="0.875rem"
                fontWeight="300"
                fontFamily="Montserrat"
                color="black"
              >
                Выйти с панели администратора
              </Text>
            </Box>
          </Box>
        </Center>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Center width="100%" height="auto" pt={10} bg="#f5f7fa" pb={10}>
                  <Center
                    pt={5}
                    width="100%"
                    display="flex"
                    alignContent="center"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Box width="80%">
                      <Text
                        textAlign="center"
                        letterSpacing="5px"
                        fontSize="2.25rem"
                        textTransform="uppercase"
                        fontWeight="400"
                        fontFamily="Montserrat"
                        color="#4f758a "
                      >
                        Статистика ​сайта
                      </Text>

                      <Box
                        pt={20}
                        display="grid"
                        gridTemplateColumns="1fr 1fr 1fr"
                        columnGap={8}
                      >
                        <Box
                          borderRadius="40"
                          height="18rem"
                          border="1.5px solid #111111"
                          rowGap={5}
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                          alignContent="center"
                          alignItems="center"
                        >
                          <Image src={images3} width="5rem" />
                          <Text
                            fontSize="2.25rem"
                            letterSpacing="3px"
                            color="#4f758a"
                            fontWeight="600"
                          >
                            {clients?.length}
                          </Text>
                          <Text
                            fontSize="1.125rem"
                            letterSpacing="3px"
                            fontFamily="Montserrat"
                          >
                            количество посетителей
                          </Text>
                        </Box>
                        <Box
                          borderRadius="40"
                          height="18rem"
                          border="1.5px solid #111111"
                          rowGap={5}
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                          alignContent="center"
                          alignItems="center"
                        >
                          <Image src={images4} width="5rem" />
                          <Text
                            fontSize="2.25rem"
                            letterSpacing="3px"
                            color="#4f758a"
                            fontWeight="600"
                          >
                            {statements?.length}
                          </Text>
                          <Text
                            fontSize="1.125rem"
                            letterSpacing="3px"
                            fontFamily="Montserrat"
                          >
                            количество заказов
                          </Text>
                        </Box>
                        <Box
                          borderRadius="40"
                          height="18rem"
                          border="1.5px solid #111111"
                          rowGap={5}
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                          alignContent="center"
                          alignItems="center"
                        >
                          <Image src={images5} width="5rem" />
                          <Text
                            fontSize="2.25rem"
                            letterSpacing="3px"
                            color="#4f758a"
                            fontWeight="600"
                          >
                            {statements?.reduce((totalLength, statement) => {
                              if (statement?.attendents) {
                                return (
                                  totalLength + statement?.attendents?.length
                                );
                              }
                              return totalLength;
                            }, 0)}
                          </Text>
                          <Text
                            textAlign="center"
                            fontSize="1.125rem"
                            letterSpacing="3px"
                            fontFamily="Montserrat"
                          >
                            количество протестированных людей{" "}
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  </Center>
                </Center>

                <Center
                  pt={5}
                  pb={10}
                  width="100%"
                  display="flex"
                  alignContent="center"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Box
                    width="80%"
                    display="flex"
                    justifyContent="center"
                    alignContent="center"
                    alignItems="center"
                    columnGap={10}
                  >
                    <Box
                      cursor="pointer"
                      width="22%"
                      height="18rem"
                      border="2px dashed blue"
                      borderRadius="40"
                      rowGap={5}
                      onClick={() => navigate("/admin/dashboard/quizzes")}
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignContent="center"
                      alignItems="center"
                    >
                      <Image src={images6} width="4rem" />
                      <Text
                        fontSize="2.25rem"
                        letterSpacing="3px"
                        color="blue"
                        fontWeight="600"
                      >
                        {quizzes?.length}
                      </Text>
                      <Text
                        fontSize="1.125rem"
                        color="#4f758a"
                        fontWeight="500"
                        letterSpacing="3px"
                        fontFamily="Montserrat"
                      >
                        колич​ество блоков
                      </Text>
                    </Box>
                    <Box
                      onClick={openBlock}
                      cursor="pointer"
                      width="22%"
                      height="18rem"
                      border="2px dashed #48904d"
                      borderRadius="40"
                      rowGap={1}
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignContent="center"
                      alignItems="center"
                    >
                      <Text
                        fontSize="1.5rem"
                        fontFamily="Montserrat"
                        textAlign="center"
                        color="#48904d"
                      >
                        Добавить
                      </Text>
                      <Text
                        fontSize="1.5rem"
                        fontFamily="Montserrat"
                        textAlign="center"
                        color="#48904d"
                      >
                        новый блок
                      </Text>
                    </Box>
                  </Box>
                </Center>

                <Text
                  pt={5}
                  fontSize="2.25rem"
                  fontWeight="500"
                  fontFamily="Montserrat"
                  letterSpacing="3px"
                  color="#4f758a"
                  textAlign="center"
                >
                  Заявки
                </Text>

                <Center
                  pt={5}
                  pb={10}
                  width="100%"
                  display="flex"
                  height="auto"
                  alignContent="center"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Box width="80%" minH="40rem" height="auto">
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
                      <Table size="sm" className="table-tiny">
                        <Thead bg="#4f758a">
                          <Tr>
                            <Th
                              textAlign="center"
                              pt={5}
                              pb={5}
                              borderBottom="1px solid rgb(34,37,49)"
                              borderColor="rgb(34,37,49)"
                              borderTop="1px solid rgb(34,37,49)"
                              color="white"
                              fontFamily="Montserrat"
                            >
                              Номер
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
                            >
                              Наименование орг
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
                            >
                              Заказчик (ФИО)
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
                            >
                              Клво. человек
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
                            >
                              Цена
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
                            >
                              Статус заказа
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
                            >
                              Разрешить
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {statements?.map((data, index) => (
                            <Tr borderBottom="2px solid #4f758a" key={index}>
                              <Td
                                textAlign="left"
                                pt={5}
                                pb={5}
                                fontFamily="Montserrat"
                              >
                                <Text
                                  textAlign="center"
                                  color="black"
                                  fontSize="1.1rem"
                                  fontFamily="Roboto"
                                  fontWeight="700"
                                >
                                  {index + 1}
                                </Text>
                              </Td>

                              <Td
                                textAlign="left"
                                pt={5}
                                pb={5}
                                fontFamily="Montserrat"
                              >
                                <Text
                                  textAlign="left"
                                  color="#4f758a"
                                  fontSize="1.1rem"
                                  fontFamily="Montserrat"
                                  fontWeight="500"
                                >
                                  {data?.companyName?.toUpperCase()}
                                </Text>
                              </Td>

                              <Td
                                textAlign="left"
                                pt={5}
                                pb={5}
                                fontFamily="Montserrat"
                              >
                                <Text
                                  textAlign="left"
                                  color="#48904d"
                                  fontSize="1.1rem"
                                  fontFamily="Montserrat"
                                  fontWeight="500"
                                >
                                  {data?.client?.fullName}
                                </Text>
                              </Td>
                              <Td
                                textAlign="left"
                                pt={5}
                                pb={5}
                                fontFamily="Montserrat"
                              >
                                <Text
                                  textAlign="left"
                                  color="black"
                                  fontSize="1.1rem"
                                  fontFamily="Montserrat"
                                  fontWeight="700"
                                >
                                  {data?.numOfUsers}
                                </Text>
                              </Td>

                              <Td
                                textAlign="left"
                                pt={5}
                                pb={5}
                                fontFamily="Montserrat"
                              >
                                <Text
                                  textAlign="left"
                                  color="#4f758a;"
                                  fontSize="1.1rem"
                                  fontFamily="Montserrat"
                                  fontWeight="600"
                                >
                                  {data?.price}
                                </Text>
                              </Td>
                              <Td
                                textAlign="left"
                                pt={5}
                                pb={5}
                                fontFamily="Montserrat"
                              >
                                <Text
                                  textAlign="left"
                                  color={
                                    data?.isApproved ? "#48904d" : "#f7cd36"
                                  }
                                  fontSize="1.1rem"
                                  fontFamily="Montserrat"
                                  fontWeight="500"
                                >
                                  {data?.isApproved
                                    ? "Оформлен/Оплачен"
                                    : "Оформлен/Не оплачен"}
                                </Text>
                              </Td>

                              <Td
                                textAlign="left"
                                pt={5}
                                pb={5}
                                fontFamily="Montserrat"
                              >
                                {data?.isApproved ? (
                                  <Button
                                    pl={8}
                                    pr={8}
                                    pt={6}
                                    onClick={() => {
                                      disApproveStatement(
                                        data?._id,
                                        data?.attendents,
                                      );
                                    }}
                                    pb={6}
                                    color="white"
                                    _hover={{ bg: "#f7cd36" }}
                                    bg="#f7cd36"
                                    borderRadius="15"
                                  >
                                    Не Разрешить
                                  </Button>
                                ) : (
                                  <Button
                                    pl={8}
                                    pr={8}
                                    onClick={() => {
                                      approveStatement(
                                        data?._id,
                                        data?.numOfUsers,
                                      );
                                    }}
                                    pt={6}
                                    pb={6}
                                    color="white"
                                    _hover={{ bg: "#48904d" }}
                                    bg="#48904d"
                                    borderRadius="15"
                                  >
                                    Разрешить
                                  </Button>
                                )}
                              </Td>
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
            path="/quizzes"
            element={
              <>
                <Center width="100%" height="auto" pt={10} bg="#f5f7fa" pb={10}>
                  <Center
                    pt={5}
                    width="100%"
                    display="flex"
                    alignContent="center"
                    height="auto"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Box width="80%">
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignContent="center"
                        alignItems="center"
                      >
                        <Text
                          textAlign="center"
                          letterSpacing="5px"
                          fontSize="2.25rem"
                          textTransform="uppercase"
                          fontWeight="400"
                          fontFamily="Montserrat"
                          color="#4f758a "
                        >
                          Блоки
                        </Text>
                        <Box onClick={openBlock} pl={5} cursor="pointer">
                          <IoMdAddCircleOutline color="#48904d" size="3rem" />
                        </Box>
                      </Box>

                      <Box width="100%" minH="40rem" height="auto">
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
                                  width="5%"
                                  fontFamily="Montserrat"
                                >
                                  Номер
                                </Th>
                                <Th
                                  textAlign="left"
                                  pt={5}
                                  pb={5}
                                  borderBottom="1px solid rgb(34,37,49)"
                                  borderColor="rgb(34,37,49)"
                                  borderTop="1px solid rgb(34,37,49)"
                                  color="white"
                                  width="15%"
                                  fontFamily="Montserrat"
                                  fontWeight="700"
                                >
                                  Картинка
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
                                  width="20%"
                                >
                                  Название блока
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
                                  Описание
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
                                  Вопросы
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
                                  Данные результатов
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
                                  Радактировать
                                </Th>
                              </Tr>
                            </Thead>
                            <Tbody width="100%">
                              {quizzes?.map((data, index) => (
                                <Tr
                                  width="100%"
                                  borderBottom="2px solid #4f758a"
                                  key={index}
                                >
                                  <Th
                                    textAlign="left"
                                    pt={5}
                                    pb={5}
                                    fontFamily="Montserrat"
                                    width="5%"
                                    maxW="5%"
                                    color="black"
                                    fontSize="1.1rem"
                                    fontWeight="700"
                                  >
                                    {index + 1}
                                  </Th>

                                  <Th
                                    textAlign="left"
                                    pt={5}
                                    pb={5}
                                    fontFamily="Montserrat"
                                    width="15%"
                                    maxW="15%"
                                  >
                                    <Image
                                      width="7rem"
                                      borderRadius="10px"
                                      border="1px solid black"
                                      height="5rem"
                                      src={data?.thumbnail}
                                    />
                                  </Th>
                                  <Th
                                    textAlign="left"
                                    pt={5}
                                    pb={5}
                                    borderBottom="1px solid rgb(34,37,49)"
                                    borderColor="rgb(34,37,49)"
                                    borderTop="1px solid rgb(34,37,49)"
                                    color="#48904d"
                                    fontFamily="Montserrat"
                                    fontWeight="700"
                                    width="20%"
                                    textTransform="none"
                                    maxW="20%"
                                    style={{
                                      wordBreak: "break-all",
                                      whiteSpace: "pre-wrap",
                                    }}
                                  >
                                    {data?.title}
                                  </Th>

                                  <Th
                                    textAlign="left"
                                    pt={5}
                                    pb={5}
                                    fontFamily="Montserrat"
                                    maxW="20%"
                                    color="black"
                                    textTransform="none"
                                    fontWeight="700"
                                    width="20%"
                                    style={{
                                      wordBreak: "break-all",
                                      whiteSpace: "pre-wrap",
                                    }}
                                  >
                                    {data?.description}
                                  </Th>

                                  <Th
                                    textAlign="center"
                                    pt={5}
                                    pb={5}
                                    fontFamily="Montserrat"
                                    width="10%"
                                  >
                                    <Text
                                      textAlign="center"
                                      color="#4f758a;"
                                      fontSize="1.1rem"
                                      fontFamily="Montserrat"
                                      fontWeight="600"
                                    >
                                      {data?.questions?.length}
                                    </Text>
                                  </Th>
                                  <Th
                                    textAlign="center"
                                    pt={5}
                                    pb={5}
                                    fontFamily="Montserrat"
                                    width="10%"
                                  >
                                    <Text
                                      textAlign="center"
                                      color="#48904d"
                                      fontSize="1.1rem"
                                      fontFamily="Montserrat"
                                      fontWeight="500"
                                    >
                                      {data?.results?.length}
                                    </Text>
                                  </Th>

                                  <Th
                                    textAlign="left"
                                    pt={5}
                                    pb={5}
                                    fontFamily="Montserrat"
                                    display="flex"
                                    justifyContent="center"
                                    alignContent="center"
                                    alignItems="center"
                                  >
                                    <Button
                                      onClick={() => {
                                        onAlertOpen();
                                        setId(data?._id);
                                      }}
                                      pl={8}
                                      pr={8}
                                      pt={6}
                                      pb={6}
                                      mr={2}
                                      color="white"
                                      bg="red"
                                      _hover={{ bg: "red" }}
                                      borderRadius="15"
                                    >
                                      Удалить
                                    </Button>
                                    <Box
                                      cursor="pointer"
                                      onClick={() => {
                                        setSelectedQuiz(data);
                                        openBlock();
                                        setIsEdit(true);
                                        setQuizData({
                                          results: data?.results,
                                          questions: data?.questions,
                                        });
                                        setTitle(data?.title);
                                        setDescription(data?.description);
                                        setIntro(data?.intro);
                                        setImageUrl(data?.thumbnail);
                                      }}
                                    >
                                      <RiEditBoxFill color="grey" size="3rem" />
                                    </Box>
                                  </Th>
                                  <AlertDialog
                                    isOpen={isAlertOpen}
                                    leastDestructiveRef={cancelRef}
                                    onClose={onAlertClose}
                                  >
                                    <AlertDialogOverlay>
                                      <AlertDialogContent
                                        bg="rgba(48, 45, 62, 1)"
                                        borderRadius="20"
                                        pb={5}
                                        pt={2}
                                      >
                                        <AlertDialogHeader
                                          fontSize="lg"
                                          fontWeight="bold"
                                          color="white"
                                        >
                                          Удалить блок
                                        </AlertDialogHeader>

                                        <AlertDialogBody
                                          bg="rgba(48, 45, 62, 1)"
                                          color="rgba(152, 151, 156, 1)"
                                        >
                                          Вы уверены? Вы не сможете отменить это
                                          действие впоследствии.
                                        </AlertDialogBody>

                                        <AlertDialogFooter>
                                          <Button
                                            pl={5}
                                            pr={5}
                                            borderRadius="10"
                                            ref={cancelRef}
                                            onClick={onAlertClose}
                                          >
                                            Отмена
                                          </Button>
                                          <Button
                                            colorScheme="red"
                                            onClick={() => deleteQuiz()}
                                            ml={3}
                                            borderRadius="10"
                                            pl={5}
                                            pr={5}
                                          >
                                            Удалить
                                          </Button>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialogOverlay>
                                  </AlertDialog>
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>
                        </TableContainer>
                      </Box>
                    </Box>
                  </Center>
                </Center>
              </>
            }
          />
        </Routes>
        <Footer />
      </Box>

      <Modal
        isOpen={isBlockOpen}
        onClose={onBlockClose}
        size="6xl"
        p={0}
        closeOnOverlayClick={false}
      >
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
              onBlockClose();
              setImageUpload(null);
              setIsEdit(false);
              setQuizData({ results: [], questions: [] });
              setTitle("");
              setSelectedQuiz("");
              setImageUrl("");
              setDescription("");
              setIntro("");
            }}
          />
          <ModalBody
            borderRadius="20"
            bg="#f5f7fa"
            pt={10}
            pb={10}
            minH="90vh"
            height="auto"
            overflowY="auto"
          >
            <Box
              width="100%"
              display="flex"
              justifyContent="center"
              alignContent="center"
              position="relative"
            >
              <Text
                fontWeight="500"
                color="#0b39ca"
                fontSize="2.25rem"
                fontFamily="Montserrat"
              >
                Создание нового блока
              </Text>
            </Box>
            <Box pt={10} width="100%" display="flex" pl={5} pb={16}>
              <Box width="50%">
                <Text
                  pb={2}
                  pt={5}
                  fontSize="1.3rem"
                  fontWeight="500"
                  fontFamily="Montserrat"
                  color="#0b39ca"
                >
                  Название блока *
                </Text>

                <Input
                  width="100%"
                  border="1px solid black"
                  bg="white"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  placeholder="Введите название блока"
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
                  color="#0b39ca"
                >
                  Введение
                </Text>

                <FormControl pt={5}>
                  <Textarea
                    onChange={(e) => setIntro(e.target.value)}
                    value={intro}
                    fontSize="1rem"
                    placeholder="Введите введение блока"
                    size="md"
                    color="black"
                    fontWeight="500"
                    fontFamily="Montserrat"
                    resize="none"
                    border="1px solid black"
                    bg="white"
                    height="8rem"
                    borderRadius="15px"
                  />
                </FormControl>

                <Text
                  pt={5}
                  fontSize="1.3rem"
                  fontWeight="500"
                  fontFamily="Montserrat"
                  color="#0b39ca"
                >
                  Описание *
                </Text>

                <FormControl pt={5}>
                  <Textarea
                    onChange={handleDescription}
                    value={description}
                    fontSize="1rem"
                    placeholder="Введите описание блока"
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
                <Text
                  pt={5}
                  fontSize="1.3rem"
                  fontWeight="500"
                  fontFamily="Montserrat"
                  color="#0b39ca"
                >
                  Изображение *
                </Text>
                <Box pt={5} mb={5} width="100%" display="flex">
                  <Box
                    width={["35%", "30%", "30%", "30%", "30%", "30%"]}
                    border="2px dashed black"
                    height={[
                      "12vh",
                      "11vh",
                      "11vh",
                      "13.5vh",
                      "13.5vh",
                      "13.5vh",
                    ]}
                    cursor="pointer"
                    borderRadius="12"
                    p={3}
                  >
                    <Dropzone
                      onDrop={handleDropImage}
                      accept="image/*"
                      minSize={1024}
                      maxSize={3072000}
                    >
                      {({
                        getRootProps,
                        getInputProps,

                        isDragAccept,
                        isDragReject,
                      }) => {
                        const additionalClass = isDragAccept
                          ? "accept"
                          : isDragReject
                            ? "reject"
                            : "";

                        return (
                          <Box
                            {...getRootProps({
                              className: `dropzone ${additionalClass}`,
                            })}
                            cursor="pointer"
                          >
                            <Center width="100%" height="100%">
                              <Box
                                width="100%"
                                height="100%"
                                justifyContent="center"
                                alignItems="center"
                                alignContent="center"
                                textAlign="center"
                              >
                                <input {...getInputProps()} />
                                <Box
                                  display="flex"
                                  justifyContent="center"
                                  alignItems="center"
                                  alignContent="center"
                                >
                                  <Box>
                                    <Box
                                      p={3}
                                      borderRadius="50%"
                                      bg="#4f758a"
                                      border="1px solid black"
                                    >
                                      <MdUpload
                                        size="2rem"
                                        fill="rgba(129, 243, 239, 1)"
                                      />
                                    </Box>
                                  </Box>
                                </Box>
                                <Text
                                  color="rgba(152, 151, 156, 1)"
                                  fontSize="0.65rem"
                                  fontFamily="Montserrat"
                                  fontWeight="600"
                                  mt={1}
                                >
                                  Загрузить изображение
                                </Text>
                              </Box>
                            </Center>
                          </Box>
                        );
                      }}
                    </Dropzone>
                  </Box>

                  {imageUpload && (
                    <Box bg="transparent" width="40%" height="13.5vh" ml={2}>
                      <Image
                        src={URL.createObjectURL(imageUpload)}
                        width="100%"
                        height="100%"
                        borderRadius="12"
                      />
                    </Box>
                  )}

                  {imageUrl?.length > 4 && imageUpload == null && (
                    <Box bg="transparent" width="40%" height="13.5vh" ml={2}>
                      <Image
                        src={imageUrl}
                        width="100%"
                        height="100%"
                        borderRadius="12"
                      />
                    </Box>
                  )}
                </Box>
              </Box>
              <Box
                width="50%"
                height="auto"
                // justifyContent="center"
                // alignContent="center"
                // alignItems="center"
                pl={10}
                pt={5}
              >
                <Box width="100%">
                  <Box display="flex" width="100%">
                    <Text
                      pt={2}
                      fontSize="1.3rem"
                      fontWeight="500"
                      fontFamily="Montserrat"
                      color="#0b39ca"
                    >
                      Вопросы *
                    </Text>
                    <Box pl={6} cursor="pointer" onClick={addQuestion}>
                      <IoMdAddCircleOutline color="blue" size="3rem" />
                    </Box>
                  </Box>

                  {quizData?.questions?.map((question) => (
                    <div key={question?.id}>
                      <Box
                        display="flex"
                        alignContent="center"
                        alignItems="center"
                      >
                        <Text color="blue" fontSize="1.3rem" pr={2}>
                          {question?.id}.
                        </Text>
                        <Input
                          mb={3}
                          width="90%"
                          border="1px solid black"
                          bg="white"
                          value={question?.title}
                          onChange={(e) =>
                            updateQuestionTitle(question.id, e.target.value)
                          }
                          placeholder="Введите вопрос"
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

                        <Box
                          cursor="pointer"
                          onClick={() => removeQuestion(question.id)}
                        >
                          <IoMdCloseCircle color="#d54950" size="2rem" />
                        </Box>
                      </Box>
                      {question?.answers?.map((answer) => (
                        <div key={answer?.key}>
                          <Box
                            display="flex"
                            pb={3}
                            pl={5}
                            alignContent="center"
                            alignItems="center"
                          >
                            <Text color="black" fontSize="1rem" pr={2}>
                              {answer?.key}.
                            </Text>
                            <Input
                              width="60%"
                              border="1px solid black"
                              bg="#e8f6fc"
                              value={answer?.value}
                              onChange={(e) =>
                                updateAnswer(
                                  question?.id,
                                  answer?.key,
                                  "value",
                                  e.target.value,
                                )
                              }
                              placeholder="Ввелите ответ"
                              pb={1}
                              borderColor="black"
                              color="black"
                              fontFamily="Montserrat"
                              fontWeight="500"
                              type="text"
                              mt={2}
                              h="3rem"
                              borderRadius="15px"
                            />

                            <Input
                              ml={2}
                              type="number"
                              placeholder="баллы"
                              width="5rem"
                              value={answer?.points}
                              bg="white"
                              borderColor="black"
                              color="black"
                              fontFamily="Montserrat"
                              fontWeight="500"
                              borderRadius="15px"
                              onChange={(e) =>
                                updateAnswer(
                                  question?.id,
                                  answer?.key,
                                  "points",
                                  parseInt(e.target.value),
                                )
                              }
                            />
                            <Box
                              cursor="pointer"
                              onClick={() =>
                                removeAnswer(question?.id, answer?.key)
                              }
                            >
                              <IoMdCloseCircle color="#d54950" size="2rem" />
                            </Box>
                          </Box>
                        </div>
                      ))}
                      <Box
                        display="flex"
                        pt={2}
                        justifyContent="right"
                        columnGap={5}
                        pb={5}
                      >
                        <Button
                          fontSize="0.8rem"
                          fontFamily="Montserrat"
                          border="1px solid black"
                          borderRadius="15"
                          _hover={{ bg: "#cdeaf7" }}
                          bg="#cdeaf7"
                          onClick={() => addAnswer(question?.id)}
                        >
                          {" "}
                          Добавить ответ
                        </Button>
                        <Button
                          fontSize="0.8rem"
                          fontFamily="Montserrat"
                          color="white"
                          border="1px solid black"
                          borderRadius="15"
                          _hover={{ bg: "#d54950" }}
                          bg="#d54950"
                          onClick={() => removeQuestion(question.id)}
                        >
                          {" "}
                          Удалить вопрос
                        </Button>
                      </Box>
                    </div>
                  ))}
                </Box>
                <Box width="100%">
                  <Box display="flex" width="100%" pt={5}>
                    <Text
                      pt={2}
                      fontSize="1.3rem"
                      fontWeight="500"
                      fontFamily="Montserrat"
                      color="#0b39ca"
                    >
                      Данные результатов
                    </Text>
                    <Box pl={6} cursor="pointer" onClick={addResult}>
                      <IoMdAddCircleOutline color="blue" size="3rem" />
                    </Box>
                  </Box>
                  {quizData?.results?.map((result, index) => (
                    <div key={index}>
                      <Box
                        display="flex"
                        pb={3}
                        alignContent="center"
                        alignItems="center"
                      >
                        <Text color="black" fontSize="1rem" pr={2}>
                          {`${index + 1}`}.
                        </Text>
                        <Box>
                          <Text
                            pb={1}
                            fontWeight="600"
                            textAlign="center"
                            color="black"
                            fontFamily="Montserrat"
                            fontSize="0.8rem"
                            pr={2}
                          >
                            диапазон
                          </Text>
                          <Input
                            type="text"
                            placeholder="Диапазон"
                            width="6rem"
                            value={result.range}
                            onChange={(e) =>
                              updateResult(index, "range", e.target.value)
                            }
                            bg="white"
                            borderColor="black"
                            color="black"
                            fontFamily="Montserrat"
                            fontWeight="500"
                            borderRadius="15px"
                            h="2rem"
                          />
                        </Box>
                        <Input
                          width="80%"
                          border="1px solid black"
                          bg="#e8f6fc"
                          value={result.message}
                          onChange={(e) =>
                            updateResult(index, "message", e.target.value)
                          }
                          placeholder="Ввелите текст"
                          pb={1}
                          borderColor="black"
                          color="black"
                          fontFamily="Montserrat"
                          fontWeight="500"
                          type="text"
                          mt={2}
                          ml={2}
                          h="3rem"
                          borderRadius="15px"
                        />

                        <Box
                          cursor="pointer"
                          onClick={() => removeResult(index)}
                        >
                          <IoMdCloseCircle color="#d54950" size="2rem" />
                        </Box>
                      </Box>
                    </div>
                  ))}
                </Box>
              </Box>
            </Box>
            <Box position="absolute" bottom={0} left="50%" pb={5}>
              {!isEdit && (
                <Button
                  onClick={addNewQuiz}
                  isLoading={isLoading}
                  isDisabled={
                    title?.length < 3 ||
                    description?.length < 3 ||
                    imageUpload == null ||
                    quizData?.questions?.length == 0
                  }
                  borderRadius="15px"
                  _hover={{ bg: "blue" }}
                  bg="blue"
                  color="white"
                  pl={8}
                  pr={8}
                  pt={6}
                  pb={6}
                  fontFamily="Montserrat"
                  fontWeight="600"
                >
                  Создать
                </Button>
              )}

              {isEdit && (
                <Button
                  onClick={saveEdit}
                  isLoading={isLoading}
                  isDisabled={
                    title == selectedQuiz?.title &&
                    description == selectedQuiz?.description &&
                    intro == selectedQuiz?.intro &&
                    imageUpload == null &&
                    imageUrl == selectedQuiz?.thumbnail &&
                    quizData?.questions?.length ==
                      selectedQuiz?.questions?.length &&
                    quizData?.results?.length ==
                      selectedQuiz?.results?.length &&
                    !resultsChanged() &&
                    !questionsChanged()
                  }
                  borderRadius="15px"
                  _hover={{ bg: "blue" }}
                  bg="blue"
                  color="white"
                  pl={8}
                  pr={8}
                  pt={6}
                  pb={6}
                  fontFamily="Montserrat"
                  fontWeight="600"
                >
                  Сохранить
                </Button>
              )}

              {isEdit && (
                <Button
                  ml={5}
                  onClick={() => {
                    onBlockClose();
                    setImageUpload(null);
                    setIsEdit(false);
                    setQuizData({ results: [], questions: [] });
                    setTitle("");
                    setSelectedQuiz("");
                    setImageUrl("");
                    setDescription("");
                    setIntro("");
                  }}
                  borderRadius="15px"
                  _hover={{ bg: "black" }}
                  bg="black"
                  color="white"
                  pl={8}
                  pr={8}
                  pt={6}
                  pb={6}
                  fontFamily="Montserrat"
                  fontWeight="600"
                >
                  Отментиь
                </Button>
              )}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>

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
          <ModalBody borderRadius="20" bg="#f5f7fa" pt={10} pb={0} minH="80vh">
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
                Пригласить администратора
              </Text>
            </Box>
            <Box pt={24} width="100%" display="flex">
              <Box width="50%">
                <Image src={email1} />
              </Box>
              <Box
                width="50%"
                display="flex"
                justifyContent="center"
                alignContent="center"
                alignItems="center"
                pl={10}
              >
                <Box>
                  <Text
                    pt={5}
                    fontSize="1.3rem"
                    fontWeight="500"
                    fontFamily="Montserrat"
                    color="#0b39ca"
                  >
                    Электронная почта
                  </Text>
                  <Input
                    width="100%"
                    border="1px solid black"
                    bg="white"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    placeholder="Введите Email"
                    pb={1}
                    borderColor="black"
                    color="black"
                    fontFamily="Montserrat"
                    fontWeight="500"
                    type="email"
                    mt={2}
                    h="3.2rem"
                    borderRadius="15px"
                  />

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

export default AdminDashboard;
