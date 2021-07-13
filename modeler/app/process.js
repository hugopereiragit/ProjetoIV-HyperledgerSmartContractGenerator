
function Participant(id, name) {
this.id = id;
this.name = name;
}

function Asset(id, name,type) {
this.id = id;
this.name = name;
}

function Task(id, name,datastores,typedatastore,participant,typeparticipant,istrasnfer) {
this.id = id;
this.name = name;
this.datastores = datastores;
this.typedatastore = typedatastore;
this.participant = participant;
this.typeparticipant = typeparticipant;
this.istrasnfer = istrasnfer;
}


      
   //data holders   
var participantArray = []; 
var participanttxt = "";
var datastoretxt = "";
var assetArray = [];
var tasktxt = "";
var taskArray = [];
var sequencetxt = "";
var messagetxt = "";
var assosstxt = ""; 

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml,"application/xml");


   var xpartic = xmlDoc.getElementsByTagName("participant");
   for (i = 0; i < xpartic.length; i++) {
    participanttxt += "Participant - " + "Id: " + xpartic.item(i).getAttribute("id") + " Name: " + xpartic.item(i).getAttribute("name") + "\n" ;
    var novo = new Participant(xpartic.item(i).getAttribute("id"),xpartic.item(i).getAttribute("name")); //adicionar - tipo


    
    this.addtoArray = function(){
          participantArray.push(novo)
    }();
    }
   console.log(participantArray);


   var xdata = xmlDoc.getElementsByTagName("dataStoreReference");
   for (i = 0; i < xdata.length; i++) {
    datastoretxt += "Datastore - " + "Id: " + xdata.item(i).getAttribute("id") + " Name: " + xdata.item(i).getAttribute("name") + "\n" ;
    var novo = new Asset(xdata.item(i).getAttribute("id"),xdata.item(i).getAttribute("name"));



    this.addtoArray = function(){
          assetArray.push(novo)
    }();
  }
   console.log(assetArray);



   var xtask = xmlDoc.getElementsByTagName("task");
   for (i = 0; i < xtask.length; i++) {
    tasktxt += "Task - " + "Id: " + xtask.item(i).getAttribute("id") + " Name: " + xtask.item(i).getAttribute("name") + "\n" ;
    var novo = new Task(xtask.item(i).getAttribute("id"),xtask.item(i).getAttribute("name"));
      
    var xassos = xmlDoc.getElementsByTagName("association");
    //para descobrir o datastore da task
    for(c=0; c<xassos.length;c++){
      //Se o sourceRef tiver o id da nossa task então a origem é a task e o destino o asset o que implica escrever
      if(xassos.item(c).getAttribute("sourceRef")==(xtask.item(i).getAttribute("id"))){
        novo.datastores=xassos.item(c).getAttribute("targetRef")
        novo.typedatastore="Escrever"
      }
      if(xassos.item(c).getAttribute("targetRef")==(xtask.item(i).getAttribute("id"))){
        novo.datastores=xassos.item(c).getAttribute("sourceRef")
        novo.typedatastore="Ler"
      }
    }

   
    var xassos = xmlDoc.getElementsByTagName("messageFlow");
    //para descobrir o datastore da task
    for(c=0; c<xassos.length;c++){
      if(xassos.item(c).getAttribute("sourceRef")==(xtask.item(i).getAttribute("id"))){
        novo.participant=xassos.item(c).getAttribute("targetRef")
        novo.typeparticipant="Recebe"
      }
      if(xassos.item(c).getAttribute("targetRef")==(xtask.item(i).getAttribute("id"))){
        novo.participant=xassos.item(c).getAttribute("sourceRef")
        novo.typeparticipant="Envia"
      }
    }

    novo.istrasnfer=false;

    this.addtoArray = function(){
          taskArray.push(novo)
    }();
    }

   console.log(taskArray);

   var x = xmlDoc.getElementsByTagName("sequenceFlow");
   for (i = 0; i < x.length; i++) {     
     sequencetxt += "SequenceFlow - " + "Id: " + x.item(i).getAttribute("id") + " Source: " + x.item(i).getAttribute("sourceRef") + "  Target: " + x.item(i).getAttribute("targetRef") + "\n" ;
    }
   console.log(sequencetxt);



   var x = xmlDoc.getElementsByTagName("association");
   for (i = 0; i < x.length; i++) {     
     assosstxt += "Association - " + "Id: " + x.item(i).getAttribute("id") + " Source: " + x.item(i).getAttribute("sourceRef") + "  Target: " + x.item(i).getAttribute("targetRef") + "\n" ;
    }
   console.log(assosstxt);



   var x = xmlDoc.getElementsByTagName("messageFlow");
   for (i = 0; i < x.length; i++) {     
     messagetxt += "messageFlow - " + "Id: " + x.item(i).getAttribute("id") + " Source: " + x.item(i).getAttribute("sourceRef") + "  Target: " + x.item(i).getAttribute("targetRef") + "\n" ;
    }
   console.log(messagetxt);


/*   
/
/
/
/
/
// criação das tabelas
/
/
/
/
/
*/

//tabela participantes

$(document).ready(function() {
    var tableparticipante =  $('#tableparticipante').DataTable( {
        data: participantArray,
        columns: [
            { title: "ID" ,data: "id" },
            { title: "Name", data:"name" }
        ],       
    } );

    $('#tableparticipante tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
        }
        else {
            tableparticipante.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    } );
 
    $('#button').click( function () {
      
      delete_id=tableparticipante .row('.selected').data().id
      tableparticipante .row('.selected').remove().draw( false );

for(i=0;i<participantArray.length;i++){
  if(delete_id==participantArray[i].id){
    participantArray.splice(i,1)
  }
}
console.log(participantArray);
    } );
    
    $('#buttonadd').click( function () {
  var newname = document.getElementById('partname').value
  var newid = document.getElementById('partid').value
  tableparticipante.rows.add([{
  "id": newid,
  "name": newname
                  
      }]).draw();

      var novo = new Participant(newid,newname);
      participantArray.push(novo);
    } );


} );

//
//
//
//
//
// Assets Table
//
//
//
//
//
//

$(document).ready(function() {
   var tableassets = $('#tableassets').DataTable( {
        data: assetArray,
        columns: [
            { title: "ID" ,data: "id" },
            { title: "Name", data:"name" }
        ]
    } );


    $('#tableassets tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
        }
        else {
            tableassets.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    } );
 
    $('#buttonasset').click( function () {
      
      delete_id=tableassets .row('.selected').data().id
      tableassets .row('.selected').remove().draw( false );

for(i=0;i<assetArray.length;i++){
  if(delete_id==assetArray[i].id){
    assetArray.splice(i,1)
  }
}
console.log(assetArray);
    } );
    
    $('#buttonaddasset').click( function () {
  var newname = document.getElementById('assetname').value
  var newid = document.getElementById('assetid').value
  tableassets.rows.add([{
  "id": newid,
  "name": newname
                  
      }]).draw();

      var novo = new Asset(newid,newname);
      assetArray.push(novo);
    } );




} );


//
//
//
//
//
// Task Table
//
//
//
//
//
//

$(document).ready(function() {
  var tabletask =  $('#tabletasks').DataTable( {
        data: taskArray,
        columns: [
            { title: "ID" ,data: "id" },
            { title: "Name", data:"name" },
            { title: "Datastore", data:"datastores" },
            { title: "Tipo", data:"typedatastore" },
            { title: "Participant", data:"participant" },
            { title: "Tipo", data:"typeparticipant" },
            { title: "IsTransfer", data:"istrasnfer" },
        ]
    } );



    $('#tabletasks tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
        }
        else {
            tabletask.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    } );
 
    $('#buttontask').click( function () {
      
      delete_id=tabletask .row('.selected').data().id
      tabletask .row('.selected').remove().draw( false );

for(i=0;i<taskArray.length;i++){
  if(delete_id==taskArray[i].id){
    taskArray.splice(i,1)
  }
}
console.log(taskArray);
    } );
    
    $('#buttonaddtask').click( function () {
  var newname = document.getElementById('taskname').value
  var newid = document.getElementById('taskid').value
  var newdatastores = document.getElementById('taskstore').value
  var newparticipant = document.getElementById('taskpart').value
 
  var checkBox = document.getElementById("tasktrasnfer");
  if(checkBox.checked == true){
  var newistransfer = true
  }else{
  var newistransfer = false
  }
  tabletask.rows.add([{
  "id": newid,
  "name": newname,
  "datastores": newdatastores,
  "participant": newparticipant,
  "istrasnfer": newistransfer
      }]).draw();

      var novo = new Task(newid,newname,newdatastores,newparticipant,newistransfer);
      taskArray.push(novo);
    } );

    
} );



