import OpenAI from "openai";

let openai = null;

/**
 * Get or create the OpenAI client (lazy initialization).
 * This avoids crashing at import time when env vars haven't loaded yet.
 */
const getOpenAIClient = () => {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw Object.assign(new Error("OpenAI API key is not configured"), { statusCode: 500 });
    }
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 25000, // 25s timeout to stay within Render's limits
    });
  }
  return openai;
};

/**
 * Parse a job description using OpenAI and extract structured data.
 * Uses JSON output mode for reliable structured responses.
 *
 * @param {string} jobDescription - The raw job description text.
 * @returns {Object} Parsed fields: company, role, requiredSkills, niceToHaveSkills, seniority, location, salaryRange.
 */
export const parseJobDescription = async (jobDescription) => {
  if (!jobDescription || jobDescription.trim().length === 0) {
    const error = new Error("Job description text is required");
    error.statusCode = 400;
    throw error;
  }

  try {
    const response = await getOpenAIClient().chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a job description parser. Extract structured information from the given job description and return it as JSON with these exact fields:
{
  "company": "string - company name (empty string if not found)",
  "role": "string - job title/role (empty string if not found)",
  "requiredSkills": ["array of required skills/technologies"],
  "niceToHaveSkills": ["array of nice-to-have/preferred skills"],
  "seniority": "string - seniority level like Junior, Mid, Senior, Lead, etc. (empty string if not found)",
  "location": "string - job location or Remote (empty string if not found)",
  "salaryRange": "string - salary range if mentioned (empty string if not found)"
}
Be accurate and extract only what is explicitly mentioned. Do not make up information.`,
        },
        {
          role: "user",
          content: jobDescription,
        },
      ],
      temperature: 0.1,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;
    const parsed = JSON.parse(content);

    // Validate the shape of the response
    return {
      company: parsed.company || "",
      role: parsed.role || "",
      requiredSkills: Array.isArray(parsed.requiredSkills) ? parsed.requiredSkills : [],
      niceToHaveSkills: Array.isArray(parsed.niceToHaveSkills) ? parsed.niceToHaveSkills : [],
      seniority: parsed.seniority || "",
      location: parsed.location || "",
      salaryRange: parsed.salaryRange || "",
    };
  } catch (err) {
    // Re-throw if it's our own error
    if (err.statusCode) throw err;

    console.error("OpenAI JD parse error:", err.message);
    const error = new Error("Failed to parse job description. Please try again.");
    error.statusCode = 502;
    throw error;
  }
};

/**
 * Generate tailored resume bullet point suggestions based on the job details.
 *
 * @param {Object} jobDetails - Parsed job details (role, company, requiredSkills, etc.)
 * @returns {string[]} Array of 3-5 resume bullet point suggestions.
 */
export const generateResumeSuggestions = async (jobDetails) => {
  const { role, company, requiredSkills, niceToHaveSkills, seniority } = jobDetails;

  if (!role) {
    const error = new Error("Role is required to generate resume suggestions");
    error.statusCode = 400;
    throw error;
  }

  try {
    const response = await getOpenAIClient().chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a professional resume writer. Generate 3 to 5 tailored resume bullet points for a candidate applying to a specific role. Each bullet point must:
- Be specific to the role and company, NOT generic
- Use action verbs and quantifiable achievements where possible
- Highlight relevant skills from the job requirements
- Be concise (1-2 lines each)

Return JSON in this format:
{
  "suggestions": ["bullet point 1", "bullet point 2", "bullet point 3"]
}`,
        },
        {
          role: "user",
          content: `Generate resume bullet points for:
Role: ${role}
Company: ${company || "Not specified"}
Seniority: ${seniority || "Not specified"}
Required Skills: ${requiredSkills?.join(", ") || "Not specified"}
Nice-to-have Skills: ${niceToHaveSkills?.join(", ") || "Not specified"}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;
    const parsed = JSON.parse(content);

    if (!Array.isArray(parsed.suggestions) || parsed.suggestions.length === 0) {
      const error = new Error("AI returned unexpected output. Please try again.");
      error.statusCode = 502;
      throw error;
    }

    return parsed.suggestions;
  } catch (err) {
    if (err.statusCode) throw err;

    console.error("OpenAI resume suggestions error:", err.message);
    const error = new Error("Failed to generate resume suggestions. Please try again.");
    error.statusCode = 502;
    throw error;
  }
};
