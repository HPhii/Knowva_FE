import React from "react";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t, i18n } = useTranslation();

  const switchToVietnamese = () => i18n.changeLanguage("vi");
  const switchToEnglish = () => i18n.changeLanguage("en");

  return (
    <div className="h-[500px] w-[500px]">
      <h1>{t("gay")}</h1>
    </div>
  );
};

export default Home;
