const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const OpenAI = require("openai");

admin.initializeApp();
const OPENAI_API_KEY = defineSecret("OPENAI_API_KEY");

exports.generateHistoryRailwayContent = onCall(
  { region: "asia-northeast1", secrets: [OPENAI_API_KEY], timeoutSeconds: 60 },
  async (request) => {
    const data = request.data || {};
    const theme = String(data.theme || "").slice(0, 100);
    const grade = String(data.grade || "").slice(0, 30);
    const difficulty = String(data.difficulty || "").slice(0, 20);

    if (!theme || !grade || !difficulty) {
      throw new HttpsError("invalid-argument", "テーマ・対象学年・難易度が必要です。");
    }

    const client = new OpenAI({ apiKey: OPENAI_API_KEY.value() });
    const prompt = [
      "あなたは日本の学校授業向け教材作成者です。",
      "10分で遊ぶ教育用すごろく『歴史鉄道』のデータを作成してください。",
      `テーマ: ${theme}`,
      `対象: ${grade}`,
      `難易度: ${difficulty}`,
      "事実関係を優先し、曖昧な問題は作らないでください。",
      "クイズは4択で正解は必ず1つ。誤答も時代・分野として不自然すぎないものにしてください。",
      "金額は1000〜10000の範囲を基本とし、授業ゲームとして極端な差を作らないでください。"
    ].join("\n");

    const schema = {
      name: "history_railway_content",
      schema: {
        type: "object",
        additionalProperties: false,
        required: ["quizzes", "finalQuiz", "events", "properties", "destinations"],
        properties: {
          quizzes: {
            type: "array", minItems: 10, maxItems: 10,
            items: {
              type: "object", additionalProperties: false,
              required: ["question", "choices", "correctIndex", "explanation"],
              properties: {
                question: { type: "string" },
                choices: { type: "array", minItems: 4, maxItems: 4, items: { type: "string" } },
                correctIndex: { type: "integer", minimum: 0, maximum: 3 },
                explanation: { type: "string" }
              }
            }
          },
          finalQuiz: {
            type: "object", additionalProperties: false,
            required: ["question", "choices", "correctIndex", "explanation"],
            properties: {
              question: { type: "string" },
              choices: { type: "array", minItems: 4, maxItems: 4, items: { type: "string" } },
              correctIndex: { type: "integer", minimum: 0, maximum: 3 },
              explanation: { type: "string" }
            }
          },
          events: {
            type: "array", minItems: 5, maxItems: 5,
            items: {
              type: "object", additionalProperties: false,
              required: ["title", "description", "effectType", "amount"],
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                effectType: { type: "string", enum: ["gain", "loss", "global_gain", "global_loss"] },
                amount: { type: "integer", minimum: -10000, maximum: 10000 }
              }
            }
          },
          properties: {
            type: "array", minItems: 6, maxItems: 12,
            items: {
              type: "object", additionalProperties: false,
              required: ["name", "location", "price", "value"],
              properties: {
                name: { type: "string" }, location: { type: "string" },
                price: { type: "integer", minimum: 1000, maximum: 10000 },
                value: { type: "integer", minimum: 1000, maximum: 15000 }
              }
            }
          },
          destinations: { type: "array", minItems: 5, maxItems: 10, items: { type: "string" } }
        }
      }
    };

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: prompt,
      text: { format: { type: "json_schema", ...schema, strict: true } }
    });

    let content;
    try {
      content = JSON.parse(response.output_text);
    } catch {
      throw new HttpsError("internal", "AI生成結果の読み取りに失敗しました。");
    }
    return { content };
  }
);
