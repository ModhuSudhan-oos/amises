// firestore.js

/**
 * Gets all documents from a specified Firestore collection.
 * @param {string} collectionName The name of the collection.
 * @returns {Promise<Array<Object>>} A promise that resolves with an array of documents,
 * each with an 'id' field added.
 */
async function getAllDocuments(collectionName) {
    try {
        const snapshot = await db.collection(collectionName).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error(`Error getting all documents from ${collectionName}:`, error);
        throw error; // Re-throw to be handled by the calling function
    }
}

/**
 * Gets a single document by its ID from a specified Firestore collection.
 * @param {string} collectionName The name of the collection.
 * @param {string} docId The ID of the document to retrieve.
 * @returns {Promise<Object|null>} A promise that resolves with the document data
 * (including 'id'), or null if not found.
 */
async function getDocumentById(collectionName, docId) {
    try {
        const doc = await db.collection(collectionName).doc(docId).get();
        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        } else {
            console.warn(`No such document: ${collectionName}/${docId}`);
            return null;
        }
    } catch (error) {
        console.error(`Error getting document ${docId} from ${collectionName}:`, error);
        throw error;
    }
}

/**
 * Adds a new document to a specified Firestore collection.
 * @param {string} collectionName The name of the collection.
 * @param {Object} data The data to add to the document.
 * @returns {Promise<string>} A promise that resolves with the ID of the newly created document.
 */
async function addDocument(collectionName, data) {
    try {
        const docRef = await db.collection(collectionName).add(data);
        return docRef.id;
    } catch (error) {
        console.error(`Error adding document to ${collectionName}:`, error);
        throw error;
    }
}

/**
 * Updates an existing document in a specified Firestore collection.
 * @param {string} collectionName The name of the collection.
 * @param {string} docId The ID of the document to update.
 * @param {Object} data The data to update the document with (partial update).
 * @returns {Promise<void>} A promise that resolves when the document is updated.
 */
async function updateDocument(collectionName, docId, data) {
    try {
        await db.collection(collectionName).doc(docId).update(data);
    } catch (error) {
        console.error(`Error updating document ${docId} in ${collectionName}:`, error);
        throw error;
    }
}

/**
 * Deletes a document from a specified Firestore collection.
 * @param {string} collectionName The name of the collection.
 * @param {string} docId The ID of the document to delete.
 * @returns {Promise<void>} A promise that resolves when the document is deleted.
 */
async function deleteDocument(collectionName, docId) {
    try {
        await db.collection(collectionName).doc(docId).delete();
    } catch (error) {
        console.error(`Error deleting document ${docId} from ${collectionName}:`, error);
        throw error;
    }
}

/**
 * Gets documents from a collection based on a query.
 * @param {string} collectionName The name of the collection.
 * @param {Array<Object>} queries An array of query objects [{ field, operator, value }]
 * e.g., [{field: 'category', operator: '==', value: 'Design'}]
 * @param {Object} [orderBy] Optional object for ordering { field: string, direction: 'asc' | 'desc' }
 * @param {number} [limit] Optional limit for the number of documents.
 * @returns {Promise<Array<Object>>} A promise that resolves with an array of queried documents.
 */
async function getDocumentsByQuery(collectionName, queries = [], orderBy = null, limit = null) {
    try {
        let queryRef = db.collection(collectionName);

        queries.forEach(q => {
            queryRef = queryRef.where(q.field, q.operator, q.value);
        });

        if (orderBy) {
            queryRef = queryRef.orderBy(orderBy.field, orderBy.direction || 'asc');
        }

        if (limit) {
            queryRef = queryRef.limit(limit);
        }

        const snapshot = await queryRef.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error(`Error querying documents from ${collectionName}:`, error);
        throw error;
    }
}

// You can add more specific Firestore functions as needed,
// e.g., for real-time listeners, transactions, etc.
