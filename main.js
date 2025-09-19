const Home = {
    template:
        `<main id="home">
        <div class="about__me">
            <img src="./assets/img/avatar.svg" alt="">
            <h1>Cody Platt</h1>
            <h3>.NET Engineer</h3>
            <p>Software engineer focused on designing and implementing robust software solutions and building tangible products.<br><br>Constantly improving. <br><br>Always learning.</p>
    
            <div class="skills_projects_link">
                <router-link to="/projects">Portfolio</router-link> 
            </div>
            <br>
            <div class="skills_projects_link">
                <a href="Cody-Platt-Resume.pdf">Resumé</a> 
            </div>
            <br>
            <div class="skills_projects_link">
                <router-link to="/media-collection">Media Collection</router-link> 
            </div>
            <br>
            <div class="skills_projects_link">
              <router-link to="/log-pr">PR Logger</router-link> 
            </div>
        </div>
    </main>`,
    data() {
        return {
            showPersonalTools: false
        }
    }
}
const Projects = {
    template:
        `<div>
        <header id="site_header" class="container d_flex">
            <div class="bio__media">
                <img src="./assets/img/avatar.svg" alt="">
                <div class="bio__media__text">
                    <h1>Cody Platt</h1>
                    <h3>.NET Engineer</h3>
                    <p>A portfolio of all of my personal endeavors and computer science projects</p>
                </div>
            </div>
            <nav>
                <router-link to='/'>Home</router-link>
                <router-link to="/projects">Projects</router-link>
                <a href="Cody-Platt-Resume.pdf">Resumé</a> 
                <router-link to="/log-pr">Personal Tools</router-link>
                <router-link to="/media-collection">Media Collection</router-link>
                <a href="https://www.github.com/plattco">
                    <i class="fab fa-github fa-lg fa-fw"></i>
                </a>
            </nav>
        </header>
    
         <main class="container">
            <div class="error" v-if="errors"> 
                Data not loading 😥
            </div>

            <section id="portfolio" v-else>
                <div class="loading" v-if="loading">Loading ... </div>
                <div class="projects" v-else>
                     <div v-for="project in projectsList" class="card__custom" >
                        <div class="card__custom__text">
                            <div>
                                <h3>{{trimTitle(project.name)}}</h3>
                                <p>{{trimText(project.description)}}</p>                        
                            </div>
                    
                            <div class="meta__data d_flex">
                                <div class="date">
                                    <h5>Updated at</h5>
                                    <div>{{new Date(project.updated_at).toDateString()}}</div>
                                </div>
                                <img class="avatar" :src="project.owner.avatar_url">
                    
                            </div>
                        </div>
                        <div class="card__custom__img"></div>
                        <div class="card_custom__button">
                            <a :href="project.html_url" target="_blank">
                                Code
                            </a>
                        </div>
                        <br>
                        <div class="card_custom__button">
                            <a :href="project.html_url" target="_blank">
                                Demo
                            </a>
                        </div>
                    
                    
                    </div>


                    <div style="text-align: center; width:100%" v-if="!loading" >
                        <div v-if="projectsList.length < projects.length">
                            <button class="btn_load_more" v-on:click="loadMore()">Load More</button>
                        </div>
                        <div v-else>
                            <a href="http://www.github.com/plattco">Visit My GitHub</a>
                        </div>

                    </div>

                    <div id="skills_section">
                        <h2>Development Skills</h2>
                        <ul class="skills">
                            <li v-for="skill in skills">{{skill}}</li>
                        </ul>
                    </div>
                </div>
            </section>
        
           
        </main>
    </div>`,
    data() {
        return {
            data: [],
            projects: [],
            projectsList: null,
            skills: [".NET", "AWS", "SQL", "Vue.js", "Git", "APIs", "Machine Learning", "Python"],
            projectsCount: 10,
            perPage: 20,
            page: 1,
            loading: true,
            errors: false,
            showPersonalTools: false // Added dropdown state
        }
    },
    methods: {
        getProjects: function(){

            this.projectsList = this.projects.slice(0, this.projectsCount);
            return this.projectsList;

        },
        fetchData: function(){
            axios
                .get(`https://api.github.com/users/plattco/repos?per_page=${this.perPage}&page=${this.page}`)
                .then(
                    response => {
                        this.projects = response.data;
                        this.projects.forEach(project =>{
                            if (project.language !== null && ! this.skills.includes(project.language)) {
                                this.skills.push(project.language)
                            };
                        });
                    }
                )
                .catch(error=> {
                    console.log(error);
                    this.errors = true;
                })
                .finally(() => {
                    this.loading = false
                    this.getProjects();
                })
        },
        loadMore(){

            if(this.projectsList.length <= this.projects.length){
                this.projectsCount += 5;
                this.projectsList = this.projects.slice(0, this.projectsCount)
            }


        },
        trimTitle: function(text){
            let title = text.replaceAll("-", " ").replace("_", " ")
            if(title.length > 15) {
                return title.slice(0, 12) + ' ...'
            } return title;

        },
        trimText: function(text){
            //console.log(text.slice(0, 100));
            if(text === null) {
                return 'This project has no description yet!';
            } else if(text.length > 100) {
                return text.slice(0, 100) + ' ...'
            }
            return text;
        }
    },
    mounted(){
        // Lifecycle hook
        setTimeout(this.fetchData, 3000);

    }
}

const PRLogger = {
    template: `
    <div>
        <header id="site_header" class="container d_flex">
            <div class="bio__media">
                <img src="./assets/img/avatar.svg" alt="">
                <div class="bio__media__text">
                    <h1>Cody Platt</h1>
                    <h3>.NET Engineer</h3>
                    <p>A portfolio of all of my personal endeavors and computer science projects</p>
                </div>
            </div>
            <nav>
                <router-link to='/'>Home</router-link>
                <router-link to="/projects">Projects</router-link>
                <a href="Cody-Platt-Resume.pdf">Resumé</a> 
                <router-link to="/log-pr">Personal Tools</router-link>
                <router-link to="/media-collection">Media Collection</router-link>
                <a href="https://www.github.com/plattco">
                    <i class="fab fa-github fa-lg fa-fw"></i>
                </a>
            </nav>
        </header>

        <main class="container">
            <div class="bg-gray-900 text-gray-100 min-h-screen flex items-center justify-center p-4">
                <div class="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
                    <h1 class="text-3xl font-bold text-center text-teal-400 mb-6">
                        Log a New PR
                    </h1>
                    <form @submit.prevent="handleSavePR" class="space-y-4">
                        <div>
                            <label for="activityName" class="block text-sm font-medium mb-1">
                                Activity
                            </label>
                            <input
                                type="text"
                                id="activityName"
                                v-model="activityName"
                                placeholder="e.g., Squat"
                                required
                                class="w-full px-4 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>

                        <div>
                            <label for="type" class="block text-sm font-medium mb-1">
                                Type
                            </label>
                            <select
                                id="type"
                                v-model="type"
                                required
                                class="w-full px-4 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                                <option disabled value="">Select exercise type</option>
                                <option value="WeightAndReps">Weight and Reps</option>
                                <option value="DistanceAndTime">Distance and Time</option>
                                <option value="Bodyweight">Bodyweight</option>
                            </select>
                        </div>

                        <div>
                            <label for="value" class="block text-sm font-medium mb-1">
                                Value
                            </label>
                            <input
                                type="text"
                                id="value"
                                v-model="value"
                                placeholder="e.g., 225 lbs or 10 minutes"
                                required
                                class="w-full px-4 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>

                        <div>
                            <label for="dateAchieved" class="block text-sm font-medium mb-1">
                                Date
                            </label>
                            <input
                                type="date"
                                id="dateAchieved"
                                v-model="dateAchieved"
                                required
                                class="w-full px-4 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>

                        <button
                            type="submit"
                            :disabled="isLoading"
                            class="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {{ isLoading ? 'Saving...' : 'Save PR' }}
                        </button>
                    </form>
                    <p v-if="statusMessage" class="mt-4 text-center text-sm font-medium">
                        {{ statusMessage }}
                    </p>
                </div>
            </div>
        </main>
    </div>
    `,
    data() {
        return {
            activityName: '',
            type: '',
            value: '',
            dateAchieved: '',
            statusMessage: '',
            isLoading: false,
            showPersonalTools: false // Added dropdown state
        }
    },
    methods: {
        handleSavePR: async function() {
            this.isLoading = true;
            this.statusMessage = 'Submitting PR entry...';

            // A mapping to convert the dropdown strings to integer values expected by the backend
            const typeMap = {
                'WeightAndReps': 0,
                'DistanceAndTime': 1,
                'Bodyweight': 2
            };

            const newPrEntry = {
                activityName: this.activityName,
                // Use the mapped integer value for the type
                type: typeMap[this.type],
                value: this.value,
                // Format the date to an ISO 8601 string as expected by the backend
                dateAchieved: new Date(this.dateAchieved).toISOString()
            };

            try {
                const response = await fetch('https://plattsdatatracker.azurewebsites.net/api/exercise', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newPrEntry),
                });

                if (response.ok) {
                    this.statusMessage = 'Success! Your PR entry has been saved.';
                    this.activityName = '';
                    this.type = '';
                    this.value = '';
                } else {
                    const errorData = await response.json();
                    this.statusMessage = `Error saving PR: ${errorData.message}`;
                }
            } catch (error) {
                console.error('Network or server error:', error);
                this.statusMessage = 'A network error occurred. Check the console for details.';
            } finally {
                this.isLoading = false;
            }
        },
        // A helper method to set the default date to today's date
        setDefaultDate: function() {
            const today = new Date().toISOString().split('T')[0];
            this.dateAchieved = today;
        }
    },
    mounted() {
        this.setDefaultDate();
    }
}

const MediaCollection = {
    template: `
    <div>
        <header id="site_header" class="container d_flex">
            <div class="bio__media">
                <img src="./assets/img/avatar.svg" alt="">
                <div class="bio__media__text">
                    <h1>Cody Platt</h1>
                    <h3>.NET Engineer</h3>
                    <p>Personal media collection tracker for games, movies, books, and more</p>
                </div>
            </div>
            <nav>
                <router-link to='/'>Home</router-link>
                <router-link to="/projects">Projects</router-link>
                <a href="Cody-Platt-Resume.pdf">Resumé</a> 
                <router-link to="/log-pr">Personal Tools</router-link>
                <router-link to="/media-collection">Media Collection</router-link>
                <a href="https://www.github.com/plattco">
                    <i class="fab fa-github fa-lg fa-fw"></i>
                </a>
            </nav>
        </header>

        <main class="container">
            <!-- Collection Stats -->
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

            <!-- Controls and Filters -->
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

            <!-- Loading State -->
            <div v-if="loading" class="loading">
                Loading your collection...
            </div>

            <!-- Empty State -->
            <div v-else-if="mediaItems.length === 0" class="empty-state">
                <h3>No items found</h3>
                <p>Try adjusting your filters or add your first item!</p>
            </div>

            <!-- Media Grid -->
<div v-else class="media-grid">
    <div v-for="item in mediaItems" :key="item.id" 
         :class="['media-card', { favorite: item.isFavorite }]">
        
        <!-- Media Type Badge -->
        <span :class="['media-type-badge', 'type-' + item.mediaType.toLowerCase()]">
            {{ item.mediaType }}
        </span>
        
        <!-- Thumbnail Section -->
        <div class="media-thumbnail">
            <img v-if="item.thumbnailUrl" :src="item.thumbnailUrl" :alt="item.title" />
            <div v-else class="media-thumbnail-placeholder">
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
        
        <!-- Media Info Section -->
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
        
        <!-- Hover Actions -->
        <div class="media-actions">
            <button class="btn-edit" @click="editItem(item)">Edit</button>
            <button class="btn-price" @click="quickPriceUpdate(item)">Price</button>
            <button class="btn-delete" @click="deleteItem(item)">Delete</button>
        </div>
    </div>
</div>

            <!-- Add/Edit Modal -->
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

            <!-- Quick Price Update Modal -->
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
            }
        };
    },
    mounted() {
        this.loadItems();
        this.loadStats();
    },
    watch: {
        filters: {
            deep: true,
            handler() {
                this.loadItems();
            }
        }
    },
    methods: {
        getEmptyItem() {
            return {
                title: '',
                mediaType: 'VideoGame',
                platform: '',
                status: 'Owned',
                rating: null,
                price: null,
                isFavorite: false,
                quantity: 1,
                condition: '',
                genre: '',
                publisher: '',
                releaseYear: null,
                notes: ''
            };
        },

        async loadItems() {
            this.loading = true;
            try {
                const params = new URLSearchParams();
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
            try {
                const response = await axios.get(`${this.apiUrl}/MediaItems/stats`);
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
}

// Define some routes
const routes = [
    {path: '/', component: Home},
    {path: '/projects', component: Projects},
    {path: '/log-pr', component: PRLogger},
    {path: '/media-collection', component: MediaCollection}
];
const router = new VueRouter({
    routes
});


// Create and mount the root instance.
const app = new Vue({
    router
}).$mount('#app');
