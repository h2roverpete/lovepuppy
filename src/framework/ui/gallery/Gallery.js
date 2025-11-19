import {useContext, useEffect, useState} from "react";
import {PageContext} from "../content/Page";
import {SiteContext} from "../content/Site";
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";

/**
 * @typedef GalleryProps
 * @property {number} galleryId
 * @property {number} pageId
 */

/**
 * Display a photo gallery
 *
 * @param props {GalleryProps}
 * @returns {JSX.Element}
 * @constructor
 */
export default function Gallery(props) {

  const {pageData} = useContext(PageContext);
  const {restApi} = useContext(SiteContext);
  const [galleryConfig, setGalleryConfig] = useState(null);
  const [galleryPhotos, setGalleryPhotos] = useState(null);

  useEffect(() => {
    if (restApi && props.galleryId && pageData?.PageID === props.pageId && !galleryConfig) {
      restApi.getGallery(props.galleryId).then((data) => {
        console.debug(`Loaded gallery ${props.galleryId}.`);
        setGalleryConfig(data);
      }).catch(error => {
        console.error(`Error loading gallery ${props.galleryId}: ${error}`);
      })
    }
  }, [restApi, props.galleryId, props.pageId, pageData.PageID, galleryConfig]);

  useEffect(() => {
    if (restApi && props.galleryId && pageData?.PageID === props.pageId && !galleryPhotos) {
      restApi.getPhotos(props.galleryId).then((data) => {
        console.debug(`Loaded ${data.length} photos for gallery ${props.galleryId}.`);
        setGalleryPhotos(data);
      }).catch(error => {
        console.error(`Error loading photos for gallery ${props.galleryId}: ${error}`);
      })
    }
  }, [restApi, props.galleryId, props.pageId, pageData.PageID, galleryPhotos]);

  const images = [];
  if (galleryPhotos) {
    for (const photo of galleryPhotos) {
      images.push({
        original: `${process.env.PUBLIC_URL}/images/gallery/${photo.SubDirectory.toString().padStart(3, '0')}/${photo.PhotoLarge}`,
        thumbnail: `${process.env.PUBLIC_URL}/images/gallery/${photo.SubDirectory.toString().padStart(3, '0')}/${photo.PhotoSmall}`,
      })
    }
  }

  return (
    <>{pageData?.PageID === props.pageId && images.length > 0 && (
      <div className="Gallery">
        <ImageGallery items={images}/>
      </div>
    )}</>
  )
}
