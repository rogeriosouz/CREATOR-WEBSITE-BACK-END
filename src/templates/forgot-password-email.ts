interface ForgotPasswordEmailRequest {
  email: string;
  token: string;
  message: string;
  urlApplication: string;
}

export function forgotPasswordEmail({
  email,
  message,
  token,
  urlApplication,
}: ForgotPasswordEmailRequest) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
  <link
      rel="stylesheet"
      type="text/css"
      href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/bold/style.css"
  />
  <title>recovery password</title>
  <style>
    * {
      padding: 0;
      margin: 0;
      box-sizing: border-box;
      border: 0 none;
    }

    a {
      text-decoration: none;
    }

    body {
      width: 100%;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-family: "Roboto", sans-serif;
      padding: 20px;
    }

    .card-email {
      width: 500px;
      border-radius: 4px;
      background-color: white;
      box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
      overflow: hidden;
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      font-size: 20px;
      font-weight: 900;
      text-align: center;
      margin: 20px;
      background-color: #020202e1;
      color: white;
      padding: 5px 20px;
      border-radius: 4px;
    }

    .content-card-email {
      width: 100%;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .title {
      font-size: 16px;
      font-weight: bold;
    }

    .header-card-email {
      width: 100%;
      background: #020202e1;
      padding: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 5px;
      color: white;
  
    }

    .header-card-email h1 {
      font-size: 14px;
      text-align: center;
      font-weight: normal;
    }

    .link {
      max-width: max-content;
      padding: 10px 40px;
      background-color: #020202e1;
      color: white;
      border-radius: 4px;
      font-size: 14px;
      margin-top: 30px;
      cursor: pointer;
      transition: all ease-in-out 150ms;
    }

    .link:hover {
      opacity: 90%;
    }

    .text-footer {
      font-size: 12px;
      color: #222222cc;
      margin-top: 10px;
    }

    @media (max-width: 600px) {
      .card-email {
        width: 100%;
      }      
    }

  </style>
</head>
<body>
  <div class="logo"><i class="ph-fill ph-browsers" style="font-size: 30px;"></i> CREATOR WEB</div>

  <div class="card-email">
    <div class="header-card-email">
      <i class="ph ph-keyhole" style="color: white; font-size: 50px;"></i>

      <h1>Enviamos a você este e-mail em resposta à sua solicitação para redefinir sua senha.</h1>
    </div>
    

    <div class="content-card-email">
      <h2 class="title">Olá ${email}</h2>
      <p>${message}</p>

      <a href='${urlApplication}/auth/recovery-password/${token}' class="link">redefinir senha</a>

      <p class="text-footer">Ignore este e-mail se você não solicitou uma alteração de senha.</p>
    </div>

   
  </div>

  <script src="https://unpkg.com/@phosphor-icons/web@2.1.1"></script>
</body>
</html>`;
}
