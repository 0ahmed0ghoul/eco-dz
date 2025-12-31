import {
  getUsers,
  saveUsers,
  getTrips,
  saveTrips,
  getFavoriteAgencies,
  saveFavoriteAgencies,
  getEmailSubscriptions,
  saveEmailSubscriptions,
  generateId
} from "../data/fileHelpers.js";

// ===============================
// SWITCH USER TO AGENCY
// ===============================
export const switchToAgency = async (req, res) => {
  try {
    const userId = req.user.id;
    const { agencyName, description, contact } = req.body;
    const image = req.file;

    const users = await getUsers();
    let user = users.find(u => u.id === userId);

    // If user doesn't exist in backend, create them from the request
    if (!user) {
      user = {
        id: userId,
        email: req.user.email,
        username: agencyName || "User",
        role: "user",
        createdAt: new Date().toISOString()
      };
      users.push(user);
    }

    // Convert image to base64 (store in JSON)
    let agencyImage = null;
    if (image) {
      const base64 = image.buffer.toString("base64");
      const mime = image.mimetype || "image/jpeg";
      agencyImage = `data:${mime};base64,${base64}`;
    }

    user.role = "agency";
    user.agencyName = agencyName || user.username || "My Agency";
    user.agencyDescription = description || "Travel Agency";
    user.agencyContact = contact || user.email;
    user.agencyImage = agencyImage || user.agencyImage;
    user.updatedAt = new Date().toISOString();

    await saveUsers(users);

    res.json({
      message: "Switched to agency successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        agencyName: user.agencyName,
        agencyImage: user.agencyImage
      }
    });
  } catch (error) {
    console.error("Switch to agency error:", error);
    res.status(500).json({ message: "Error switching to agency", error: error.message });
  }
};

// ===============================
// UPDATE AGENCY PROFILE PICTURE
// ===============================
export const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    const image = req.file;

    if (!image) {
      return res.status(400).json({ message: "No image provided" });
    }

    const users = await getUsers();
    const user = users.find(u => u.id === userId);

    if (!user || user.role !== "agency") {
      return res.status(403).json({ message: "Only agencies can update their profile picture" });
    }

    // Convert image to base64
    const base64 = image.buffer.toString("base64");
    const mime = image.mimetype || "image/jpeg";
    const agencyImage = `data:${mime};base64,${base64}`;

    user.agencyImage = agencyImage;
    user.updatedAt = new Date().toISOString();

    await saveUsers(users);

    res.json({
      message: "Profile picture updated successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        agencyName: user.agencyName,
        agencyImage: user.agencyImage
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile picture", error: error.message });
  }
};

// ===============================
// GET USER PROFILE
// ===============================
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const users = await getUsers();
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.json({
        id: userId,
        username: req.user.username || "User",
        email: req.user.email || "",
        role: "user"
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};

// ===============================
// CREATE TRIP (AGENCY ONLY)
// ===============================
export const createTrip = async (req, res) => {
  try {
    // Use authenticated user's agency
    const userId = req.user.id;
    const users = await getUsers();
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ message: "Agency not found" });
    }

    const {
      title,
      description,
      destination,
      duration,
      price,
      activities,
      maxParticipants,
      startDate
    } = req.body;

    const images = req.files || [];

    // Convert images to base64
    let tripImages = [];
    if (images && images.length > 0) {
      tripImages = images.map(image => {
        const base64 = image.buffer.toString("base64");
        const mime = image.mimetype || "image/jpeg";
        return `data:${mime};base64,${base64}`;
      });
    }

    // Parse activities
    let parsedActivities = [];
    if (activities) {
      parsedActivities = typeof activities === "string"
        ? JSON.parse(activities)
        : activities;
    }

    const newTrip = {
      id: generateId(),
      agencyId: userId,
      agencyName: user.agencyName,
      title,
      description,
      destination,
      duration,
      price: Number(price),
      images: tripImages,
      image: tripImages[0] || null, // Keep first image as primary for backward compatibility
      activities: parsedActivities,
      maxParticipants: Number(maxParticipants),
      currentParticipants: 0,
      startDate,
      rating: 0,
      reviews: 0,
      createdAt: new Date().toISOString()
    };

    const trips = await getTrips();
    trips.push(newTrip);
    await saveTrips(trips);

    // Notify subscribers (non-blocking)
    try {
      notifySubscribers(userId, user.agencyName, newTrip);
    } catch (err) {
      console.error('Error notifying subscribers:', err);
    }

    res.status(201).json({
      message: "Trip created successfully",
      trip: newTrip
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating trip", error: error.message });
  }
};

// ===============================
// GET ALL TRIPS
// ===============================
export const getAllTrips = async (req, res) => {
  try {
    const trips = await getTrips();
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trips", error: error.message });
  }
};

// ===============================
// GET TRIP BY ID
// ===============================
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

// ===============================
// FAVORITE AGENCY
// ===============================
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
    if (favorites.find(f => f.userId === userId && f.agencyId === agencyId)) {
      return res.status(400).json({ message: "Already favorited" });
    }

    const favorite = {
      id: generateId(),
      userId,
      agencyId,
      agencyName: agency.agencyName,
      createdAt: new Date().toISOString()
    };

    favorites.push(favorite);
    await saveFavoriteAgencies(favorites);

    res.status(201).json({ message: "Added to favorites", favorite });
  } catch (error) {
    res.status(500).json({ message: "Error adding favorite", error: error.message });
  }
};

// ===============================
// REMOVE FAVORITE AGENCY
// ===============================
export const removeFavoriteAgency = async (req, res) => {
  try {
    const userId = req.user.id;
    const { agencyId } = req.params;
    
    const favorites = await getFavoriteAgencies();
    const filtered = favorites.filter(f => !(f.userId === userId && f.agencyId === agencyId));
    
    await saveFavoriteAgencies(filtered);
    
    res.json({ message: "Removed from favorites" });
  } catch (error) {
    res.status(500).json({ message: "Error removing favorite", error: error.message });
  }
};

// ===============================
// GET USER FAVORITES
// ===============================
export const getUserFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const favorites = await getFavoriteAgencies();
    const users = await getUsers();
    
    const userFavorites = favorites
      .filter(f => f.userId === userId)
      .map(f => users.find(u => u.id === f.agencyId))
      .filter(Boolean);
    
    res.json(userFavorites);
  } catch (error) {
    res.status(500).json({ message: "Error fetching favorites", error: error.message });
  }
};

// ===============================
// TOGGLE EMAIL SUBSCRIPTION
// ===============================
export const toggleEmailSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const { agencyId } = req.body;
    
    const subscriptions = await getEmailSubscriptions();
    const existing = subscriptions.find(s => s.userId === userId && s.agencyId === agencyId);
    
    if (existing) {
      const filtered = subscriptions.filter(s => !(s.userId === userId && s.agencyId === agencyId));
      await saveEmailSubscriptions(filtered);
      res.json({ message: "Unsubscribed", subscribed: false });
    } else {
      subscriptions.push({
        userId,
        agencyId,
        emailNotifications: true,
        subscribedAt: new Date().toISOString()
      });
      await saveEmailSubscriptions(subscriptions);
      res.json({ message: "Subscribed", subscribed: true });
    }
  } catch (error) {
    res.status(500).json({ message: "Error toggling subscription", error: error.message });
  }
};

// ===============================
// GET USER SUBSCRIPTIONS
// ===============================
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

// ===============================
// UNSUBSCRIBE FROM EMAILS
// ===============================
export const unsubscribeFromEmails = async (req, res) => {
  try {
    const { token } = req.params;
    
    const subscriptions = await getEmailSubscriptions();
    const filtered = subscriptions.filter(s => s.userId !== token);
    
    await saveEmailSubscriptions(filtered);
    
    res.json({ message: "Unsubscribed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error unsubscribing", error: error.message });
  }
};

// ===============================
// GET TRIPS BY AGENCY
// ===============================
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

// ===============================
// EMAIL SUBSCRIBERS NOTIFY
// ===============================
async function notifySubscribers(agencyId, agencyName, trip) {
  const subscriptions = await getEmailSubscriptions();
  const users = await getUsers();

  const subscribers = subscriptions.filter(
    s => s.agencyId === agencyId && s.emailNotifications
  );

  for (const sub of subscribers) {
    const user = users.find(u => u.id === sub.userId);
    if (user) {
      console.log(`📧 Email to ${user.email}`);
      console.log(`New trip from ${agencyName}: ${trip.title}`);
    }
  }
}

// ===============================
// DELETE TRIP
// ===============================
export const deleteTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;
    
    const trips = await getTrips();
    const tripIndex = trips.findIndex(t => t.id === tripId);
    
    if (tripIndex === -1) {
      return res.status(404).json({ message: "Trip not found" });
    }
    
    // Check if user owns this trip
    if (trips[tripIndex].agencyId !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete this trip" });
    }
    
    // Remove trip
    trips.splice(tripIndex, 1);
    await saveTrips(trips);
    
    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting trip", error: error.message });
  }
};

// ===============================
// EDIT TRIP
// ===============================
export const editTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;
    const {
      title,
      description,
      destination,
      duration,
      price,
      activities,
      maxParticipants,
      startDate,
      imagesToRemove
    } = req.body;
    const images = req.files || [];

    const trips = await getTrips();
    const tripIndex = trips.findIndex(t => t.id === tripId);

    if (tripIndex === -1) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const trip = trips[tripIndex];

    // Check if user owns this trip
    if (trip.agencyId !== userId) {
      return res.status(403).json({ message: "Unauthorized to edit this trip" });
    }

    // Update trip fields
    if (title) trip.title = title;
    if (description) trip.description = description;
    if (destination) trip.destination = destination;
    if (duration) trip.duration = duration;
    if (price) trip.price = Number(price);
    if (maxParticipants) trip.maxParticipants = Number(maxParticipants);
    if (startDate) trip.startDate = startDate;
    if (activities) {
      trip.activities = typeof activities === "string" ? JSON.parse(activities) : activities;
    }

    // Handle images
    if (!trip.images) {
      trip.images = trip.image ? [trip.image] : [];
    }

    // Remove images if specified
    if (imagesToRemove) {
      const imagesToRemoveArray = typeof imagesToRemove === "string" 
        ? JSON.parse(imagesToRemove) 
        : imagesToRemove;
      trip.images = trip.images.filter((_, idx) => !imagesToRemoveArray.includes(idx.toString()));
    }

    // Add new images
    if (images && images.length > 0) {
      const newImages = images.map(image => {
        const base64 = image.buffer.toString("base64");
        const mime = image.mimetype || "image/jpeg";
        return `data:${mime};base64,${base64}`;
      });
      trip.images = [...trip.images, ...newImages];
    }

    // Ensure backward compatibility - set image to first in images array
    trip.image = trip.images && trip.images.length > 0 ? trip.images[0] : null;

    trip.updatedAt = new Date().toISOString();

    await saveTrips(trips);

    res.json({
      message: "Trip updated successfully",
      trip
    });
  } catch (error) {
    console.error("Edit trip error:", error);
    res.status(500).json({ message: "Error editing trip", error: error.message });
  }
};

// ===============================
// CLEANUP EXPIRED TRIPS
// ===============================
export const cleanupExpiredTrips = async () => {
  try {
    const trips = await getTrips();
    const now = new Date();
    
    const validTrips = trips.filter(trip => {
      if (!trip.endDate) return true;
      const endDate = new Date(trip.endDate);
      return endDate >= now;
    });
    
    if (validTrips.length < trips.length) {
      await saveTrips(validTrips);
      console.log(`🗑️ Cleaned up ${trips.length - validTrips.length} expired trips`);
    }
  } catch (error) {
    console.error("Error cleaning up expired trips:", error);
  }
};

// Run cleanup every hour
setInterval(cleanupExpiredTrips, 60 * 60 * 1000);
