import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import User from "../models/user.js";

export const checkAuthentication = [
    ClerkExpressRequireAuth({}),
    async (req, res, next) => {
        try {
            if (!req.auth?.userId) {
                return res.status(401).json({ error: "Not authenticated" });
            }

            let user = await User.findOne({ clerkUserId: req.auth.userId }).select("firstName lastName username profileImage");

            // if user is not found in the database but available at clerk
            if (!user) {
                const clerkUser = await clerkClient.users.getUser(req.auth.userId);
                
                if (!clerkUser) {
                    console.log("auth middleware 404")
                    return res.status(404).json({ error: "User not found in Clerk" });
                }

                user = await User.create({
                    clerkUserId: clerkUser.id,
                    email: clerkUser.emailAddresses[0]?.emailAddress,
                    firstName: clerkUser.firstName,
                    lastName: clerkUser.lastName,
                });
            }

            req.user = user;
            next();
        } catch (error) {
            console.log("Authentication error:", error);
            res.status(500).json({ error: "Authentication failed" });
        }
    }
];




// const userSetup = async (req, res, next) => {
//   console.log("=== Inside userSetup middleware ===");
//   try {
//     if (!req.auth?.userId) {
//       console.log("No userId found in req.auth");
//       return res.status(401).json({ error: "Not authenticated" });
//     }

//     let user = await User.findOne({ clerkUserId: req.auth.userId });

//     if (!user) {
//       const clerkUser = await clerkClient.users.getUser(req.auth.userId);
      
//       if (!clerkUser) {
//         return res.status(404).json({ error: "User not found in Clerk" });
//       }

//       user = await User.create({
//         clerkUserId: clerkUser.id,
//         email: clerkUser.emailAddresses[0]?.emailAddress,
//         firstName: clerkUser.firstName,
//         lastName: clerkUser.lastName,
//       });
      
//       console.log("✅ New user created in database");
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.log("Authentication error:", error);
//     res.status(500).json({ error: "Authentication failed" });
//   }
// };

