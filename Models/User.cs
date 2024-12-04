using System;
using System.Collections.Generic;

namespace reportplusback.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        // Propriedades relacionadas ao AuthController
        public string Password { get; set; } = string.Empty; // Senha do usuário
        public string? PasswordResetToken { get; set; } // Token para redefinição de senha
        public DateTime? PasswordResetTokenExpiry { get; set; } // Expiração do token

        // Relacionamento com FormModel
        public ICollection<FormModel> Forms { get; set; } = new List<FormModel>();
    }
}
