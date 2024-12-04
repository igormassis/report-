using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace reportplusback.Filters
{
    public class FileUploadOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            if (operation.OperationId != "UploadFile") return;

            operation.Parameters.Add(new OpenApiParameter
            {
                Name = "file",
                In = ParameterLocation.Query,
                Required = true,
                Schema = new OpenApiSchema { Type = "file" }
            });
        }
    }
}
