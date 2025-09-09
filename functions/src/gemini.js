const functions = require("firebase-functions");

exports.generateText = functions.https.onCall(async (data, context) => {
  const { prompt } = data;
  if (!prompt) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with one argument 'prompt' containing the text to process."
    );
  }

  try {
    const { generateText } = await import("../../src/lib/gemini.js");
    const result = await generateText(prompt);
    return result;
  } catch (error) {
    console.error("Error in generateText cloud function:", error);
    throw new functions.https.HttpsError(
      "internal",
      "An error occurred while generating text."
    );
  }
});
