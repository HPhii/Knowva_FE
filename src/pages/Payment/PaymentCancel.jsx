import React, { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const PaymentCancel = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const orderCode = searchParams.get("orderCode");

  useEffect(() => {
    // You can add analytics or other tracking here
    console.log('Payment cancelled:', { orderCode });
  }, [orderCode]);

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
          fill="#dc3545"
          viewBox="0 0 16 16"
          style={{ margin: "0 auto" }}
        >
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
        </svg>

        <h1 style={{ color: "#dc3545", marginTop: "20px" }}>
          {t('payment.cancel.title')}
        </h1>
        <p style={{ color: "#555", marginBottom: "20px" }}>
          {orderCode
            ? t('payment.cancel.descriptionWithCode', { orderCode })
            : t('payment.cancel.description')
          }
        </p>
        <p style={{ color: "#666", fontSize: "14px", marginBottom: "30px" }}>
          {t('payment.cancel.tryAgain')}
        </p>

        <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
          <Link
            to="/pricing"
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
            {t('payment.cancel.tryAgainButton')}
          </Link>
          <Link
            to="/"
            style={{
              display: "inline-block",
              padding: "12px 25px",
              backgroundColor: "#6c757d",
              color: "white",
              textDecoration: "none",
              borderRadius: "5px",
              fontWeight: "bold",
            }}
          >
            {t('payment.cancel.backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
