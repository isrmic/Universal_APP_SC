

function returnRenderTemplate(page, id){

    var resultreturn

    switch(page){

        case "list":

            resultreturn = {

                template:'<div> <div v-show="isOk"> <h2 class="page-header">{{TitlePage}}</h2> <table class="table table-hover table-striped table-bordered"> <tbody> <tr> <td> Nome </td> <td> Preco </td> <td> Descricao </td> <td> Quantidade </td> <td colspan="3"> <div class="input-group"> <input class="form-control" @keydown.enter="__init__" name="prod" v-model="prod" id="navbarInput-01" type="search" placeholder="Search"> <span class="input-group-btn"> <button @click = "__init__" class="btn"><span class="fui-search"></span></button> </span> </div> </td> </tr> <tr v-if="Produtos.length > 0" v-for="Produto in Produtos"> <td>{{Produto.Name}}</td> <td>{{Produto.Price | dollarsign}}</td> <td>{{Produto.Description}}</td> <td v-bind:class="Islacking(Produto.Count_P, Produto.Min_Count)">{{Produto.Count_P}}</td> <td> <button @click="viewProd(Produto.ID)" class="btn btn-inverse btn-xs"> view </button> </td> <td> <button @click="editProd(Produto.ID)" class="btn btn-inverse btn-xs"> edit </button> </td> <td> <button @click="removeprod(Produto.ID)" class="btn btn-inverse btn-xs"> remove </button> </td> <td v-if="parseInt(Produto.Count_P) < parseInt(Produto.Min_Count)"> <label class="label label-danger"> Em Falta {{Produto.Min_Count}}</label> </td> </tr> </tbody> </table> <div v-if ="Produtos.length == 0"> Nenhum Produto Foi Encontrado !!! <hr/> </div> <button @click="gotoaddprod" class="btn btn-info"> <span> <i class = "glyphicon glyphicon-plus"></i> </span> </button> <button @click="__init__(true)" class="btn btn-primary"> <span> <i class = "glyphicon glyphicon-refresh"></i> </span> </button> <button @click = "gotoaddprov" class="btn btn-default">Adicionar Fornecedor</button> </div> </div>',

                http:{

                    emulateJSON:true,
                    emulateHTTP:true
                },

                data:() => {

                    return{

                        TitlePage:'Lista De Produtos',
                        Produtos:{},
                        isOk:false,
                        prod:'',
                        Key:WEBAPPCONFIG.key


                    }
                },

                created:function(){
                    this.__init__()
                },

                methods:{

                    __init__:function(){

                      this.prod = arguments[0] === true ? '' : this.prod

                      this.$http.get(WEBAPPCONFIG.AcessJsonALL + "?prod=" + this.prod).then((response) => {

                          this.$set(this, 'Produtos', JSON.parse(response.data))
                          this.isOk = true

                      })

                    },

                    viewProd:(id) => {
                        changepage('viewprod', id)
                    },

                    editProd:(id) => {
                        changepage('editprod', id)
                    },

                    removeprod:function(id){
                        this.$http.post(WEBAPPCONFIG.RemoveProd, { prodID_del: id, key:this.Key } ).then((response) => {
                            this.__init__()
                        })
                    },

                    Islacking:(param1, param2) => {

                        if (parseInt(param1) < parseInt(param2))
                          return 'alert alert-danger'
                        return ''
                    },

                    gotoaddprod:() => {
                        changepage('addprod')
                    },

                    gotoaddprov:() => {
                        changepage("addprov")
                    }

                },

                filters:{

                    dollarsign:(param) =>{

                        return "R$ "+ param.split(".").join(",")
                    }
                }
            }

        break;

        case "view":

            resultreturn = {

                props:['idprod'],
                template:'<div> <div v-show="isOk" v-for="Produto in Produtos"> <div class="page-header"> <h1>{{Produto.ID}}<small>{{Produto.Name}}</small></h1> </div><ul> <div class="row"> <li> <b>Valor: </b> {{ Produto.Price | dollarsign }}</li><li> <b>Descrição :</b>{{Produto.Description}}</li><li> <b>Quantidade em estoque: </b>{{Produto.Count_P}}</li></div></ul> <ul> <div class="row"> <li> <b>Código Produto: </b> {{ Produto.Code_Produt }} </li><li> <b>Inserido Em: </b>{{ Produto.insertData | viewDate }}</li><li> <b>Última Modificação: </b>{{ Produto.dataModified | viewDate }}</li></div></ul> <hr/> <div class="row"> <button @click = "editProd(idprod)" class="btn btn-warning" > Editar </button> <button @click = "removeprod" class="btn btn-danger"> Remover </button> <button @click = "backtolist" class="btn btn-default"> Voltar </a> </div></div> </div>',

                http:{

                    emulateJSON:true,
                    emulateHTTP:true
                },

                data:() =>{

                    return {

                      Produtos:{},
                      isOk:false,
                      key:WEBAPPCONFIG.key

                    }
                },

                created:function(){
                    this.__init__()
                },

                methods:{

                    __init__:function(){

                        this.$http.get(WEBAPPCONFIG.AcessJsonALL + "/" + this.idprod).then((response) => {

                            this.$set(this, 'Produtos', JSON.parse(response.data))
                            this.isOk = true

                        })
                    },

                    removeprod:function(){
                        this.$http.post(WEBAPPCONFIG.RemoveProd, { prodID_del: this.idprod,  key:this.Key } ).then((response) => {
                            backtolist()
                        })
                    },

                    editProd:(id) => {
                        changepage('editprod', id)
                    },

                },

                filters:{

                    dollarsign:(param) =>{

                        return "R$ "+ param.split(".").join(",")
                    },

                    viewDate:(param) =>{


                         var datetime = param.split(" ")
                         var date = datetime[0].split("-")

                        return date[2] + "-" + date[1] + "-" + date[0] + " " + datetime[1]

                    }
                }

            }

        break;

        case "edit":

            resultreturn = {

                props:['idprod'],
                template: '<div> <div v-show="isOk" v-for="Produto in Produtos"> <h3 class="page-header"> Editar Produto <h1>{{Produto.ID}}<small>{{Produto.Name}}</small></h1> </h3> <form onsubmit = "return false;"> <input type="hidden" name="prod_ID" v-bind:value="Produto.ID"> <input type="hidden" name="Key" v-bind:value="Produto.Key"> <div class="row"> <div class="form-group col-md-3"> <label for="campo1">Nome : </label> <input type="text" name="name_prod" v-model="Produto.Name" required="require" class="form-control" id="campo1"> </div><div class="form-group col-md-2"> <label for="campo2">Preço : </label> <input type="number" step="0.01" name="price_prod" v-model="Produto.Price" required="require" class="form-control" id="campo2"> </div><div class="form-group col-md-2"> <label for="campo3">Quantidade : </label> <input type="number" name="Count_Prod" v-model="Produto.Count_P" required="require" class="form-control" id="campo3"> </div><div class="form-group col-md-2"> <label for="min_c">Minimo : </label> <input type="number" name="min_count" v-model="Produto.Min_Count" required="require" class="form-control" id="min_c"> </div><div class="form-group col-md-3"> <label for="campo4">Código Produto : </label> <div class="input-group"> <span class="input-group-addon" id="codebar"><i class="glyphicon glyphicon-barcode"></i></span> <input type="text" name="code_prod" aria-describedby="codebar" v-model="Produto.Code_Produt" maxlength="16" required="require" class="form-control" id="campo4"> </div></div><div class="form-group col-md-2"> <label for="campo5">Fornecedor : </label> <select id="campo5" name="provider" class="form-control"> <option v-bind:value="Produto.ID" > SELECT </option> <option v-for="provs in Produto.prov" v-bind:value="provs.ID" >{{provs.Name}} -- {{provs.Company}}</option> </select> </div></div><div class="row"> <div class="form-group col-md-10"> <label for="campo4">Descrição : </label> <input type="text" name="desc_prod" v-model="Produto.Description" required="require" class="form-control" id="campo4"> </div></div><hr/> <div id="actions" class="row"> <div class="col-md-12"> <input type = "button" @click = "updateProd" class="btn btn-success" value = "Salvar" /> <input type = "button" @click = "backtolist" class="btn btn-default" value = "Cancelar">  </div> </div> </form> </div>',

                http:{

                    emulateJSON:true,
                    emulateHTTP:true

                },

                data:function(){

                    return {

                        Produtos:{},
                        isOk:false,
                        Key:WEBAPPCONFIG.key
                    }
                },

                created:function(){
                    this.__init__()
                },

                methods:{

                    __init__:function(){

                        this.$http.get(WEBAPPCONFIG.AcessJsonALL + "/" + this.idprod).then((response) => {

                            this.$set(this, 'Produtos', JSON.parse(response.data))
                            this.isOk = true

                        })
                    },

                    updateProd:function(){

                        var Produto = this.Produtos[0]

                        var body = { "name_prod": Produto.Name, "price_prod": Produto.Price, "desc_prod": Produto.Description, "Count_Prod": Produto.Count_P, "provider": Produto.ProviderID, "code_prod": Produto.Code_Produt, "min_count": Produto.Min_Count, "prod_ID": this.Produtos[0].ID, key: this.Key }

                        this.$http.post(WEBAPPCONFIG.UpdateProd, body).then(() => {

                            backtolist()
                            
                        })
                    }
                }
            }

        break;

        case "add":

            resultreturn = {

                template:'<div> <h3 class="page-header"> {{ TitlePage }} </h3> <form onsubmit = "return false;"> <input type="hidden" name="key" v-bind:value="Key"> <div class="row"> <div class="form-group col-md-3"> <label for="name">Nome : </label> <input type="text" name="name_prod" v-model="Produto.Name" maxlength="16" required="require" class="form-control" id="name"> </div><div class="form-group col-md-2"> <label for="price">Preço : </label> <input type="number" step="0.01" name="price_prod" v-model="Produto.Price" required="require" class="form-control" id="price"> </div><div class="form-group col-md-2"> <label for="count">Quantidade : </label> <input type="number" name="count_prod" v-model="Produto.Count" required="require" class="form-control" id="count"> </div><div class="form-group col-md-2"> <label for="min_c">Minimo : </label> <input type="number" name="min_count" v-model="Produto.Min_Count" required="require" class="form-control" id="min_c"> </div><div class="form-group col-md-3"> <label for="code_p">Código Produto : </label> <div class="input-group"> <span class="input-group-addon" id="code_baricon"><i class="glyphicon glyphicon-barcode"></i></span> <input type="text" name="code_prod" v-model="Produto.Code" maxlength="16" ariadescribedby="code_baricon" required="require" class="form-control" id="code_p"> </div></div><div class="form-group col-md-2"> <label for="campo5">Fornecedor : </label> <select id="campo5" name="provider" v-model ="Produto.ProviderID" class="form-control"> <option value="0"> SELECT </option> <option v-for="prov in provs" v-bind:value = "prov.ID"> {{prov.company}} </option> </select> </div></div><div class="row"> <div class="form-group col-md-10"> <label for="campo3">Descrição : </label> <input type="text" name="desc_prod" v-model = "Produto.Description" required="require" class="form-control" id="campo3"> </div></div><hr/> <div id="actions" class="row"> <div class="col-md-12"> <button @click = "addNewProd" class="btn btn-success" > Adicionar </button> <input @click = "backtolist" type="button" class="btn btn-default" value="Cancelar" /> </div></div></form> </div>',

                http:{
                  emulateJSON: true,
                  emulateHTTP: true
                },

                data:function(){

                    return {

                      TitlePage:'Adicionar Produto',

                      Produto:{

                        Name:'',
                        Price:0.00,
                        Count:'',
                        Min_Count:10,
                        Code:'',
                        ProviderID:'',
                        Description:''

                      },

                      provs:{},

                      Key:WEBAPPCONFIG.key,

                    }

                },

                created:function(){

                    this.loadprovs()
                },

                methods:{

                    addNewProd:function(){

                      if(this.condiction){

                          var body =  { "name_prod":this.Produto.Name, "price_prod":this.Produto.Price, "desc_prod":this.Produto.Description, "count_prod":this.Produto.Count, "provider":this.Produto.ProviderID, "code_prod":this.Produto.Code, "min_count":this.Produto.Min_Count, key:this.Key }

                           this.$http.post(WEBAPPCONFIG.AddProd, body).then((response) => {

                            backtolist()

                          })
                      }

                    },

                    loadprovs:function(){

                        this.$http.get(WEBAPPCONFIG.Providersjson).then((response)=>{

                            this.$set(this, "provs", JSON.parse(response.data))

                        })
                    }
                },

                computed:{

                    condiction:function(){

                        var Produto = this.Produto
                        var cond = true

                        for(prop in Produto){
                            if(Produto[prop] === ""){
                                cond = false
                                break;
                            }
                        }
                        return cond

                    }
                }

              }


        break;

        case "addprov":

            resultreturn = {


                template:'<div> <h3 class="page-header">{{TitlePage}}</h3> <form onsubmit = "return false;"> <input type="hidden" v-bind:value="Key"> <div class="row"> <div class="form-group col-md-3"> <label for="name">Nome : </label> <input type="text" name="name_prov" v-model="Provider.Name" required="require" class="form-field form-control" id="name"> </div><div class="form-group col-md-2"> <label for="company">Empresa : </label> <input type="text" name="company_prov" v-model="Provider.company" required="require" class="form-field form-control" id="company"> </div><div class="form-group col-md-2"> <label for="office">Cargo : </label> <input type="text" name="office_prov"v-model="Provider.Office" required="require" class="form-field form-control" id="office"> </div><div class="form-group col-md-2"> <label for="CEP">CEP : </label> <input @change = "autoCompleteCEP" type="text" name="cep_prov" v-model="Provider.CEP" required="require" class="form-field form-control" id="CEP"> </div><div class="form-group col-md-2"> <label for="region">Região : </label> <input type="text" name="region_prov"v-model="Provider.Region" required="require" class="form-field form-control" id="region"> </div><div class="form-group col-md-5"> <label for="address">Endereço : </label> <input type="text" name="location_prov" v-model="Provider.Location" required="require" class="form-field form-control" id="address"> </div><div class="form-group col-md-2"> <label for="campo8">País : </label> <input type="text" name="country_prov" v-model="Provider.Country" required="require" class="form-field form-control" id="campo8"> </div><div class="form-group col-md-2"> <label for="campo9">Telefone : </label> <div class="input-group"> <span class="input-group-addon" id="iconphone"><i class="glyphicon glyphicon-earphone"></i></span> <input type="text" name="phone_prov" v-model="Provider.Phone" aria-describedby="iconphone" required="require" class="form-field form-control" id="campo9"> </div></div><div class="form-group col-md-3"> <label for="email">Email : </label> <div class="input-group"> <span class="input-group-addon" id="iconmail"><i class="glyphicon glyphicon-envelope"></i></span> <input type="text" name="email_prov" v-model="Provider.Email" aria-describedby="icomail" required="require" class="form-field form-control" id="email"> </div></div><div class="form-group col-md-3"> <label for="city">Cidade - Estado : </label> <input type="text" name="city_prov" v-model="Provider.City" required="require" class="form-field form-control" id="city"> </div></div><hr/> <div id="actions" class="row"> <div class="col-md-12"> <button @click ="registerprov" class="btn btn-success" > Registrar </button> <input type = "button" @click = "backtolist" class="btn btn-default" value = "Cancelar" /> </div></div></form> </div>',

                http:{

                    emulateHTTP:true,
                    emulateJSON:true
                },

                data:function(){

                    return {

                      TitlePage:"Registrar Fornecedor",

                      Provider:{

                          Name:'',
                          company:'',
                          Office:'',
                          "Location":'',
                          Region:'',
                          City:'',
                          CEP:'',
                          Country:'',
                          Phone:'',
                          Email:''
                    },

                    Key:WEBAPPCONFIG.key
                }
            },

            methods:{

                registerprov:function(){

                    var Provider = this.Provider

                    var body = { "name_prov":Provider.Name, "company_prov":Provider.company, "office_prov":Provider.Office, "location_prov":Provider.Location, "city_prov":Provider.City, "region_prov":Provider.Region, "cep_prov":Provider.CEP, "country_prov":Provider.Country, "phone_prov":Provider.Phone, "email_prov":Provider.Email, key:this.Key }

                    this.$http.post(WEBAPPCONFIG.AddProv, body).then(() => {

                        backtolist()
                    })
                },

                autoCompleteCEP:function(){


                    this.$http.get("https://viacep.com.br/ws/"+this.Provider.CEP+"/json/").then((response) => {

                        this.$set(this.Provider, "CEP", response.data.cep)
                        this.$set(this.Provider, "Location", response.data.logradouro + " - " + response.data.bairro)
                        this.$set(this.Provider, "City", response.data.localidade + " - " + response.data.uf)

                    })
                }
            }
      }

      break;
  }


    return resultreturn
}
