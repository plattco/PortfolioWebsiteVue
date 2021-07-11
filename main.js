
const Home = {template: '<div>My Portfolio</div>'} 
const Projects = {
    
    template: `<div> 
         <div v-for="project in projects">
            <h2 class="title">{{project.full_name}}</h2>
            
            <div class="author">
                <img width="50px" :src="project.owner.avatar_url" alt="me">
            </div>
            <div class="view">
                <a :href="project.html_url">View</a>
            </div>
        </div>
    </div>`,
    data(){
        return {
            projects: [],
            perPage: 20,
            page: 1
        }
    }, 
    mounted(){
        
         axios
         .get(`https://api.github.com/users/plattco/repos?per_page=${this.perPage}&page=${this.page}`)
         .then(
            response => {
                //console.log(response);
                this.projects = response.data;
            }
        )
        .catch(error=> {console.log(error);})
    }
} 

// Define some routes
const routes = [
    {path: '/', component: Home},
    {path: '/projects', component: Projects}
];
// Create the router instance and pass the routes to it
const router = new VueRouter({
routes: routes
});
// Create and mount the root instance.

let app = new Vue({
    router 
}).$mount('#app');
