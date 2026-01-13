import React from 'react';
import {useCookies} from "react-cookie";
import {useContext, useMemo} from "react";
import axios from "axios";

export const RestApiContext = React.createContext({});

export default function RestApi(props) {

  const siteId = useMemo(() => parseInt(process.env.REACT_APP_SITE_ID), []);
  const host = useMemo(() => process.env.REACT_APP_BACKEND_HOST, []);
  const apiKey = useMemo(() => process.env.REACT_APP_API_KEY, []);
  const [cookies] = useCookies(); // can't use auth context, access directly

  axios.defaults.headers.common["x-api-key"] = apiKey;
  if (cookies.token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${cookies.token.access_token}`;
  }

  async function getPage(pageId) {
    const response = await axios.get(`${host}/api/v1/content/pages/${pageId}`);
    return response.data;
  }

  async function getPageSections(pageId) {
    const response = await axios.get(`${host}/api/v1/content/pages/${pageId}/sections`);
    return response.data;
  }

  async function insertOrUpdatePageSection(data) {
    const response = await axios.post(`${host}/api/v1/content/pages/${data.PageID}/sections`, data);
    return response.data;
  }

  async function uploadSectionImage(pageId, pageSectionId, file) {
    const formData = new FormData();
    formData.append('SectionImage', file);
    const response = await axios.post(`${host}/api/v1/content/pages/${pageId}/sections/${pageSectionId}/image`, formData);
    return response.data;
  }

  async function deleteSectionImage(pageId, pageSectionId) {
    const response = await axios.delete(`${host}/api/v1/content/pages/${pageId}/sections/${pageSectionId}/image`);
    return response.data;
  }

  async function deletePageSection(pageId, pageSectionId) {
    const response = await axios.delete(`${host}/api/v1/content/pages/${pageId}/sections/${pageSectionId}`);
    return response.data;
  }

  async function insertOrUpdatePage(data) {
    const response = await axios.post(`${host}/api/v1/content/pages/${data.PageID}`, data);
    return response.data;
  }

  async function getSite() {
    const response = await axios.get(`${host}/api/v1/content/sites/${siteId}`);
    return response.data;
  }

  async function getSiteOutline() {
    const response = await axios.get(`${host}/api/v1/content/sites/${siteId}/outline`);
    return response.data;
  }

  async function getSitemap() {
    const response = await axios.get(`${host}/api/v1/content/sites/${siteId}/sitemap`);
    return response.data;
  }

  async function getGuestBook(guestBookId) {
    const response = await axios.get(`${host}/api/v1/guestbook/${guestBookId}`);
    return response.data;
  }

  async function getGuest(guestId) {
    const response = await axios.get(`${host}/api/v1/guestbook/guest/${guestId}`);
    return response.data;
  }

  async function insertOrUpdateGuest(guestBookId, data) {
    const response = await axios.post(`${host}/api/v1/guestbook/${guestBookId}/guest`, data);
    return response.data;
  }

  async function getGuestFeedback(guestFeedbackId) {
    const response = await axios.get(`${host}/api/v1/guestbook/feedback/${guestFeedbackId}`);
    return response.data;
  }

  async function insertOrUpdateGuestFeedback(guestId, data) {
    const response = await axios.post(`${host}/api/v1/guestbook/guest/${guestId}/feedback`, data);
    return response.data;
  }

  async function getGallery(galleryId) {
    const response = await axios.get(`${host}/api/v1/gallery/${galleryId}`);
    return response.data;
  }

  async function getPhotos(galleryId) {
    const response = await axios.get(`${host}/api/v1/gallery/${galleryId}/photos`);
    return response.data;
  }

  async function getAuthToken(clientId, redirectUrl, authCode) {
    const response = await axios.post(`${host}/oauth/token?client_id=${clientId}&redirect_uri=${redirectUrl}&code=${authCode}&grant_type=authorization_code`);
    return response.data;
  }

  async function refreshToken(refreshToken, clientId) {
    const response = await axios.post(`${host}/oauth/token?client_id=${clientId}&grant_type=refresh_token&refresh_token=${refreshToken}`);
    return response.data;
  }

  async function checkToken() {
    const response = await axios.get(`${host}/oauth/check`);
    return response.data;
  }

  return (
    <RestApiContext value={{
      getPage: getPage,
      getPageSections: getPageSections,
      insertOrUpdatePageSection: insertOrUpdatePageSection,
      uploadSectionImage: uploadSectionImage,
      deleteSectionImage: deleteSectionImage,
      deletePageSection: deletePageSection,
      insertOrUpdatePage: insertOrUpdatePage,
      getSite: getSite,
      getSiteOutline: getSiteOutline,
      getSitemap: getSitemap,
      getGuestBook: getGuestBook,
      getGuest: getGuest,
      insertOrUpdateGuest: insertOrUpdateGuest,
      getGuestFeedback: getGuestFeedback,
      insertOrUpdateGuestFeedback: insertOrUpdateGuestFeedback,
      getGallery: getGallery,
      getPhotos: getPhotos,
      getAuthToken: getAuthToken,
      refreshToken: refreshToken,
      checkToken: checkToken,
    }}>
      {props.children}
    </RestApiContext>
  );
}

export function useRestApi() {
  return useContext(RestApiContext);
}