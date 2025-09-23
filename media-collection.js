const MediaCollection = {
    template: `
    <div>
        <div v-if="!selectedUser" class="profile-picker-container">
            <h1>Who's Collecting?</h1>
            <div class="profile-list">
                <div v-for="user in users" :key="user.id" class="profile-card" @click="selectUser(user)">
                    <div class="profile-avatar">{{ user.username.charAt(0).toUpperCase() }}</div>
                    <span class="profile-name">{{ user.username }}</span>
                </div>
                <div class="profile-card add-new" @click="showCreateProfile = true">
                    <div class="profile-avatar">+</div>
                    <span class="profile-name">Add Profile</span>
                </div>
            </div>

            <div v-if="showCreateProfile" class="modal active" @click.self="showCreateProfile = false">
                <div class="modal-content modal-small">
                    <div class="modal-header">
                        <h2>Create Profile</h2>
                        <button class="close-btn" @click="showCreateProfile = false">×</button>
                    </div>
                    <form @submit.prevent="createUser">
                        <div class="form-group">
                            <label>Username</label>
                            <input v-model="newUsername" placeholder="Enter a new username" required>
                        </div>
                        <p v-if="createUserError" class="error-message">{{ createUserError }}</p>
                        <div class="form-actions">
                            <button type="button" class="btn-cancel" @click="showCreateProfile = false">Cancel</button>
                            <button type="submit" class="btn-save">Create</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div v-if="selectedUser">
            <header id="site_header" class="container d_flex">
                <div class="bio__media">
                    <img src="./assets/img/avatar.svg" alt="">
                    <div class="bio__media__text">
                        <h1>Cody Platt</h1>
                        <h3>.NET Engineer</h3>
                        <p>Browsing the collection for: <strong>{{ selectedUser.username }}</strong></p>
                    </div>
                </div>
                <nav>
                    <router-link to='/'>Home</router-link>
                    <router-link to="/projects">Projects</router-link>
                    <a href="Cody-Platt-Resume.pdf">Resumé</a> 
                    <router-link to="/log-pr">Personal Tools</router-link>
                    <router-link to="/media-collection">Media Collection</router-link>
                    <a href="#" @click.prevent="switchUser" class="switch-user-btn">Switch Profile</a>
                    <a href="https://www.github.com/plattco">
                        <i class="fab fa-github fa-lg fa-fw"></i>
                    </a>
                </nav>
            </header>

            <main class="container">
                 <div class="collection-header" v-if="stats">
                    <h2>📚 My Media Collection</h2>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <h3>{{ stats.totalItems }}</h3>
                            <p>Total Items</p>
                        </div>
                        <div class="stat-card">
                            <h3>\${{ (stats.totalValue || 0).toFixed(2) }}</h3>
                            <p>Collection Value</p>
                        </div>
                        <div class="stat-card">
                            <h3>{{ stats.totalFavorites }}</h3>
                            <p>Favorites</p>
                        </div>
                        <div class="stat-card">
                            <h3>{{ mediaItems.length }}</h3>
                            <p>Filtered Items</p>
                        </div>
                    </div>
                </div>

                <div class="media-controls">
                    <div class="filter-bar">
                        <select v-model="filters.mediaType" class="filter-select">
                            <option value="">All Media Types</option>
                            <option value="VideoGame">Video Games</option>
                            <option value="DVD">DVDs</option>
                            <option value="VHS">VHS</option>
                            <option value="CD">CDs</option>
                            <option value="Book">Books</option>
                            <option value="Manga">Manga</option>
                        </select>

                        <select v-model="filters.status" class="filter-select">
                            <option value="">All Status</option>
                            <option value="Owned">Owned</option>
                            <option value="Wishlist">Wishlist</option>
                            <option value="Sold">Sold</option>
                            <option value="Loaned">Loaned</option>
                            <option value="Lost">Lost</option>
                        </select>

                        <select v-model="filters.platform" v-if="filters.mediaType === 'VideoGame'" class="filter-select">
                            <option value="">All Platforms</option>
                            <option value="Nintendo Entertainment System">NES</option>
                            <option value="Super Nintendo">SNES</option>
                            <option value="Nintendo 64">N64</option>
                            <option value="GameCube">GameCube</option>
                            <option value="Wii">Wii</option>
                            <option value="Nintendo Switch">Switch</option>
                            <option value="PlayStation">PS1</option>
                            <option value="PlayStation 2">PS2</option>
                            <option value="PlayStation 3">PS3</option>
                            <option value="PlayStation 4">PS4</option>
                            <option value="PlayStation 5">PS5</option>
                            <option value="Xbox">Xbox</option>
                            <option value="Xbox 360">Xbox 360</option>
                            <option value="Xbox One">Xbox One</option>
                        </select>

                        <input 
                            type="text" 
                            v-model="filters.searchTerm" 
                            placeholder="Search titles, publishers..."
                            class="search-input">

                        <select v-model="filters.sortBy" class="filter-select">
                            <option value="title">Sort by Title</option>
                            <option value="rating">Sort by Rating</option>
                            <option value="price">Sort by Price</option>
                            <option value="createdat">Sort by Date Added</option>
                        </select>

                        <button class="btn-add" @click="showAddModal = true">+ Add Item</button>
                    </div>
                </div>

                <div v-if="loading" class="loading">
                    Loading your collection...
                </div>

                <div v-else-if="mediaItems.length === 0" class="empty-state">
                    <h3>No items found</h3>
                    <p>Try adjusting your filters or add your first item!</p>
                </div>

                <div v-else class="media-grid">
                    <div v-for="item in mediaItems" :key="item.id" 
                         :class="['media-card', { favorite: item.isFavorite }]">
                        
                        <span :class="['media-type-badge', 'type-' + item.mediaType.toLowerCase()]">
                            {{ item.mediaType }}
                        </span>
                        
                        <div class="media-thumbnail">
                            <img :src="getImageUrl(item)" :alt="item.title" />
                        
                            <div v-if="!item.imageUrl && !item.thumbnailUrl" class="media-thumbnail-placeholder">
                                <span class="placeholder-icon">
                                    <i v-if="item.mediaType === 'VideoGame'" class="fas fa-gamepad"></i>
                                    <i v-else-if="item.mediaType === 'DVD'" class="fas fa-compact-disc"></i>
                                    <i v-else-if="item.mediaType === 'VHS'" class="fas fa-video"></i>
                                    <i v-else-if="item.mediaType === 'CD'" class="fas fa-music"></i>
                                    <i v-else-if="item.mediaType === 'Book'" class="fas fa-book"></i>
                                    <i v-else-if="item.mediaType === 'Manga'" class="fas fa-book-open"></i>
                                    <i v-else class="fas fa-image"></i>
                                </span>
                                <div class="placeholder-text">{{ item.mediaType }}</div>
                            </div>
                        </div>
                        
                        <div class="media-info">
                            <div class="media-title">{{ item.title }}</div>
                            <div class="media-meta">
                                <div class="media-rating" v-if="item.rating">
                                    ★ {{ item.rating }}/5
                                </div>
                                <div class="media-price" v-if="item.price">
                                    {{ '$' + item.price.toFixed(2) }}
                                </div>
                                <div :class="['media-status', 'status-' + item.status.toLowerCase()]">
                                    {{ item.status }}
                                </div>
                            </div>
                        </div>
                        
                        <div class="media-actions">
                            <button class="btn-edit" @click="editItem(item)">Edit</button>
                            <button class="btn-price" @click="quickPriceUpdate(item)">Price</button>
                            <button class="btn-delete" @click="deleteItem(item)">Delete</button>
                        </div>
                    </div>
                </div>

                <div :class="['modal', { active: showAddModal || showEditModal }]" @click.self="closeModal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h2>{{ showEditModal ? 'Edit Item' : 'Add New Item' }}</h2>
                            <button class="close-btn" @click="closeModal">×</button>
                        </div>

                        <form @submit.prevent="saveItem">
                            <div class="form-group">
                                <label>Title *</label>
                                <input v-model="currentItem.title" required>
                            </div>

                            <div class="form-group">
                                <label>Media Type *</label>
                                <select v-model="currentItem.mediaType" required>
                                    <option value="VideoGame">Video Game</option>
                                    <option value="DVD">DVD</option>
                                    <option value="VHS">VHS</option>
                                    <option value="CD">CD</option>
                                    <option value="Book">Book</option>
                                    <option value="Manga">Manga</option>
                                </select>
                            </div>

                            <div class="form-group" v-if="currentItem.mediaType === 'VideoGame'">
                                <label>Platform</label>
                                <select v-model="currentItem.platform">
                                    <option value="">Select Platform</option>
                                    <option value="Nintendo Entertainment System">NES</option>
                                    <option value="Super Nintendo">SNES</option>
                                    <option value="Nintendo 64">N64</option>
                                    <option value="GameCube">GameCube</option>
                                    <option value="Wii">Wii</option>
                                    <option value="Nintendo Switch">Switch</option>
                                    <option value="PlayStation">PS1</option>
                                    <option value="PlayStation 2">PS2</option>
                                    <option value="PlayStation 3">PS3</option>
                                    <option value="PlayStation 4">PS4</option>
                                    <option value="PlayStation 5">PS5</option>
                                    <option value="Xbox">Xbox</option>
                                    <option value="Xbox 360">Xbox 360</option>
                                    <option value="Xbox One">Xbox One</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label>Status</label>
                                <select v-model="currentItem.status">
                                    <option value="Owned">Owned</option>
                                    <option value="Wishlist">Wishlist</option>
                                    <option value="Sold">Sold</option>
                                    <option value="Loaned">Loaned</option>
                                    <option value="Lost">Lost</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label>Rating (0-5)</label>
                                <input type="number" v-model.number="currentItem.rating" min="0" max="5" step="0.5">
                            </div>

                            <div class="form-group">
                                <label>Price</label>
                                <input type="number" v-model.number="currentItem.price" min="0" step="0.01">
                            </div>

                            <div class="form-group">
                                <label>Quantity</label>
                                <input type="number" v-model.number="currentItem.quantity" min="1">
                            </div>

                            <div class="form-group">
                                <label>Condition</label>
                                <select v-model="currentItem.condition">
                                    <option value="">Select Condition</option>
                                    <option value="Mint">Mint</option>
                                    <option value="Near Mint">Near Mint</option>
                                    <option value="Good">Good</option>
                                    <option value="Fair">Fair</option>
                                    <option value="Poor">Poor</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label>Genre</label>
                                <input v-model="currentItem.genre">
                            </div>

                            <div class="form-group">
                                <label>Publisher</label>
                                <input v-model="currentItem.publisher">
                            </div>

                            <div class="form-group">
                                <label>Release Year</label>
                                <input type="number" v-model.number="currentItem.releaseYear" min="1900" max="2030">
                            </div>

                            <div class="form-group">
                                <label>
                                    <input type="checkbox" v-model="currentItem.isFavorite">
                                    Mark as Favorite
                                </label>
                            </div>
                            
                            <div class="form-group">
                                <label>Image URL</label>
                                <input v-model="currentItem.imageUrl"> 
                            </div>

                            <div class="form-group">
                                <label>Notes</label>
                                <textarea v-model="currentItem.notes" rows="3"></textarea>
                            </div>

                            <div class="form-actions">
                                <button type="button" class="btn-cancel" @click="closeModal">Cancel</button>
                                <button type="submit" class="btn-save">Save</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div :class="['modal', { active: showPriceModal }]" @click.self="closePriceModal">
                    <div class="modal-content modal-small">
                        <div class="modal-header">
                            <h2>Update Price</h2>
                            <button class="close-btn" @click="closePriceModal">×</button>
                        </div>
                        
                        <form @submit.prevent="savePriceUpdate">
                            <div class="form-group">
                                <label>Item: <strong>{{ priceUpdateItem.title }}</strong></label>
                            </div>
                            
                            <div class="form-group">
                                <label>Current Price: \${{ (priceUpdateItem.price || 0).toFixed(2) }}</label>
                            </div>
                            
                            <div class="form-group">
                                <label>New Price *</label>
                                <input 
                                    type="number" 
                                    v-model.number="newPrice" 
                                    min="0" 
                                    step="0.01"
                                    required
                                    placeholder="Enter new price">
                            </div>
                            
                            <div class="form-actions">
                                <button type="button" class="btn-cancel" @click="closePriceModal">Cancel</button>
                                <button type="submit" class="btn-save">Update Price</button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    </div>
    `,
    data() {
        return {
            apiUrl: 'https://mediacollectionapi.azurewebsites.net/api',
            mediaItems: [],
            stats: null,
            loading: true,
            showAddModal: false,
            showEditModal: false,
            showPriceModal: false,
            currentItem: this.getEmptyItem(),
            priceUpdateItem: {},
            newPrice: 0,
            filters: {
                mediaType: '',
                platform: '',
                status: '',
                searchTerm: '',
                sortBy: 'title',
                isFavorite: null
            },
            // NEW: State for user profiles
            users: [],
            selectedUser: null,
            showCreateProfile: false,
            newUsername: '',
            createUserError: ''
        };
    },
    mounted() {
        // NEW: Check if a user was previously selected and stored in the session
        const savedUser = sessionStorage.getItem('selectedUser');
        if (savedUser) {
            this.selectedUser = JSON.parse(savedUser);
            // If user is found, load their items directly
            this.loadItems();
            this.loadStats();
        } else {
            // Otherwise, load the list of users to show the picker
            this.loadUsers();
        }
    },
    watch: {
        filters: {
            deep: true,
            handler() {
                // NEW: Ensure we don't load items if no user is selected
                if (this.selectedUser) {
                    this.loadItems();
                }
            }
        }
    },
    methods: {
        // --- NEW USER MANAGEMENT METHODS ---
        async loadUsers() {
            this.loading = true;
            try {
                const response = await axios.get(`${this.apiUrl}/Users`);
                this.users = response.data;
            } catch (error) {
                console.error('Error loading users:', error);
                alert('Failed to load user profiles.');
            } finally {
                this.loading = false;
            }
        },
        selectUser(user) {
            this.selectedUser = user;
            // NEW: Save selected user to session storage for persistence
            sessionStorage.setItem('selectedUser', JSON.stringify(user));
            // Now load the items and stats for this user
            this.loadItems();
            this.loadStats();
        },
        async createUser() {
            if (!this.newUsername.trim()) return;
            this.createUserError = '';
            try {
                await axios.post(`${this.apiUrl}/Users`, { username: this.newUsername });
                this.showCreateProfile = false;
                this.newUsername = '';
                // Refresh the user list to show the new profile
                await this.loadUsers();
            } catch (error) {
                console.error('Error creating user:', error);
                this.createUserError = error.response?.data || 'Failed to create profile. Please try again.';
            }
        },
        switchUser() {
            this.selectedUser = null;
            // NEW: Clear user from session storage
            sessionStorage.removeItem('selectedUser');
            // Clear out old data and reload the user list
            this.mediaItems = [];
            this.stats = null;
            this.loadUsers();
        },

        // --- EXISTING METHODS (with minor updates) ---
        getEmptyItem() {
            return {
                title: '',
                mediaType: 'VideoGame',
                platform: null,
                status: 'Owned',
                rating: null,
                price: null,
                isFavorite: false,
                quantity: 1,
                condition: null,
                genre: null,
                publisher: null,
                releaseYear: null,
                imageUrl: null,
                notes: null
            };
        },
        getImageUrl(item) {
            if (item.imageUrl && item.imageUrl.trim() !== '') {
                return item.imageUrl;
            } else {
                return item.thumbnailUrl;
            }
        },
        async loadItems() {
            // NEW: Guard clause to prevent loading if there's no user
            if (!this.selectedUser) return;
            this.loading = true;
            try {
                const params = new URLSearchParams();
                // NEW: Add the userId to every request for media items
                params.append('userId', this.selectedUser.id);

                if (this.filters.mediaType) params.append('mediaType', this.filters.mediaType);
                if (this.filters.platform) params.append('platform', this.filters.platform);
                if (this.filters.status) params.append('status', this.filters.status);
                if (this.filters.searchTerm) params.append('searchTerm', this.filters.searchTerm);
                if (this.filters.sortBy) params.append('sortBy', this.filters.sortBy);
                if (this.filters.isFavorite !== null) params.append('isFavorite', this.filters.isFavorite);

                const response = await axios.get(`${this.apiUrl}/MediaItems?${params}`);
                this.mediaItems = response.data;
            } catch (error) {
                console.error('Error loading items:', error);
                alert('Failed to load items. Please try again.');
            } finally {
                this.loading = false;
            }
        },
        async loadStats() {
            // NEW: Guard clause
            if (!this.selectedUser) return;
            try {
                // NEW: Add userId to the stats request
                const response = await axios.get(`${this.apiUrl}/MediaItems/stats?userId=${this.selectedUser.id}`);
                this.stats = response.data;
            } catch (error) {
                console.error('Error loading stats:', error);
            }
        },
        editItem(item) {
            this.currentItem = { ...item };
            this.showEditModal = true;
        },
        async saveItem() {
            try {
                // NEW: Add userId when creating a new item
                if (!this.showEditModal) {
                    this.currentItem.userId = this.selectedUser.id;
                }

                if (this.showEditModal) {
                    await axios.put(`${this.apiUrl}/MediaItems/${this.currentItem.id}`, this.currentItem);
                } else {
                    await axios.post(`${this.apiUrl}/MediaItems`, this.currentItem);
                }
                this.closeModal();
                this.loadItems();
                this.loadStats();
            } catch (error) {
                console.error('Error saving item:', error);
                alert('Failed to save item. Please try again.');
            }
        },
        async deleteItem(item) {
            if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
                try {
                    await axios.delete(`${this.apiUrl}/MediaItems/${item.id}`);
                    this.loadItems();
                    this.loadStats();
                } catch (error) {
                    console.error('Error deleting item:', error);
                    alert('Failed to delete item. Please try again.');
                }
            }
        },
        quickPriceUpdate(item) {
            this.priceUpdateItem = { ...item };
            this.newPrice = item.price || 0;
            this.showPriceModal = true;
        },
        async savePriceUpdate() {
            try {
                await axios.patch(`${this.apiUrl}/MediaItems/${this.priceUpdateItem.id}/price`, {
                    price: this.newPrice
                });
                this.closePriceModal();
                this.loadItems();
                this.loadStats();
                alert(`Price updated to \$${this.newPrice.toFixed(2)}`);
            } catch (error) {
                console.error('Error updating price:', error);
                alert('Failed to update price. Please try again.');
            }
        },
        closePriceModal() {
            this.showPriceModal = false;
            this.priceUpdateItem = {};
            this.newPrice = 0;
        },
        closeModal() {
            this.showAddModal = false;
            this.showEditModal = false;
            this.currentItem = this.getEmptyItem();
        }
    }
};

export default MediaCollection;