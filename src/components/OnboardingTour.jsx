import React, { useEffect, useMemo, useState } from "react";
import { TourProvider } from "@reactour/tour";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

const LOCAL_STORAGE_KEY = "onboardingTour.completed";

const OnboardingTour = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const steps = useMemo(
    () => [
      {
        selector: "header",
        content: t(
          "tour.header",
          "Đây là thanh điều hướng. Bạn có thể truy cập các tính năng chính ở đây."
        ),
        position: "bottom",
      },
      {
        selector: "a[href='/my-library']",
        content: t(
          "tour.myLibrary",
          "Thư viện của bạn: quản lý các bộ flashcard, quiz đã tạo."
        ),
      },
      {
        selector: "a[href='/flashcards']",
        content: t(
          "tour.flashcards",
          "Tạo thẻ ghi nhớ từ văn bản/tài liệu/hình ảnh."
        ),
      },
      {
        selector: "a[href='/quizzes']",
        content: t("tour.quizzes", "Tạo quiz thông minh từ nội dung của bạn."),
      },
    ],
    [t]
  );

  useEffect(() => {
    const completed = localStorage.getItem(LOCAL_STORAGE_KEY) === "true";
    const isLoggedIn = !!localStorage.getItem("token");
    if (isLoggedIn && !completed) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [location.pathname]);

  const handleClose = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, "true");
    setIsOpen(false);
  };

  // Reactour yêu cầu bọc con để hoạt động, nhưng không thay đổi layout
  return (
    <TourProvider
      steps={steps}
      onClickClose={handleClose}
      onMaskClick={handleClose}
      onClickHighlighted={undefined}
      afterOpen={() => setIsOpen(true)}
      beforeClose={handleClose}
      padding={{ mask: 8, popover: 12 }}
      styles={{
        popover: (base) => ({ ...base, zIndex: 10000 }),
        maskArea: (base) => ({ ...base, rx: 8 }),
      }}
      disabled={!isOpen}
    >
      {null}
    </TourProvider>
  );
};

export default OnboardingTour;
