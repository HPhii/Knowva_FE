import React from "react";
import { Modal, InputNumber } from "antd";
import { useTranslation } from "react-i18next";

const CardLimitModal = ({
  open,
  onOk,
  onCancel,
  tempCardLimit,
  onCardLimitChange,
}) => {
  const { t } = useTranslation();
  return (
    <Modal open={open} onOk={onOk} onCancel={onCancel} centered>
      <div className="py-4">
        <p className="!mb-1.5 font-semibold text-[#000] text-[25px]">
          {t("studyFlashcard.spacedRepetition.setup.title")}
        </p>
        <p className="text-gray-700 text-[17px] mb-4 block">
          {t("studyFlashcard.spacedRepetition.setup.description")}
        </p>
        <div className="flex items-center gap-3">
          <span className="!mb-1.5 font-semibold text-[#000] text-[17px]">
            {t("studyFlashcard.spacedRepetition.setup.cardsPerDay")}:
          </span>
          <InputNumber
            min={1}
            max={100}
            value={tempCardLimit}
            onChange={onCardLimitChange}
            className="w-24"
          />
        </div>
      </div>
    </Modal>
  );
};

export default CardLimitModal;
