using reportplusback.Data;
using reportplusback.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using reportplusback.Filters;
using Microsoft.Extensions.FileProviders; // Necessário para servir arquivos estáticos
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// **Configuração do banco de dados (SQL Server)**
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// **Adiciona serviços de controladores para a API**
builder.Services.AddControllers().AddJsonOptions(options =>
{
    // Configuração para evitar referências cíclicas ao serializar objetos
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});

// **Configuração do Swagger**
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "API ReportPlusBack",
        Version = "v1",
        Description = "API para gerenciar formulários e uploads",
        Contact = new OpenApiContact
        {
            Name = "Suporte ReportPlus",
            Email = "suporte@reportplus.com"
        }
    });

    // Adiciona suporte para upload de arquivos com IFormFile
    c.OperationFilter<FileUploadOperationFilter>();

    // Garante que as rotas sejam descritas corretamente
    c.DescribeAllParametersInCamelCase();

    // Resolve conflitos de rotas
    c.ResolveConflictingActions(apiDescriptions => apiDescriptions.First());
});

// **Configuração de logs**
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

// **Habilita CORS para permitir chamadas do frontend**
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// **Registra serviços adicionais**
builder.Services.AddTransient<EmailService>();

var app = builder.Build();

// **Configuração do Swagger no ambiente de desenvolvimento**
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1");
        c.RoutePrefix = string.Empty;
    });
}

// **Configurações de pipeline**
app.UseHttpsRedirection();

// **Habilitar CORS para todas as requisições**
app.UseCors("AllowAll");

// **Servir arquivos estáticos da pasta wwwroot**
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads")),
    RequestPath = "/uploads" // Define a rota "/uploads" para acessar os arquivos
});

// **Habilitar logs para todas as requisições recebidas**
app.Use(async (context, next) =>
{
    Console.WriteLine($"Request: {context.Request.Method} {context.Request.Path}");
    await next.Invoke();
    Console.WriteLine($"Response: {context.Response.StatusCode}");
});

// **Mapeamento de controladores**
app.UseRouting(); // Adicionado para garantir que o roteamento funcione corretamente
app.UseAuthorization();
app.MapControllers();

// **Mapeamento explícito de rotas (opcional)**
app.MapControllerRoute(
    name: "desativar-conta",
    pattern: "api/{controller=Auth}/desativar-conta/{id}",
    defaults: new { action = "DesativarConta" }
);

// **Adicionado: Verificação de rota TaskController**
app.MapControllerRoute(
    name: "task-routes",
    pattern: "api/{controller=Task}/{action=Index}/{id?}"
);

// **Verifica ou cria a pasta "wwwroot/uploads" na inicialização**
var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
if (!Directory.Exists(uploadPath))
{
    Directory.CreateDirectory(uploadPath);
    Console.WriteLine($"Pasta de uploads criada em: {uploadPath}");
}

// **Exibe mensagem de inicialização bem-sucedida**
Console.WriteLine("Aplicação iniciada com sucesso!");

// **Inicia o aplicativo**
app.Run();
