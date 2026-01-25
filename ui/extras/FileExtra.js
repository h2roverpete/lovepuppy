import {useSiteContext} from "../content/Site";
import {useEffect, useState} from "react";
import ExtraConfig from "./ExtraConfig";

export default function FileExtra({extraData}) {

  const {siteData} = useSiteContext();
  const [content, setContent] = useState(<></>);

  useEffect(() => {
    if (siteData && extraData) {
      const parts = extraData.ExtraFile.split("/");
      const fileUrl = `${siteData?.SiteRootUrl}/${extraData.ExtraFile}`;
      const fileName = parts[parts.length - 1];
      switch (extraData.ExtraFileMimeType) {
        case 'text/plain':
          // embed HTML on the page
          fetch(fileUrl)
            .then(response => response.text())
            .then(data => setContent(<>
              <pre className={'Extra'}>{data}</pre>
              <ExtraConfig extraData={extraData}/>
            </>))
            .catch(error => console.error(`Error fetching HTML ${fileUrl}:`, error));
          break;
        case 'text/html':
          // embed HTML on the page
          fetch(fileUrl)
            .then(response => response.text())
            .then(data => setContent(<>
              <div className={'Extra'} dangerouslySetInnerHTML={{__html: data}}/>
              <ExtraConfig extraData={extraData}/>
            </>))
            .catch(error => console.error(`Error fetching HTML ${fileUrl}:`, error));
          break;
        default:
          // display a link to the file
          setContent(<>
            <div className={'Extra'}>
              <a
                href={fileUrl}>{extraData.ExtraFilePrompt ? extraData.ExtraFilePrompt : fileName}</a>
            </div>
            <ExtraConfig extraData={extraData}/>
          </>);
          break;
      }
    }
  }, [siteData, extraData]);
  return content;
}