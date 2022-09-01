const playwright = require('playwright');
const browserType = "chromium";
const personnr = "";
const regnr = "";
const list = [];


async function run(){
    let year;
    let date = new Date;
    if (personnr.slice(0,2)[0] == 1|| personnr.slice(0,2)[0] == 2 || personnr.slice(0,2)[0] == 3 || personnr.slice(0,2)[0] == 4 || personnr.slice(0,2)[0] == 5){
        year = Number(`19${personnr.slice(0,2)}`);
    }
    const browser = await playwright[browserType].launch({headless:false});
    const context = await browser.newContext();
    list.push({namn: "Folksam", props: await folksam(context, personnr, regnr)});
    list.push({namn: "If", props: await IF(context, personnr, regnr)});
    list.push({namn: "Trygghansa", props: await tryggHansa(context, personnr, regnr)});
    list.sort((a, b) => Number(a.props.halv) > Number(b.props.halv)? 1: -1);
    console.log(list);
}

run();

async function folksam(context, personnr, regnr) {
    try {
        const page = await context.newPage();
    await page.goto("https://www.folksam.se/forsakringar/bilforsakring?icmp=h_tp_bilforsakring");
    await page.waitForLoadState();
    await page.click("#onetrust-accept-btn-handler"); // cookie
    await page.fill("#regnr", regnr); // Regnummer
    await page.fill("#ssn", personnr); // Personnummer
    await page.click("#main > div.centeredbanner_background_color.u-bgcolor-blue-5 > div > div > div > div > form > div.css-1l92nzk > button > span > span");
    let amountHalv = page.locator("#root > div.c014 > div > section.c0117.c0118 > div > div > form > div > section:nth-child(2) > div:nth-child(2) > div > div > div > div > div.css-yurkfg > label > div > div.c01135 > div", {timeout: 10000});
    let amountHel = page.locator("#root > div.c014 > div > section.c0117.c0118 > div > div > form > div > section:nth-child(2) > div:nth-child(2) > div > div > div > div > div.css-6wd47n > label > div > div.c01135 > div", {timeout:10000});
    amountHalv = await amountHalv.textContent();
    amountHel = await amountHel.textContent();
    let halv = fixString(amountHalv, "k");
    let hel = fixString(amountHel, "k");
    return {Halv: halv, Hel:hel};
    } catch (error) {
        return ({Halv:"-", Hel:"-"});
    }
}

async function IF(context, personnr, regnr) {
    try {
        const page = await context.newPage();
    await page.goto("https://www.if.se/privat/forsakringar/bilforsakring");
    await page.waitForLoadState();
    await page.click("body > div.optanon-alert-box-wrapper > div.optanon-alert-box-bg > div.optanon-alert-box-button-container > div.optanon-alert-box-button.optanon-button-allow > div > button"); // cookie
    await page.click("#hero_display_webshop_button");
    await page.fill("#hero_webshop_wrapper > os-entry > os-entry-template > div > os-entry-input:nth-child(1) > os-unified-text-input > input", regnr); // Regnummer
    await page.fill("#hero_webshop_wrapper > os-entry > os-entry-template > div > os-entry-input:nth-child(2) > os-unified-text-input > input", personnr); // Personnummer
    await page.click("#hero_webshop_wrapper > os-entry > os-entry-template > div > os-spinner-button > button");
    await page.waitForTimeout(5000);
    let amountHalv = page.locator("#app > div > table > thead > div > tr > th.col.col-2 > div > div.price > strong > polaris-price > span:nth-child(1)");
    let amountHel = page.locator("#app > div > table > thead > div > tr > th.selected.col.col-1 > div > div.price > strong > polaris-price > span:nth-child(1)");
    amountHalv = await amountHalv.textContent();
    amountHel = await amountHel.textContent();
    let halv = amountHalv.trim();
    let hel = amountHel.trim();
    return {Halv: halv, Hel: hel};
    } catch (error) {
        return ({Halv:"-", Hel:"-"});
    }
}

async function tryggHansa(context, personnr, regnr) {
    try {
        const page = await context.newPage();
    await page.goto("https://www.trygghansa.se/");
    await page.waitForLoadState();
    await page.click("#ctl00_PlaceholderBlankPage_ctl04_ctl00_lbOk"); // cookie
    await page.fill("#ctl00_ctl40_g_820217c6_8d73_4d25_81d7_92f36c89c5b5_ctl00_tbRegnr_txbInput", regnr); // Regnummer
    await page.fill("#ctl00_ctl40_g_820217c6_8d73_4d25_81d7_92f36c89c5b5_ctl00_tbSsn_txbInput", personnr); // Personnummer
    await page.click("#ctl00_ctl40_g_820217c6_8d73_4d25_81d7_92f36c89c5b5_ctl00_btnQqPl");
    await page.waitForNavigation();
    await page.click("#spa-pl-car-v2 > div > div:nth-child(2) > div > div.th-grid-layout__main-content > div:nth-child(3) > div.th-grid-layout__column--left > div:nth-child(1) > div.th-quote-view__section__content > div > div:nth-child(4) > div > div:nth-child(2) > div > label:nth-child(3)");
    await page.waitForTimeout(2000);
    let amountHalv = page.locator("#spa-pl-car-v2 > div > div:nth-child(2) > div > div.th-grid-layout__main-content > div:nth-child(3) > div.th-grid-layout__column--left > div:nth-child(1) > div.th-quote-view__section__content > div > div:nth-child(3) > div > div.app-radio-button-accordion__container > div:nth-child(1) > div > label:nth-child(2) > span > span:nth-child(2)");
    let amountHel = page.locator("#spa-pl-car-v2 > div > div:nth-child(2) > div > div.th-grid-layout__main-content > div:nth-child(3) > div.th-grid-layout__column--left > div:nth-child(1) > div.th-quote-view__section__content > div > div:nth-child(3) > div > div.app-radio-button-accordion__container > div:nth-child(1) > div > label.app-radio-button-list__option.app-radio-button-list__option--selected > span > span:nth-child(2)");
    amountHalv = await amountHalv.textContent();
    amountHel = await amountHel.textContent();
    let halv = fixString(amountHalv, "k");
    let hel = fixString(amountHel, "k");
    return {Halv: halv, Hel: hel};
    } catch (error) {
        return ({Halv:"-", Hel:"-"});
    }
}
async function länsförsäkringar(context, personnr, regnr) {
    try {
        const page = await context.newPage();
    await page.goto("https://www.lansforsakringar.se/stockholm/privat/forsakring/bilforsakring/");
    await page.waitForLoadState();
    await page.click("#onetrust-accept-btn-handler"); // cookie
    await page.fill("#b6dba386-7b16-4896-ab6e-de828dc785e0", regnr); // Regnummer
    await page.fill("#__field_ > div > div > div > div:nth-child(2) > div > input", personnr); // Personnummer
    await page.click("#__field_ > div > div > div > div.col.align-self-end.barker-send-button.col-md-6 > div > button");
    await page.waitForTimeout(2000);
    await page.click("#app > div:nth-child(1) > div > div > div:nth-child(1) > div:nth-child(2) > div.col-8 > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div.card-block > div:nth-child(3) > fieldset > label");
    await page.waitForTimeout(2000);
    let amountHel = page.locator("#app > div:nth-child(1) > div > div > div:nth-child(1) > div:nth-child(2) > div.col-4.pl-0 > div > div.mb-1.hide-empty > div > aside > div.price-box-header > div > div:nth-child(1) > p");
    amountHel = await amountHel.textContent();
    let hel = Number(amountHel);
    await page.click("#app > div:nth-child(1) > div > div > div:nth-child(1) > div:nth-child(2) > div.col-8 > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(2) > div.my-1 > div > div > fieldset > div > div:nth-child(2)")
    await page.waitForTimeout(2000);
    let amountHalv = page.locator("#app > div:nth-child(1) > div > div > div:nth-child(1) > div:nth-child(2) > div.col-4.pl-0 > div > div.mb-1.hide-empty > div > aside > div.price-box-header > div > div:nth-child(1) > p");
    amountHalv = await amountHalv.textContent();
    let halv = Number(amountHalv);
    console.log(hel, halv);
    return {Halv: halv, Hel: hel};
    } catch (error) {
        return ({Halv:"-", Hel:"-"});
    }
}




async function template(context, personnr, regnr) {
    try {
        const page = await context.newPage();
    await page.goto("");
    await page.waitForLoadState();
    await page.click(""); // cookie
    await page.fill("#regnr", regnr); // Regnummer
    await page.fill("#ssn", personnr); // Personnummer
    await page.click("");
    let amountHalv = page.locator("");
    let amountHel = page.locator("");
    amountHalv = await amountHalv.textContent();
    amountHel = await amountHel.textContent();
    let halv = fixString(amountHalv, "k");
    let hel = fixString(amountHel, "k");
    return {Halv: halv, Hel: hel};
    } catch (error) {
        return ({Halv:"-", Hel:"-"});
    }
}

function fixString(string, startLetter = "k"){
    return string.slice(0,string.indexOf(startLetter)).trim();
}