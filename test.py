from random import randrange
def generator(länge, klein, groß, num, sym):
    symbols = ("!", "?", "%", "&", ".", ",", ";", ":", "=", "§", "#", "+", "*", "~", "/", "(", ")", "@")
    letters = ("a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z")
    capitalletters = ("A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z")
    print(länge, klein, groß, num, sym)
    try:
        PASSWORT = ""
        kreuze = [klein, groß, num, sym]
        runden = int(len(kreuze))
        for i in range(runden):
            if kreuze[i] == True:
                kreuze[i] = 1
            elif kreuze[i] == None:
                kreuze[i] = 0
            if 1 == kreuze[i]:
                kreuze[i] = i + 1
        for i in range(länge):
            if 0 in kreuze:
                kreuze.remove(0)

        for i in range(länge):
            listnum = randrange(len(kreuze))
            list = kreuze[listnum]
            if list == 1:
                pos = randrange(26)
                PASSWORT = PASSWORT + letters[pos]
            if list == 2:
                pos = randrange(26)
                PASSWORT = PASSWORT + capitalletters[pos]
            if list == 3:
                PASSWORT = PASSWORT + str(randrange(9))
            if list == 4:
                pos = randrange(18)
                PASSWORT = PASSWORT + symbols[pos]
        print(PASSWORT)
        return PASSWORT
    except:
        pass

print(generator(12, True, True, None, None))