import minimist from 'minimist';
import gulp from 'gulp';
import 'colors';
import RestAPI from 'framework/api/api.mjs'
import * as fs from "node:fs";
import 'dotenv/config';

const args = minimist(process.argv.slice(2));

gulp.task("buildSitemap", async function () {
  const restApi = new RestAPI(
    parseInt(process.env.REACT_APP_SITE_ID),
    process.env.REACT_APP_BACKEND_HOST,
    process.env.REACT_APP_API_KEY
  );
  const sitemap = await restApi.getSitemap();
  fs.writeFileSync(`./public/sitemap.xml`, sitemap);
  console.log(`Site map:\n\n${sitemap}`.green);
});