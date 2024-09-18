var projectName = "基于PHP的新闻管理系统设计与实现"

if(!window.menus){
    let menusJSON = localStorage.getItem("menus")
    if(!menusJSON){
        http.get("menu/list",{
            params:{
                page: 1,
                limit: 1,
                sort: 'id',
            }
        }).then(res=>{
            menusJSON = res.data.data.list[0].menujson
            localStorage.setItem("menus", res.data.data.list[0].menujson)
            window.menus = JSON.parse(menusJSON)
        })
    }else{
        window.menus = JSON.parse(menusJSON)
    }
}
var indexMenuList = [
    {
        name: '新闻信息管理',
        icon: '',
        child:[
            {
                name:'新闻信息',
                url:'client/page/xinwenxinxi/list.html'
            },

        ]
    },
    {
        name: '新闻资讯管理',
        icon: '',
        child:[
            {
                name:'公告信息',
                url:'client/page/news/list.html'
            },

        ]
    },
]

function navigateTo(menuItem){
    let url = ''
    if (menuItem.tableName == 'center'){
        return
    }
    else if(menuItem.tableName=='examrecord'&&menuItem.menuJump=='22'){
        url = `${baseUrl}client/page/examfailrecord/list.html?centerType=1`
    }
    else if(menuItem.tableName=='exampaper'&&menuItem.menuJump=='12'){
        url =`${baseUrl}client/page/exampaper/list.html?centerType=1`
    }
    else if(menuItem.tableName=='forum'&&menuItem.menuJump=='14'){
        url = `${baseUrl}client/page/forum/list.html?centerType=1&&myType=1`
    }
    else{
        switch (menuItem.menu){
            case '我的收藏':
                url = `${baseUrl}client/page/storeup/list.html?centerType=1&&type=1`
                break;
            default:
                url = `${baseUrl}client/page/${menuItem.tableName}/list.html?centerType=1`
        }
    }
    location.href = url
}
