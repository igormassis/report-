using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace reportplusback.Models
{
    public class FormModel
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "O título é obrigatório.")]
        [MaxLength(100, ErrorMessage = "O título não pode exceder 100 caracteres.")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "A descrição é obrigatória.")]
        [MaxLength(500, ErrorMessage = "A descrição não pode exceder 500 caracteres.")]
        public string Description { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.DateTime)]
        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Relacionamento com a tabela de usuários
        public int UserId { get; set; }

        [JsonIgnore]
        public User? User { get; set; }

        // Propriedade para armazenar o caminho do arquivo
        [MaxLength(255, ErrorMessage = "O caminho do arquivo não pode exceder 255 caracteres.")]
        public string? FilePath { get; set; }

        // Propriedade para armazenar o nome do arquivo
        [MaxLength(255, ErrorMessage = "O nome do arquivo não pode exceder 255 caracteres.")]
        public string FileName { get; set; } = "default.pdf"; // Define um valor padrão

     

    }
}
