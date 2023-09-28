const { By, Key, Builder } = require('selenium-webdriver');
const prompt = require('prompt-sync')({ sigint: true });

//require('chromedriver');

async function getBenchmark(processor) {
  let driver = await new Builder().forBrowser('chrome').build();

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
    await driver.quit();
  }
}

async function getPC(pclink) {
    let driver = null; // Initialize the driver variable outside the try block
  
    try {
      driver = await new Builder().forBrowser('chrome').build();
  
      await driver.get(pclink);
  
      await driver.findElement(By.className('coi-banner__accept')).click();
  
      // Get the text from the element with the specified class name
      const text = await driver.findElement(By.className('my-spacer-solo')).getText();
  
      // get the cpu
      const lines = text.split('\n');
      if (lines.length >= 2) {
        const secondLineWords = lines[1].split(/\s+/);
  
        const fetchedCpu = secondLineWords[secondLineWords.length - 1];

        return fetchedCpu;
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      if (driver) {
        await driver.quit();
      }
    }
  }


async function main(){
    while (true) {
        const pclink = prompt("(e to quit) link to pc:");
        
        if (pclink === "e") {
        break; // Exit the loop if the user inputs 'e'
        } else {
        let theBench = await getPC(pclink);
        console.log("cpu is: ",theBench)
        await getBenchmark(theBench);
        }
    }
}

main();