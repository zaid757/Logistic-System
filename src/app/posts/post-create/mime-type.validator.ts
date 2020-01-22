import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

export const mimeType = ( // nie just function nntie dia jadi asychncrhonous validator
  control: AbstractControl // nie dia mintak fungsi kat absctracControl
): Promise<{ [key: string]: any }> /* key: string tuh just nk declare yg ade property nama dia tkde function pun
 and dia akan dpt value any value nntie untuk error */
 | // sini ade simbul'or' saje jarak nk bg mudah paham
 Observable<{ [key: string]: any }> => { // sini pun sama macam atas promises dgn observable same je function dia
  if (typeof(control.value) === 'string') { // sini nak bagi lepas dia pakai obervable
    return of(null); // null means valid. sini of tu obervable
    }
  const fle = control.value as File; // sini dia create property file yg value dia sebagai File
  const fileReader = new FileReader(); // sini dia nnati boleh bagi baca url
  // tslint:disable-next-line: deprecation
  const frObs = Observable.create( // sini dia buat observable khas
    (observer: Observer<{ [key: string]: any }>) => { // pastu dia dpt observer yg control bila dia kluarkan data
      fileReader.addEventListener('loadend', () => { // loadend end tu tmpt  file reader dgr kat dia
        const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
        // pakai uint arrray bagi membolehkan untuk diba sini bkn jadi url tpi arrayBuffer
        let header = '';
        let isValid = false;
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
        }
        switch (header) {
          case '89504e47':
            isValid = true;
            break;
          case 'ffd8ffe0':
          case 'ffd8ffe1':
          case 'ffd8ffe2':
          case 'ffd8ffe3':
          case 'ffd8ffe8':
            isValid = true;
            break;
          default:
            isValid = false; // Or you can use the blob.type as fallback
            break;
        }
        if (isValid) {
          observer.next(null); // null means ok
        } else {
          observer.next({ invalidMimeType: true });
        }
        observer.complete(); // nie nak bgtau any subsrsribe suma dah setel
      });
      fileReader.readAsArrayBuffer(fle);
    }
  );
  return frObs;
};
