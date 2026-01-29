import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TestCase, ComplianceStandard, Priority, TestStatus } from "../types";

// Initialize the API client
// Note: In a real production app, ensure strict error handling if key is missing.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

const testCaseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    testCases: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "A concise title for the test case" },
          description: { type: Type.STRING, description: "Purpose of the test" },
          preconditions: { type: Type.STRING, description: "State required before test starts" },
          priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
          complianceTags: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Relevant compliance standards (e.g., HIPAA, FDA)"
          },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                stepNumber: { type: Type.INTEGER },
                action: { type: Type.STRING },
                expectedResult: { type: Type.STRING }
              },
              required: ["stepNumber", "action", "expectedResult"]
            }
          }
        },
        required: ["title", "description", "priority", "steps", "preconditions"]
      }
    }
  }
};

export const generateTestCasesFromRequirement = async (
  requirement: string,
  standards: ComplianceStandard[]
): Promise<TestCase[]> => {
  if (!apiKey) {
    console.error("API Key is missing");
    throw new Error("Google API Key is missing. Please check your environment variables.");
  }

  const prompt = `
    You are a Senior Healthcare QA Engineer specializing in FDA and HIPAA compliance.
    
    Analyze the following software requirement and generate comprehensive test cases.
    Ensure that the test cases cover positive flows, negative flows, and edge cases.
    Pay strict attention to the selected compliance standards: ${standards.join(', ')}.

    Requirement: "${requirement}"

    Generate 3-5 high-quality test cases.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: testCaseSchema,
        thinkingConfig: { thinkingBudget: 1024 } // Allow some reasoning for compliance checks
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response from AI model");
    }

    const parsed = JSON.parse(responseText);
    
    // Map the raw AI response to our application's typed objects
    const mappedCases: TestCase[] = parsed.testCases.map((tc: any, index: number) => ({
      ...tc,
      id: `tc-gen-${Date.now()}-${index}`,
      status: TestStatus.DRAFT,
      createdAt: new Date().toISOString(),
      traceabilityId: `REQ-${Math.floor(Math.random() * 1000)}` // Mock traceability ID
    }));

    return mappedCases;

  } catch (error) {
    console.error("Error generating test cases:", error);
    throw error;
  }
};
