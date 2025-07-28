// admin-script.js

document.addEventListener('DOMContentLoaded', () => {
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');

    // Listen for authentication state changes specifically for admin pages
    listenForAuthChanges(async (user) => {
        if (!user) {
            // If user logs out or is not authenticated, redirect to login page
            // unless already on login page
            if (window.location.pathname !== '/login.html') {
                window.location.href = '/login.html';
            }
        } else {
            // User is logged in. Now ensure their admin role is properly set in Firestore
            try {
                const userDocRef = db.collection('adminUsers').doc(user.uid);
                const userDoc = await userDocRef.get();

                if (!userDoc.exists) {
                    // User exists in Firebase Auth but not in our adminUsers collection
                    // This is a security concern; force logout.
                    console.warn(`Authenticated user ${user.email} (UID: ${user.uid}) not found in adminUsers collection. Forcing logout.`);
                    await signOutUser();
                    if (window.location.pathname !== '/login.html') {
                        window.location.href = '/login.html';
                    }
                } else {
                    // User is in adminUsers. Ensure their role is consistent.
                    const userData = userDoc.data();
                    if (userData.userId !== user.uid) {
                        // Update the adminUsers document with the correct UID if missing/incorrect
                        await userDocRef.update({ userId: user.uid });
                        console.log(`Updated adminUsers document for ${user.email} with UID: ${user.uid}`);
                    }
                    // Update last login time
                    await userDocRef.update({ lastLogin: firebase.firestore.FieldValue.serverTimestamp() });
                }

                // Dynamically show/hide "Team Members" link based on role
                // This part ensures that the sidebar link visibility is correctly managed.
                const teamManagementLink = document.getElementById('teamManagementLink'); // Make sure this ID is in your admin sidebar
                if (teamManagementLink) {
                    const role = getCurrentUserRole();
                    if (role === 'superAdmin') {
                        teamManagementLink.style.display = 'flex'; // Or 'block' based on your CSS
                    } else {
                        teamManagementLink.style.display = 'none';
                    }
                }

            } catch (error) {
                console.error("Error managing admin user data on login:", error);
                // Handle error, e.g., redirect or show message
                await signOutUser();
                if (window.location.pathname !== '/login.html') {
                    window.location.href = '/login.html';
                }
            }
        }
    });

    // Handle Admin Logout Button
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', async () => {
            try {
                await signOutUser();
                // Redirect to login page after logout
                window.location.href = '/login.html';
            } catch (error) {
                console.error("Logout failed:", error);
                alert("Failed to log out. Please try again.");
            }
        });
    }
});
