import { getUsers, saveUsers, getTrips, saveTrips, getFavoriteAgencies, saveFavoriteAgencies, getEmailSubscriptions, saveEmailSubscriptions, generateId } from "../data/fileHelpers.js";
import nodemailer from "nodemailer";

// Switch user role to agency
export const switchToAgency = async (req, res) => {
  try {
    const userId = req.user.id;
    const { agencyName, description, contact } = req.body;

    const users = await getUsers();
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user to agency role
    user.role = "agency";
    user.agencyName = agencyName;
    user.agencyDescription = description || "";
    user.agencyContact = contact || user.email;
    user.updatedAt = new Date().toISOString();

    await saveUsers(users);

    res.json({ 
      message: "Successfully switched to agency role", 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        agencyName: user.agencyName
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error switching to agency", error: error.message });
  }
};

// Get user profile with role
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const users = await getUsers();
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role || "user",
      agencyName: user.agencyName || null,
      agencyDescription: user.agencyDescription || null,
      agencyContact: user.agencyContact || null
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};

// Create new trip (agency only)
export const createTrip = async (req, res) => {
  try {
    const userId = req.user.id;
    const users = await getUsers();
    const user = users.find(u => u.id === userId);

    if (!user || user.role !== "agency") {
      return res.status(403).json({ message: "Only agencies can create trips" });
    }

    const { title, description, destination, duration, price, activities, maxParticipants, startDate, image } = req.body;

    const newTrip = {
      id: generateId(),
      agencyId: userId,
      agencyName: user.agencyName,
      title,
      description,
      destination,
      duration,
      price: parseFloat(price),
      image: image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400",
      activities: activities || [],
      maxParticipants: parseInt(maxParticipants),
      currentParticipants: 0,
      startDate,
      createdAt: new Date().toISOString(),
      rating: 0,
      reviews: 0
    };

    const trips = await getTrips();
    trips.push(newTrip);
    await saveTrips(trips);

    // Send emails to subscribers
    await notifySubscribers(userId, user.agencyName, newTrip);

    res.status(201).json({ 
      message: "Trip created successfully", 
      trip: newTrip 
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating trip", error: error.message });
  }
};

// Get all trips
export const getAllTrips = async (req, res) => {
  try {
    const trips = await getTrips();
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trips", error: error.message });
  }
};

// Get trips by agency
export const getTripsByAgency = async (req, res) => {
  try {
    const { agencyId } = req.params;
    const trips = await getTrips();
    const agencyTrips = trips.filter(t => t.agencyId === agencyId);
    res.json(agencyTrips);
  } catch (error) {
    res.status(500).json({ message: "Error fetching agency trips", error: error.message });
  }
};

// Get single trip
export const getTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const trips = await getTrips();
    const trip = trips.find(t => t.id === tripId);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trip", error: error.message });
  }
};

// Add agency to favorites
export const addFavoriteAgency = async (req, res) => {
  try {
    const userId = req.user.id;
    const { agencyId } = req.body;

    const users = await getUsers();
    const agency = users.find(u => u.id === agencyId && u.role === "agency");

    if (!agency) {
      return res.status(404).json({ message: "Agency not found" });
    }

    const favorites = await getFavoriteAgencies();
    const exists = favorites.find(f => f.userId === userId && f.agencyId === agencyId);

    if (exists) {
      return res.status(400).json({ message: "Already favorited" });
    }

    const newFavorite = {
      id: generateId(),
      userId,
      agencyId,
      agencyName: agency.agencyName,
      createdAt: new Date().toISOString()
    };

    favorites.push(newFavorite);
    await saveFavoriteAgencies(favorites);

    // Create email subscription automatically
    const subscriptions = await getEmailSubscriptions();
    const subExists = subscriptions.find(s => s.userId === userId && s.agencyId === agencyId);

    if (!subExists) {
      const newSub = {
        id: generateId(),
        userId,
        agencyId,
        agencyName: agency.agencyName,
        emailNotifications: true,
        unsubscribeToken: generateId(),
        createdAt: new Date().toISOString()
      };
      subscriptions.push(newSub);
      await saveEmailSubscriptions(subscriptions);
    }

    res.status(201).json({ message: "Agency added to favorites", favorite: newFavorite });
  } catch (error) {
    res.status(500).json({ message: "Error adding favorite", error: error.message });
  }
};

// Remove agency from favorites
export const removeFavoriteAgency = async (req, res) => {
  try {
    const userId = req.user.id;
    const { agencyId } = req.params;

    const favorites = await getFavoriteAgencies();
    const filtered = favorites.filter(f => !(f.userId === userId && f.agencyId === agencyId));

    if (favorites.length === filtered.length) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    await saveFavoriteAgencies(filtered);
    res.json({ message: "Removed from favorites" });
  } catch (error) {
    res.status(500).json({ message: "Error removing favorite", error: error.message });
  }
};

// Get user's favorite agencies
export const getUserFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const favorites = await getFavoriteAgencies();
    const userFavorites = favorites.filter(f => f.userId === userId);
    res.json(userFavorites);
  } catch (error) {
    res.status(500).json({ message: "Error fetching favorites", error: error.message });
  }
};

// Toggle email subscription
export const toggleEmailSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const { agencyId } = req.body;

    const subscriptions = await getEmailSubscriptions();
    const sub = subscriptions.find(s => s.userId === userId && s.agencyId === agencyId);

    if (!sub) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    sub.emailNotifications = !sub.emailNotifications;
    sub.updatedAt = new Date().toISOString();

    await saveEmailSubscriptions(subscriptions);

    res.json({ 
      message: "Email subscription updated", 
      subscription: sub 
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating subscription", error: error.message });
  }
};

// Unsubscribe from emails (using token - no auth needed)
export const unsubscribeFromEmails = async (req, res) => {
  try {
    const { token } = req.params;

    const subscriptions = await getEmailSubscriptions();
    const sub = subscriptions.find(s => s.unsubscribeToken === token);

    if (!sub) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    sub.emailNotifications = false;
    sub.unsubscribedAt = new Date().toISOString();

    await saveEmailSubscriptions(subscriptions);

    res.json({ message: "Successfully unsubscribed from emails" });
  } catch (error) {
    res.status(500).json({ message: "Error unsubscribing", error: error.message });
  }
};

// Get user's email subscriptions
export const getUserSubscriptions = async (req, res) => {
  try {
    const userId = req.user.id;
    const subscriptions = await getEmailSubscriptions();
    const userSubs = subscriptions.filter(s => s.userId === userId);
    res.json(userSubs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subscriptions", error: error.message });
  }
};

// Helper function to notify subscribers
async function notifySubscribers(agencyId, agencyName, trip) {
  try {
    const subscriptions = await getEmailSubscriptions();
    const users = await getUsers();
    
    // Get all subscribers for this agency
    const subscribers = subscriptions.filter(
      s => s.agencyId === agencyId && s.emailNotifications === true
    );

    // Simulate sending emails (in production, use real email service)
    for (const sub of subscribers) {
      const subscriber = users.find(u => u.id === sub.userId);
      if (subscriber) {
        console.log(`📧 Email sent to ${subscriber.email}:`);
        console.log(`   Subject: New trip from ${agencyName}!`);
        console.log(`   Trip: ${trip.title} - ${trip.destination}`);
        console.log(`   Price: $${trip.price} | Duration: ${trip.duration}`);
        console.log(`   Unsubscribe: /api/agency/unsubscribe/${sub.unsubscribeToken}`);
        console.log("---");
      }
    }
  } catch (error) {
    console.error("Error notifying subscribers:", error);
  }
}
