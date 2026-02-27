import type { NextApiRequest, NextApiResponse } from 'next';
import { AIService } from '../../services/AIService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const aiService = new AIService();
    const response = await aiService.processMessage(message);

    return res.status(200).json(response);
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'Failed to process message' });
  }
}
