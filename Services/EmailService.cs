using System;
using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

namespace reportplusback.Services
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void SendPasswordResetEmail(string toEmail, string resetLink, string resetToken)
        {
            var smtpServer = _configuration["EmailSettings:SmtpServer"];
            var smtpPort = int.TryParse(_configuration["EmailSettings:SmtpPort"], out int port) ? port : 587;
            var senderEmail = _configuration["EmailSettings:SenderEmail"];
            var senderPassword = _configuration["EmailSettings:SenderPassword"];

            if (string.IsNullOrEmpty(smtpServer) || string.IsNullOrEmpty(senderEmail) || string.IsNullOrEmpty(senderPassword))
            {
                throw new InvalidOperationException("Configurações de e-mail estão incompletas.");
            }

            if (string.IsNullOrEmpty(toEmail))
            {
                throw new ArgumentNullException(nameof(toEmail), "O e-mail de destino não pode ser nulo.");
            }

            // Corpo do e-mail com link e token formatados separadamente
            var mailMessage = new MailMessage
            {
                From = new MailAddress(senderEmail),
                Subject = "Recuperação de Senha",
                Body = $"Olá,\n\nClique no link a seguir para redefinir sua senha:\n{resetLink}\n\n" +
                       $"Se necessário, use o seguinte token de recuperação:\n{resetToken}\n\n" +
                       "Este token expira em 1 hora.\n\nAtenciosamente,\nEquipe de Suporte",
                IsBodyHtml = false,
            };
            mailMessage.To.Add(toEmail);

            try
            {
                using (var smtpClient = new SmtpClient(smtpServer, smtpPort))
                {
                    smtpClient.Credentials = new NetworkCredential(senderEmail, senderPassword);
                    smtpClient.EnableSsl = true;
                    smtpClient.Timeout = 10000;
                    smtpClient.UseDefaultCredentials = false;

                    smtpClient.Send(mailMessage);
                    Console.WriteLine("E-mail de recuperação de senha enviado com sucesso.");
                }
            }
            catch (SmtpException smtpEx)
            {
                Console.WriteLine($"Erro SMTP: {smtpEx.Message}");
                throw new InvalidOperationException("Erro ao enviar o e-mail de recuperação de senha (SMTP)", smtpEx);
            }
        }
    }
}
