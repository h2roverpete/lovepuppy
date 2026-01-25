import {useEffect, useState} from "react";
import {useRestApi} from "../../api/RestApi";
import GuestBook from "../guestbook/GuestBook";
import {usePageContext} from "../content/Page";
import Gallery from "../gallery/Gallery";
import React from 'react'
import Instagram from "../instagram/Instagram";
import FileExtra from "./FileExtra";

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
    {extras.map((extra) => (<React.Fragment key={extra.ExtraID}>
      {extra.ExtraType === 'guestbook' && (
        <GuestBook guestBookId={extra.GuestBookID} extraId={extra.ExtraID}/>
      )}
      {extra.ExtraType === 'gallery' && (
        <Gallery galleryId={extra.GalleryID} extraId={extra.ExtraID}/>
      )}
      {extra.ExtraType === 'instagram' && (
        <Instagram extraData={extra}/>
      )}
      {extra.ExtraType === 'file' && (
        <FileExtra extraData={extra}/>
      )}
    </React.Fragment>))}
  </>)
}