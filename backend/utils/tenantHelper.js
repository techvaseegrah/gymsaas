// Helper functions for tenant-aware database operations

// Add tenant filter to a query
const addTenantFilter = (query, tenantId) => {
    if (tenantId) {
        return { ...query, tenant: tenantId };
    }
    return query;
};

// Add tenant to a document before saving
const addTenantToDocument = (doc, tenantId) => {
    if (tenantId) {
        return { ...doc, tenant: tenantId };
    }
    return doc;
};

// Verify that a document belongs to the specified tenant
const verifyTenantOwnership = async (model, documentId, tenantId) => {
    if (!tenantId) {
        throw new Error('Tenant ID is required');
    }
    
    const document = await model.findById(documentId);
    if (!document) {
        throw new Error('Document not found');
    }
    
    if (document.tenant.toString() !== tenantId.toString()) {
        throw new Error('Access denied: Document does not belong to this tenant');
    }
    
    return true;
};

module.exports = {
    addTenantFilter,
    addTenantToDocument,
    verifyTenantOwnership
};