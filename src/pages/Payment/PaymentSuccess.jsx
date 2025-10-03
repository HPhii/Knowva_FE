import React, { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const PaymentSuccess = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  // Read all parameters from URL
  const paymentInfo = {
    orderCode: searchParams.get("orderCode"),
    amount: searchParams.get("amount"),
    description: searchParams.get("description"),
    status: searchParams.get("status"),
    paymentId: searchParams.get("id"),
  };

  useEffect(() => {
    // You can add analytics or other tracking here
    console.log('Payment successful:', paymentInfo);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f7f7f7",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "40px 50px",
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          maxWidth: "500px",
          width: "90%",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
          fill="#28a745"
          viewBox="0 0 16 16"
          style={{ margin: "0 auto" }}
        >
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
        </svg>

        <h1
          style={{ color: "#28a745", marginTop: "20px", marginBottom: "10px" }}
        >
          {t('payment.success.title')}
        </h1>
        <p style={{ color: "#555", marginBottom: "30px" }}>
          {t('payment.success.description')}
        </p>

        {paymentInfo.orderCode && (
          <div
            style={{
              textAlign: "left",
              border: "1px solid #eee",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "30px",
            }}
          >
            <p>
              <strong>{t('payment.success.status')}:</strong>{" "}
              <span style={{ color: "#28a745", fontWeight: "bold" }}>
                {paymentInfo.status || t('payment.success.completed')}
              </span>
            </p>
            <p>
              <strong>{t('payment.success.orderCode')}:</strong> {paymentInfo.orderCode}
            </p>
            {paymentInfo.amount && (
              <p>
                <strong>{t('payment.success.amount')}:</strong> {paymentInfo.amount} VND
              </p>
            )}
            {paymentInfo.description && (
              <p>
                <strong>{t('payment.success.description')}:</strong> {paymentInfo.description}
              </p>
            )}
          </div>
        )}

        <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
          <Link
            to="/"
            style={{
              display: "inline-block",
              padding: "12px 25px",
              backgroundColor: "#007bff",
              color: "white",
              textDecoration: "none",
              borderRadius: "5px",
              fontWeight: "bold",
            }}
          >
            {t('payment.success.backToHome')}
          </Link>
          <Link
            to="/user/dashboard"
            style={{
              display: "inline-block",
              padding: "12px 25px",
              backgroundColor: "#28a745",
              color: "white",
              textDecoration: "none",
              borderRadius: "5px",
              fontWeight: "bold",
            }}
          >
            {t('payment.success.goToDashboard')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
