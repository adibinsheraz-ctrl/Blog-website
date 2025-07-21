// Data Manager - Centralized data management system
class DataManager {
    constructor() {
        this.storageKey = 'duggarswad_data';
        this.listeners = new Map();
        this.initializeData();
        this.setupStorageListener();
    }

    // Initialize default data structure
    initializeData() {
        const existingData = this.getData();
        if (!existingData || !existingData.initialized) {
            const defaultData = {
                initialized: true,
                version: '1.0.0',
                lastUpdated: new Date().toISOString(),
                posts: [
                    {
                        id: 1,
                        title: "Traditional Rajma of Bhaderwah",
                        author: "Priya Sharma",
                        email: "priya@example.com",
                        category: "main-course",
                        ingredients: "2 cups Bhaderwah Rajma (kidney beans), soaked overnight\n2 large onions, finely chopped\n4-5 tomatoes, pureed\n1 tbsp ginger-garlic paste\n2 tsp red chili powder\n1 tsp turmeric powder\n2 tsp coriander powder\n1 tsp garam masala\nSalt to taste\n3 tbsp mustard oil\nFresh coriander for garnish",
                        instructions: "Pressure cook the soaked rajma with salt and turmeric until soft and tender.\nHeat mustard oil in a heavy-bottomed pan and add chopped onions.\nCook until golden brown, then add ginger-garlic paste.\nAdd tomato puree and cook until oil separates.\nAdd all the spices and cook for 2-3 minutes.\nAdd the cooked rajma along with its water.\nSimmer for 20-25 minutes until the gravy thickens.\nGarnish with fresh coriander and serve hot with rice.",
                        story: "This recipe has been passed down in our family for generations. The secret to authentic Bhaderwah Rajma lies in using the local variety of kidney beans and cooking it slowly in mustard oil.",
                        tips: "The dish tastes even better the next day! Always use mustard oil for authentic flavor.",
                        prepTime: "30 minutes",
                        cookTime: "45 minutes",
                        servings: "4-6 people",
                        status: "approved",
                        createdAt: "2024-01-15T10:00:00Z",
                        approvedAt: "2024-01-15T12:00:00Z",
                        images: ["https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"]
                    },
                    {
                        id: 2,
                        title: "Ambal - The Traditional Pumpkin Curry",
                        author: "Rajesh Kumar",
                        email: "rajesh@example.com",
                        category: "main-course",
                        ingredients: "1 kg pumpkin, cut into cubes\n2 onions, sliced\n1 tbsp ginger-garlic paste\n2 tsp red chili powder\n1 tsp turmeric powder\n2 tsp coriander powder\n1 tsp fennel powder\n1 cup yogurt\n3 tbsp mustard oil\nSalt to taste\nFresh mint leaves",
                        instructions: "Heat mustard oil and fry pumpkin pieces until lightly golden.\nRemove and set aside.\nIn the same oil, cook onions until brown.\nAdd ginger-garlic paste and spices.\nAdd beaten yogurt gradually while stirring.\nReturn pumpkin to the pan and mix gently.\nCover and cook on low heat for 15-20 minutes.\nGarnish with fresh mint and serve.",
                        story: "Ambal represents the essence of Dogra cuisine - simple ingredients transformed into something extraordinary through traditional cooking techniques.",
                        tips: "Don't overcook the pumpkin to maintain its texture. The yogurt should be at room temperature to prevent curdling.",
                        prepTime: "20 minutes",
                        cookTime: "30 minutes",
                        servings: "4-5 people",
                        status: "approved",
                        createdAt: "2024-01-12T09:00:00Z",
                        approvedAt: "2024-01-12T11:00:00Z",
                        images: ["https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg"]
                    },
                    {
                        id: 3,
                        title: "Kalaadi - The Hill Cheese Delight",
                        author: "Meera Devi",
                        email: "meera@example.com",
                        category: "appetizers",
                        ingredients: "500g fresh Kalaadi cheese\n2 onions, sliced\n3-4 green chilies\n1 tsp red chili powder\n1/2 tsp turmeric powder\nSalt to taste\n2 tbsp mustard oil\nFresh coriander leaves",
                        instructions: "Cut kalaadi into thick slices\nHeat mustard oil in a pan\nFry kalaadi slices until golden\nAdd sliced onions and green chilies\nSeason with salt and red chili powder\nCook until onions are translucent\nGarnish with coriander and serve hot",
                        story: "Kalaadi is more than just cheese; it's a testament to the ingenuity of hill people who created this nutritious and delicious food from simple cow's milk.",
                        tips: "Don't overcook the kalaadi as it can become rubbery. Fresh kalaadi works best for this recipe.",
                        prepTime: "10 minutes",
                        cookTime: "15 minutes",
                        servings: "3-4 people",
                        status: "pending",
                        createdAt: "2024-01-20T14:00:00Z",
                        images: ["https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg"]
                    }
                ],
                settings: {
                    siteName: "Duggarswad",
                    siteDescription: "Preserving the traditional flavours of Jammu, one recipe at a time.",
                    adminNotifications: true,
                    autoApproval: false
                },
                notifications: []
            };
            
            this.saveData(defaultData);
        }
    }

    // Get all data
    getData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading data:', error);
            return null;
        }
    }

    // Save all data
    saveData(data) {
        try {
            data.lastUpdated = new Date().toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            this.notifyListeners('dataChanged', data);
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }

    // Get posts by status
    getPosts(status = null) {
        const data = this.getData();
        if (!data || !data.posts) return [];
        
        if (status) {
            return data.posts.filter(post => post.status === status);
        }
        return data.posts;
    }

    // Add new post
    addPost(postData) {
        const data = this.getData();
        if (!data) return null;

        const newPost = {
            id: Date.now(),
            ...postData,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        data.posts.push(newPost);
        
        // Add notification for admin
        this.addNotification({
            type: 'new_recipe',
            title: 'New Recipe Submitted',
            message: `"${newPost.title}" by ${newPost.author || 'Anonymous'} is pending approval`,
            postId: newPost.id,
            timestamp: new Date().toISOString()
        });

        this.saveData(data);
        return newPost;
    }

    // Update post
    updatePost(postId, updates) {
        const data = this.getData();
        if (!data) return null;

        const postIndex = data.posts.findIndex(post => post.id === postId);
        if (postIndex === -1) return null;

        data.posts[postIndex] = { ...data.posts[postIndex], ...updates };
        
        // Add notification for status changes
        if (updates.status) {
            const post = data.posts[postIndex];
            if (updates.status === 'approved') {
                updates.approvedAt = new Date().toISOString();
                this.addNotification({
                    type: 'recipe_approved',
                    title: 'Recipe Approved',
                    message: `"${post.title}" has been approved and is now live`,
                    postId: postId,
                    timestamp: new Date().toISOString()
                });
            } else if (updates.status === 'rejected') {
                updates.rejectedAt = new Date().toISOString();
                this.addNotification({
                    type: 'recipe_rejected',
                    title: 'Recipe Rejected',
                    message: `"${post.title}" has been rejected`,
                    postId: postId,
                    timestamp: new Date().toISOString()
                });
            }
        }

        this.saveData(data);
        return data.posts[postIndex];
    }

    // Delete post
    deletePost(postId) {
        const data = this.getData();
        if (!data) return false;

        const postIndex = data.posts.findIndex(post => post.id === postId);
        if (postIndex === -1) return false;

        data.posts.splice(postIndex, 1);
        this.saveData(data);
        return true;
    }

    // Approve post
    approvePost(postId) {
        return this.updatePost(postId, { 
            status: 'approved',
            approvedAt: new Date().toISOString()
        });
    }

    // Reject post
    rejectPost(postId, reason = '') {
        return this.updatePost(postId, { 
            status: 'rejected',
            rejectedAt: new Date().toISOString(),
            rejectionReason: reason
        });
    }

    // Get statistics
    getStats() {
        const posts = this.getPosts();
        return {
            total: posts.length,
            approved: posts.filter(p => p.status === 'approved').length,
            pending: posts.filter(p => p.status === 'pending').length,
            rejected: posts.filter(p => p.status === 'rejected').length,
            contributors: new Set(posts.map(p => p.author || 'Anonymous')).size
        };
    }

    // Notification management
    addNotification(notification) {
        const data = this.getData();
        if (!data) return;

        notification.id = Date.now();
        notification.read = false;
        
        if (!data.notifications) {
            data.notifications = [];
        }
        
        data.notifications.unshift(notification);
        
        // Keep only last 50 notifications
        if (data.notifications.length > 50) {
            data.notifications = data.notifications.slice(0, 50);
        }
        
        this.saveData(data);
        this.notifyListeners('newNotification', notification);
    }

    // Get notifications
    getNotifications(unreadOnly = false) {
        const data = this.getData();
        if (!data || !data.notifications) return [];
        
        if (unreadOnly) {
            return data.notifications.filter(n => !n.read);
        }
        return data.notifications;
    }

    // Mark notification as read
    markNotificationRead(notificationId) {
        const data = this.getData();
        if (!data || !data.notifications) return;

        const notification = data.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.saveData(data);
        }
    }

    // Mark all notifications as read
    markAllNotificationsRead() {
        const data = this.getData();
        if (!data || !data.notifications) return;

        data.notifications.forEach(n => n.read = true);
        this.saveData(data);
    }

    // Event listener system
    addEventListener(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    removeEventListener(event, callback) {
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    notifyListeners(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('Error in event listener:', error);
                }
            });
        }
    }

    // Setup storage listener for cross-tab updates
    setupStorageListener() {
        window.addEventListener('storage', (e) => {
            if (e.key === this.storageKey) {
                this.notifyListeners('dataChanged', this.getData());
            }
        });
    }

    // Export data (for backup)
    exportData() {
        const data = this.getData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `duggarswad-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Import data (for restore)
    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (this.saveData(data)) {
                        resolve(data);
                    } else {
                        reject(new Error('Failed to save imported data'));
                    }
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }
}

// Create global instance
window.dataManager = new DataManager();