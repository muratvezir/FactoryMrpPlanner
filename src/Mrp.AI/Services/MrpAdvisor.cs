using Azure;
using Azure.AI.OpenAI;
using Mrp.Core.Entities;
using Mrp.Engine.Services; // MrpResult için
using System.Text;

namespace Mrp.AI.Services;

public class MrpAdvisor
{
    private readonly string _apiKey;
    private readonly string _model = "gpt-4"; // veya gpt-3.5-turbo

    public MrpAdvisor(string apiKey)
    {
        _apiKey = apiKey;
    }

    public async Task<string> AnalyzePlanAsync(MrpResult plan)
    {
        if (string.IsNullOrEmpty(_apiKey))
            return "AI analizi için API Key tanımlanmamış.";

        var client = new OpenAIClient(_apiKey);

        // Prompt hazırlığı
        var sb = new StringBuilder();
        sb.AppendLine("Aşağıdaki üretim planı verilerine göre bir risk analizi ve yönetici özeti yap.");
        sb.AppendLine("Sen tecrübeli bir Üretim Planlama Müdürüsün.");
        
        sb.AppendLine($"\nPlan Özeti:");
        sb.AppendLine($"- Toplam Üretim/Satın Alma Önerisi: {plan.Suggestions.Count}");
        sb.AppendLine($"- Tespit Edilen İstisnalar/Riskler: {plan.Exceptions.Count}");
        
        if (plan.Exceptions.Any())
        {
            sb.AppendLine("\nKritik Riskler:");
            foreach (var ex in plan.Exceptions.Take(10)) // Token limitini korumak için ilk 10
            {
                sb.AppendLine($"- [{ex.Type}] {ex.ItemCode}: {ex.Message} (Tarih: {ex.AffectedDate:dd.MM.yyyy})");
            }
        }
        
        sb.AppendLine("\nLütfen şunları sağla:");
        sb.AppendLine("1. Genel Durum Değerlendirmesi (Kritik mi, Yönetilebilir mi?)");
        sb.AppendLine("2. Acil Aksiyon Önerileri");
        sb.AppendLine("3. İyileştirme Fırsatları");

        var prompt = sb.ToString();

        var chatCompletionsOptions = new ChatCompletionsOptions()
        {
            DeploymentName = _model, 
            Messages =
            {
                new ChatRequestSystemMessage("Sen uzman bir üretim planlama asistanısın."),
                new ChatRequestUserMessage(prompt),
            },
            Temperature = (float)0.7,
        };

        try
        {
            Response<ChatCompletions> response = await client.GetChatCompletionsAsync(chatCompletionsOptions);
            return response.Value.Choices[0].Message.Content;
        }
        catch (Exception ex)
        {
            return $"AI Analizi sırasında hata oluştu: {ex.Message}";
        }
    }
}
