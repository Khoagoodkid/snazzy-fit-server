export function getWelcomeMailTemplate(
    username: string,
    verifyLink: string,
  ): string {
    return `
          <html>
    <head>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #e0eafc, #cfdef3);
          margin: 0;
          padding: 40px 20px;
        }
        .container {
          background: white;
          max-width: 600px;
          margin: auto;
          padding: 30px 25px;
          border-radius: 12px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
          text-align: center;
        }
        h1 {
          color: #2c3e50;
          margin-bottom: 16px;
        }
        p {
          font-size: 16px;
          color: #555;
          line-height: 1.5;
          margin: 10px 0;
        }
        .btn {
          display: inline-block;
          background-color: #3498db;
          color: white;
          padding: 12px 25px;
          margin: 20px 0;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          transition: background-color 0.3s ease;
        }
        .btn:hover {
          background-color: #2980b9;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome, ${username}!</h1>
        <p>Thanks for joining us — we’re thrilled to have you here!<br>
        To get started, please confirm your email address below.</p>
        <a href="${verifyLink}" class="btn">Verify Email</a>
        <p>If you didn’t sign up for this account, you can safely ignore this email.</p>
        <p>Warm wishes,<br><strong>The Team</strong></p>
      </div>
    </body>
  </html>
  
        `;
  }
  export function getResendVerifyMailTemplate(
    username: string,
    verifyLink: string,
  ): string {
    return `
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
                .container { background: white; padding: 20px; border-radius: 5px; text-align: center; }
                h1 { color: #d9534f; } 
                p { font-size: 16px; color: #555; }
                .btn {
                  display: inline-block;
                  background-color: #d9534f;
                  color: white;
                  padding: 10px 20px;
                  text-decoration: none;
                  border-radius: 5px;
                  font-weight: bold;
                }
                .btn:hover {
                  background-color: #c9302c;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Email Verification Required</h1>
                <p>Hello ${username},</p>
                <p>We noticed that you haven't verified your email yet. Please click the button below to verify your account.</p>
                <a href="${verifyLink}" class="btn">Verify Your Email</a>
                <p>If you did not request this verification, please ignore this email.</p>
                <p>Best Regards,<br> The Team</p>
              </div>
            </body>
          </html>
        `;
  }
  
  
  export function getAttendeeMailTemplate(title: string, body: string): string {
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
            .container { background: white; padding: 20px; border-radius: 5px; text-align: center; }
            h1 { color: #d9534f; } 
            p { font-size: 16px; color: #555; }   
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${title}</h1>
            <p>${body}</p>
          </div>
        </body>
      </html>
    `;
  }

  export function getChangePasswordMailTemplate(username: string, changePasswordLink: string): string {
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
            .container { background: white; padding: 20px; border-radius: 5px; text-align: center; }
            h1 { color: #d9534f; } 
            p { font-size: 16px; color: #555; }   
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Change Password</h1>
            <p>Hello ${username},</p>
            <p>Click the button below to change your password.</p>
            <a href="${changePasswordLink}" class="btn">Change Password</a>
            <p>If you did not request this password change, please ignore this email.</p>
            <p>Best Regards,<br> The Team</p>
          </div>
        </body>
      </html>
    `;
  }