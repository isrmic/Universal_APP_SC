
function changepage(page, id) {
    if (id === undefined)
        id = null

    appcontrol.$emit('changepage', page, id)
}

var backtolist = () => {
    changepage('listprodut')
}

var appcontrol = new Vue({

    el:"#appcontrol",

    data:function(){

        return {

            actualview:'listprodut',
            idprod:null
        }
    },

    components:{

        listprodut: returnRenderTemplate("list"),
        viewprod:   returnRenderTemplate("view"),
        editprod:   returnRenderTemplate("edit"),
        addprod:    returnRenderTemplate("add"),
        addprov:    returnRenderTemplate("addprov")
    },

})

appcontrol.$on("changepage", function (page, id) {

    if (id === undefined)
        id = null

    this.actualview = page
    this.idprod = id
})
