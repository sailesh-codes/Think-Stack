# Quiz Generator

An AI-powered quiz generation application built with React and OpenAI API that creates personalized quizzes based on user-selected topics and difficulty levels.

## Features

- **AI-Powered Quiz Generation**: Uses OpenAI's GPT-4 model to generate intelligent, topic-specific questions
- **Multiple Difficulty Levels**: Easy, Medium, Hard, and Expert levels with varying question counts
- **Content Moderation**: Built-in content moderation using OpenAI's moderation API
- **Interactive UI**: Modern, responsive design with smooth animations
- **Real-time Feedback**: Toast notifications for user actions and API responses
- **Fallback System**: Sample questions when API is unavailable

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quiz-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Add your OpenAI API key to the `.env` file:
   ```env
   VITE_OPENAI_API_KEY=your_actual_openai_api_key_here
   ```

4. **Get OpenAI API Key**
   
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create an account or sign in
   - Generate a new API key
   - Copy the key to your `.env` file

5. **Start the development server**
   ```bash
   npm start
   ```

   The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Generate a Quiz**
   - Enter a topic of interest
   - Select difficulty level (Easy, Medium, Hard, Expert)
   - Wait for AI-generated questions
   - Take the quiz with the interactive interface

2. **Difficulty Levels**
   - **Easy**: 5 questions, 5-minute time limit
   - **Medium**: 10 questions, 10-minute time limit
   - **Hard**: 15 questions, 15-minute time limit
   - **Expert**: 20 questions, 20-minute time limit

3. **Features**
   - Real-time question generation using OpenAI
   - Content moderation for appropriate topics
   - Progress tracking and timer
   - Detailed explanations for each answer
   - Score calculation and performance metrics

## Technical Details

### Core Technologies

- **React 18**: Frontend framework with hooks
- **Vite**: Build tool and development server
- **Tailwind CSS**: Styling framework
- **Framer Motion**: Animation library
- **OpenAI API**: AI-powered content generation
- **React Router**: Client-side routing

### Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Main application pages
├── services/           # API integration and business logic
├── hooks/              # Custom React hooks
├── styles/             # Global styles and Tailwind configuration
└── utils/              # Utility functions
```

### API Integration

The application integrates with OpenAI API using:
- **Chat Completions**: For quiz question generation
- **Structured Outputs**: Ensures consistent JSON response format
- **Moderation API**: Content safety and appropriateness checking

## Troubleshooting

### Common Issues

1. **Quiz not generating after selecting difficulty**
   - Check if `VITE_OPENAI_API_KEY` is set in `.env` file
   - Verify API key is valid on OpenAI platform
   - Check browser console for error messages

2. **API Key Issues**
   - Ensure the API key starts with `sk-`
   - Verify you have sufficient OpenAI credits
   - Check for any usage limits or restrictions

3. **Build Issues**
   - Run `npm install` to ensure all dependencies are installed
   - Clear cache: `rm -rf node_modules package-lock.json && npm install`

### Environment Variables

Required environment variables:

```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

**Important**: Never commit the `.env` file to version control. The `.env.example` file serves as a template.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.