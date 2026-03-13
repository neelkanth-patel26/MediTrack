export interface Message {
  id: string
  sender_id: string
  recipient_id: string
  content: string
  created_at: string
  read: boolean
  sender_name?: string
  sender_avatar?: string
}

export interface Conversation {
  id: string
  participant_id: string
  participant_name: string
  participant_avatar?: string
  last_message?: string
  last_message_time?: string
  unread_count: number
}

// Mock message data for development
const MOCK_MESSAGES: Record<string, Message[]> = {
  'patient-doctor': [
    {
      id: '1',
      sender_id: '3',
      recipient_id: '2',
      content: "Hi Dr. Smith, I've been experiencing frequent headaches lately.",
      created_at: new Date(Date.now() - 3600000).toISOString(),
      read: true,
      sender_name: 'John Patient',
      sender_avatar: '👨‍🦱',
    },
    {
      id: '2',
      sender_id: '2',
      recipient_id: '3',
      content: "I see. Let me schedule an appointment with you to discuss this further. How's your availability next week?",
      created_at: new Date(Date.now() - 1800000).toISOString(),
      read: true,
      sender_name: 'Dr. Smith',
      sender_avatar: '👨‍⚕️',
    },
    {
      id: '3',
      sender_id: '3',
      recipient_id: '2',
      content: 'I can do Tuesday or Wednesday afternoon.',
      created_at: new Date(Date.now() - 900000).toISOString(),
      read: false,
      sender_name: 'John Patient',
      sender_avatar: '👨‍🦱',
    },
  ],
}

export class MessagingService {
  // Fetch conversations for a user
  static async getConversations(userId: string): Promise<Conversation[]> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Mock conversations based on role
    return [
      {
        id: '1',
        participant_id: '2',
        participant_name: 'Dr. Smith',
        participant_avatar: '👨‍⚕️',
        last_message: 'Tuesday or Wednesday afternoon works for me.',
        last_message_time: new Date(Date.now() - 900000).toISOString(),
        unread_count: 0,
      },
      {
        id: '2',
        participant_id: '4',
        participant_name: 'Dr. Johnson',
        participant_avatar: '👨‍⚕️',
        last_message: 'Your test results look good!',
        last_message_time: new Date(Date.now() - 86400000).toISOString(),
        unread_count: 0,
      },
    ]
  }

  // Fetch messages between two users
  static async getMessages(userId: string, otherUserId: string): Promise<Message[]> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300))

    return MOCK_MESSAGES['patient-doctor'] || []
  }

  // Send a message
  static async sendMessage(senderId: string, recipientId: string, content: string): Promise<Message> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newMessage: Message = {
      id: Math.random().toString(),
      sender_id: senderId,
      recipient_id: recipientId,
      content,
      created_at: new Date().toISOString(),
      read: false,
    }

    // Add to mock data
    if (!MOCK_MESSAGES['patient-doctor']) {
      MOCK_MESSAGES['patient-doctor'] = []
    }
    MOCK_MESSAGES['patient-doctor'].push(newMessage)

    return newMessage
  }

  // Mark messages as read
  static async markAsRead(messageIds: string[]): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 200))

    messageIds.forEach((id) => {
      for (const key in MOCK_MESSAGES) {
        const message = MOCK_MESSAGES[key].find((m) => m.id === id)
        if (message) {
          message.read = true
        }
      }
    })
  }

  // Delete a message
  static async deleteMessage(messageId: string): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 200))

    for (const key in MOCK_MESSAGES) {
      MOCK_MESSAGES[key] = MOCK_MESSAGES[key].filter((m) => m.id !== messageId)
    }
  }
}
