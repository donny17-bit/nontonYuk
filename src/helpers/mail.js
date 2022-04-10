const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const fs = require("fs");
const mustache = require("mustache");

const clientId =
  "200323727619-jht8jl3gogg9s258hotojf286om6fb87.apps.googleusercontent.com";
const clientSecret = "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";
const refreshToken =
  "1//04IsE5d7pm5i7CgYIARAAGAQSNwF-L9IrkgcVVXiD_ui2SKwdTOgR-4w3Vi2mhOSyWx7dxo07IUlxfZc77vIXKUDWztH6EaSqSKk";
// const clientId = process.env.MAIL_CLIENT_ID;
// const clientSecret = process.env.MAIL_CLIENT_SECRET;
// const refreshToken = process.env.MAIL_REFRESH_TOKEN;

const { OAuth2 } = google.auth;
const OAuth2Client = new OAuth2(clientId, clientSecret);
OAuth2Client.setCredentials({
  refresh_token: refreshToken,
});

module.exports = {
  sendMail: (data) =>
    new Promise((resolve, reject) => {
      const accessToken = OAuth2Client.getAccessToken;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "nontonyuk2023@gmail.com",
          clientId,
          clientSecret,
          refreshToken,
          accessToken,
        },
      });

      const fileTemplate = fs.readFileSync(
        `src/template/email/${data.template}`,
        "utf8"
      );

      const mailOptions = {
        from: '"nontonYuk 👻" <nontonyuk2023@gmail.com>', // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        html: mustache.render(fileTemplate, { ...data }),
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    }),
};
