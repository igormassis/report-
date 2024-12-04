using Microsoft.AspNetCore.Mvc;
using reportplusback.Data;
using reportplusback.Models;
using System.Linq;

namespace reportplusback.Controllers
{
    [ApiController]
    [Route("api/tasks")] // Certifique-se de que esta rota corresponde ao que o frontend está chamando
    public class TaskController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TaskController(AppDbContext context)
        {
            _context = context;
        }

        // Obter todas as tarefas de um usuário
        [HttpGet]
        public IActionResult GetTasks([FromQuery] int userId)
        {
            if (userId <= 0)
            {
                return BadRequest("ID do usuário não fornecido ou inválido.");
            }

            var tasks = _context.Tasks
                .Where(t => t.UserId == userId)
                .OrderBy(t => t.DueDate) // Ordenar pela data de vencimento
                .ToList();

            return Ok(tasks);
        }


        // Criar uma nova tarefa
        [HttpPost]
        public IActionResult CreateTask([FromBody] TaskModel task)
        {
            if (task == null || task.UserId <= 0 || string.IsNullOrEmpty(task.Title) || task.DueDate == default)
            {
                return BadRequest("Dados inválidos. Certifique-se de enviar título, usuário e data válida.");
            }

            if (task.DueDate <= DateTime.Now)
            {
                return BadRequest("A data de vencimento deve ser no futuro.");
            }

            _context.Tasks.Add(task);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetTasks), new { userId = task.UserId }, task);
        }



        // Atualizar uma tarefa existente
        [HttpPut("{id}")]
        public IActionResult UpdateTask(int id, [FromBody] TaskModel updatedTask)
        {
            var task = _context.Tasks.FirstOrDefault(t => t.Id == id);
            if (task == null) return NotFound("Tarefa não encontrada.");

            task.Title = updatedTask.Title;
            task.Description = updatedTask.Description;
            task.Completed = updatedTask.Completed;
            task.UpdatedAt = DateTime.Now;

            _context.SaveChanges();
            return Ok(task);
        }

        // Excluir uma tarefa
        [HttpDelete("{id}")]
        public IActionResult DeleteTask(int id)
        {
            var task = _context.Tasks.FirstOrDefault(t => t.Id == id);
            if (task == null) return NotFound("Tarefa não encontrada.");

            _context.Tasks.Remove(task);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
