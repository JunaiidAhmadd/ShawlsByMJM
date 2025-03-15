// Authentication Middleware

// Check if user is logged in
const isAuthenticated = (req, res, next) => {
    console.log('isAuthenticated check - Session exists:', !!req.session);
    console.log('isAuthenticated check - isLoggedIn:', req.session?.isLoggedIn);
    
    if (req.session && req.session.isLoggedIn) {
        return next();
    }
    res.redirect('/login');
};

// Check if user is an admin
const isAdmin = (req, res, next) => {
    console.log('isAdmin check - Session exists:', !!req.session);
    console.log('isAdmin check - isLoggedIn:', req.session?.isLoggedIn);
    console.log('isAdmin check - User exists:', !!req.session?.user);
    console.log('isAdmin check - isAdmin flag:', req.session?.user?.isAdmin);
    console.log('Full session data:', JSON.stringify(req.session, null, 2));
    
    // First check if user is logged in
    if (!req.session || !req.session.isLoggedIn) {
        console.log('User not logged in, redirecting to login page');
        return res.redirect('/login?message=Please log in to access admin area');
    }
    
    // Then check if user has admin privileges
    if (req.session.user && req.session.user.isAdmin) {
        console.log('Admin check passed, proceeding to admin route');
        return next();
    }
    
    // If logged in but not admin
    console.log('User logged in but not admin, redirecting to home page');
    req.flash('error', 'You need admin privileges to access this page');
    return res.redirect('/');
};

module.exports = {
    isAuthenticated,
    isAdmin
}; 