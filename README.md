# 🤖 SWASTIK - AI Orchestration Agent

**Smart customer service automation powered by multi-agent AI orchestration**

SWASTIK is an intelligent customer service agent that automatically analyzes customer inquiries and generates structured responses with proper categorization, priority assessment, and professional replies.

![SWASTIK Demo](https://via.placeholder.com/800x400/1f2937/white?text=SWASTIK+AI+Agent)

## ✨ Features

- 🎯 **Instant Issue Analysis** - Automatically categorizes and prioritizes customer inquiries
- 📊 **Smart Sentiment Detection** - Identifies customer emotions and urgency levels  
- 🎫 **Ticket Management** - Generates structured ticket information
- ✍️ **Professional Responses** - Creates empathetic, solution-focused customer replies
- ⚡ **Fast Processing** - Responses generated in under 4 seconds
- 🔄 **Reliable Fallbacks** - Ensures consistent service availability

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/swastik-agent.git
cd swastik-agent
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the application**
```bash
npm run dev
```

4. **Open in browser**
Navigate to `http://localhost:5173`

## 🛠️ Usage

### Basic Operation

1. **Enter Customer Message**: Paste any customer service inquiry into the chat interface
2. **AI Analysis**: SWASTIK automatically analyzes the message for:
   - Issue summary and categorization
   - Priority and urgency assessment  
   - Customer sentiment analysis
3. **Structured Response**: Receive formatted output including:
   - Issue categorization
   - Suggested customer reply
   - Ticket information

### Example Input
```
Customer charged twice for order #7789 and demanding immediate refund!
```

### Example Output
```
Issue summary: Double payment for order #7789
Category: billing
Priority: high
Urgent: Yes
Sentiment: frustrated

Ticket

ID: N/A
Status: N/A
Action taken: N/A

Suggested reply to customer

Dear valued customer,

I apologize for the inconvenience with your order #7789. I understand your frustration regarding the double charge, and I'm here to help resolve this immediately.

Our billing team will process your refund within 24 hours, and you'll receive a confirmation email once completed.

Thank you for your patience and understanding.

Sincerely,
SWASTIK Support Team
```

## 🏗️ Project Structure

```
src/
├── components/           # React components
├── api/                 # AI integration services
├── styles/              # CSS and styling
├── App.tsx             # Main application
└── main.tsx            # Entry point
```

## 🎨 Customization

### Categories
Supported issue categories:
- `billing` - Payment and invoice issues
- `technical` - Product functionality problems  
- `account` - User account management
- `product` - Product inquiries and feedback
- `other` - General inquiries

### Priority Levels
- `low` - Standard inquiries
- `medium` - Important issues requiring attention
- `high` - Urgent problems affecting service
- `critical` - Emergency situations

## 📦 Build & Deploy

### Development Build
```bash
npm run build
```

### Production Deployment

**Vercel**
```bash
npm install -g vercel
vercel --prod
```

**Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🧪 Testing

Run the development server and test with various customer service scenarios:

- Billing complaints
- Technical support requests  
- Product inquiries
- Account issues
- Urgent escalations

## 🏆 Hackathon Submission

### Problem Statement
Customer service teams spend significant time manually categorizing, prioritizing, and crafting responses to customer inquiries, leading to slower response times and inconsistent service quality.

### Solution
SWASTIK automates the entire customer service workflow using AI orchestration:
- Intelligent issue categorization
- Automatic priority and sentiment assessment
- Professional response generation
- Structured ticket management

### Technical Stack
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **AI Integration**: Multi-agent orchestration system
- **Deployment**: Production-ready build system

### Innovation
- Multi-agent AI coordination for comprehensive analysis
- Real-time sentiment and urgency detection
- Consistent, professional response templates
- Intelligent fallback systems for reliability

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📞 Support

For questions and support:
- 📧 Email: support@swastik-ai.com
- 💬 Discord: [SWASTIK Community](https://discord.gg/swastik)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/swastik-agent/issues)

---

**Built with ❤️ for better customer service automation**