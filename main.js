
const Home = {
    template: 
    `<main id="home">
        <div class="about__me">
            <img src="./assets/img/avatar.svg" alt="">
            <h1>John Doe</h1>
            <h3>Python Expert</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. </p>
    
            <div class="skills_projects_link">
                <router-link to="/projects">Projects/Skills</router-link> 
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
                <h1>John Doe</h1>
                <h3>Python Expert</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. </p>
            </div>
        </div>
        <nav>
            <router-link to='/'>Home</router-link>
            <router-link to="/projects">Project</router-link>
            <a href="https://">
                <i class="fab fa-github fa-lg fa-fw"></i>
            </a>
        </nav>
    </header>

</div>`,
    data() { 
        return {
               projects: [],
               projectsList: null,
               skills: [],
               projectsCount: 5,
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
        loadMore(){
            
            if(this.projectsList.length <= this.projects.length){
                this.projectsCount += 5;
                this.projectsList = this.projects.slice(0, this.projectsCount)
            }
            
        
        }
    },
    mounted(){  
        // Lifecycle hook      
        
    }
}

// Define some routes
const routes = [
    {path: '/', component: Home},
    {path: '/projects', component: Projects}
];
// Create the router instance and pass the routes to it
const router = new VueRouter({
routes
});
// Create and mount the root instance.

let app = new Vue({
    router 
}).$mount('#app');
