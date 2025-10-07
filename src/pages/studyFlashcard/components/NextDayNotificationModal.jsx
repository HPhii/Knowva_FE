import React from "react";
import { Modal } from "antd";
import { useTranslation } from "react-i18next";

const NextDayNotificationModal = ({ modeDataResult, open, onOk, onCancel }) => {
  const { t } = useTranslation();
  console.log("modeDataResult: ", modeDataResult);
  return (
    <Modal open={open} onOk={onOk} onCancel={onCancel} centered>
      <div className="py-4">
        <p className="!mb-1.5 font-semibold text-[#000] text-[25px]">
          {t("studyFlashcard.spacedRepetition.newDay.title")}
        </p>
      </div>
      <div className="text-gray-700 text-[17px] mb-4">
        <p>
          {t("studyFlashcard.spacedRepetition.newDay.newCards", {
            count: modeDataResult?.newFlashcardsPerDay,
          })}
        </p>
      </div>
      <div className="text-gray-700 text-[17px] mb-4">
        <p>
          {t("studyFlashcard.spacedRepetition.newDay.reviewCards", {
            count: modeDataResult?.knowCardsCount,
          })}
        </p>
      </div>
    </Modal>
  );
};

export default NextDayNotificationModal;
