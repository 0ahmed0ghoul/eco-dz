import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to read JSON file
export const readJsonFile = async (filename) => {
  try {
    const filepath = path.join(__dirname, filename);
    const data = await fs.readFile(filepath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
};

// Helper to write JSON file
export const writeJsonFile = async (filename, data) => {
  try {
    const filepath = path.join(__dirname, filename);
    await fs.writeFile(filepath, JSON.stringify(data, null, 2));
  } catch (error) {
    throw error;
  }
};

// Places operations
export const getPlaces = async () => readJsonFile("places.json");
export const savePlaces = async (data) => writeJsonFile("places.json", data);

// Conversations operations
export const getConversations = async () => readJsonFile("conversations.json");
export const saveConversations = async (data) => writeJsonFile("conversations.json", data);

// Messages operations
export const getMessages = async () => readJsonFile("messages.json");
export const saveMessages = async (data) => writeJsonFile("messages.json", data);

// Support tickets operations
export const getSupportTickets = async () => readJsonFile("supportTickets.json");
export const saveSupportTickets = async (data) => writeJsonFile("supportTickets.json", data);

// Support messages operations
export const getSupportMessages = async () => readJsonFile("supportMessages.json");
export const saveSupportMessages = async (data) => writeJsonFile("supportMessages.json", data);

// Comments operations
export const getComments = async () => readJsonFile("comments.json");
export const saveComments = async (data) => writeJsonFile("comments.json", data);

// Comment replies operations
export const getCommentReplies = async () => readJsonFile("commentReplies.json");
export const saveCommentReplies = async (data) => writeJsonFile("commentReplies.json", data);

// Comment likes operations
export const getCommentLikes = async () => readJsonFile("commentLikes.json");
export const saveCommentLikes = async (data) => writeJsonFile("commentLikes.json", data);

// Reply likes operations
export const getReplyLikes = async () => readJsonFile("replyLikes.json");
export const saveReplyLikes = async (data) => writeJsonFile("replyLikes.json", data);

// Eco Tours operations
export const getEcoTours = async () => readJsonFile("ecoTours.json");
export const saveEcoTours = async (data) => writeJsonFile("ecoTours.json", data);

// Deal Destinations operations
export const getDealDestinations = async () => readJsonFile("dealDestinations.json");
export const saveDealDestinations = async (data) => writeJsonFile("dealDestinations.json", data);

// Family Packages operations
export const getFamilyPackages = async () => readJsonFile("familyPackages.json");
export const saveFamilyPackages = async (data) => writeJsonFile("familyPackages.json", data);

// Adventure Tours operations
export const getAdventureTours = async () => readJsonFile("adventureTours.json");
export const saveAdventureTours = async (data) => writeJsonFile("adventureTours.json", data);

// Accommodations operations
export const getAccommodations = async () => readJsonFile("accommodations.json");
export const saveAccommodations = async (data) => writeJsonFile("accommodations.json", data);

// Last Minute Deals operations
export const getLastMinute = async () => readJsonFile("lastMinute.json");
export const saveLastMinute = async (data) => writeJsonFile("lastMinute.json", data);

// Quizzes operations
export const getQuizzes = async () => readJsonFile("quizzes.json");
export const saveQuizzes = async (data) => writeJsonFile("quizzes.json", data);

// Green Transport operations
export const getTransport = async () => readJsonFile("greenTransport.json");
export const saveTransport = async (data) => writeJsonFile("greenTransport.json", data);

// Users operations
export const getUsers = async () => readJsonFile("users.json");
export const saveUsers = async (data) => writeJsonFile("users.json", data);

// Generate unique ID
export const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Trips operations
export const getTrips = async () => readJsonFile("trips.json");
export const saveTrips = async (data) => writeJsonFile("trips.json", data);

// Favorite Agencies operations
export const getFavoriteAgencies = async () => readJsonFile("favoriteAgencies.json");
export const saveFavoriteAgencies = async (data) => writeJsonFile("favoriteAgencies.json", data);

// Email Subscriptions operations
export const getEmailSubscriptions = async () => readJsonFile("emailSubscriptions.json");
export const saveEmailSubscriptions = async (data) => writeJsonFile("emailSubscriptions.json", data);
