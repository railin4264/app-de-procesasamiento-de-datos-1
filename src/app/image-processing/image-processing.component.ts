import { Component } from '@angular/core';
import { ImageSource, knownFolders, path } from '@nativescript/core';
import { requestPermissions, takePicture } from '@nativescript/camera';

@Component({
  selector: 'ns-image-processing',
  templateUrl: './image-processing.component.html',
})
export class ImageProcessingComponent {
  public imageSrc: ImageSource | null = null;
  public processedImageSrc: ImageSource | null = null;

  public async onTakePicture() {
    try {
      await requestPermissions();
      const imageAsset = await takePicture({
        width: 300,
        height: 300,
        keepAspectRatio: true,
        saveToGallery: false,
      });
      
      if (imageAsset) {
        this.imageSrc = await ImageSource.fromAsset(imageAsset);
      }
    } catch (err) {
      console.error('Error taking picture:', err);
    }
  }

  public async onProcessImage() {
    if (this.imageSrc) {
      try {
        const width = this.imageSrc.width;
        const height = this.imageSrc.height;
        const bitmapData = this.imageSrc.toBase64String('png');
        
        // Crear una nueva ImageSource con la imagen procesada
        const grayscaleData = this.applyGrayscaleFilter(bitmapData);
        
        // Cargar la imagen procesada usando fromBase64Sync (versión síncrona)
        this.processedImageSrc = ImageSource.fromBase64Sync(grayscaleData);  // Actualizado
  
        console.log('Image processed successfully');
      } catch (err) {
        console.error('Error processing image:', err);
      }
    }
  }
  

  private applyGrayscaleFilter(base64Image: string): string {
    // Decode base64 string to binary
    const binaryString = atob(base64Image);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Apply grayscale filter
    for (let i = 0; i < bytes.length; i += 4) {
      const avg = (bytes[i] + bytes[i + 1] + bytes[i + 2]) / 3;
      bytes[i] = avg;     // Red
      bytes[i + 1] = avg; // Green
      bytes[i + 2] = avg; // Blue
      // Alpha channel (bytes[i + 3]) remains unchanged
    }

    // Convert back to base64
    let binary = '';
    const len2 = bytes.byteLength;
    for (let i = 0; i < len2; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
}