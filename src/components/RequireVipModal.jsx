import React from "react";
import { Modal, Button } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const RequireVipModal = ({ open, onCancel }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      title={
        <div className="w-full text-center mt-5">
          <p className="!mb-0">{t("error.vipRequired")}</p>
        </div>
      }
    >
      <div className="text-center py-0">
        <div className="flex justify-center gap-4 mt-6">
          <Button
            type="primary"
            className="!bg-[var(--color-blue)] !hover:bg-[var(--color-blue-hover)]"
            onClick={() => {
              onCancel();
              navigate("/pricing");
            }}
          >
            {t("becomeVip")}
          </Button>
          <Button onClick={onCancel}>{t("cancel", "Hủy")}</Button>
        </div>
      </div>
    </Modal>
  );
};

export default RequireVipModal;
