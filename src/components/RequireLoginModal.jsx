import React from "react";
import { Modal } from "antd";
import { useTranslation } from "react-i18next";

const RequireLoginModal = ({ open, onOk, onCancel }) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      title={t("auth.requireLoginTitle", "Yêu cầu đăng nhập")}
      onOk={onOk}
      onCancel={onCancel}
      okText={t("auth.login", "Đăng nhập")}
      cancelText={t("common.cancel", "Hủy")}
      centered
    >
      <p className="!mb-0">
        {t(
          "auth.requireLoginDescription",
          "Bạn cần đăng nhập để xem thư viện của mình."
        )}
      </p>
    </Modal>
  );
};

export default RequireLoginModal;
