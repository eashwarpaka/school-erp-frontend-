export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export class ChatbotService {
  /**
   * Simulates a conversation turn with the AI chatbot.
   * Hands off to a human agent if confidence is too low.
   */
  static async sendMessage(
    message: string,
    history: ChatMessage[],
    userContext: any
  ): Promise<{ reply: string; confidence: number; escalated: boolean }> {
    console.log('[ChatbotService] Sending message:', message, userContext);
    
    // Simulate latency
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const lowerMsg = message.toLowerCase();

    // Mock scenario: Fee balance
    if (lowerMsg.includes('fee') || lowerMsg.includes('balance') || lowerMsg.includes('due')) {
      return {
        reply: 'Your current outstanding fee balance is $450.00, due on the 15th of next month. Would you like me to send you the payment link?',
        confidence: 0.95,
        escalated: false,
      };
    }

    // Mock scenario: Timetable / PTA
    if (lowerMsg.includes('pta') || lowerMsg.includes('meeting')) {
      return {
        reply: 'The next Parent-Teacher Association (PTA) meeting is scheduled for Friday, October 12th at 4:00 PM in the Main Auditorium.',
        confidence: 0.9,
        escalated: false,
      };
    }

    // Mock scenario: Complex/Unknown -> Escalation
    if (lowerMsg.includes('bullying') || lowerMsg.includes('complaint') || lowerMsg.includes('issue')) {
      return {
        reply: 'I understand this is a sensitive matter. I am escalating this conversation to a human counselor/administrator immediately. Please hold on.',
        confidence: 0.3, // Below threshold
        escalated: true,
      };
    }

    // Default response
    return {
      reply: 'I am the Smart School Assistant. I can help you with fees, timetables, attendance, and notices. How can I help you today?',
      confidence: 0.8,
      escalated: false,
    };
  }
}
