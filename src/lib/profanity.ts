// A simple list of words to block.
// In a real application, you would want to use a more robust library 
// or service for profanity filtering.
const badWords = [
    'darn', 'heck', 'gosh', 'shoot', 'frak',
    'ass', 'asshole', 'bastard', 'bitch', 'crap', 'cunt', 'damn', 'dick', 'douche',
    'fag', 'fuck', 'hell', 'motherfucker', 'piss', 'pussy', 'shit', 'slut', 'twat', 'whore'
];

// Words that may be sensitive in the context of remembrance or well-wishes
const sensitiveWords = [
    'kill', 'die', 'murder', 'suicide', 'hate'
];

const blocklist = [...badWords, ...sensitiveWords].map(word => word.toLowerCase());

/**
 * Checks if a given text contains any words from the blocklist.
 * This is a simple implementation that checks for whole words.
 * @param text The text to check.
 * @returns True if the text contains profanity, false otherwise.
 */
export function containsProfanity(text: string): boolean {
    if (!text) return false;

    // Create a regex to match whole words from the blocklist, case-insensitively.
    // The \b assertions ensure that we match whole words only (e.g., "ass" but not "classic").
    const regex = new RegExp(`\\b(${blocklist.join('|')})\\b`, 'gi');
    
    return regex.test(text);
}
