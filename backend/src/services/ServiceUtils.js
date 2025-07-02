const nodemailer = require("nodemailer");

class ServiceUtils {
  static formatStringFromCamelToSnake(camelString) {
    return camelString.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
  }

  static giveTodayDate() {
    const date = new Date();
    let month = date.getMonth().toString();
    if (month.length === 1) {
      month = "0".concat(month);
    }
    let day = date.getDate().toString();
    if (day.length === 1) {
      day = "0".concat(day);
    }
    return `${date.getFullYear()}-${month}-${day}`;
  }

  static async sendEmail(option) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      const mailOption = {
        from: process.env.EMAIL_ID,
        to: option.email,
        subject: option.subject,
        html: option.message,
      };
      await transporter.sendMail(mailOption, (err) => {
        if (err) console.error(err);
      });
    } catch (err) {
      console.error(err);
    }
  }

  static pickMailText(userLang, frText, enText) {
    if (userLang === "en") {
      return enText;
    }
    return frText;
  }

  static resetPasswordLinkMailTemplate(content, buttonUrl, buttonText) {
    return `<!DOCTYPE html>
    <html>
    <body style="text-align: center; font-family: 'Verdana', serif; color: #000;">
      <div
        style="
          max-width: 400px;
          margin: 10px;
          background-color: #fafafa;
          padding: 25px;
          border-radius: 20px;
        "
      >
        <p style="text-align: left;">
          ${content}
        </p>
        <a href="${buttonUrl}" target="_blank">
          <button
            style="
              background-color: #444394;
              border: 0;
              width: 200px;
              height: 30px;
              border-radius: 6px;
              color: #fff;
            "
          >
            ${buttonText}
          </button>
        </a>
        <p style="text-align: left;">
        Si vous ne parvenez pas à cliquer sur le bouton ci-dessus, copiez/collez l'adresse URL ci-dessous dans la barre d'adresse de votre navigateur. 
        </p>
        <a href="${buttonUrl}" target="_blank">
            <p style="margin: 0px; text-align: left; font-size: 10px; text-decoration: none;">
              ${buttonUrl}
            </p>
        </a>
      </div>
    </body>
  </html>`;
  }

  static notRegisteredMailTemplate(
    paragraphOne,
    paragraphTwo,
    buttonOneUrl,
    buttonOneText,
    paragraphThree,
    buttonTwoUrl,
    buttonTwoText
  ) {
    return `<!DOCTYPE html>
 <html>
 <body style="text-align: center; font-family: 'Verdana', serif; color: #000;">
   <div
     style="
       max-width: 400px;
       margin: 10px;
       background-color: #fafafa;
       padding: 25px;
       border-radius: 20px;
     "
   >
     <p style="text-align: left;">
       ${paragraphOne}
     </p>
     <p style="text-align: left;">
       ${paragraphTwo}
     </p>
     <a href="${buttonOneUrl}" target="_blank">
     <button
     style="
       background-color: #444394;
       border: 0;
       width: 200px;
       height: 30px;
       border-radius: 6px;
       color: #fff;
     "
   >
     ${buttonOneText}
   </button>
     </a>
     <p style="text-align: left;">
     ${paragraphThree} 
     </p>
     <a href="${buttonTwoUrl}" target="_blank">
         <button
         style="
           background-color: #444394;
           border: 0;
           width: 200px;
           height: 30px;
           border-radius: 6px;
           color: #fff;
         "
       >
         ${buttonTwoText}
       </button>
     </a>
   </div>
 </body>
 <footer><p>Ceci est un email automatique, prière de ne pas y répondre.</p></footer>
</html>`;
  }

  static bannedAccountNotificationMailTemplate(
    paragraphOne,
    paragraphTwo,
    buttonOneUrl,
    buttonOneText,
    signature,
    dontAnswerText
  ) {
    return `<!DOCTYPE html>
 <html>
 <body style="text-align: center; font-family: 'Verdana', serif; color: #000;">
   <div
     style="
       max-width: 400px;
       margin: 10px;
       background-color: #fafafa;
       padding: 25px;
       border-radius: 20px;
     "
   >
     <p style="text-align: left;">
       ${paragraphOne}
     </p>
     <p style="text-align: left;">
       ${paragraphTwo}
     </p>
     <a href="${buttonOneUrl}" target="_blank">
     <button
     style="
       background-color: #444394;
       border: 0;
       width: 200px;
       height: 30px;
       border-radius: 6px;
       color: #fff;
     "
   >
     ${buttonOneText}
   </button>
     </a>
 <p style="text-align: right;">
 ${signature}</p>
   </div>
 </body>
 <footer><p>${dontAnswerText}</p></footer>
</html>`;
  }

  static unbannedAccountNotificationMailTemplate(
    paragraphOne,
    paragraphTwo,
    buttonOneUrl,
    buttonOneText,
    signature,
    dontAnswerText
  ) {
    return `<!DOCTYPE html>
 <html>
 <body style="text-align: center; font-family: 'Verdana', serif; color: #000;">
   <div
     style="
       max-width: 400px;
       margin: 10px;
       background-color: #fafafa;
       padding: 25px;
       border-radius: 20px;
     "
   >
     <p style="text-align: left;">
       ${paragraphOne}
     </p>
     <p style="text-align: left;">
       ${paragraphTwo}
     </p>
     <a href="${buttonOneUrl}" target="_blank">
     <button
     style="
       background-color: #444394;
       border: 0;
       width: 200px;
       height: 30px;
       border-radius: 6px;
       color: #fff;
     "
   >
     ${buttonOneText}
   </button>
     </a>
 <p style="text-align: right;">
 ${signature}</p>
   </div>
 </body>
 <footer><p>${dontAnswerText}</p></footer>
</html>`;
  }
}

module.exports = ServiceUtils;
