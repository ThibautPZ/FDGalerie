class MailTemplates {
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

  static notRegisteredMailTemplate(userEmail) {
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
     Nous avons reçu une demande de réinitialisation de mot de passe d'un compte sur le site ${process.env.FRONTEND_URL}, cependant l'adresse mail renseignée (${userEmail}) sur laquelle vous recevez ce message ne correspond à aucun compte enregistré.</p> 
     <p style="text-align: left;"> Si vous êtes à l'origine de cette demande, deux cas de figure : 
     </p>
     <p style="text-align: left;">
     - Soit vous possédez un compte mais l'adresse mail qui est inscrite n'est pas celle-ci. Nous vous invitons alors à réitérer votre demande en renseignant une autre adresse mail en cliquent sur le lien suivant : 
     </p>
     <a href="${process.env.FRONTEND_URL}/MDPOublie" target="_blank">
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
   Demander de nouveau la réinitialisation du mot de passe
   </button>
     </a>
     <p style="text-align: left;">
     - Soit vous ne possédez aucun compte sur notre site, dans ce cas nous serons heureux de vous compter parmi nous. Vous pouvez créer un compte gratuitement et facilement en cliquant sur le lien ci-dessous.
     </p>
     <a href="${process.env.FRONTEND_URL}/Connexion?page=Inscription" target="_blank">
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
       Créer un compte
       </button>
     </a>
   </div>
 </body>
 <footer><p>Ceci est un email automatique, prière de ne pas y répondre.</p></footer>
</html>`;
  }

  static deletedAccountNotificationMailTemplate(
    paragraphOne,
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
     
 <p style="text-align: right;">
 ${signature}</p>
   </div>
 </body>
 <footer><p>${dontAnswerText}</p></footer>
</html>`;
  }

  static warnedAccountNotificationMailTemplate(
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
<footer><p>${dontAnswerText}Ceci est un email automatique, prière de ne pas y répondre.</p></footer>
</html>`;
  }
}
module.exports = MailTemplates;
