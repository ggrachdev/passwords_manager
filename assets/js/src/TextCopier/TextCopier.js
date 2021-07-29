import Toasts from '../Toasts/Toasts';

export default class TextCopier {
    static copy(textForCopy) {
        // Step 1: create a textarea element.
        // It is capable of holding linebreaks (newlines) unlike "input" element
        const myFluffyTextarea = document.createElement('textarea');

        // Step 2: Store your string in innerHTML of myFluffyTextarea element        
        myFluffyTextarea.innerHTML = textForCopy;

        // Step3: find an id element within the body to append your myFluffyTextarea there temporarily
        const parentElement = document.querySelector('body');
        parentElement.appendChild(myFluffyTextarea);

        // Step 4: Simulate selection of your text from myFluffyTextarea programmatically 
        myFluffyTextarea.select();

        // Step 5: simulate copy command (ctrl+c)
        // now your string with newlines should be copied to your clipboard 
        document.execCommand('copy');

        // Step 6: Now you can get rid of your fluffy textarea element
        parentElement.removeChild(myFluffyTextarea);
        Toasts.success('Успешно скопировано');
    }
}