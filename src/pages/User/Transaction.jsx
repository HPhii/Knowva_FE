import React from "react";
import { useTranslation } from "react-i18next";

const Transaction = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t("transaction")}
        </h1>
        <p className="text-gray-600">
          {t("transactionDescription") ||
            "View your transaction history and payment details"}
        </p>
      </div>

      <div className="bg-gray-50 rounded-xl p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t("noTransactions") || "No Transactions Available"}
        </h3>
        <p className="text-gray-500">
          {t("transactionEmptyMessage") ||
            "You haven't made any transactions yet. Your payment history will appear here once you make a purchase."}
        </p>
      </div>
    </>
  );
};

export default Transaction;
