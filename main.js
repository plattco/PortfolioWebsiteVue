const Home = {
    template:
        `<main id="home">
        <div class="about__me">
            <img src="./assets/img/avatar.svg" alt="">
            <h1>Cody Platt</h1>
            <h3>.NET Engineer</h3>
            <p>Software engineer focused on designing and implementing backend software solutions and mobile app development.<br><br>Constantly improving. <br><br>Always learning.</p>
    
            <div class="skills_projects_link">
                <router-link to="/projects">Portfolio</router-link> 
            </div>
            <br>
            <div class="skills_projects_link">
                <router-link to="/log-pr">Log PR</router-link> 
            </div>
            <br>
            <div class="skills_projects_link">
                <a href="Cody-Platt-Resume.pdf">Resumé</a> 
            </div>
        </div>
    </main>`
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
                <router-link to="/log-pr">Log PR</router-link>
                <a href="Cody-Platt-Resume.pdf">Resumé</a> 
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
                <router-link to="/log-pr">Log PR</router-link>
                <a href="Cody-Platt-Resume.pdf">Resumé</a> 
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
            isLoading: false
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
                const response = await fetch('http://localhost:5018/api/exercise', {
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

// Define some routes
const routes = [
    {path: '/', component: Home},
    {path: '/projects', component: Projects},
    {path: '/log-pr', component: PRLogger}
];
// Create the router instance and pass the routes to it
const router = new VueRouter({
    routes
});


// Create and mount the root instance.
const app = new Vue({
    router
}).$mount('#app');
