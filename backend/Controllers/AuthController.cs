using Microsoft.AspNetCore.Mvc;
using reportplusback.Data;
using reportplusback.Models;
using reportplusback.Services;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using BCrypt.Net;

namespace reportplusback.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly EmailService _emailService;

        public AuthController(AppDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // Login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                if (string.IsNullOrEmpty(loginDto.Email) || string.IsNullOrEmpty(loginDto.Password))
                {
                    return BadRequest(new { message = "Email e senha são obrigatórios." });
                }

                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
                if (existingUser == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, existingUser.Password))
                {
                    return Unauthorized(new { message = "Credenciais inválidas." });
                }
                return Ok(new
                {
                    message = "Login bem-sucedido",
                    user = new
                    {
                        Id = existingUser.Id,
                        Name = existingUser.Name, // Inclua o nome do usuário aqui
                        Email = existingUser.Email,
                    }
                });

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro no login: {ex.Message}");
                return StatusCode(500, new { message = "Erro no servidor ao processar o login." });
            }
        }




        // Registro
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            try
            {
                if (string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.Password) || string.IsNullOrEmpty(user.Name))
                {
                    return BadRequest(new { message = "Todos os campos são obrigatórios." });
                }

                var existingUser = await _context.Users.AnyAsync(u => u.Email == user.Email);
                if (existingUser)
                {
                    return BadRequest(new { message = "O e-mail já está em uso." });
                }

                user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Usuário registrado com sucesso." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro no registro: {ex.Message}");
                return StatusCode(500, new { message = "Erro interno no servidor." });
            }
        }

        // Solicitação de redefinição de senha
        [HttpPost("request-password-reset")]
        public async Task<IActionResult> RequestPasswordReset([FromBody] PasswordResetRequestDto resetDto)
        {
            Console.WriteLine("Recebendo solicitação de recuperação de senha...");
            if (string.IsNullOrEmpty(resetDto.Email))
            {
                Console.WriteLine("Erro: E-mail está vazio.");
                return BadRequest(new { message = "O campo de e-mail é obrigatório." });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == resetDto.Email.Trim());
            if (user == null)
            {
                Console.WriteLine($"Usuário com e-mail {resetDto.Email} não encontrado.");
                return BadRequest(new { message = "Usuário não encontrado." });
            }

            Console.WriteLine($"Usuário encontrado: {user.Name}. Gerando token de recuperação...");
            user.PasswordResetToken = Guid.NewGuid().ToString();
            user.PasswordResetTokenExpiry = DateTime.UtcNow.AddHours(1);

            await _context.SaveChangesAsync();
            Console.WriteLine($"Token gerado e salvo no banco para o e-mail {user.Email}.");

            try
            {
                string frontendUrl = "http://localhost:3000/reset-password";
                string resetLink = $"{frontendUrl}/{user.PasswordResetToken}";
                _emailService.SendPasswordResetEmail(user.Email, resetLink, user.PasswordResetToken);
                Console.WriteLine($"E-mail enviado para {user.Email} com o link {resetLink}.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao enviar e-mail: {ex.Message}");
                return StatusCode(500, new { message = "Erro ao enviar o e-mail de recuperação de senha." });
            }

            return Ok(new { message = "Instruções de recuperação de senha enviadas para o e-mail." });
        }


        // Redefinição de senha
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] PasswordResetDto resetDto)
        {
            try
            {
                if (string.IsNullOrEmpty(resetDto.Token) || string.IsNullOrEmpty(resetDto.NewPassword))
                {
                    return BadRequest(new { message = "Token e nova senha são obrigatórios." });
                }

                var user = await _context.Users.FirstOrDefaultAsync(u =>
                    u.PasswordResetToken == resetDto.Token &&
                    u.PasswordResetTokenExpiry > DateTime.UtcNow);

                if (user == null)
                {
                    return BadRequest(new { message = "Token inválido ou expirado." });
                }

                user.Password = BCrypt.Net.BCrypt.HashPassword(resetDto.NewPassword);
                user.PasswordResetToken = null;
                user.PasswordResetTokenExpiry = null;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Senha redefinida com sucesso." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro na redefinição de senha: {ex.Message}");
                return StatusCode(500, new { message = "Erro interno no servidor." });
            }
        }

        // Alteração de senha
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
        {
            try
            {
                if (string.IsNullOrEmpty(changePasswordDto.UserId) ||
                    string.IsNullOrEmpty(changePasswordDto.CurrentPassword) ||
                    string.IsNullOrEmpty(changePasswordDto.NewPassword))
                {
                    return BadRequest(new { message = "Todos os campos são obrigatórios." });
                }

                if (!int.TryParse(changePasswordDto.UserId, out int userId))
                {
                    return BadRequest(new { message = "ID de usuário inválido." });
                }

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
                if (user == null)
                {
                    return NotFound(new { message = "Usuário não encontrado." });
                }

                if (!BCrypt.Net.BCrypt.Verify(changePasswordDto.CurrentPassword, user.Password))
                {
                    return BadRequest(new { message = "Senha atual incorreta." });
                }

                user.Password = BCrypt.Net.BCrypt.HashPassword(changePasswordDto.NewPassword);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Senha alterada com sucesso." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao alterar a senha: {ex.Message}");
                return StatusCode(500, new { message = "Erro interno no servidor." });
            }
        }

        [HttpDelete("desativar-conta/{id}")]
        public async Task<IActionResult> DesativarConta(int id)
        {
            try
            {
                // Buscar o usuário no banco de dados
                var usuario = await _context.Users.Include(u => u.Forms)
                                                     .FirstOrDefaultAsync(u => u.Id == id);

                if (usuario == null)
                {
                    return NotFound("Usuário não encontrado.");
                }

                // Remover formulários relacionados
                _context.Forms.RemoveRange(usuario.Forms);

                // Remover o usuário
                _context.Users.Remove(usuario);

                await _context.SaveChangesAsync();

                return Ok("Conta desativada com sucesso.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao desativar conta: {ex.Message}");
            }
        }

    }

    // DTOs
    public class PasswordResetRequestDto
    {
        public string? Email { get; set; }
    }

    public class PasswordResetDto
    {
        public string? Token { get; set; }
        public string? NewPassword { get; set; }
    }

    public class ChangePasswordDto
    {
        public string? UserId { get; set; }
        public string? CurrentPassword { get; set; }
        public string? NewPassword { get; set; }
    }
}

public class LoginDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
