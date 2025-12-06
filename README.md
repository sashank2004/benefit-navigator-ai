# AI-Powered Benefits Discovery Flow

A multi-screen web application where employees can describe a health-related need in free text, and AI automatically classifies it into a benefits category, recommends suitable benefits, and generates a simple step-by-step action plan.

## 1. Project Setup & Demo

### Live Demo
URL: https://aipoweredbenefitsdiscoveryflow.lovable.app/
Loom: https://www.loom.com/share/9034a9a48f164b9e9d2c22ceae27a7c2

### Run Locally
Ensure you have Node.js and npm installed.

git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm install
npm run dev

## 2. Problem Understanding

The objective is to help employees discover the right benefits based on natural-language input.

### Flow Steps
1. Screen 1 – User enters a health-related issue.
2. Screen 2 – AI classifies the input into categories such as Dental, Vision, OPD, Mental Health, with a loading animation.
3. Screen 3 – Displays 2–4 mock benefit cards based on the selected category.
4. Screen 4 – AI generates a 3-step action plan for availing the chosen benefit.

All benefits are static and fetched from mock JSON files.

## 3. AI Prompts & Iterations

### Initial Prompt
Classify the following text into Dental, OPD, Vision, Mental Health.

### Refined Classification Prompt
Return ONLY the category name from {Dental, OPD, Vision, Mental Health} that matches the text: "{user_input}". Nothing else.

### Action Plan Prompt
Generate steps explaining how an employee can avail the benefit titled "{benefit_title}". Keep the steps simple and clear.

### Fallback Prompt
Unrecognized — please rephrase your need.

A Regenerate option is provided to retry AI responses.

## 4. Architecture & Code Structure

### Project Structure Overview

The project follows a clean component-based architecture with separate folders for UI components, data, services, and serverless functions.

### Key Files & Responsibilities

### src/
- ActionPlan.tsx  
  - Displays the AI-generated 3-step action plan for the selected benefit.

- BenefitCard.tsx  
  - Reusable card component that shows benefit title, coverage, and description.

- BenefitInput.tsx  
  - Screen where the user enters a free-text health concern (e.g., “I have tooth pain”).

- BenefitList.tsx  
  - Displays 2–4 benefit cards based on the AI-classified category.

- LoadingClassifier.tsx  
  - Shows a loading animation while the AI processes and classifies the input.

- NavLink.tsx  
  - Small navigation/link helper component for internal routing.

- NoMatch.tsx  
  - Fallback screen for invalid routes.

### data/
- benefits.ts  
  - Contains mock JSON-like data for benefits across categories (Dental, OPD, Mental Health, Vision).
  - No real backend — benefits are statically loaded.

### services/
- aiService.ts  
  - Handles all AI interactions.
  - Includes:
    - Classification prompt logic  
    - Action-plan generation prompt  
    - Fallback handling for unrecognized input  
    - Regenerate response support  

### supabase/functions/benefits-ai/index.ts
- Serverless function that acts as an API endpoint for AI requests.
- Processes:
  - Classification requests  
  - Action-plan generation requests  
- Ensures prompt formatting and response parsing before returning structured output.

### App Flow
1. User enters text → BenefitInput.tsx  
2. AI classification → LoadingClassifier.tsx → BenefitList.tsx  
3. User selects a benefit → ActionPlan.tsx  
4. Supabase function + aiService.ts handle AI calls behind the scenes.

### Tech Stack
- React + TypeScript
- Vite
- Tailwind CSS
- shadcn-ui
- Supabase Edge Functions (for AI backend)


## 5. Demo Recording

Loom: https://www.loom.com/share/9034a9a48f164b9e9d2c22ceae27a7c2

## 6. Known Issues / Improvements

- Future improvements:
  - Add clarifying questions for uncertain inputs
  - Expand categories and mock data
  - Improve transitions and UX

## 7. Bonus Work

- Added loading animation
- Improved prompt engineering for consistent outputs
