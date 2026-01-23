import {useEffect, useState} from "react";
import {useRestApi} from "../../api/RestApi";
import GuestBook from "../guestbook/GuestBook";
import {usePageContext} from "./Page";
import Gallery from "../gallery/Gallery";
import React from 'react'
import {usePageSectionContext} from "./PageSection";

/**
 * Display any page extras.
 *
 * @constructor
 */
export default function PageExtras() {

  // extras to show
  const [extras, setExtras] = useState([]);
  const {pageData} = usePageContext();
  const {getGuestBooks, getGalleries} = useRestApi();
  const {pageSectionData} = usePageSectionContext();

  useEffect(() => {
    if (pageData && getGuestBooks && getGalleries) {
      getGuestBooks().then((result) => {
        const newExtras = [];
        for (const guestBook of result) {
          if ((pageData && pageData.PageID === guestBook.PageID) || (pageSectionData && pageSectionData.PageSectionID === guestBook.PageSectionID)) {
            newExtras.push((
              <React.Fragment key={guestBook.GuestBookID}>
                <GuestBook guestBookId={guestBook.GuestBookID} pageId={guestBook.PageID}/>
              </React.Fragment>));
          }
        }
        getGalleries().then((result) => {
          for (const gallery of result) {
            if ((pageData && pageData.PageID === gallery.PageID) || (pageSectionData && pageSectionData.PageSectionID === gallery.PageSectionID)) {
              newExtras.push(
                <React.Fragment key={gallery.GalleryID}>
                  <Gallery galleryId={gallery.GuestBookID} pageId={gallery.PageID}/>)
                </React.Fragment>
              );
            }
          }
          setExtras(newExtras);
        }).catch((err) => {
          console.error(`Error getting gallery list.`, err);
        })
      }).catch((err) => {
        console.error(`Error getting guest book list.`, err);
      })
    }
  }, [getGuestBooks, getGalleries, pageData, pageSectionData]);

  return (<>
    {extras}
  </>)
}