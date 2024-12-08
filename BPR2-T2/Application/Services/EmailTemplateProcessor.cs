namespace Application.Services;

public class EmailTemplateProcessor
{
    public static string LoadTemplate(string templateName, Dictionary<string, string> placeholders)
    {
        string templatePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Templates", $"{templateName}.html");
        if (!File.Exists(templatePath))
        {
            throw new Exception($"Template {templateName} not found at path: {templatePath}");
        }

        string templateContent = File.ReadAllText(templatePath);

        foreach (var placeholder in placeholders)
        {
            templateContent = templateContent.Replace($"{{{placeholder.Key}}}", placeholder.Value);
        }

        return templateContent;
    }
}
