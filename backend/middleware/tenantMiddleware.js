const Tenant = require('../models/Tenant');

// Middleware to identify tenant from request
const tenantMiddleware = async (req, res, next) => {
    try {
        let tenantSlug;
        
        // Try to get tenant from subdomain (for production)
        if (req.subdomains && req.subdomains.length > 0) {
            tenantSlug = req.subdomains[0];
        }
        // Try to get tenant from custom header (for development)
        else if (req.headers['x-tenant-id']) {
            tenantSlug = req.headers['x-tenant-id'];
        }
        // Try to get tenant from URL parameter
        else if (req.params.tenantSlug) {
            tenantSlug = req.params.tenantSlug;
        }
        // Try to get tenant from query parameter
        else if (req.query.tenant) {
            tenantSlug = req.query.tenant;
        }
        
        if (tenantSlug) {
            // Find tenant by slug
            const tenant = await Tenant.findOne({ 
                slug: tenantSlug.toLowerCase(),
                isActive: true 
            });
            
            if (tenant) {
                req.tenant = tenant;
                req.tenantId = tenant._id;
            } else {
                return res.status(404).json({ msg: 'Gym not found' });
            }
        } else {
            // For global routes (signup, login), tenant is not required
            // But we still want to allow access
            req.tenant = null;
            req.tenantId = null;
        }
        
        next();
    } catch (err) {
        console.error('Tenant identification error:', err.message);
        res.status(500).json({ msg: 'Server error during tenant identification' });
    }
};

module.exports = tenantMiddleware;