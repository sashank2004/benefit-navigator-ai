import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, userInput, benefit, userNeed } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (action === 'classify') {
      // Classification prompt
      const systemPrompt = `You are an expert health benefits classifier. Your job is to analyze employee health-related concerns and classify them into one of four categories.

Categories:
- Dental: Issues related to teeth, gums, mouth, oral health, dental procedures, orthodontics, toothaches, cavities, dental hygiene
- Mental Health: Issues related to stress, anxiety, depression, emotional wellbeing, therapy, counseling, burnout, work-life balance, sleep problems, mood issues
- Vision: Issues related to eyes, eyesight, glasses, contacts, vision problems, eye exams, eye strain, blurry vision
- OPD (Outpatient Department): General health issues, doctor consultations, checkups, fever, cold, flu, infections, general pain, medication needs, blood tests, routine health concerns

Analyze the user's input carefully and determine the BEST matching category. Consider the primary health concern being described.

Respond with a JSON object containing:
- category: The category name (exactly one of: "Dental", "Mental Health", "Vision", "OPD") or null if truly unrelated to health benefits
- confidence: A number between 0 and 1 indicating your confidence
- reasoning: A brief explanation of why you chose this category (1-2 sentences)
- suggestions: An array of 2-3 specific questions the user might want to ask about their benefits

Only respond with valid JSON, nothing else.`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Please classify this health concern: "${userInput}"` }
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI gateway error:", response.status, errorText);
        
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        throw new Error(`AI gateway error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      console.log("AI classification response:", content);

      // Parse the JSON response
      let result;
      try {
        // Remove markdown code blocks if present
        const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
        result = JSON.parse(cleanContent);
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
        return new Response(JSON.stringify({ 
          category: null, 
          confidence: 0, 
          fallback: true,
          reasoning: "Unable to classify your request. Please try describing your health concern differently."
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({
        category: result.category,
        confidence: result.confidence || 0.8,
        fallback: result.category === null,
        reasoning: result.reasoning || "",
        suggestions: result.suggestions || []
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } else if (action === 'action-plan') {
      // Action plan generation prompt
      const systemPrompt = `You are an expert employee benefits advisor. Generate a detailed, personalized action plan for an employee who wants to use their health benefit.

The action plan should be:
- Specific to the benefit and provider mentioned
- Practical and actionable with clear steps
- Include realistic timeframes
- Mention any documents or information they might need
- Be encouraging and supportive in tone

Respond with a JSON object containing:
- steps: An array of 4-5 step objects, each with:
  - title: A concise action title (2-4 words)
  - description: Detailed description of what to do (2-3 sentences, personalized to their specific need and the benefit)
  - timeframe: When to do this step
  - tips: Optional array of 1-2 helpful tips for this step
- summary: A brief encouraging summary (1 sentence)
- importantNotes: Array of 1-2 important things to remember

Only respond with valid JSON, nothing else.`;

      const userMessage = `Generate an action plan for an employee with this health concern: "${userNeed}"

They have selected this benefit:
- Benefit Title: ${benefit.title}
- Category: ${benefit.category}
- Coverage: ${benefit.coverage}
- Provider: ${benefit.provider}
- Description: ${benefit.description}

Create a detailed, personalized action plan to help them use this benefit effectively.`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI gateway error:", response.status, errorText);
        
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        throw new Error(`AI gateway error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      console.log("AI action plan response:", content);

      // Parse the JSON response
      let result;
      try {
        const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
        result = JSON.parse(cleanContent);
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
        // Return a fallback action plan
        return new Response(JSON.stringify({
          steps: [
            { title: "Contact Provider", description: `Reach out to ${benefit.provider} to get started.`, timeframe: "Today" },
            { title: "Gather Documents", description: "Prepare your employee ID and insurance details.", timeframe: "Before appointment" },
            { title: "Schedule Appointment", description: "Book an appointment with an in-network provider.", timeframe: "Within 1 week" },
            { title: "Follow Up", description: "Complete any recommended follow-up care.", timeframe: "As needed" }
          ],
          summary: "We're here to help you access your benefits!",
          importantNotes: ["Keep all receipts for reimbursement", "Contact HR if you have questions"]
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Benefits AI error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
