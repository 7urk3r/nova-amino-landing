// Simple Node.js script to test Perplexity API
require('dotenv').config();

async function searchPerplexity(query, model = 'sonar-pro') {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  
  if (!apiKey || apiKey === 'your_api_key_here') {
    console.error('❌ Please add your Perplexity API key to the .env file');
    console.log('Edit the .env file and replace "your_api_key_here" with your actual API key');
    return;
  }

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'user', content: query }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices[0]?.message?.content || 'No response received';
    
    console.log(`\n🔍 Query: ${query}`);
    console.log(`🤖 Model: ${model}`);
    console.log(`📝 Response:\n${result}\n`);
    
    return result;
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Get command line arguments
const args = process.argv.slice(2);
const query = args[0];
const model = args[1] || 'sonar-pro';

if (!query) {
  console.log('Usage: node search.js "your search query" [model]');
  console.log('Models: sonar, sonar-pro, sonar-reasoning, sonar-reasoning-pro, sonar-deep-research');
  console.log('Example: node search.js "inspiring quotes about science" sonar-pro');
} else {
  searchPerplexity(query, model);
}
