import React from "react";
import { useTranslation } from "react-i18next";

const TextInput = ({
  value,
  onChange,
  characterCount,
  maxCharacters,
  minCharacters,
}) => {
  const { t } = useTranslation();

  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={t("quiz.textInput.placeholder")}
      className="w-full h-[250px] bg-transparent border-none outline-none resize-none text-gray-800 placeholder-gray-500 text-base leading-relaxed"
    />
  );
};

export default TextInput;
