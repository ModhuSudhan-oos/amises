// auth.js

let currentUserRole = null; // Store the current user's role globally

/**
 * Handles user sign-in with email and password.
 * @param {string} email User's email.
 * @param {string} password User's password.
 * @returns {Promise<firebase.User>} A promise that resolves with the signed-in user.
 */
async function signInWithEmail(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Error signing in:", error);
        throw error; // Re-throw to be handled by the calling function (e.g., login.html)
    }
}

/**
 * Handles user sign-out.
 * @returns {Promise<void>} A promise that resolves when the user is signed out.
 */
async function signOutUser() {
    try {
        await auth.signOut();
        console.log("User signed out successfully.");
        // Clear stored role on logout
        currentUserRole = null;
    } catch (error) {
        console.error("Error signing out:", error);
        throw error;
    }
}

/**
 * Listens for authentication state changes and manages user roles.
 * This should be called once, typically in script.js or admin-script.js.
 * @param {function} callback A function to execute when auth state changes (optional).
 */
function listenForAuthChanges(callback = () => {}) {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            // User is signed in. Fetch their role from Firestore.
            try {
                const userDoc = await db.collection('adminUsers').doc(user.uid).get();
                if (userDoc.exists) {
                    currentUserRole = userDoc.data().role;
                    console.log(`User ${user.email} signed in. Role: ${currentUserRole}`);
                } else {
                    // If an authenticated user doesn't have an entry in adminUsers,
                    // they might be a regular user or an admin whose role isn't set.
                    // For this app, we treat them as non-admin if no role is found.
                    currentUserRole = null;
                    console.warn(`User ${user.email} is authenticated but has no admin role defined.`);
                }
            } catch (error) {
                console.error("Error fetching user role:", error);
                currentUserRole = null; // Assume no role on error
            }
        } else {
            // User is signed out.
            currentUserRole = null;
            console.log("User is signed out.");
        }
        callback(user); // Call the provided callback
    });
}

/**
 * Checks if the current user has the required roles and redirects if not.
 * @param {Array<string>} requiredRoles An array of roles (e.g., ['editor', 'superAdmin']).
 * @param {string} redirectUrl The URL to redirect to if authentication fails or role is insufficient.
 * @returns {Promise<boolean>} Resolves true if authorized, false if redirected.
 */
async function checkAuthAndRedirect(requiredRoles, redirectUrl) {
    return new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            unsubscribe(); // Unsubscribe immediately after the first check

            if (!user) {
                // Not authenticated
                window.location.href = redirectUrl;
                resolve(false);
                return;
            }

            // User is authenticated, now check role
            let userRole = null;
            try {
                const userDoc = await db.collection('adminUsers').doc(user.uid).get();
                if (userDoc.exists) {
                    userRole = userDoc.data().role;
                    currentUserRole = userRole; // Update global role
                } else {
                    // If user is authenticated but not in adminUsers, treat as no admin role
                    console.warn(`Authenticated user ${user.email} not found in adminUsers collection.`);
                    window.location.href = redirectUrl;
                    resolve(false);
                    return;
                }
            } catch (error) {
                console.error("Error fetching user role for redirection:", error);
                window.location.href = redirectUrl;
                resolve(false);
                return;
            }

            if (!userRole || !requiredRoles.includes(userRole)) {
                // Insufficient role
                alert('You do not have permission to access this page.');
                window.location.href = redirectUrl;
                resolve(false);
            } else {
                // Authorized
                resolve(true);
            }
        });
    });
}

/**
 * Gets the current user's role from the globally stored variable.
 * This variable is updated by `listenForAuthChanges` or `checkAuthAndRedirect`.
 * @returns {string|null} The current user's role or null if not an admin or not logged in.
 */
function getCurrentUserRole() {
    return currentUserRole;
}
