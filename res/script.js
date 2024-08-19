// --- Notes ---
// https://dribbble.com/shots/4099945-Tacos-and-Trees-Marijuana-delivery-with-Tacos/attachments/939399
// 1039px is a good width

// - To Do -
// Finish designing product view
// Add Similar items to product view
// Finish the overall design as well
// *** Need to fix the animation with the test product and reuse of the first product and shit ***
// Make the search/filtering functions
// https://medium.com/@thierrymeier/filtering-and-sorting-best-practices-on-mobile-61626449cec
// Set up the cart system

// - Product Component -
Vue.component('productComp', {
    template: ` <div v-show="info.id >= 0" :class="['rela-inline', 'product-card']" :key="info.id" :style="{'animation-delay':(info.delay*0.1)+'s'}">
                    <div class="rela-block product-pic" :style="{'background': 'url('+info.img+') center no-repeat'}">
                        <div class="product-view-button" @click="view(info.id)">View</div>
                    </div>
                    <div class="rela-block product-info">
                        <div class="rela-block">
                            <p>{{info.name}}</p>
                            <p class="product-artist">{{info.artist}}</p>
                        </div><br>
                        <div class="vert-center product-cost">\{{info.cost}}WETH</div>
                    </div>
                </div>`,
    props: {
        info: {
            type: Object,
            default: {
                id: 0,
                name: 'Untitled',
                artist: 'Artist',
                desc: 'Product description',
                delay: 0,
                cost: 0,
                catg: 'test',
                img: 'https://picsum.photos/600/?random',
            }
        },
    },
    methods: {
        view: function(id) { app.viewProduct(id); },
    }
});

// - Vue Stuff -
var app = new Vue({
    el: '#app',
    data: {
        menuOpen: false,
        cartOpen: false,
        searchOpen: false,
        productViewOpen: false,
        currentViewedProduct: 0, // Product's id
        viewedProduct: {},
        searchInput: '',
        newItems: [],
        newItemPos: 0,
        products: [
            // Test product offsets the index so that no item stays in the same position when switching categories. 
            // This makes it so that the animation will not be skipped if the first item has the same index in a category and in general.
            // Hacky I know. I'll figure out the Vue way to do this later :/
            // Transition groups perhaps? (https://codepen.io/shshaw/pen/aWdjWV)
            {
              id: 1,
              name: 'APIXL #1',
              artist: 'Fahira Anita Salsabila',
              desc: '',
              cost: 1,
              catg: 'Female',
              img: 'https://raw.githubusercontent.com/APIXL/APIXL/main/res/img/APIXL%20%231.png',
              date: '19 Aug 2024'
            },{
              id: 2,
              name: 'APIXL #2',
              artist: 'Fahira Anita Salsabila',
              desc: '',
              cost: 1,
              catg: 'Male',
              img: 'https://raw.githubusercontent.com/APIXL/APIXL/main/res/img/APIXL%20%232.png',
              date: '19 Aug 2024'
            },{
              id: 3,
              name: 'APIXL #3',
              artist: 'Fahira Anita Salsabila',
              desc: '',
              cost: 1,
              catg: 'Female',
              img: 'https://raw.githubusercontent.com/APIXL/APIXL/main/res/img/APIXL%20%233.png',
              date: '19 Aug 2024'
            },{
              id: 4,
              name: 'APIXL #4',
              artist: 'Fahira Anita Salsabila',
              desc: '',
              cost: 1,
              catg: 'Male',
              img: 'https://raw.githubusercontent.com/APIXL/APIXL/main/res/img/APIXL%20%234.png',
              date: '19 Aug 2024'
            },{
              id: 5,
              name: 'APIXL #5',
              artist: 'Fahira Anita Salsabila',
              desc: '',
              cost: 1,
              catg: 'Female',
              img: 'https://raw.githubusercontent.com/APIXL/APIXL/main/res/img/APIXL%20%235.png',
              date: '19 Aug 2024'
            },{
              id: 6,
              name: 'APIXL #6',
              artist: 'Fahira Anita Salsabila',
              desc: '',
              cost: 1,
              catg: 'Male',
              img: 'https://raw.githubusercontent.com/APIXL/APIXL/main/res/img/APIXL%20%236.png',
              date: '19 Aug 2024'
            },{
              id: 7,
              name: 'APIXL #7',
              artist: 'Fahira Anita Salsabila',
              desc: '',
              cost: 1,
              catg: 'Female',
              img: 'https://raw.githubusercontent.com/APIXL/APIXL/main/res/img/APIXL%20%237.png',
              date: '19 Aug 2024'
            },{
              id: 8,
              name: 'APIXL #8',
              artist: 'Fahira Anita Salsabila',
              desc: '',
              cost: 1,
              catg: 'Male',
              img: 'https://raw.githubusercontent.com/APIXL/APIXL/main/res/img/APIXL%20%238.png',
              date: '19 Aug 2024'
            },{
              id: 9,
              name: 'APIXL #9',
              artist: 'Fahira Anita Salsabila',
              desc: '',
              cost: 1,
              catg: 'Female',
              img: 'https://raw.githubusercontent.com/APIXL/APIXL/main/res/img/APIXL%20%239.png',
              date: '19 Aug 2024'
            },{
              id: 10,
              name: 'APIXL #10',
              artist: 'Fahira Anita Salsabila',
              desc: '',
              cost: 1,
              catg: 'Male',
              img: 'https://raw.githubusercontent.com/APIXL/APIXL/main/res/img/APIXL%20%2310.png',
              date: '19 Aug 2024'
            }
        ],
        filteredProducts: [],
        displayedProducts: [],
        displayPos: 0,
        catg: ['All','Female','Male'],
        currentCatg: 'All',
    },
    methods: {
        init: function() {
            app.updateNewItems();
            app.updateFilteredProducts();
        },
        updateNewItems: function() {
            // sort all of the products by date and then take the 10 newest
            this.newItems = [];
            var arr = [];
            // 1 because of the test product (Need to fix that)
            for(var i = 1; i < this.products.length; i++) {arr.push(this.products[i])}
            arr.sort(function(a, b){ return (new Date(b.date)).getTime() - (new Date(a.date)).getTime() });
            
            for(var i = 0; i < 10 && i < arr.length; i++) { this.newItems.push(arr[i]) }
        },
        updateNewItemPos: function(num) {
            this.newItemPos += num;
            // Checks
            if(this.newItemPos < 0) { this.newItemPos = 0 }
            if(this.newItems.length > 1 && (this.newItemPos > this.newItems.length - 1)) { 
                this.newItemPos = this.newItems.length - 1
            }
        },
        updateFilteredProducts: function() {
            this.filteredProducts = [];
            for(var i in this.products) {
                if(this.products[i].catg === this.currentCatg || this.currentCatg === 'All') { this.filteredProducts.push(this.products[i]) }
            }
            app.updateDisplayedProducts();
        },
        updateDisplayedProducts: function() {
            this.displayedProducts = [];
            this.displayPos = 0;
            app.addDisplayedProducts();
        },
        addDisplayedProducts: function() {
            if((this.filteredProducts.length - this.displayPos) <= 12) {
                this.displayedProducts = JSON.parse(JSON.stringify( this.filteredProducts ));
                for(var i = 0; i < this.displayedProducts.length; i++) { this.displayedProducts[i].delay = (i - this.displayPos); }
                this.displayPos = this.filteredProducts.length;
            } else {
                // The ternary is for the test product. I really need to fix that.... :/
                for(var i = 0; i < (this.displayPos===0?13:12); i++) { 
                    this.displayedProducts.push(this.filteredProducts[i + this.displayPos]);
                    this.displayedProducts[i+this.displayPos].delay = (i);
                }
                this.displayPos = this.displayedProducts.length;
            }
        },
        updateViewedProduct: function() { 
            this.viewedProduct = (app.products.filter(function(el){ return el.id === app.currentViewedProduct }))[0]; 
        },
        viewProduct: function(id) {
            this.currentViewedProduct = id; 
            app.updateViewedProduct(); 
            this.productViewOpen = true;
        },
    }
});

app.init();

// Scroll Function
// window.addEventListener('scroll', function() { app.pageScrolled = (window.scrollY > 0); }, false);
