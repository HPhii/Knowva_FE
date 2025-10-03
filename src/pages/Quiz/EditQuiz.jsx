import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Form, Input, Button, message, Card, Space, Divider, Select } from "antd";
import { PlusOutlined, DeleteOutlined, SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import api from "../../config/axios";

const EditQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchQuizDetail();
  }, [id]);

  const fetchQuizDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/quiz-sets/${id}`);
      setQuiz(response.data);
      
      // Set form values
      form.setFieldsValue({
        title: response.data.title,
        description: response.data.description,
        timeLimit: response.data.timeLimit,
        questionType: response.data.questionType,
        visibility: response.data.visibility,
        category: response.data.category,
        maxQuestions: response.data.maxQuestions,
        language: response.data.language,
        questions: response.data.questions || []
      });
    } catch (err) {
      console.error("Error fetching quiz detail:", err);
      message.error("Không thể tải thông tin quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const values = await form.validateFields();
      
      const response = await api.put(`/quiz-sets/${id}`, {
        title: values.title,
        description: values.description,
        timeLimit: values.timeLimit,
        questionType: values.questionType,
        visibility: values.visibility,
        category: values.category,
        maxQuestions: values.maxQuestions,
        language: values.language,
        questions: values.questions
      });
      
      message.success("Cập nhật quiz thành công!");
      navigate(`/quiz/${id}`);
    } catch (err) {
      console.error("Error updating quiz:", err);
      message.error(err.response?.data?.message || "Cập nhật quiz thất bại");
    } finally {
      setSaving(false);
    }
  };

  const addQuestion = () => {
    const questions = form.getFieldValue('questions') || [];
    const newQuestion = {
      questionText: '',
      timeLimit: 30,
      answers: [
        { answerText: '', isCorrect: false },
        { answerText: '', isCorrect: false },
        { answerText: '', isCorrect: false },
        { answerText: '', isCorrect: false }
      ]
    };
    
    form.setFieldsValue({
      questions: [...questions, newQuestion]
    });
  };

  const removeQuestion = (index) => {
    const questions = form.getFieldValue('questions') || [];
    questions.splice(index, 1);
    form.setFieldsValue({ questions });
  };

  const addAnswer = (questionIndex) => {
    const questions = form.getFieldValue('questions') || [];
    if (questions[questionIndex]) {
      questions[questionIndex].answers.push({ answerText: '', isCorrect: false });
      form.setFieldsValue({ questions });
    }
  };

  const removeAnswer = (questionIndex, answerIndex) => {
    const questions = form.getFieldValue('questions') || [];
    if (questions[questionIndex] && questions[questionIndex].answers) {
      questions[questionIndex].answers.splice(answerIndex, 1);
      form.setFieldsValue({ questions });
    }
  };

  const toggleCorrectAnswer = (questionIndex, answerIndex) => {
    const questions = form.getFieldValue('questions') || [];
    if (questions[questionIndex] && questions[questionIndex].answers) {
      // Toggle the selected answer
      questions[questionIndex].answers[answerIndex].isCorrect = !questions[questionIndex].answers[answerIndex].isCorrect;
      form.setFieldsValue({ questions });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(`/quiz/${id}`)}
                className="mr-4"
              >
                Quay lại
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">
                Sửa Quiz: {quiz?.title}
              </h1>
            </div>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={saving}
              onClick={handleSave}
              size="large"
            >
              Lưu thay đổi
            </Button>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          className="space-y-6"
        >
          {/* Basic Info */}
          <Card title="Thông tin cơ bản" className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label="Tiêu đề"
                name="title"
                rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
              >
                <Input placeholder="Nhập tiêu đề quiz" />
              </Form.Item>

              <Form.Item
                label="Thời gian (phút)"
                name="timeLimit"
                rules={[{ required: true, message: "Vui lòng nhập thời gian" }]}
              >
                <Input type="number" placeholder="30" />
              </Form.Item>
            </div>

            <Form.Item
              label="Mô tả"
              name="description"
              rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Nhập mô tả quiz"
              />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item
                label="Loại câu hỏi"
                name="questionType"
                rules={[{ required: true, message: "Vui lòng chọn loại câu hỏi" }]}
              >
                <Select placeholder="Chọn loại câu hỏi">
                  <Select.Option value="MULTIPLE_CHOICE">Trắc nghiệm</Select.Option>
                  <Select.Option value="TRUE_FALSE">Đúng/Sai</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Quyền hiển thị"
                name="visibility"
                rules={[{ required: true, message: "Vui lòng chọn quyền hiển thị" }]}
              >
                <Select placeholder="Chọn quyền hiển thị">
                  <Select.Option value="PUBLIC">Công khai</Select.Option>
                  <Select.Option value="PRIVATE">Riêng tư</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Danh mục"
                name="category"
                rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
              >
                <Select placeholder="Chọn danh mục">
                  <Select.Option value="SCIENCE">Khoa học</Select.Option>
                  <Select.Option value="HISTORY">Lịch sử</Select.Option>
                  <Select.Option value="GEOGRAPHY">Địa lý</Select.Option>
                  <Select.Option value="LITERATURE">Văn học</Select.Option>
                  <Select.Option value="MATH">Toán học</Select.Option>
                  <Select.Option value="LANGUAGE">Ngôn ngữ</Select.Option>
                  <Select.Option value="TECHNOLOGY">Công nghệ</Select.Option>
                  <Select.Option value="SPORTS">Thể thao</Select.Option>
                  <Select.Option value="ART">Nghệ thuật</Select.Option>
                  <Select.Option value="OTHER">Khác</Select.Option>
                </Select>
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label="Số câu hỏi tối đa"
                name="maxQuestions"
                rules={[{ required: true, message: "Vui lòng nhập số câu hỏi tối đa" }]}
              >
                <Input type="number" placeholder="5" min="1" max="100" />
              </Form.Item>

              <Form.Item
                label="Ngôn ngữ"
                name="language"
                rules={[{ required: true, message: "Vui lòng chọn ngôn ngữ" }]}
              >
                <Select placeholder="Chọn ngôn ngữ">
                  <Select.Option value="vi">Tiếng Việt</Select.Option>
                  <Select.Option value="en">English</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </Card>

          {/* Questions */}
          <Card 
            title="Câu hỏi" 
            extra={
              <Button 
                type="dashed" 
                icon={<PlusOutlined />} 
                onClick={addQuestion}
              >
                Thêm câu hỏi
              </Button>
            }
          >
            <Form.List name="questions">
              {(fields, { add, remove }) => (
                <div className="space-y-6">
                  {fields.map((field, questionIndex) => (
                    <Card
                      key={field.key}
                      size="small"
                      title={`Câu hỏi ${questionIndex + 1}`}
                      extra={
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => removeQuestion(questionIndex)}
                        >
                          Xóa
                        </Button>
                      }
                      className="bg-gray-50"
                    >
                      <Form.Item
                        key={`${field.key}-questionText`}
                        name={[field.name, 'questionText']}
                        label="Nội dung câu hỏi"
                        rules={[{ required: true, message: "Vui lòng nhập nội dung câu hỏi" }]}
                      >
                        <Input.TextArea
                          rows={2}
                          placeholder="Nhập nội dung câu hỏi"
                        />
                      </Form.Item>

                      <Form.Item
                        key={`${field.key}-timeLimit`}
                        name={[field.name, 'timeLimit']}
                        label="Thời gian (giây)"
                        rules={[{ required: true, message: "Vui lòng nhập thời gian" }]}
                      >
                        <Input type="number" placeholder="30" />
                      </Form.Item>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Đáp án</label>
                            <p className="text-xs text-gray-500 mt-1">
                              💡 Có thể chọn nhiều câu trả lời đúng cho mỗi câu hỏi
                            </p>
                          </div>
                          <Button
                            type="dashed"
                            size="small"
                            icon={<PlusOutlined />}
                            onClick={() => addAnswer(questionIndex)}
                          >
                            Thêm đáp án
                          </Button>
                        </div>

                        <Form.List name={[field.name, 'answers']}>
                          {(answerFields, { add: addAnswer, remove: removeAnswer }) => (
                            <div className="space-y-3">
                              {answerFields.map((answerField, answerIndex) => (
                                <div key={answerField.key} className="flex items-center space-x-3">
                                  <div className="flex-1">
                                    <Form.Item
                                      key={`${answerField.key}-answerText`}
                                      name={[answerField.name, 'answerText']}
                                      rules={[{ required: true, message: "Vui lòng nhập đáp án" }]}
                                    >
                                      <Input placeholder={`Đáp án ${String.fromCharCode(65 + answerIndex)}`} />
                                    </Form.Item>
                                  </div>
                                  
                                  <Button
                                    type={form.getFieldValue(['questions', questionIndex, 'answers', answerIndex, 'isCorrect']) ? 'primary' : 'default'}
                                    onClick={() => toggleCorrectAnswer(questionIndex, answerIndex)}
                                    className="min-w-[100px]"
                                  >
                                    {form.getFieldValue(['questions', questionIndex, 'answers', answerIndex, 'isCorrect']) ? 'Đúng' : 'Sai'}
                                  </Button>
                                  
                                  <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => removeAnswer(questionIndex, answerIndex)}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </Form.List>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Form.List>
          </Card>
        </Form>
      </div>
    </div>
  );
};

export default EditQuiz;
