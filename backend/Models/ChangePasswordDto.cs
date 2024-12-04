using System.ComponentModel.DataAnnotations;

namespace reportplusback.Models // Substitua por seu namespace
{
    public class ChangePasswordDto
    {
        [Required]
        public string? UserId { get; set; }

        [Required]
        public string? CurrentPassword { get; set; }

        [Required]
        [MinLength(6, ErrorMessage = "A nova senha deve ter no mínimo 6 caracteres.")]
        public string? NewPassword { get; set; }
    }
}
