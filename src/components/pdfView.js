import { func } from 'prop-types';
import React from 'react';
import { useState, useEffect } from "react";
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

const PdfView = ({pdf}) => {
  const [numPages, setNumPages] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [type, setType] = useState('');
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if(authors.length){
      localStorage.setItem(pdf,JSON.stringify([...authors]))
    }else if(localStorage.getItem(pdf)){
      setAuthors(JSON.parse(localStorage.getItem(pdf)))
    }
  }, [authors])


  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  useEffect(() => {
    if(type){
        var canvas = document.querySelector(`.react-pdf__Document`);
          //Variables
          document.querySelector('.pdfBox').scrollTop = 0;
          var canvasx = canvas.getBoundingClientRect().left;
          var canvasy = canvas.getBoundingClientRect().top;
          var last_mousex = 0;
          var last_mousey = 0;
          var mousex = 0;
          var mousey = 0;
          var mousedown = false;
          // Mousedown
          function md(e){
            last_mousex = parseInt(e.clientX-canvasx);
            last_mousey = parseInt(e.clientY-canvasy);
            mousedown = true;
          }
          canvas.addEventListener('mousedown', md);

          // //Mouseup
          function mu(){
            mousedown = false;
            var width = mousex-last_mousex;
            var height = mousey-last_mousey;
            if(width>0 && height>0){
              var d = {
                'last_mousex':last_mousex,
                'last_mousey':last_mousey+document.querySelector('.pdfBox').scrollTop,
                'width':width,
                'height':height,
              };
              setAuthors(a=>[...a, {
                ...d,
                'type':type,
                'page_num':0
              }]);
            }
          }
          canvas.addEventListener('mouseup', mu);

          //Mousemove
          function mv(e){
            mousex = parseInt(e.clientX-canvasx);
            mousey = parseInt(e.clientY-canvasy);
              if(mousedown) {
                  var width = mousex-last_mousex;
                  var height = mousey-last_mousey;
                  var rec = `<svg style='left:${last_mousex};top:${last_mousey+document.querySelector('.pdfBox').scrollTop};'><rect x=${0} y=${0} width=${width} height=${height} style="fill:rgba(5, 173, 5,.3);stroke-width:1;stroke:rgba(5, 173, 5,.8)"></rect></svg>`
                  if(type=='title'){
                    rec = `<svg style='left:${last_mousex};top:${last_mousey+document.querySelector('.pdfBox').scrollTop};'><rect x=${0} y=${0} width=${width} height=${height} style="fill:rgba(255, 165, 0,.3);stroke-width:1;stroke:rgba(255, 165, 0,.8)"></rect></svg>`
                  }
                  var temp = document.querySelector('.pdfView .temp');
                  temp.innerHTML = rec;
              }
          }
          canvas.addEventListener('mousemove', mv);

      return () => {
        canvas.removeEventListener('mousedown', md);
        canvas.removeEventListener('mouseup',mu)
        canvas.removeEventListener('mousemove', mv);
      }
    }
  }, [type])

  function onPageRendered(i) {
    if(i == 1){
      setType('author');
    }
  }

  return (
    <div className='pdfView'>
      <div className='info'>
        <div className='labels'>
          <h3>Labels</h3>
          <div onClick={()=>setType('title')} className={`btn titleBtn ${type=='title'?'selected':''}`}>Title</div>
          <div onClick={()=>setType('author')} className={`btn AuthorBtn ${type!=='title'?'selected':''}`}>Author</div>
        </div>
        <div className='boxes'>
          <h3>Boxes</h3>
          {authors.map((a)=>(
            <div className='data'>
              x: {parseInt(a.last_mousex)}, y: {parseInt(a.last_mousey)} width: {parseInt(a.width)}
              {a.type=='title' ?
                <div className={`btn titleBtn`}>Title</div>
              :
                <div className={`btn AuthorBtn`}>Author</div>      
              }
            </div>
          ))}
        </div>
      </div>
      <div className='pdfBox'>
        <Document 
          file={pdf}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {Array.from(
            new Array(numPages),
            (el, index) => (
              <Page
                key={`page_${index + 1}`}
                className={`page_${index + 1}`}
                pageNumber={index + 1}
                width={525}
                renderTextLayer={false}
                onRenderSuccess={()=>onPageRendered(index+1)}
              >
              </Page>
            ),
          )}

          <div className='perm'>
            {authors.map((a)=>{
              // if(a.page_num==(index+1)){
                if(a.type=='title'){
                  return <svg style={{left:a.last_mousex,top:a.last_mousey}}><rect x={0} y={0} width={a.width} height={a.height} style={{fill:'rgba(255, 165, 0,.3)',strokeWidth:1,stroke:'rgba(255, 165, 0,.8)'}}></rect></svg>
                }else{
                  return <svg style={{left:a.last_mousex,top:a.last_mousey}}><rect x={0} y={0} width={a.width} height={a.height} style={{fill:'rgba(5, 173, 5,.3)',strokeWidth:1,stroke:'rgba(5, 173, 5,.8)'}}></rect></svg>
                }
              // }
            })}
          </div>
          <div className='temp'>
          </div>
        </Document>
      </div>
    </div>
  )
}

export default PdfView;