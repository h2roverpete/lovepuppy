import {Button, Collapse} from "react-bootstrap";
import {BsChevronLeft, BsChevronRight} from "react-icons/bs";
import SiteFields from "./SiteFields";
import SiteOutline from "./SiteOutline";
import {useState} from "react";

export default function SiteEditor({children}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className="SiteEditor"
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100vw',
        minHeight: '100vh',
        height: '100%'
      }}
    >
        <Collapse
          in={expanded}
          dimension={'width'}
        >
          <div style={{
            width: '250px',
            minWidth: '250px',
            height: '100vh',
            borderRight: '1px solid #00000040',
            backgroundColor: '#e0e0e0f0',
            position: 'fixed',
            left: '0px',
            zIndex: '100',
          }}>
            <div style={{
              padding: '7px 10px 10px 20px',
              display: 'flex',
              flexDirection: 'column',
              height: '100vh',
            }}>
              <div style={{flexGrow: 1}}>
                <h5>Site Outline</h5>
                <SiteOutline/>
              </div>
              <div style={{flexGrow: 0}}>
                <h5 className={'mt-4'}>Site Properties</h5>
                <SiteFields/>
              </div>
            </div>
          </div>
        </Collapse>
      <Button
        onClick={() => setExpanded(!expanded)}
        className={'bg-transparent btn-light border-0'}
        style={{
          padding: '10px 0 0 2px',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          zIndex: '900',
        }}
      >
        {expanded ? (<BsChevronLeft size={'18'}/>) : ((<BsChevronRight/>))}
      </Button>
      {
        children
      }
    </div>
  )
}