import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from "react";
import PdfView from './components/pdfView';

function App() {
  const [pdfNum, setPdfNum] = useState(0);
  var urls= ['https://arxiv.org/pdf/2212.08011.pdf', 'https://arxiv.org/pdf/2212.07937.pdf', 'https://arxiv.org/pdf/2212.07931.pdf']

  return (
    <div className="App">
      {!pdfNum ?
        <>
          <div className='heading'>
            <h2>Documents</h2>
          </div>
          <div className='subhead'>
            {[1,2,3].map(i=>(
              <h3>-<span onClick={()=>setPdfNum(i)}>Sample document {i}.pdf</span></h3>
            ))}
          </div>
        </>
      :
        <PdfView
          pdf={urls[pdfNum-1]}
        />
      }
    </div>
  );
}

export default App;
