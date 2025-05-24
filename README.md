# AI-Powered RFP/RFQ Lifecycle Automation
AI-powered document management system automating RFP, RFQ, Proposal, and Quotation creation using GPT-4. Features multi-agent architecture, real-time collaboration, and PDF export. Built with React, TypeScript, and Tailwind CSS. Streamlines document workflow for business teams.
# Document management system

A modern document management system for creating and managing RFP, Proposal, RFQ, and Quotation documents.

## Features

- AI-powered document generation
- Real-time collaboration
- Document preview and editing
- PDF export functionality
- Dark mode support
- Responsive design

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up OpenAI API key:
   - Create a `.env` file in the project root
   - Add your OpenAI API key:
     ```
     VITE_OPENAI_API_KEY=sk-your-api-key-here
     ```
   - Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Key Security

- Never commit your `.env` file to version control
- Keep your API key secure and don't share it publicly
- The API key is used for generating document content using OpenAI's GPT-4 model
- API calls are made securely with proper error handling

## Usage

1. Navigate to the Documents page
2. Select the type of document you want to create
3. Use the "Generate Content" button to create AI-powered content
4. Edit and customize the generated content as needed
5. Download the final document as PDF

## Error Handling

The system includes comprehensive error handling for API calls:
- API key validation
- Network error handling
- Rate limiting protection
- Detailed error messages

## Development

Built with:
- React
- TypeScript
- Tailwind CSS
- OpenAI API
- Vite 
