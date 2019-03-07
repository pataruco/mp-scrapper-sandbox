import getMpIndex from './src/index';
import getMp from './src/mp';
import { MP } from './typings/mp';
import fs from 'fs';
import colors from 'colors/safe';
import puppeteer from 'puppeteer';

process.setMaxListeners(Infinity);

let numberOfMPs = 0;
let numberofMPsScraped = 1;

export const saveMembersInAFile = async (data: MP[]) => {
  const mpObject = JSON.stringify(data);
  try {
    await fs.writeFileSync('./data/members.json', mpObject);
    console.log(colors.yellow('The file was saved!'));
  } catch (error) {
    console.error(colors.red(JSON.stringify(error)));
    throw error;
  }
};

export const scrapeMps = async (links: string[]): Promise<MP[]> => {
  const browser = await puppeteer.launch({
    headless: true,
    handleSIGINT: false,
  });
  const page = await browser.newPage();
  const mps: MP[] = [];
  for (const link of links) {
    let mp: MP;
    try {
      mp = await getMp(page, link);
    } catch (error) {
      console.error(colors.red(JSON.stringify(error)));
      throw error;
    }
    console.log(
      colors.green(`${mp.name} `) +
        `/ has been scrapped ` +
        colors.yellow(`${numberofMPsScraped++} `) +
        `of ` +
        colors.green(`${numberOfMPs}`),
    );
    mps.push(mp);
  }
  browser.close();
  return mps;
};

const start = async (
  saveMembersInAFilefn = saveMembersInAFile,
): Promise<void> => {
  console.log(colors.yellow('Scraper started'));
  const mpIndex = await getMpIndex();
  numberOfMPs = mpIndex.length;
  const mps = await scrapeMps(mpIndex);
  await saveMembersInAFilefn(mps);
};

if (!module.parent) {
  start().catch(console.error);
}

export default start;

// start();
