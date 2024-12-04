using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using reportplusback.Data;
using reportplusback.Models;
using System.Threading.Tasks;
using System.IO;

namespace reportplusback.Controllers
{
    [ApiController]
    [Route("api/form")] // Atualiza para "api/form" para consistência com o frontend
    public class FormController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FormController(AppDbContext context)
        {
            _context = context;
        }

        // Método de teste para verificar se o controlador está funcional
        [HttpGet("test")]
        public IActionResult Test()
        {
            return Ok(new { message = "Test endpoint is working!" });
        }

        // Método para listar todos os formulários de um usuário
        [HttpGet("list")]
public async Task<IActionResult> GetForms([FromQuery] int userId)
{
    try
    {
        Console.WriteLine($"Buscando formulários para o usuário com ID: {userId}");

        if (userId <= 0)
        {
            Console.WriteLine("ID do usuário inválido.");
            return BadRequest(new { message = "ID do usuário inválido." });
        }

        Console.WriteLine("Iniciando consulta ao banco de dados...");
                var forms = await _context.Forms
            .Where(f => f.UserId == userId)
            .Select(f => new
            {
                Id = f.Id,
                Title = f.Title ?? "[Sem título]",
                Description = f.Description ?? "[Sem descrição]",
                FileName = f.FileName ?? "[Sem arquivo]",
                FilePath = f.FilePath ?? "[Sem caminho]",
                CreatedAt = f.CreatedAt ?? DateTime.UtcNow // Define um valor padrão se for nulo
            })
            .ToListAsync();


                Console.WriteLine($"Formulários encontrados: {forms.Count}");

        if (!forms.Any())
        {
            Console.WriteLine("Nenhum formulário encontrado.");
            return NotFound(new { message = "Nenhum formulário encontrado para este usuário." });
        }

        Console.WriteLine("Retornando dados para o cliente.");
        return Ok(forms);
    }
    catch (Exception ex)
    {
        Console.WriteLine("Erro capturado no método GetForms:");
        Console.WriteLine($"Mensagem do erro: {ex.Message}");
        Console.WriteLine($"StackTrace do erro: {ex.StackTrace}");
        return StatusCode(500, new { message = "Erro interno no servidor.", details = ex.Message });
    }
}



        [HttpGet("{id}")]
        public async Task<IActionResult> GetFormById(int id)
        {
            Console.WriteLine($"Recebendo ID: {id}"); // Log para debug

            try
            {
                var form = await _context.Forms.FirstOrDefaultAsync(f => f.Id == id);

                if (form == null)
                {
                    return NotFound(new { message = "Formulário não encontrado." });
                }

                // Certifique-se de que todos os campos necessários são retornados
                return Ok(new
                {
                    form.Id,
                    form.Title,
                    form.Description,
                    form.FileName, // Campo necessário para o download
                    form.FilePath  // Certifique-se de que o caminho relativo é retornado, se necessário
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao buscar formulário", error = ex.Message });
            }
        }


        [HttpGet("download/{fileName}")]
        public IActionResult DownloadFile(string fileName)
        {
            Console.WriteLine($"Tentando baixar o arquivo: {fileName}");

            if (string.IsNullOrEmpty(fileName))
            {
                Console.WriteLine("Nome do arquivo não fornecido.");
                return BadRequest(new { message = "Nome do arquivo não fornecido." });
            }

            // Caminho completo do arquivo
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads", fileName);

            if (!System.IO.File.Exists(filePath))
            {
                Console.WriteLine($"Arquivo não encontrado: {filePath}");
                return NotFound(new { message = "Arquivo não encontrado." });
            }

            try
            {
                var memory = new MemoryStream();
                using (var stream = new FileStream(filePath, FileMode.Open))
                {
                    stream.CopyTo(memory);
                }
                memory.Position = 0;

                var contentType = "application/pdf"; // Ajuste para o tipo de arquivo apropriado
                return File(memory, contentType, fileName);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao processar o download: {ex.Message}");
                return StatusCode(500, new { message = "Erro ao processar o download.", error = ex.Message });
            }
        }






        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteForm(int id)
        {
            Console.WriteLine($"Tentando excluir o formulário com ID: {id}"); // Log para depuração

            try
            {
                // Busca o formulário pelo ID
                var form = await _context.Forms.FirstOrDefaultAsync(f => f.Id == id);

                // Verifica se o formulário existe
                if (form == null)
                {
                    Console.WriteLine($"Formulário com ID {id} não encontrado."); // Log de erro
                    return NotFound(new { message = "Formulário não encontrado." });
                }

                // Remove o formulário
                _context.Forms.Remove(form);
                await _context.SaveChangesAsync();

                Console.WriteLine($"Formulário com ID {id} excluído com sucesso."); // Log de sucesso
                return Ok(new { message = "Formulário excluído com sucesso." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao excluir formulário: {ex.Message}"); // Log de erro
                return StatusCode(500, new { message = "Erro ao excluir formulário.", error = ex.Message });
            }
        }







        // Método para criar um formulário
        [HttpPost("create")]
        public async Task<IActionResult> CreateForm([FromForm] FormModel form, IFormFile? file)
        {
            try
            {
                // Valida campos obrigatórios
                if (string.IsNullOrEmpty(form.Title) || string.IsNullOrEmpty(form.Description))
                {
                    return BadRequest(new { message = "Título e descrição são obrigatórios." });
                }

                // Processa o upload do arquivo
                if (file != null)
                {
                    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    var fileName = file.FileName;
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    form.FileName = fileName; // Nome do arquivo
                    form.FilePath = $"/uploads/{fileName}"; // Caminho relativo para o cliente
                }

                form.CreatedAt = DateTime.UtcNow;
                _context.Forms.Add(form);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Formulário criado com sucesso!", form });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao criar formulário: {ex.Message}");
                return StatusCode(500, new { message = "Erro ao criar formulário.", error = ex.Message });
            }
        }






        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile([FromForm] int userId, [FromForm] string title, [FromForm] string description, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "Nenhum arquivo enviado." });

            if (userId <= 0 || string.IsNullOrEmpty(title) || string.IsNullOrEmpty(description))
                return BadRequest(new { message = "Dados inválidos." });

            try
            {
                // Define a pasta onde os arquivos serão armazenados
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                // Gera um nome único para o arquivo
                var fileName = $"{Guid.NewGuid()}_{file.FileName}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                // Salva o arquivo no sistema
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Cria o objeto de formulário para salvar no banco
                var form = new FormModel
                {
                    UserId = userId,
                    Title = title,
                    Description = description,
                    FileName = fileName,
                    FilePath = $"/uploads/{fileName}", // Caminho relativo
                    CreatedAt = DateTime.UtcNow
                };

                // Salva o formulário no banco
                _context.Forms.Add(form);
                await _context.SaveChangesAsync();

                // Retorna os dados do formulário incluindo o nome e o caminho do arquivo
                return Ok(new
                {
                    message = "Upload e registro concluídos com sucesso!",
                    form.Id,
                    form.Title,
                    form.Description,
                    form.FileName,
                    form.FilePath
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao salvar o arquivo: {ex.Message}");
                return StatusCode(500, new { message = "Erro ao salvar o arquivo.", error = ex.Message });
            }
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateForm(int id, [FromBody] FormModel updatedForm)
        {
            try
            {
                // Encontra o formulário existente no banco de dados
                var existingForm = await _context.Forms.FirstOrDefaultAsync(f => f.Id == id);

                if (existingForm == null)
                {
                    // Retorna erro 404 se o formulário não for encontrado
                    return NotFound(new { message = "Formulário não encontrado." });
                }

                // Atualiza os campos do formulário, se fornecidos
                existingForm.Title = updatedForm.Title ?? existingForm.Title;
                existingForm.Description = updatedForm.Description ?? existingForm.Description;
                existingForm.UpdatedAt = DateTime.UtcNow;

                // Salva as alterações no banco de dados
                _context.Forms.Update(existingForm);
                await _context.SaveChangesAsync();

                // Retorna sucesso com os dados atualizados
                return Ok(new { message = "Formulário atualizado com sucesso!", existingForm });
            }
            catch (Exception ex)
            {
                // Log de erro e retorno de status 500
                Console.WriteLine($"Erro ao atualizar o formulário: {ex.Message}");
                return StatusCode(500, new { message = "Erro ao atualizar o formulário.", error = ex.Message });
            }
        }







    }
}
