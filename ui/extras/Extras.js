import {useEffect, useState} from "react";
import {useRestApi} from "../../api/RestApi";
import GuestBook from "../guestbook/GuestBook";
import {usePageContext} from "../content/Page";
import Gallery from "../gallery/Gallery";
import React from 'react'
import Instagram from "../embed/Instagram";

/**
 * Display any page extras.
 *
 * @constructor
 */
export default function Extras() {

  // extras to show
  const [extras, setExtras] = useState([]);
  const {pageData} = usePageContext();
  const {Extras} = useRestApi();

  useEffect(() => {
    if (pageData) {
      Extras.getPageExtras(pageData.PageID).then(result => {
        setExtras(result);
      });
    }
  }, [pageData])
  return (<>
    {extras.map((extra) => (<>
      {extra.ExtraType === 'guestbook' && (
        <React.Fragment key={extra.ExtraID}>
          <GuestBook guestBookId={extra.GuestBookID} extraId={extra.ExtraID}/>
        </React.Fragment>
      )}
      {extra.ExtraType === 'gallery' && (
        <React.Fragment key={extra.ExtraID}>
          <Gallery galleryId={extra.GalleryID} extraId={extra.ExtraID}/>
        </React.Fragment>
      )}
      {extra.ExtraType === 'instagram' && (
        <React.Fragment key={extra.ExtraID}>
          <Instagram extraData={extra}/>
        </React.Fragment>
      )}
    </>))}
  </>)
}