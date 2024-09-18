Vue.component("page-swiper",{
    template:`
<div class="page-swiper">
    <swiper v-if="swiperList.length" :list="swiperList" :option='{"paginationClickable":true,"slidesPerView":1,"loop":true,"autoplay":5000,"effect":"fade"}'>
        <template slot-scope="scope">
            <div class="item">
                <img v-if="scope.item.value" :src="baseUrl + scope.item.value" alt="">
            </div>
        </template>
    </swiper>
</div>
    `,
    data(){
        return{
            userInfo:window.userInfo,
            swiperList:[],
        }
    },
    created(){
        this.getSwiperList()
    },
    methods:{
        getSwiperList(){
            http.get('config/list',{
                params:{page:1,limit:6}
            }).then(res=>{
                this.swiperList = res.data.data.list
            })
        },
    }
})
