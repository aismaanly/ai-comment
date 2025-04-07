const aiPrompt = (postDescription: string, model: string) => {
  return `You're a casual social media user reacting to a post on your feed. Based on the description below, generate a few natural, human-like comments that real people might leave under the post.

Guidelines:
- Generate 3 unique comments, varying the number naturally to make it feel organic.
- Each comment should have its own tone — curious, funny, supportive, relatable, etc.
- Use casual, everyday language. Make it feel like something a real person would type on their phone.
- Avoid sounding robotic or overly scripted. Keep it light, friendly, or witty when needed.
- Emojis are optional — use them occasionally, only if it feels natural to the tone.
- Avoid overly generic praise. Make comments that specifically respond to the content of the post.

Post description: "${postDescription}${postDescription.slice(-1) === "." ? "" : "."}"

Use the ${model} model to generate the comments.`;
};

export default aiPrompt;