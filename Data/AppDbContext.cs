using Microsoft.EntityFrameworkCore;
using reportplusback.Models;

namespace reportplusback.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<FormModel> Forms { get; set; } = null!;

        public DbSet<TaskModel> Tasks { get; set; } = null!;



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<FormModel>()
                .Property(f => f.FilePath)
                .HasMaxLength(255)
                .IsRequired(false);

            modelBuilder.Entity<FormModel>()
                .HasOne(f => f.User)
                .WithMany(u => u.Forms)
                .HasForeignKey(f => f.UserId);

            modelBuilder.Entity<TaskModel>()
               .HasOne<User>() // Relaciona a tarefa ao usuário
               .WithMany() // Um usuário pode ter muitas tarefas
               .HasForeignKey(t => t.UserId); // Define UserId como chave estrangeira

        }

    }
}