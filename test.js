
let text="ali4com\\"
let conf={
"regex":["/ICC|ICJ|genocide|international Criminal Court|INTERNATIONAL COURT OF JUSTICE|idf|dead sea|Israel Defense Forces|holy land|Ibrahimi Mosque|Cave of the Patriarchs|dome of the rock/",
"/jerusalem|quds|alqouds|aqsa|alaqsa|alaqsa|al-masjid al-aqsa|Temple Mount|tel aviv|massacre|west bank|w\\.bank|humanity|human right/",
"palestin(e|ian)s|gaza|israel|israel|zionist|aipac|zionism|israeli|Palestinians authority|hamas|fateh|abbas|nakba|jordan river",
"/Acre|Abu Sinan|Amqa|Arab Ghawarina|Arab al-?Na'?im|Arab al-?Samniyya|Arraba -?Buttof|Ayn al-?'?Asad|al-?Bassa|Bayt Jann|Bi'?na|al-Birwa|Buqei''a|Peki'?in |al(\\s|-)?Damun/",
"/Dayr al-Asad|Dayr Hanna|Dayr al-Qasi|Fassuta|al(\\s|-)?Ghabisiyya|al(\\s|-)?Husseiniya|Iqrit|Iribbin|Khirbat|al(\\s|-)?Jadeida|Jatt|Jiddin|Khirbat|Julis|al-Kabri|Kabul |Kafr '?Inan|Kafr Sumei|Kafr Yasif|Kammana East|Kammana West|Kh\\.? Idmith/",
"/Kh\\.? Jurdeih|Kh\\.? al(\\s|-)?Suwwana|Kisra(\\s|-)?Sumei|Kuwaykat|Majd al(\\s|-)?Kurum|Makr|al(\\s|-)?Manshiyya|al(\\s|-)?Mansura|Mas'?ub|al-Mazra'?a|Mi'?ar|Mi'?ilya|al(\\s|-)?Nabi Rubin|Nahf|al(\\s|-)?Nahr|Nawaqir|al(\\s|-)?Qubsi|al(\\s|-)?Rama/",
"/Church of the Nativity|Church of St. Catherine of Alexandria|Carmel of the Holy Child Jesus|Carmel of the Child Jesus|Church of the Nativity|Episcopal Diocese Of Jerusalem|Church of All Nations|Holy Monastery of Saint Nicholas/",
"/Kathisma Church|Chapel of the Ascension|The Franciscans Chapel(by the Stateion 7)?|Chapel of Saint Vincent de Paul|Chapel of Simon of Cyrene|Co-Cathedral of the Diocese of Jerusalem|Armenian Patriarchate of Jerusalem|Holy Trinity Cathedral/",
"/Church of St\\.? Mary of Agony|Ethiopian Monastery|Vincent de Paul Chapel|Chiesa Dell'?Ascensione|Coptic Orthodox Patriarchate Jerusalem|Latin Patriarchate of Jerusalem|The Monastery of Saint Saviour|Greek Catholic Church of St\\.? Veronica/",
"/Auguste Victoria|Coptic Church of St\\.? Helen|Church of Saint Alexander Nevskiy|Emmaus Nicopolis|St Mark'?s Syriac Church|Pools of Bethesda|Jerusalem Baptist Church|Dominus Flevit Church|St\\.? James Cathedral Church|St\\.? George'?s Monastery/"]}
regex=RegExp(conf.regex[2])
console.log(regex)
console.log(text.search(new RegExp(conf.regex[2],'i')))