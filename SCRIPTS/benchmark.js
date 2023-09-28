const { By, Key, Builder } = require('selenium-webdriver');
const prompt = require('prompt-sync')({ sigint: true });



async function getBenchmark(processor, driver) {
  try {
    await driver.get('https://www.cpubenchmark.net/cpu_list.php');
    
    try {
      await driver.findElement(By.className('css-47sehv')).click();
    } catch (clickError) {
      console.error('Error clicking element:', clickError.message);
    }
    
    let xpathExpression = `//*[contains(text(),'${processor}')]`;

    try {
      let element = await driver.findElement(By.xpath(xpathExpression));
      let parentElement = await element.findElement(By.xpath('..'));
      let nextSibling = await parentElement.findElement(By.xpath('following-sibling::*'));
      let text = await element.getText();
      let siblingText = await nextSibling.getText();
      //console.log(text, '\n', siblingText);

      const cpuBMWithoutCommas = siblingText.replace(/,/g, '');

      return (text,cpuBMWithoutCommas);

    } catch (findError) {
      console.error('Error finding element:', findError.message);
    }
  } catch (error) {
    // Handle errors related to navigation, etc.
    console.error('Outer error CPU:', error.message);
  } finally {
    // Cleanup or additional actions to perform regardless of success or failure
  }
}

async function getGPUBenchmark(GPU, driver) {
  try {
    await driver.get('https://www.videocardbenchmark.net/gpu_list.php');
    try {
      cookieBtn = await driver.findElement(By.className('css-47sehv'));
      await cookieBtn.click();
    } catch (clickError) {
      console.error('Error clicking element:', clickError.message);
    }
    
    let xpathExpression = `//*[contains(text(),'${GPU}')]`;

    try {
      let element = await driver.findElement(By.xpath(xpathExpression));
      let parentElement = await element.findElement(By.xpath('..'));
      let nextSibling = await parentElement.findElement(By.xpath('following-sibling::*'));
      let text = await element.getText();
      let siblingText = await nextSibling.getText();
      //console.log(text, '\n', siblingText);
      return(text,siblingText);
      
    } catch (findError) {
      console.error('Error finding element:', findError.message);
    }
  } catch (error) {
    // Handle errors related to navigation, etc.
    console.error('Outer error GPU:', error.message);
  } finally {
    // Cleanup or additional actions to perform regardless of success or failure
  }
}




async function getPC2(pclink, driver) {
  try {
    await driver.get(pclink);
  } catch (error) {
    console.log("Error in driver.get:");
  }

  try {
    await driver.findElement(By.className('coi-banner__accept')).click();
  } catch (error) {
    console.log("Error in finding and clicking the accept button:");
  }

  try {
    let teknisettiedotLocation = `//*[contains(text(),'Tekniset tiedot')]`;
    await driver.findElement(By.xpath(teknisettiedotLocation)).click();
  } catch (error) {
    console.log("Error in clicking 'Tekniset tiedot':");
  }

  let cpuMODEL = null;
  try {
    let prossessorModelXPATH = `//*[contains(text(),'Prosessori (malli)')]`;
    let prossorinMalliTektsi = await driver.findElement(By.xpath(prossessorModelXPATH));
    cpuMODEL = await prossorinMalliTektsi.findElement(By.xpath('following-sibling::*')).getText();
  } catch (error) {
    console.log("Error in getting CPU model:");
  }

  let price = null;
  try {
    const priceElement = await driver.findElement(By.xpath("//pwr-price[@type='integer']"));
    price = await priceElement.getText();
  } catch (error) {
    console.log("Error in getting price:");
  }

  let gpuModel = null;
  try {
    let gpuModelXPATH = `//*[contains(text(),'Näytönohjain (malli)')]`;
    let gpuModelTeksti = await driver.findElement(By.xpath(gpuModelXPATH));
    gpuModel = await gpuModelTeksti.findElement(By.xpath('following-sibling::*')).getText();
  } catch (error) {
    console.log("Error in getting GPU model:");
  }

  let pcArray = [];
  pcArray.push(price);
  pcArray.push(cpuMODEL);
  pcArray.push(gpuModel);

  return pcArray;
}

async function main(){

  let driver = null;
      try{
      const pclink = prompt("link to pc(press e to quit):");

      driver = await new Builder().forBrowser('chrome').build();

      if (pclink === "e") {

        await driver.quit();
        
      } else {
        
        let pcInfo = await getPC2(pclink,driver);
        console.log(pcInfo);
        let cpuB = await getBenchmark(pcInfo[1],driver);
        let gpuB = await getGPUBenchmark(pcInfo[2],driver);
        console.log(cpuB);
        console.log(gpuB);
        console.log("Value of this pc: ",(parseInt(cpuB)+parseInt(gpuB))/parseFloat(pcInfo[0]));

        if (driver) {
          await driver.quit();
        }

      }
      }catch (error){
      
      }finally{     

      }
}

main();