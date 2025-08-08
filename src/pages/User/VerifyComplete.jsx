import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Card, Button, Typography } from "antd";
import { CheckCircleOutlined, HomeOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const VerifyComplete = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div
      style={{ minHeight: "100vh", background: "#f5f7fa" }}
      className="flex items-center justify-center py-8 px-2"
    >
      <Card
        className="w-full max-w-md rounded-3xl shadow-2xl"
        style={{ borderRadius: 24 }}
        bodyStyle={{ padding: 32 }}
      >
        <div className="flex flex-col items-center">
          {/* Success Icon */}
          <div className="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="85"
              height="85"
              viewBox="0 0 24 24"
            >
              <g
                fill="none"
                stroke="#000"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              >
                <path
                  stroke-dasharray="64"
                  stroke-dashoffset="64"
                  d="M3 12c0 -4.97 4.03 -9 9 -9c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9Z"
                >
                  <animate
                    fill="freeze"
                    attributeName="stroke-dashoffset"
                    dur="0.6s"
                    values="64;0"
                  />
                </path>
                <path
                  stroke-dasharray="14"
                  stroke-dashoffset="14"
                  d="M8 12l3 3l5 -5"
                >
                  <animate
                    fill="freeze"
                    attributeName="stroke-dashoffset"
                    begin="0.6s"
                    dur="0.2s"
                    values="14;0"
                  />
                </path>
              </g>
            </svg>
          </div>

          <Title
            level={2}
            style={{
              color: "#000000",
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            {t("verifyComplete.title")}
          </Title>

          <Paragraph
            style={{
              textAlign: "center",
              fontSize: "16px",
              color: "#666",
              marginBottom: 32,
            }}
          >
            {t("verifyComplete.description")}
          </Paragraph>

          {/* Go to Home Button */}
          <Button
            type="primary"
            size="large"
            className="w-full !bg-[var(--color-blue)] hover:!bg-[var(--color-blue-hover)] !border-none"
            onClick={() => navigate("/")}
            icon={<HomeOutlined />}
          >
            {t("verifyComplete.goToHome")}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default VerifyComplete;
