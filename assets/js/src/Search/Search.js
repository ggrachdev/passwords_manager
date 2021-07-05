export default class Search {
    static string(from, need) {
        let isSearched = false;

        if (typeof from === 'string' && typeof need === 'string')
        {
            from = from.trim();
            need = need.trim();
            
            if (need.length > 0)
            {
                isSearched = (from.toLowerCase().indexOf(need.toLowerCase()) !== -1);
            }

            if (isSearched === false)
            {
                let russianString = Search.stringToRussianKeyboard(need.toLowerCase());
                isSearched = (from.toLowerCase().indexOf(russianString.toLowerCase()) !== -1);
            }
        }

        return isSearched;
    }

    static stringToRussianKeyboard(str) {
        let replacer = {
            "q": "й", "w": "ц", "e": "у", "r": "к", "t": "е", "y": "н", "u": "г",
            "i": "ш", "o": "щ", "p": "з", "[": "х", "]": "ъ", "a": "ф", "s": "ы",
            "d": "в", "f": "а", "g": "п", "h": "р", "j": "о", "k": "л", "l": "д",
            ";": "ж", "'": "э", "z": "я", "x": "ч", "c": "с", "v": "м", "b": "и",
            "n": "т", "m": "ь", ",": "б", ".": "ю", "/": "."
        };

        return str.replace(/[A-z/,.;\'\]\[]/g, (x) => {
            return x == x.toLowerCase() ? replacer[ x ] : replacer[ x.toLowerCase() ].toUpperCase();
        });
    }
}