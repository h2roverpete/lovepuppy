import React, {useState, useEffect, useContext} from 'react';
import {PageContext} from "./Page";

export default function HtmlFile(props) {
  const {pageData} = useContext(PageContext);

  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    fetch(props.fileName)
      .then(response => response.text())
      .then(data => setHtmlContent(data))
      .catch(error => console.error(`Error fetching HTML ${props.fileName}:`, error));
  }, []);

  return (
    <>{pageData?.PageID === props.pageId && (
      <div dangerouslySetInnerHTML={{__html: htmlContent}}/>
    )}</>
  );
}