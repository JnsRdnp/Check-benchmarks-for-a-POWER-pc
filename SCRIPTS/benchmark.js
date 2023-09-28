const { By, Key, Builder } = require('selenium-webdriver');
const prompt = require('prompt-sync')({ sigint: true });

//require('chromedriver');

async function getBenchmark(processor,driver) {
  /* let driver = await new Builder().forBrowser('chrome').build(); */

  try {
    await driver.get('https://www.cpubenchmark.net/cpu_list.php');

    await driver.findElement(By.className('css-47sehv')).click();

    let xpathExpression = `//*[contains(text(),'${processor}')]`;

    let element = await driver.findElement(By.xpath(xpathExpression));

    let parentElement = await element.findElement(By.xpath('..'));
    let nextSibling = await parentElement.findElement(By.xpath('following-sibling::*'));

    let text = await element.getText();
    let siblingText = await nextSibling.getText();

    console.log(text, '\n', siblingText);

  } catch (error) {
    //console.error('An error occurred:', error);
  } finally {
    if (driver) {
      await driver.close();
      await driver.quit();
    }
  }
}

async function getPC2(pclink,driver) {
    //let driver = null; // Initialize the driver variable outside the try block
  
    try {
        //driver = await new Builder().forBrowser('chrome').build();
    
        await driver.get(pclink);
    
        await driver.findElement(By.className('coi-banner__accept')).click();
    
        // Get the text from the element with the specified class name

        let teknisettiedotLocation = `//*[contains(text(),'Tekniset tiedot')]`;

        await driver.findElement(By.xpath(teknisettiedotLocation)).click();

        
        let prossessorModelXPATH = `//*[contains(text(),'Prosessori (malli)')]`;
        let prossorinMalliTektsi = await driver.findElement(By.xpath(prossessorModelXPATH));

        let cpuMODEL = await prossorinMalliTektsi.findElement(By.xpath('following-sibling::*')).getText();

        return cpuMODEL;


        } catch (error) {
          //console.error("An error occurred:", error);
        } finally {
/*             if (driver) {
              await driver.quit();
        } */
    }
  }


async function main(){

  let driver = null;
      try{
      const pclink = prompt("link to pc(press e to quit):");

      driver = await new Builder().forBrowser('chrome').build();

      if (pclink === "e") {

        await driver.quit();
        
      } else {
        
        let cpuName = await getPC2(pclink,driver);
        console.log("cpu is: ",cpuName)
        await getBenchmark(cpuName,driver);

        await driver.quit();
      }
      }catch (error){
      
      }finally{     
/*         if (driver) {
          await driver.quit();
        } */
      }
}

main();