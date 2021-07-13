import $ from 'jquery';

import BpmnModeler from 'bpmn-js/lib/Modeler';

import diagramXML from '../resources/newDiagram.bpmn';


//var express = require("express");
//var fs = require("fs");
//var app = express();

//data holders    
var participanttxt = "";
var datastoretxt = "";
var tasktxt = "";
var sequencetxt = "";
var messagetxt = "";
var assosstxt = "";



var container = $('#js-drop-zone');
var i;
var modeler = new BpmnModeler({
  container: '#js-canvas'
});

function createNewDiagram() {
  openDiagram(diagramXML);
}

async function openDiagram(xml) {

  try {
    await modeler.importXML(xml);
    container
      .removeClass('with-error')
      .addClass('with-diagram');
  } catch (err) {

    container
      .removeClass('with-diagram')
      .addClass('with-error');

    container.find('.error pre').text(err.message);

    console.error(err);
  }
}

function registerFileDrop(container, callback) {

  function handleFileSelect(e) {
    e.stopPropagation();
    e.preventDefault();

    var files = e.dataTransfer.files;

    var file = files[0];

    var reader = new FileReader();
    
 
    reader.onload = function(e) {
    
      //dados a obter - datastore - id - name
      //              - Assosiation - idsource - idtarget (entre datastore e task)
      //              - task - id - name
      //              - Sequenceflow - idsource - idtarget (entre tasks)
      //              - messageflow - idsource - idtarget (entre participant e task)
      //              - participant - id - name    
    
    var xml = e.target.result;
   
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml,"application/xml");


     var x = xmlDoc.getElementsByTagName("participant");
     for (i = 0; i < x.length; i++) {
      participanttxt += "Participant - " + "Id: " + x.item(i).getAttribute("id") + " Name: " + x.item(i).getAttribute("name") + "\n" ;
      }
     console.log(participanttxt);


     var x = xmlDoc.getElementsByTagName("dataStoreReference");
     for (i = 0; i < x.length; i++) {
      datastoretxt += "Datastore - " + "Id: " + x.item(i).getAttribute("id") + " Name: " + x.item(i).getAttribute("name") + "\n" ;
      }
     console.log(datastoretxt);

 

     var x = xmlDoc.getElementsByTagName("task");
     for (i = 0; i < x.length; i++) {
      tasktxt += "Task - " + "Id: " + x.item(i).getAttribute("id") + " Name: " + x.item(i).getAttribute("name") + "\n" ;
      }
     console.log(tasktxt);

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

     sessionStorage.setItem("test", xml);
    // console.log(xml);
     callback(xml);
    };



    reader.readAsText(file);
  }

  function handleDragOver(e) {
    e.stopPropagation();
    e.preventDefault();

    e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  container.get(0).addEventListener('dragover', handleDragOver, false);
  container.get(0).addEventListener('drop', handleFileSelect, false);
}


// file drag / drop ///////////////////////

// check file api availability
if (!window.FileList || !window.FileReader) {
  window.alert(
    'Looks like you use an older browser that does not support drag and drop. ' +
    'Try using Chrome, Firefox or the Internet Explorer > 10.');
} else {
  registerFileDrop(container, openDiagram);
}

// bootstrap diagram functions

$(function() {

  $('#js-create-diagram').click(function(e) {
    e.stopPropagation();
    e.preventDefault();

    createNewDiagram();
  });

  var downloadLink = $('#js-download-diagram');
  var downloadSvgLink = $('#js-download-svg');
  var downloadSmart = $('#js-process-smart-contract');

  $('.buttons a').click(function(e) {
    if (!$(this).is('.active')) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  function setEncoded(link, name, data) {
    var encodedData = encodeURIComponent(data);

    if (data) {
      link.addClass('active').attr({
        'href': 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData,
        'download': name
      });
    } else {
      link.removeClass('active');
    }
  }

  var exportArtifacts = debounce(async function() {

    try {

      const { svg } = await modeler.saveSVG();

      setEncoded(downloadSvgLink, 'diagram.svg', svg);
    } catch (err) {

      console.error('Error happened saving svg: ', err);
      setEncoded(downloadSvgLink, 'diagram.svg', null);
    }

    try {
      const { xml } = await modeler.saveXML({ format: true });
      setEncoded(downloadLink, 'diagram.bpmn', xml);
    } catch (err) {

      console.error('Error happened saving XML: ', err);
      setEncoded(downloadLink, 'diagram.bpmn', null);
    }

  }, 500);

  modeler.on('commandStack.changed', exportArtifacts);
});





// helpers //////////////////////

function debounce(fn, timeout) {

  var timer;

  return function() {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(fn, timeout);
  };
}


/*app.get('/test', (req, res) => {
  res.send('Hello World!')
})*/