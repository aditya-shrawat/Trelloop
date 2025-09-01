import { Webhook } from "svix";
import User from "../models/user.js";

// function to generate unique username from mail ids
const generateUniqueUsername = async (email) => {
  const [prefix, domain] = email.split("@");
  const cleanPrefix = prefix.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Try just the email prefix
  let existing = await User.findOne({ username: cleanPrefix });
  if (!existing) return cleanPrefix;

  // Try adding first letter of domain
  const domainLetter = domain.trim().charAt(0).toLowerCase();
  const usernameWithDomain = cleanPrefix + domainLetter;

  existing = await User.findOne({ username: usernameWithDomain });
  if (!existing) return usernameWithDomain;

  //Add random number
  const randomNum = Math.floor(Math.random() * 10000); // 0 to 9999
  const usernameWithRandom = usernameWithDomain + randomNum;

  existing = await User.findOne({ username: usernameWithRandom });
  if (!existing) return usernameWithRandom;

  //Final fallback
  return "user" + Date.now().toString().slice(-8);
};

// webhook handlers -
export const webhookHandler = async (req, res) => {
  console.log("WEB HOOK RECEIVED");

  try {
    const svix_id = req.headers["svix-id"];
    const svix_timestamp = req.headers["svix-timestamp"];
    const svix_signature = req.headers["svix-signature"];
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET_KEY;

    const payload = req.body.toString();

    if (!payload || typeof payload !== "string") {
      console.error("Invalid payload type:", typeof payload);
      return res.status(400).send("Invalid payload");
    }

    const headers = {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    };

    const wh = new Webhook(webhookSecret);

    let evt;
    try {
      evt = wh.verify(payload, headers);
    } catch (err) {
      console.error("Webhook verification failed:", err);
      return res.status(400).send("Invalid signature");
    }

    const { data, type } = evt;
    console.log("Webhook event type:", type);

    switch (type) {
      case "user.created":
        await handleUserCreated(data, res);
        break;
      case "user.updated":
        await handleUserUpdated(data, res);
        break;
      case "user.deleted":
        await handleUserDeleted(data, res);
        break;
      default:
        console.log(`Unhandled webhook event type: ${type}`);
        res.status(200).json({ message: "Event received but not processed" });
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
    return res.status(500).json({error: "Internal server error",details: error.message,});
  }
};

const handleUserCreated = async (data, res) => {
  console.log("Webhook at user_created");
  try {
    const { id, first_name, last_name, email_addresses, image_url, } = data;
    const email = email_addresses?.[0]?.email_address;

    if (!id || !email) {
      console.error("Invalid user data - missing id or email :", data);

      return res.status(400).json({ error: "Invalid user data - missing id or email" });
    }

    const existingUser = await User.findOne({
      $or: [{ clerkUserId: id }, { email: email.toLowerCase() }],
    });

    if (existingUser) {
      console.log("User already exists, updating :", existingUser._id);
      // Update existing user
      const updatedUser = await User.findByIdAndUpdate(
        existingUser._id,
        {
          firstName: first_name || existingUser.firstName,
          lastName: last_name || existingUser.lastName,
          email: email.toLowerCase(),
          profileImage: image_url || existingUser.profileImage,
          lastLogin: new Date(),
        },
        { new: true, runValidators: true }
      );
      return res.status(200).json({message: "Existing user updated successfully",});
    }

    // Create new user
    const username = await generateUniqueUsername(email);

    const newUser = await User.create({
      clerkUserId: id,
      firstName: first_name,
      lastName: last_name,
      email: email.toLowerCase(),
      username,
      profileImage: image_url,
      lastLogin: new Date(),
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error user.created :", error);

    if (error.code === 11000) {
      return res.status(409).json({ error: "User already exists", details: error.message});
    }

    return res.status(500).json({error: "Error creating user",details: error.message,});
  }
};

const handleUserUpdated = async (data, res) => {
  console.log("Webhook at user_updated");
  try {
    const { id, first_name, last_name, email_addresses } = data;
    const email = email_addresses?.[0]?.email_address;

    if (!id) {
      return res.status(400).json({ error: "Invalid user data - missing id" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { clerkUserId: id },
      {
        ...(first_name && { firstName: first_name }),
        ...(last_name && { lastName: last_name }),
        ...(email && { email: email.toLowerCase() }),
        lastLogin: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      console.log(`User not found for update: ${id}`);
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Error updating user", details: error.message });
  }
};

const handleUserDeleted = async (data, res) => {
  console.log("Webhook at user_deleted");
  try {
    const { id } = data;

    if (!id) {
      return res.status(400).json({ error: "Invalid user data - missing id" });
    }

    const result = await User.findOneAndDelete({ clerkUserId: id });

    if (!result) {
      console.log(`User not found for deletion: ${id}`);
      return res.status(404).json({ error: "User not found" });
    }

    console.log(`User permanently deleted: ${result._id}`);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Error deleting user", details: error.message });
  }
};
