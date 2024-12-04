using System.ComponentModel.DataAnnotations;

public class TaskModel
{
    public int Id { get; set; }

    [Required(ErrorMessage = "O título é obrigatório.")]
    [MaxLength(100, ErrorMessage = "O título não pode ter mais que 100 caracteres.")]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public bool Completed { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public DateTime? UpdatedAt { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required(ErrorMessage = "A data de vencimento é obrigatória.")]
    public DateTime DueDate { get; set; }
}
