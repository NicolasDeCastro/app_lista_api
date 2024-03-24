sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/odata/ODataModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
     // Remover se não for utilizar
  ], function(Controller, Filter, FilterOperator, ODataModel, Fragment,MT,MessageBox) {
    "use strict";
  
    return Controller.extend("project1.controller.S1", {
      onInit: function() {
        // Inicializar variáveis ou realizar outras ações necessárias
      },
  
      onSearch: function(oEvent) {
        // var sQuery = oEvent.getParameters("query");
        // var objFilter = {filters:[]  }
        var aFilters = [];
        var sQuery = oEvent.getSource().getValue();
        if (sQuery && sQuery.length > 0) {
        var filter = new Filter("ProductName", FilterOperator.Contains, sQuery);
        aFilters.push(filter);
   
     }
         // update list binding
        var oList = this.byId("table0");
        var oBinding = oList.getBinding("items");
        oBinding.filter(aFilters, "Application");
      },
  
      onPress: function(oEvent) {
      
        
        var oView = this.getView();
        this.oButton = oEvent.getSource();
       
        this.oMaterial = oEvent.getSource().getBindingContext().getProperty("ProductName");
        
        var index = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());
        
        this.oRate = oEvent.getSource().getParent().getTable().getItems()[index].getCells()[3].getValue();
        MT.show(this.oRate);

        if(!this._Comentario){
          this._Comentario = Fragment.load({
          id: oView.getId(),
          name: "project1.view.Commentary",
          controller: this
          }).then(function (oDialog){
            oView.addDependent(oDialog);
            return oDialog;
          });
        }
            this._Comentario.then(function (oDialog){
            oDialog.open();
    });   


      },


      onCloseDialog : function(){

        this._Comentario.then(function(oDialog){
          oDialog.close();
        })



        

      },
      onPost : function(oEvent){
        let t = this;
        let oModel = this.getView().getModel();
        
        let  oPost = this.getView().byId("input0");
        let oObj = {
          propriedade1 : this.oMaterial,
          propriedade2 : this.oRate,
          propriedade3 : oPost.getValue()
        };

        MessageBox.confirm(
          "desseja inserir um comentario",//pergunta
          function (oAction){//função disparo insert

            //verificando se confirmou a ação
            if (MessageBox.action.ok === oAction) {


              //criando busyDialog
              t._oBusyDialog = new sap.m.BusyDialog({
                text:"enviando"
              });
              t._oBusyDialog.open();
              setTimeout(function(){
                //chamada para a sap
                let oModelSend = new ODataModel(oModel.sServiceUrl(),true);
                oModelSend.create("nome da entidade",oObj,null,
                function (d, r){//função retorno sucesso
                  if(r.statusCode === 201){
                      //sucesso
                    MT.Show("modelo enviado",{
                      duration:4000
                    });
                    t.oButton.getBadgeCustomData().setValue("1");

                    //fechando dialog do fragment
                    t.onCloseDialog();

                    // refresh no model
                    t.getView().refresh();

                    //fechando busyDialog
                    t._oBusyDialog.close();

                  }
               
                },function(e){
                  //função erro

                  t._oBusyDialog.close();
                });



              },2000);

            }

          }
        )

      }








      
    });
  }
);
