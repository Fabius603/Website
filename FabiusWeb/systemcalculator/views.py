from django.template import loader
from django.http import HttpResponse
from random import randrange

context = {'ergebnis': "", 'verlauf': []}
def systemcalculator(request):
    template = loader.get_template('systemcalc.html')
    if request.method == "POST":
        vonsystem = request.POST.get('zahlensystemevon')
        zusystem = request.POST.get('zahlensystemezu')
        number = request.POST.get('number')
        Systems().berechnen(vonsystem, zusystem, number)
        return HttpResponse(template.render(context, request=request))
    elif request.method == "GET":
        context["ergebnis"] = ""
        return HttpResponse(template.render(context, request=request))
    else:
        return HttpResponse(template.render(context, request=request))
    

def pwgen(request):
    template = loader.get_template('pwgen.html')
    if request.method == "POST":
        länge = request.POST.get("stärke")
        klein = request.POST.get("klein")
        groß = request.POST.get("groß")
        num = request.POST.get("zahlen")
        sym = request.POST.get("symbole")
        generator(länge, klein, groß, num, sym)
        return HttpResponse(template.render(context, request=request))
    else:
        return HttpResponse(template.render(request=request))

    
def main(request):
    template = loader.get_template('main.html')
    context["ergebnis"] = ""
    return HttpResponse(template.render(request=request))


def generator(länge, klein, groß, num, sym):
    symbols = ("!", "?", "%", "&", ".", ",", ";", ":", "=", "§", "#", "+", "*", "~", "/", "(", ")", "@")
    letters = ("a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z")
    capitalletters = ("A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z")
    
    try:
        PASSWORT = ""
        kreuze = [klein, groß, num, sym]
        runden = int(len(kreuze))
        for i in range(runden):
            if kreuze[i] == "true":
                kreuze[i] = 1
            elif kreuze[i] == None:
                kreuze[i] = 0
            if 1 == kreuze[i]:
                kreuze[i] = i + 1
        for i in range(int(länge)):
            if 0 in kreuze:
                kreuze.remove(0)
        for i in range(int(länge)):
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
        context["passwort"] = PASSWORT
        return PASSWORT
    except:
        pass




class Systems():
    def __init__(self):
        self.HexBinär = {
            "1": "0001",
            "2": "0010",
            "3": "0011",
            "4": "0100",
            "5": "0101",
            "6": "0110",
            "7": "0111",
            "8": "1000",
            "9": "1001",
            "A": "1010",
            "B": "1011",
            "C": "1100",
            "D": "1101",
            "E": "1110",
            "F": "1111",
            "a": "1010",
            "b": "1011",
            "c": "1100",
            "d": "1101",
            "e": "1110",
            "f": "1111",
            }

    def toDezimalsystem(self, fromSystem, number, von, zu):
        nr = number
        try:  
            number = list(str(number))
            number = number[::-1]
            Werte = []
            expo = 0
            newNumber = 0
            if fromSystem == 2:
                for x in number:
                    if int(x) > 1:
                        print("falsche Werte!")

            for index, value in enumerate(number):
                if "A" == value or "a" == value:
                    number[index] = 10
                if "B" == value or "b" == value:
                    number[index] = 11
                if "C" == value or "c" == value:
                    number[index] = 12
                if "D" == value or "d" == value:
                    number[index] = 13
                if "E" == value or "e" == value:
                    number[index] = 14
                if "F" == value or "f" == value:
                    number[index] = 15

            int_number = [int(i) for i in number]
                           
            for i in number:
                Werte.append(int_number[expo] * (fromSystem ** expo))
                expo = expo + 1
            
            for i in Werte:
                newNumber = newNumber + i
            self.ergebnis(newNumber, von, zu, nr)
        except:
            pass

    def toBinärsystem(self, fromSystem, number, von, zu):
        nr = number
        if fromSystem == 10:
            binärwrong = []
            number = int(number)
            while number != 0:
                binärwrong.append(number % 2)
                number = number // 2
            binärlist = binärwrong[::-1]
            str_binärlist = [str(i) for i in binärlist]
            newNumber = ''.join(str_binärlist)
            self.ergebnis(newNumber, von, zu, nr)
        if fromSystem == 16:
            newNum = ""
            numberList = list(str(number))
            for num in numberList:
                newNum = newNum + self.HexBinär[str(num)]
            if str(newNum)[0] == "0":
                newNum = newNum[1:]
            if str(newNum)[0] == "0":
                newNum = newNum[1:]
            if str(newNum)[0] == "0":
                newNum = newNum[1:]

            self.ergebnis(newNum, von, zu, nr)


    def toHexadezimalsystem(self, fromSystem, number, von, zu):
        nr = number
        if fromSystem == 2:
            try:  
                number = list(str(number))
                number = number[::-1]
                Werte = []
                expo = 0
                newNumber = 0

                int_number = [int(i) for i in number]

                for i in number:
                    Werte.append(int_number[expo] * (fromSystem ** expo))
                    expo = expo + 1
                
                for i in Werte:
                    newNumber = newNumber + i
                number = newNumber   
            except:
                pass
        number = int(number)
        hexwrong = []
        while number != 0:
            hexwrong.append(number % 16)
            number = number // 16
        hexlist = hexwrong[::-1]

        for index, value in enumerate(hexlist):
            if 10 == value:
                hexlist[index] = "A"
            if 11 == value:
                hexlist[index] = "B"
            if 12 == value:
                hexlist[index] = "C"
            if 13 == value:
                hexlist[index] = "D"
            if 14 == value:
                hexlist[index] = "E"  
            if 15 == value:
                hexlist[index] = "F"          
        str_hexlist = [str(i) for i in hexlist]
        newNumber = "".join(str_hexlist)
        self.ergebnis(newNumber, von, zu, nr)

        

    def ergebnis(self, ergebnis, von, zu, nr):
        context['ergebnis'] = ergebnis
        context['verlauf'].insert(0, f"Von {von}: {nr}\n Zu {zu}: {ergebnis}")
        if len(context['verlauf']) >= 6:
            context['verlauf'].remove(context['verlauf'][6])


    def fehler(self, nummer):
        context['ergebnis'] = nummer
        print(nummer)

    def berechnen(self, von, zu, nummer):
        if von != zu:
            if nummer != None:
                if zu == "Binärsystem":
                    if von == "Dezimalsystem":
                        self.toBinärsystem(10, nummer, von, zu)
                    if von == "Hexadezimalsystem":
                        self.toBinärsystem(16, nummer, von, zu)

                if zu == "Dezimalsystem":
                    if von == "Binärsystem":
                        self.toDezimalsystem(2, nummer, von, zu)
                    if von == "Hexadezimalsystem":
                        self.toDezimalsystem(16, nummer, von, zu)

                if zu == "Hexadezimalsystem":
                    if von == "Binärsystem":
                        self.toHexadezimalsystem(2, nummer, von, zu)
                    if von == "Dezimalsystem":
                        self.toHexadezimalsystem(10, nummer, von, zu)
            elif nummer == None:
                self.fehler("Nummer fehlt!")
            else:
                self.fehler("FEHLER!")

        elif von == zu and von != None and zu != None:
            self.fehler("Fehler! Du hast zweimal das selbe System ausgewählt!") 
        
        elif von == None or zu == None:
            self.fehler("Du hast noch nicht alle Systeme ausgewählt")

        else:
            self.fehler("FEHLER!")
