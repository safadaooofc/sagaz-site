const sharp = require('sharp');
const fs = require('fs');

async function cropImage() {
  const logoPath = './public/assets/images/logo-sagazzz-azul.png';
  
  try {
    // Sharp's trim() automatically crops away background
    // We can use a threshold.
    await sharp(logoPath)
      .trim({ threshold: 40 })
      .toFile('./public/assets/images/logo-sagazzz-azul-cropped.png');
      
    fs.renameSync('./public/assets/images/logo-sagazzz-azul-cropped.png', logoPath);
    console.log("Logo cropped successfully!");
    
  } catch (err) {
    console.error("Error cropping image:", err);
  }
}

cropImage();
