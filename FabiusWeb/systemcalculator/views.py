from django.template import loader
from django.http import HttpResponse
from random import randrange
import json
import requests
from bs4 import BeautifulSoup
import re

context = {'ergebnis': "", 'verlauf': [], 'feldgröße': [], 'spielerfarben': [], 'strich_color': []}
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

    
def malen(request):
    template = loader.get_template('malen.html')
    return HttpResponse(template.render(request=request))   

def interactive(request):
    template = loader.get_template('interactive.html')
    return HttpResponse(template.render(context, request=request))

def settings(request):
    template = loader.get_template('settings.html')
    if request.method == "POST":
        xWert = request.POST.get("xwert")
        yWert = request.POST.get("ywert")
        p1_color = request.POST.get('Player_1_color')
        p2_color = request.POST.get('Player_2_color')
        strich_color = request.POST.get('Strich_color')
        Settings().setsettings(xWert, yWert, p1_color, p2_color, strich_color)
        template = loader.get_template('interactive.html')
        return HttpResponse(template.render(context, request=request))
    else:
        return HttpResponse(template.render(request=request))

def main(request):
    template = loader.get_template('main.html')
    context["ergebnis"] = ""
    return HttpResponse(template.render(request=request))

def webscraper(request):
    template = loader.get_template('webscraper.html')
    if request.method == "GET":
        suchEingabe = request.GET.get('searchInput')
        if suchEingabe != "":
            context["headingsHtml"] = ["Allgemein"]
            Scraper().run(suchEingabe)
        return HttpResponse(template.render(context, request=request))
    else:
        return HttpResponse(template.render(context, request=request))
    


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
        context["passwort"] = PASSWORT
        return PASSWORT
    except:
        pass


class Settings():
    def __inin__(self):
        # feldgröße[0] ist x
        # feldgröße[1] ist y
        # spielerfarben[0] ist Spieler 1
        # spielerfarben[1] ist Spieler 2
        pass

    def setsettings(self, xWert, yWert, p1_color, p2_color, strich_color):
        größe = [xWert, yWert]
        context['feldgröße'] = json.dumps(größe)

        strich_farben = []

        if strich_color == "rot":
            strich_farben.append("red")
        elif strich_color == "blau":
            strich_farben.append("blue")
        elif strich_color == "grün":
            strich_farben.append("green")
        elif strich_color == "gelb":
            strich_farben.append("yellow")
        elif strich_color == "pink":
            strich_farben.append("pink")
        elif strich_color == "orange":
            strich_farben.append("orange")
        elif strich_color == "weiß":
            strich_farben.append("white")
        else:
            strich_farben.append("red")

        strich_farbe = [strich_farben]
        context['strich_color'] = json.dumps(strich_farbe)


        context['spielerfarben'] = []
        farben = []
        if p1_color == "rot":
            farben.append("red")
        elif p1_color == "blau":
            farben.append("blue")
        elif p1_color == "grün":
            farben.append("green")
        elif p1_color == "schwarz":
            farben.append("black")
        elif p1_color == "gelb":
            farben.append("yellow")
        elif p1_color == "pink":
            farben.append("pink")
        elif p1_color == "orange":
            farben.append("orange")
        elif p1_color == "weiß":
            farben.append("white")
        else:
            farben.append("black")

        if p2_color == "rot":
            farben.append("red")
        elif p2_color == "blau":
            farben.append("blue")
        elif p2_color == "grün":
            farben.append("green")
        elif p2_color == "schwarz":
            farben.append("black")
        elif p2_color == "gelb":
            farben.append("yellow")
        elif p2_color == "pink":
            farben.append("pink")
        elif p2_color == "orange":
            farben.append("orange")
        elif p2_color == "weiß":
            farben.append("white")
        else:
            farben.append("black")

        context['spielerfarben'] = json.dumps(farben)

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


class Scraper:
    def __init__(self):
        self.letzteElement = ""
        self.h2List = []

        self.verboteneElemente = [
            "div",
            "style",
            "figure",
            "li",
            "a",
            "figcaption",
            "i",
            "b",
            "table",
            "k",
            "tbody",
            "th",
            "td",
            "img",
            "h3",
        ]

    def getData(self):
        unordered_list = self.results.find("div", {"class": "mw-parser-output"})
        children = unordered_list.findChildren()    
        Literatur = unordered_list.find(id="Literatur")
        Einzelnachweise = unordered_list.find(id="Einzelnachweise")
        Weblinks = unordered_list.find(id="Weblinks")
        Siehe_auch = unordered_list.find(id="Siehe_auch")

        headlines = unordered_list.find_all("h2")
        self.headlinesDict = {"Allgemein": []}
        self.headings = ['Allgemein']
        for head in headlines:
            überschriftText = self.replace(head.text)
            if überschriftText == "Literatur" or überschriftText == "Einzelnachweise" or überschriftText == "Weblinks" or überschriftText == "Siehe auch":
                break
            if überschriftText != "Inhaltsverzeichnis":
                self.headings.append(überschriftText)
                self.headlinesDict[überschriftText] = []
                context["headingsHtml"].append(überschriftText)
        context["headings"] = json.dumps(self.headings)
        hinzufügenZu = "Allgemein"
        for child in children:
            if(self.letzteElement == self.replace(child.name)):
                continue
            if child == Literatur or child == Einzelnachweise or child == Weblinks or child == Siehe_auch:
                break
            if child.name in self.verboteneElemente:
                continue
            if child.name == "h2":
                hinzufügenZu = self.replace(child.text)
                self.h2List.append(child)
                continue
                    
            if child.name == "ul" and child.parent != unordered_list:
                continue

            if child.parent in self.h2List:
                continue
                
            
            else:
                if hinzufügenZu == "Inhaltsverzeichnis":
                    continue
                
                if child in unordered_list.find_all("span", class_ = "mw-headline"):
                    lastText = self.replace(child.text)
                    self.letzteElement = lastText
                    self.headlinesDict[hinzufügenZu].append(lastText+"5545234345")

                else:
                    lastText = self.replace(child.text)
                    self.letzteElement = lastText
                    if lastText != "" or lastText != None:
                        self.headlinesDict[hinzufügenZu].append(lastText)

        context["scraperText"] = json.dumps(self.headlinesDict)


    def replace(self, text):
        while True:
            text = text.replace("[Bearbeiten | Quelltext bearbeiten]", "")
            text = text.replace("[ | ]", "")
            text = text.replace("\n", "")
            number = [int(num) for num in re.findall(r'\d+', text)]
            for zahl in number:
                text = text.replace("["+str(zahl)+"]", " ")

            if "[Bearbeiten | Quelltext bearbeiten]" not in text and "[ | ]" not in text and "\n" not in text:
                break

        return text
    
    def run(self, suchEingabe):
        suche = suchEingabe
        URL = f'https://de.wikipedia.org/wiki/{suche}'
        try:
            website = requests.get(URL)
            self.results = BeautifulSoup(website.content, 'html.parser')
        except:
            print("da ist etwas schiefgelaufen")

        self.getData()