export default class PasswordGenerator {
    static generate( {needNumerics = true, needUpperChars = true, needSymbols = true, needLowerChars = true, length = 15} ) {
        let password = '';

        let providers = [];

        if (needNumerics)
        {
            providers.push(PasswordGenerator.generateNumeric);
        }

        if (needUpperChars)
        {
            providers.push(PasswordGenerator.generateUpperChar);
        }

        if (needSymbols)
        {
            providers.push(PasswordGenerator.generateSymbol);
        }

        if (needLowerChars)
        {
            providers.push(PasswordGenerator.generateLowerChar);
        }

        if (providers.length)
        {
            for (var i = 0; i < length; i++) {
                password += providers[Math.floor(Math.random() * providers.length)]();
            }
        }

        return password.length ? password : PasswordGenerator.generate({});
    }

    static generateNumeric()
    {
        let items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        return items[Math.floor(Math.random() * items.length)];
    }

    static generateUpperChar()
    {
        let items = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        return items[Math.floor(Math.random() * items.length)];
    }

    static generateLowerChar()
    {
        let items = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        return items[Math.floor(Math.random() * items.length)];
    }

    static generateSymbol()
    {
        let items = [";", "_", "!", "@", "\\", "/", "-", "+", ")", "(", "$", ".", "?", "#", "%", "^", "&", "*"];
        return items[Math.floor(Math.random() * items.length)];
    }
}