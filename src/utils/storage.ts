
import { PrayerResult } from "@/types";

// Local storage keys
const USER_IP_KEY = 'user_ip';
const RESULTS_KEY = 'prayer_results';
const USAGE_COUNT_KEY = 'usage_count';
const USAGE_DATE_KEY = 'usage_date';
const LANGUAGE_KEY = 'selected_language';

// Get today's date as a string in YYYY-MM-DD format
const getTodayDateString = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

// Reset usage count if it's a new day
const checkAndResetDailyLimit = (): void => {
  const lastUsageDate = localStorage.getItem(USAGE_DATE_KEY);
  const todayDate = getTodayDateString();
  
  if (lastUsageDate !== todayDate) {
    localStorage.setItem(USAGE_COUNT_KEY, '0');
    localStorage.setItem(USAGE_DATE_KEY, todayDate);
    console.log('Reset daily usage count - new day detected');
  }
};

// Initialize usage tracking
export const initUsageTracking = async (): Promise<void> => {
  // Initialize usage count if not exists
  if (!localStorage.getItem(USAGE_COUNT_KEY)) {
    localStorage.setItem(USAGE_COUNT_KEY, '0');
  }
  
  // Initialize usage date if not exists
  if (!localStorage.getItem(USAGE_DATE_KEY)) {
    localStorage.setItem(USAGE_DATE_KEY, getTodayDateString());
  }
  
  // Check if we need to reset daily count
  checkAndResetDailyLimit();
  
  // Try to get user IP if not already stored
  if (!localStorage.getItem(USER_IP_KEY)) {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      localStorage.setItem(USER_IP_KEY, data.ip);
      console.log('User IP stored for usage tracking');
    } catch (error) {
      console.error('Error fetching IP:', error);
      // If IP fetching fails, use a random identifier as fallback
      const fallbackId = 'user_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem(USER_IP_KEY, fallbackId);
    }
  }
};

// Check if user has reached daily limit
export const hasReachedDailyLimit = (): boolean => {
  checkAndResetDailyLimit();
  const usageCount = parseInt(localStorage.getItem(USAGE_COUNT_KEY) || '0', 10);
  // MAXIMUM_DAILY_USAGE can be adjusted as needed - currently set to 3
  return usageCount >= 10;
};

// Get remaining daily usages
export const getRemainingUsages = (): number => {
  checkAndResetDailyLimit();
  const usageCount = parseInt(localStorage.getItem(USAGE_COUNT_KEY) || '0', 10);
  // MAXIMUM_DAILY_USAGE can be adjusted as needed - currently set to 3
  return Math.max(0, 10 - usageCount);
};

// Increment usage count
export const incrementUsageCount = (): void => {
  checkAndResetDailyLimit();
  const currentCount = parseInt(localStorage.getItem(USAGE_COUNT_KEY) || '0', 10);
  localStorage.setItem(USAGE_COUNT_KEY, (currentCount + 1).toString());
  console.log(`Incremented usage count to ${currentCount + 1}`);
};

// Save result to local storage
export const saveResult = (result: PrayerResult): void => {
  try {
    const savedResults = localStorage.getItem(RESULTS_KEY);
    const results: PrayerResult[] = savedResults ? JSON.parse(savedResults) : [];
    
    // Add new result at beginning of array
    results.unshift(result);
    
    // Limit to 10 most recent results
    const limitedResults = results.slice(0, 10);
    
    localStorage.setItem(RESULTS_KEY, JSON.stringify(limitedResults));
    console.log('Result saved to local storage');
  } catch (error) {
    console.error('Error saving result:', error);
  }
};

// Get saved results
export const getSavedResults = (): PrayerResult[] => {
  try {
    const savedResults = localStorage.getItem(RESULTS_KEY);
    return savedResults ? JSON.parse(savedResults) : [];
  } catch (error) {
    console.error('Error retrieving saved results:', error);
    return [];
  }
};

// Save selected language
export const saveLanguage = (langCode: string): void => {
  localStorage.setItem(LANGUAGE_KEY, langCode);
};

// Get selected language
export const getSavedLanguage = (): string | null => {
  return localStorage.getItem(LANGUAGE_KEY);
};

// User ID for tracking (IP address)
export const getUserId = (): string => {
  return localStorage.getItem(USER_IP_KEY) || 'unknown';
};

/* 
// PREMIUM VERSION IMPLEMENTATION NOTES:
// For implementing a premium version, you would:
// 1. Add a USER_TIER_KEY to store if the user is "free" or "premium"
// 2. Add functions to check or update the tier status
// 3. Modify the hasReachedDailyLimit function to have different limits based on tier
// 4. Add a payment processor integration

export const isPremiumUser = (): boolean => {
  return localStorage.getItem(USER_TIER_KEY) === 'premium';
};

export const hasReachedDailyLimit = (): boolean => {
  checkAndResetDailyLimit();
  const usageCount = parseInt(localStorage.getItem(USAGE_COUNT_KEY) || '0', 10);
  
  // Different limits based on user tier
  const maxUsage = isPremiumUser() ? 10 : 3;
  return usageCount >= maxUsage;
};

// You would also implement functions to handle payment processing and 
// activate premium status after successful payment
*/
