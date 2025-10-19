import * as SibApiV3Sdk from "@sendinblue/client";
import dotenv from "dotenv";
dotenv.config();

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

apiInstance.authentications["apiKey"].apiKey = process.env.BREVO_API_KEY;

const sender = {
  email: process.env.EMAIL, // The "from" email you verified on Brevo
  name: "Dash Dine",
};

// function to send otp to user's email from my(app) email
export const sendOtpMail = async (to, otp) => {
  const tranEmailApi = new SibApiV3Sdk.SendSmtpEmail();

  tranEmailApi.sender = sender;
  tranEmailApi.to = [{ email: to }];
  tranEmailApi.subject = "Reset Your Password";
  tranEmailApi.htmlContent = `<p>Your OTP for reset DashDine password is <b>${otp}</b>. It expires in 5 minutes.</p>`;

  apiInstance.sendTransacEmail(tranEmailApi).then(
    function (data) {
      console.log(
        "Password reset OTP seny successfully.Return data: " +
          JSON.stringify(data)
      );
    },
    function (error) {
      console.error("Error sending password reset OTP:", error);
    }
  );
};

// function to send otp to user's email from my(app) email
export const sendDeliveryOtpMail = async (user, otp) => {
  const tranEmailApi = new SibApiV3Sdk.SendSmtpEmail();

  tranEmailApi.sender = sender;
  tranEmailApi.to = [{ email: user.email }];
  tranEmailApi.subject = "Delivery OTP";
  tranEmailApi.htmlContent = `<p>Your otp for delivery confirmation is <b>${otp}</b>. It expires in 5 minutes.</p>`;

  apiInstance.sendTransacEmail(tranEmailApi).then(
    function (data) {
      console.log(
        "Delivery OTP sent successfully. Returned data: " + JSON.stringify(data)
      );
    },
    function (error) {
      console.error("Error sending delivery OTP:", error);
    }
  );
};
