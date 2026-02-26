export const COACH_KEYWORD_RESPONSES: { keywords: string[]; response: string }[] = [
  {
    keywords: ['hello', 'hi', 'hey', 'start'],
    response:
      "Hey! \u{1F4AA} I'm your AI Coach. Ask me about workouts, nutrition, recovery, or motivation. What's on your mind?",
  },
  {
    keywords: ['motivation', 'motivated', 'lazy', "don't want to"],
    response:
      "Remember: you don't have to be motivated to show up. Discipline beats motivation every time. The best workout is the one you almost skipped. What's holding you back today?",
  },
  {
    keywords: ['sore', 'soreness', 'doms', 'recovery'],
    response:
      'Soreness means your muscles are adapting. Make sure you\'re sleeping 7-9 hours, eating enough protein (1.6-2.2g per kg bodyweight), and staying hydrated. Light movement and stretching can help. If pain is sharp or in joints, take a rest day.',
  },
  {
    keywords: ['protein', 'nutrition', 'eat', 'diet', 'food', 'meal'],
    response:
      "For muscle growth, aim for 1.6-2.2g protein per kg bodyweight daily. Spread it across 3-5 meals. Good sources: chicken, eggs, Greek yogurt, lentils, fish, whey protein. Don't neglect carbs \u2014 they fuel your workouts.",
  },
  {
    keywords: ['plateau', 'stuck', 'not progressing', 'stalled'],
    response:
      'Plateaus are normal. Try these: (1) Increase volume \u2014 add 1 set per exercise. (2) Change rep ranges \u2014 if doing 8-12, try 5-8 heavier. (3) Improve sleep and nutrition. (4) Deload for a week at 50-60% intensity, then come back.',
  },
  {
    keywords: ['beginner', 'new', 'starting', 'first time'],
    response:
      'Welcome! Start with compound movements: squat, bench press, deadlift, overhead press, rows. 3x per week, 3 sets of 8-12 reps. Focus on form over weight. Increase weight by the smallest increment when you hit the top of your rep range for all sets.',
  },
  {
    keywords: ['progressive overload', 'overload', 'progress'],
    response:
      "Progressive overload is THE key to growth. Each session, try to beat your last performance: more weight, more reps, or more sets. Even 1 extra rep counts. Track everything \u2014 that's what this app is for.",
  },
  {
    keywords: ['rest', 'rest day', 'off day'],
    response:
      'Rest days are when you grow. Your muscles repair and get stronger during rest, not during the workout. Take at least 1-2 full rest days per week. Active recovery (walking, light stretching) is great on off days.',
  },
  {
    keywords: ['warm up', 'warmup', 'stretch'],
    response:
      'Always warm up: 5 min light cardio, then 2-3 warm-up sets with lighter weight for your first exercise. Dynamic stretches before training, static stretches after. Never skip the warm-up \u2014 injury prevention is progress protection.',
  },
  {
    keywords: ['sleep', 'tired', 'fatigue', 'exhausted'],
    response:
      'Sleep is the most underrated performance enhancer. Aim for 7-9 hours. Tips: consistent bed time, no screens 30 min before bed, cool dark room, limit caffeine after 2 PM. Poor sleep = poor recovery = poor gains.',
  },
  {
    keywords: ['form', 'technique', 'how to'],
    response:
      "Good form is non-negotiable. Check the Exercise Catalog in this app for video demonstrations. Key rules: control the weight, full range of motion, don't ego lift. When in doubt, lower the weight and nail the movement pattern.",
  },
  {
    keywords: ['weight loss', 'lose weight', 'cut', 'fat loss'],
    response:
      "Fat loss = caloric deficit. Track your calories and aim for 300-500 cal below maintenance. Keep protein high to preserve muscle. Lift heavy \u2014 don't switch to 'light weight high reps' for fat loss. Cardio helps but diet is king.",
  },
  {
    keywords: ['bulk', 'gain weight', 'mass', 'muscle gain'],
    response:
      'For a lean bulk, eat 200-400 cal above maintenance. Prioritize protein (1.6-2.2g/kg). Train hard with progressive overload, focus on compound lifts. Expect to gain 0.5-1kg per month. More than that is likely excess fat.',
  },
]

export const COACH_DEFAULT_RESPONSE =
  "I'm not sure I understand that fully. Try asking me about: workouts, nutrition, recovery, progressive overload, motivation, or common training questions. I'm here to help!"

export const COACH_SYSTEM_PROMPT = `You are IronLog AI Coach, an expert fitness and strength training assistant built into the IronLog workout tracker app. Your role:

- Give practical, evidence-based advice on training, nutrition, recovery, and motivation
- Be concise: respond in 2-4 paragraphs max unless the user asks for detail
- Use a direct, encouraging but not fake-cheerful tone
- Reference progressive overload principles when relevant
- When asked about exercises, recommend checking the app's Exercise Catalog
- Never give medical advice \u2014 recommend seeing a doctor for injuries or health concerns
- If the user shares their workout data, analyze it and give specific feedback
- Use metric units (kg, cm) by default`

export const COACH_QUICK_REPLIES = [
  'How do I start?',
  'Help with plateau',
  'Nutrition tips',
]

export const MOOD_EMOJIS: Record<number, string> = {
  1: '\u{1F61E}',
  2: '\u{1F615}',
  3: '\u{1F610}',
  4: '\u{1F642}',
  5: '\u{1F604}',
}

export const EXERCISE_CATEGORIES = [
  'All',
  'Chest',
  'Back',
  'Shoulders',
  'Arms',
  'Legs',
  'Core',
  'Cardio',
  'Full-body',
] as const

export const DEFAULT_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions'
export const DEFAULT_API_MODEL = 'gpt-3.5-turbo'
