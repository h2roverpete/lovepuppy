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
  const [guestBooks, setGuestBooks] = useState([]);
  const [galleries, setGalleries] = useState([]);

  const {pageData} = usePageContext();
  const {getGuestBooks, getGalleries} = useRestApi();

  useEffect(() => {
    if (pageData && getGuestBooks) {
      getGuestBooks().then((result) => {
        const display = [];
        for (const guestBook of result) {
          if (guestBook.PageID === pageData.PageID) {
            display.push((<GuestBook guestBookId={guestBook.GuestBookID} pageId={guestBook.PageID}/>));
          }
        }
        setGuestBooks(display);
      }).catch((err) => {
        console.error(`Error getting guest book list.`, err);
      })
    }
  }, [getGuestBooks, pageData]);

  useEffect(() => {
    if (pageData && getGalleries) {
      getGalleries().then((result) => {
        const display = [];
        for (const gallery of result) {
          if (gallery.PageID === pageData.PageID) {
            display.push((<Gallery galleryId={gallery.GuestBookID} pageId={gallery.PageID}/>));
          }
        }
        setGalleries(display);
      }).catch((err) => {
        console.error(`Error getting gallery list.`, err);
      })
    }
  }, [getGalleries, pageData]);

  return (<>
    {guestBooks.map((guestBook) => (<React.Fragment key={guestBook.GuestBookID}>
      {guestBook}
    </React.Fragment>))}
    {galleries.map((gallery) => (<React.Fragment key={gallery.GalleryID}>
      {gallery}
    </React.Fragment>))}
  </>)
}