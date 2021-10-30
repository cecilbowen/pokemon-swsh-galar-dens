let COPY_COORDS = false; //if true, copies current mouse click (x,y) to clipboard

//images
let MAP_RAW = "https://i.redd.it/2av1w1hnrjz31.jpg"; //den map
let MAP_NUMBERED = "https://i.imgur.com/p4uYILW.jpg"; //den map w/ den numbers
let MAP_GMAX = "https://i.imgur.com/vj9FCCY.png"; //den map w/ gigantamax spawns
let MAP_RARE = "https://i.imgur.com/Czz3j3C.jpg"; //den map w/ normal & rare den numbers
let PIXEL = "https://upload.wikimedia.org/wikipedia/commons/c/ca/1x1.png"; //blank 1x1 png
//let MARKER_ICON = "https://image.flaticon.com/icons/png/128/188/188918.png"; //icon to highlight searched dens/pokemon
let NORMAL_ICON = "https://www.serebii.net/itemdex/sprites/pokeball.png"; //pokeball for normal dens
let RARE_ICON = "https://www.serebii.net/itemdex/sprites/ultraball.png"; //ultra ball for rare dens
let GMAX_ICON = "https://www.serebii.net/itemdex/sprites/masterball.png"; //master ball for gmax dens
let NR_ICON = "https://i.imgur.com/6nCv3xt.png"; //normal/rare icon
let NG_ICON = "https://i.imgur.com/yzws2bg.png"; //normal/gmax icon

let MARKER_SIZE = 30;

var icon = L.icon({
    iconUrl: PIXEL, //offline: '1x1.png'
    shadowUrl: PIXEL,

    iconSize:     [MARKER_SIZE, MARKER_SIZE], // size of the icon
    shadowSize:   [MARKER_SIZE, MARKER_SIZE], // size of the shadow
    iconAnchor:   [MARKER_SIZE/2, MARKER_SIZE/2], // point of the icon which will correspond to marker's location
    shadowAnchor: [MARKER_SIZE/2, MARKER_SIZE/2],  // the same for the shadow
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
});

var normalIcon = L.icon({
    iconUrl: NORMAL_ICON, //offline: 'pokeball.png'
    shadowUrl: NORMAL_ICON,

    iconSize:     [MARKER_SIZE, MARKER_SIZE], // size of the icon
    shadowSize:   [MARKER_SIZE, MARKER_SIZE], // size of the shadow
    iconAnchor:   [MARKER_SIZE/2, MARKER_SIZE/2], // point of the icon which will correspond to marker's location
    shadowAnchor: [MARKER_SIZE/2, MARKER_SIZE/2],  // the same for the shadow
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
});

var rareIcon = L.icon({
    iconUrl: RARE_ICON, //offline: 'pokeball.png'
    shadowUrl: RARE_ICON,

    iconSize:     [MARKER_SIZE, MARKER_SIZE], // size of the icon
    shadowSize:   [MARKER_SIZE, MARKER_SIZE], // size of the shadow
    iconAnchor:   [MARKER_SIZE/2, MARKER_SIZE/2], // point of the icon which will correspond to marker's location
    shadowAnchor: [MARKER_SIZE/2, MARKER_SIZE/2],  // the same for the shadow
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
});

var gmaxIcon = L.icon({
    iconUrl: GMAX_ICON, //offline: 'pokeball.png'
    shadowUrl: GMAX_ICON,

    iconSize:     [MARKER_SIZE, MARKER_SIZE], // size of the icon
    shadowSize:   [MARKER_SIZE, MARKER_SIZE], // size of the shadow
    iconAnchor:   [MARKER_SIZE/2, MARKER_SIZE/2], // point of the icon which will correspond to marker's location
    shadowAnchor: [MARKER_SIZE/2, MARKER_SIZE/2],  // the same for the shadow
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
});

var nrIcon = L.icon({
    iconUrl: NR_ICON, //offline: 'pokeball.png'
    shadowUrl: NR_ICON,

    iconSize:     [MARKER_SIZE, MARKER_SIZE], // size of the icon
    shadowSize:   [MARKER_SIZE, MARKER_SIZE], // size of the shadow
    iconAnchor:   [MARKER_SIZE/2, MARKER_SIZE/2], // point of the icon which will correspond to marker's location
    shadowAnchor: [MARKER_SIZE/2, MARKER_SIZE/2],  // the same for the shadow
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
});

var ngIcon = L.icon({
    iconUrl: NG_ICON, //offline: 'pokeball.png'
    shadowUrl: NG_ICON,

    iconSize:     [MARKER_SIZE, MARKER_SIZE], // size of the icon
    shadowSize:   [MARKER_SIZE, MARKER_SIZE], // size of the shadow
    iconAnchor:   [MARKER_SIZE/2, MARKER_SIZE/2], // point of the icon which will correspond to marker's location
    shadowAnchor: [MARKER_SIZE/2, MARKER_SIZE/2],  // the same for the shadow
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
});

var map = L.map('mapid', {
	id: 'dens',
	attribution: 'Galar Raid Dens Interactive Map',
    crs: L.CRS.Simple,
	minZoom: -1.6,
	maxZoom: -0.5,
	//doubleClickZoom: false,
});
var bounds = [[0,0], [1900, 1900]]; //1688 x 1844
var denMap = L.imageOverlay(MAP_RARE, bounds);
denMap.addTo(map);
map.fitBounds(bounds);

let denDescription = "";
let denList = []; //currently highlighted dens
function Den(number, pkmn = undefined) {
	this.number = number;
	this.name = "Den " + number;
	this.pokemon = pkmn || [];
}

function Dens(split) {
	let tiers = split.split("/");
	this.rare = tiers[0];
	this.normal = tiers[1];
	this.gmax = tiers[2];
	let ll = (this.gmax === "0" ? this.rare : this.gmax);
	this.link = (ll === "0" ? this.normal : ll);
}

map.attributionControl.addAttribution('InfexiousBand | Galar Raid Dens Interactive Map');

let rareDens = "10 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76";
let normalDens = "1 10 11 12 13 14 15 16 17 18 19 2 20 21 22 23 24 25 26 27 28 29 3 30 31 32 33 34 35 36 37 38 39 4 40 41 42 5 6 7 8 84 9";
let gmaxDens = "77 78 79 80 81 82 83 84 85 86 87 88 89 90 91 92 93";
let allDens = rareDens + " " + normalDens + " " + gmaxDens;

//DENS ----------------------------------------------------------------------------------------
{
//alt format: rare/normal/gmax
	
//15 - Lake of Outrage
L.marker([1503.0732337179545, 672.7465955447269], {icon, alt: "0/18/77"}).addTo(map); //Den #77
L.marker([1536.4608629081242, 778.8190944512874], {icon, alt: "74/84/0"}).addTo(map); //Den #74
L.marker([1466.6503655104968, 787.9110229289925], {icon, alt: "44/8/0"}).addTo(map); //Den #44
L.marker([1543.1265309753937, 897.8883362941217], {icon, alt: "56/25/0"}).addTo(map); //Den #??

//16 - Hammerlocke Hills
L.marker([1585.0246871847346, 987.9334494385059], {icon, alt: "73/23/0"}).addTo(map); //Den #73
L.marker([1615.3770773576161, 1057.6382344342455], {icon, alt: "57/30/0"}).addTo(map); //Den #57
L.marker([1569.848492098294, 1103.0978768227712], {icon, alt: "62/33/0"}).addTo(map); //Den #62
L.marker([1484.8617996142257, 1178.8639474703143], {icon, alt: "53/19/0"}).addTo(map); //Den #53
L.marker([1533.425623890836, 1275.8445178991694], {icon, alt: "61/32/0"}).addTo(map); //Den #61
L.marker([1636.6237504786332, 1333.426731591302], {icon, alt: "45/12/0"}).addTo(map); //Den #45
L.marker([1539.4961019254124, 1445.5605161496655], {icon, alt: "68/14/0"}).addTo(map); //Den #68

//14 - Giant's Cap
L.marker([1503.0732337179545, 1009.147949219818], {icon, alt: "0/32/89"}).addTo(map); //Den #89
L.marker([1445.4036923894798, 890.9528790096512], {icon, alt: "0/24/78"}).addTo(map); //Den #78
L.marker([1378.6284340091402, 915.1980216168649], {icon, alt: "55/23/0"}).addTo(map); //Den #55
L.marker([1272.3950684040549, 948.5350927017836], {icon, alt: "71/18/0"}).addTo(map); //Den #71
L.marker([1220.7960051101563, 915.1980216168649], {icon, alt: "60/30/0"}).addTo(map); //Den #60

//12 - Dusty Bowl
L.marker([1430.227497303039, 1057.6382344342455], {icon, alt: "75/9/0"}).addTo(map); //Den #75
L.marker([1272.3950684040549, 1063.699520086049], {icon, alt: "0/36/88"}).addTo(map); //Den #88
L.marker([1408.9808241820217, 1148.5575192112974], {icon, alt: "49/11/0"}).addTo(map); //Den #49
L.marker([1333.0998487498182, 1175.8333046444125], {icon, alt: "0/17/93"}).addTo(map); //Den #93
L.marker([1232.936961179309, 1157.6494476890023], {icon, alt: "48/10/0"}).addTo(map); //Den #48
L.marker([1399.8751071301574, 1254.6300181178574], {icon, alt: "55/21/0"}).addTo(map); //Den #55
L.marker([1433.2627363203271, 1321.3041602876954], {icon, alt: "52/17/0"}).addTo(map); //Den #52
L.marker([1375.5931949918522, 1309.1815889840884], {icon, alt: "54/20/0"}).addTo(map); //Den #54
L.marker([1475.7560825623614, 1394.0395881093364], {icon, alt: "0/15/93"}).addTo(map); //Den #93

//13 - Giant's Mirror
L.marker([1500.0379947006663, 1554.6636578821274], {icon, alt: "70/27/0"}).addTo(map); //Den #70
L.marker([1421.1217802511744, 1554.6636578821274], {icon, alt: "69/36/0"}).addTo(map); //Den #69
L.marker([1387.7341510610047, 1494.0508013640933], {icon, alt: "72/25/0"}).addTo(map); //Den #72
L.marker([1320.9588926806655, 1454.6524446273709], {icon, alt: "67/42/0"}).addTo(map); //Den #67
L.marker([1290.606502507784, 1321.3041602876954], {icon, alt: "43/28/0"}).addTo(map); //Den #43

//10 - Stony Wilderness
L.marker([1041.7169030901555, 984.9028066126042], {icon, alt: "51/3/0"}).addTo(map); //Den #51
L.marker([1099.3864444186304, 1048.5463059565404], {icon, alt: "50/2/0"}).addTo(map); //Den #50
L.marker([1138.8445516433762, 1133.4043050817884], {icon, alt: "59/27/0"}).addTo(map); //Den #59
L.marker([1141.8797906606644, 1218.2623042070365], {icon, alt: "63/35/0"}).addTo(map); //Den #63
L.marker([1041.7169030901555, 1275.8445178991694], {icon, alt: "0/12/85"}).addTo(map); //Den #85
L.marker([1235.9722001965972, 1318.2735174617933], {icon, alt: "0/19/80"}).addTo(map); //Den #80
L.marker([1150.9855077125287, 1315.242874635892], {icon, alt: "55/22/0"}).addTo(map); //Den #55
L.marker([1166.1617027989696, 1360.7025170244174], {icon, alt: "54/18/0"}).addTo(map); //Den #54
L.marker([1123.6683565569356, 1363.733159850319], {icon, alt: "50/14/0"}).addTo(map); //Den #50
L.marker([1193.478853954563, 1433.4379448460588], {icon, alt: "0/1/81"}).addTo(map); //Den #81
L.marker([1211.690288058292, 1487.9895157122899], {icon, alt: "43/6/0"}).addTo(map); //Den #43
L.marker([1075.104532280325, 1418.28473071655], {icon, alt: "66/40/0"}).addTo(map); //Den #66

//11 - Bridge Field
L.marker([959.7654496233754, 821.2480940139114], {icon, alt: "0/34/82"}).addTo(map); //Den #82
L.marker([965.8359276579516, 1003.0866635680146], {icon, alt: "65/40/0"}).addTo(map); //Den #65
L.marker([896.0254302603241, 1024.3011633493265], {icon, alt: "59/27/0"}).addTo(map); //Den #59
L.marker([838.3558889318491, 972.7802353089974], {icon, alt: "0/13/87"}).addTo(map); //Den #87
L.marker([808.0034987589677, 1075.822091389656], {icon, alt: "52/16/0"}).addTo(map); //Den #52
L.marker([917.2721033813411, 1187.9558759480194], {icon, alt: "44/8/0"}).addTo(map); //Den #44
L.marker([953.694971588799, 1142.496233559494], {icon, alt: "63/36/0"}).addTo(map); //Den #63
L.marker([959.7654496233754, 1297.0590176804815], {icon, alt: "0/4/92"}).addTo(map); //Den #92
L.marker([1005.2940348826976, 1378.8863739798278], {icon, alt: "46/5/0"}).addTo(map); //Den #46

//9 - Motostoke Riverbank
L.marker([768.5453915342217, 957.627021179489], {icon, alt: "60/30/0"}).addTo(map); //Den #60
L.marker([701.7701331538824, 1063.699520086049], {icon, alt: "56/24/0"}).addTo(map); //Den #56
L.marker([738.1930013613402, 1200.0784472516264], {icon, alt: "50/14/0"}).addTo(map); //Den #50
L.marker([665.3472649464245, 1160.6800905149044], {icon, alt: "65/40/0"}).addTo(map); //Den #65

//17 - North Lake Miloch
L.marker([586.4310504969325, 1369.7944455021225], {icon, alt: "60/29/0"}).addTo(map); //Den #60
L.marker([495.373879978288, 1372.8250883280243], {icon, alt: "48/10/0"}).addTo(map); //Den #48
L.marker([516.6205530993051, 1263.7219465955625], {icon, alt: "48/10/0"}).addTo(map); //Den #48
L.marker([571.2548554104918, 1203.109090077528], {icon, alt: "60/29/0"}).addTo(map); //Den #60
L.marker([486.2681629264236, 1039.4543774788353], {icon, alt: "76/41/0"}).addTo(map); //Den #76
L.marker([525.7262701511695, 960.6576640053904], {icon, alt: "76/41/0"}).addTo(map); //Den #76

//5 - Giant's Seat
L.marker([446.81005570167764, 1369.7944455021225], {icon, alt: "0/11/84"}).addTo(map); //Den #84
L.marker([370.92908026947373, 1384.947659631631], {icon, alt: "49/11/0"}).addTo(map); //Den #49
L.marker([340.57669009659224, 1272.8138750732678], {icon, alt: "45/12/0"}).addTo(map); //Den #45
L.marker([276.8366707335409, 1357.6718741985155], {icon, alt: "51/15/0"}).addTo(map); //Den #51
L.marker([219.1671294050662, 1284.9364463768745], {icon, alt: "0/15/83"}).addTo(map); //Den #83

//6 - South Lake Miloch
L.marker([197.92045628404912, 1233.4155183365453], {icon, alt: "76/41/0"}).addTo(map); //Den #76
L.marker([228.2728464569306, 1154.6188048631009], {icon, alt: "76/41/0"}).addTo(map); //Den #76
L.marker([373.96431928676196, 1103.0978768227712], {icon, alt: "0/8/91"}).addTo(map); //Den #91
L.marker([471.09196783998283, 1166.7413761667076], {icon, alt: "43/1/0"}).addTo(map); //Den #43
L.marker([446.81005570167764, 1063.699520086049], {icon, alt: "46/5/0"}).addTo(map); //Den #46

//1 - Rolling Fields
L.marker([185.77950021489644, 1112.1898053004766], {icon, alt: "62/33/0"}).addTo(map); //Den #62
L.marker([164.53282709387935, 1033.3930918270319], {icon, alt: "51/3/0"}).addTo(map); //Den #51
L.marker([222.20236842235445, 1009.147949219818], {icon, alt: "46/4/0"}).addTo(map); //Den #46
L.marker([276.8366707335409, 1009.147949219818], {icon, alt: "0/31/90"}).addTo(map); //Den #90
L.marker([225.23760743964237, 809.1255227103046], {icon, alt: "65/39/0"}).addTo(map); //Den #65
L.marker([194.88521726676086, 739.4207377145649], {icon, alt: "52/16/0"}).addTo(map); //Den #52
L.marker([301.1185828718463, 718.2062379332532], {icon, alt: "10/1/0"}).addTo(map); //Den #10
L.marker([131.1451979037096, 645.4708101116117], {icon, alt: "64/37/0"}).addTo(map); //Den #64
L.marker([240.4138025260833, 600.0111677230859], {icon, alt: "0/31/92"}).addTo(map); //Den #92

//7 - East Lake Axwell
L.marker([616.7834406698142, 966.7189496571939], {icon, alt: "0/29/86"}).addTo(map); //Den #86
L.marker([525.7262701511695, 887.9222361837491], {icon, alt: "61/31/0"}).addTo(map); //Den #61
L.marker([556.078660324051, 797.0029514066977], {icon, alt: "65/39/0"}).addTo(map); //Den #65
L.marker([279.8719097508292, 936.4125213981766], {icon, alt: "44/7/0"}).addTo(map); //Den #44
L.marker([400.7239406019158, 979.7725522389244], {icon, alt: "61/31/0"}).addTo(map); //Den #61

//4 - Axew's Eye
L.marker([398.24623142506715, 872.7690220542407], {icon, alt: "64/38/0"}).addTo(map); //Den #??

//3 - West Lake Axwell
L.marker([622.8539187043904, 681.8385240224325], {icon, alt: "63/35/0"}).addTo(map); //Den #63
L.marker([474.1272068572709, 687.8998096742359], {icon, alt: "75/9/0"}).addTo(map); //Den #75
L.marker([483.2329239091355, 621.225667504398], {icon, alt: "0/9/91"}).addTo(map); //Den #91
L.marker([386.1052753559145, 645.4708101116117], {icon, alt: "75/9/0"}).addTo(map); //Den #75
L.marker([276.8366707335409, 469.69352620931215], {icon, alt: "44/7/0"}).addTo(map); //Den #44
L.marker([288.97762680269363, 645.4708101116117], {icon, alt: "44/42/0"}).addTo(map); //Den #??

//8 - Watchtower Ruins
L.marker([589.4662895142208, 533.3370255532479], {icon, alt: "47/6/0"}).addTo(map); //Den #47
L.marker([461.9862507881184, 487.8773831647221], {icon, alt: "50/2/0"}).addTo(map); //Den #50
L.marker([537.8672262203222, 536.3676683791497], {icon, alt: "0/0/0"}).addTo(map); //Den #none

//2 - Dappled Grove
L.marker([398.24623142506715, 357.55974165094835], {icon, alt: "0/28/79"}).addTo(map); //Den #79
L.marker([310.2242999237107, 384.83552708406387], {icon, alt: "0/4/92"}).addTo(map); //Den #92
L.marker([325.40049501015164, 451.5096692539018], {icon, alt: "59/26/0"}).addTo(map); //Den #59
L.marker([243.44904154337155, 406.0500268653759], {icon, alt: "59/26/0"}).addTo(map); //Den #59
L.marker([364.85860223489755, 330.2839562178328], {icon, alt: "58/26/0"}).addTo(map); //Den #??
}
//---------------------------------------------------------------------------------------------------

//DEN POKEMON ---------------------------------------------------------------------------------
let denPokemon = [];
{
//auto pulled from Serebii using custom Tampermonkey script:
//  (get all elements with class 'pkmn' and save innerText)
let den10 = denPokemon.push("10 Bewear Clobbopus Falinks Farfetch'd Grapploct Hawlucha Pancham Pangoro Sawk Sirfetch'd Stufful Throh Tyrogue"); //10
let den43 = denPokemon.push("43 Corsola Cursola Dusclops Dusknoir Duskull Gastly Gengar Gourgeist Haunter Polteageist Pumpkaboo Runerigus Sableye Sinistea Yamask"); //43
let den44 = denPokemon.push("44 Arrokuda Basculin Chewtle Feebas Gyarados Lapras Magikarp Mareanie Milotic Pyukumuku Qwilfish Toxapex"); //44
let den45 = denPokemon.push("45 Bisharp Bronzong Bronzor Durant Klang Klink Klinklang Lucario Onix Pawniard Riolu Steelix"); //45
let den46 = denPokemon.push("46 Accelgor Araquanid Blipbug Dewpider Dottler Dwebble Escavalier Golisopod Karrablast Orbeetle Shedinja Shelmet Wimpod"); //46
let den47 = denPokemon.push("47 Aegislash Corsola Cursola Doublade Drifblim Drifloon Gourgeist Honedge Polteageist Pumpkaboo Runerigus Sableye Sinistea Yamask"); //47
let den48 = denPokemon.push("48 Bewear Croagunk Falinks Gallade Hawlucha Lucario Machamp Machoke Machop Passimian Riolu Scrafty Scraggy Stufful Toxicroak"); //48
let den49 = denPokemon.push("49 Bisharp Bronzong Bronzor Copperajah Duraludon Ferroseed Ferrothorn Honedge Meowth Pawniard Perrserker Stunfisk"); //49
let den50 = denPokemon.push("50 Gardevoir Hatenna Hatterene Hattrem Inkay Kirlia Malamar Mr. Mime Mr. Rime Ralts Swoobat Woobat"); //50
let den51 = denPokemon.push("51 Barbaracle Binacle Bonsly Carkol Coalossal Crustle Dwebble Larvitar Onix Pupitar Roggenrola Rolycoly Steelix Stonjourner Sudowoodo Tyranitar"); //51
let den52 = denPokemon.push("52 Barboach Gastrodon Golett Golurk Palpitoad Quagsire Rhyperior Runerigus Seismitoad Stunfisk Wooper Yamask"); //52
let den53 = denPokemon.push("53 Arcanine Centiskorch Charizard Charmander Charmeleon Growlithe Heatmor Litwick Ninetales Salazzle Sizzlipede Torkoal Vulpix"); //53
let den54 = denPokemon.push("54 Arcanine Carkol Chandelure Coalossal Growlithe Heatmor Lampent Litwick Ninetales Salandit Salazzle Sizzlipede Torkoal Turtonator Vulpix"); //54
let den55 = denPokemon.push("55 Avalugg Bergmite Cubchoo Darmanitan Darumaka Delibird Eiscue Glalie Lapras Mr. Mime Mr. Rime Snorunt Vanillite Vanilluxe"); //55
let den56 = denPokemon.push("56 Boltund Chinchou Galvantula Joltik Lanturn Morpeko Pikachu Pincurchin Togedemaru Toxel Toxtricity Yamper"); //56
let den57 = denPokemon.push("57 Electrike Helioptile Joltik Pichu Pikachu Rotom Toxel"); //57
let den58 = denPokemon.push("58 Appletun Applin Budew Eldegoss Ferroseed Ferrothorn Flapple Gossifleur Lombre Lotad Ludicolo Nuzleaf Roselia Roserade Seedot Shiftry"); //58
let den59 = denPokemon.push("59 Cherrim Cherubi Cottonee Dhelmise Eldegoss Gossifleur Lombre Lotad Ludicolo Morelull Nuzleaf Seedot Shiftry Shiinotic Whimsicott"); //59
let den60 = denPokemon.push("60 Drapion Garbodor Koffing Mareanie Salandit Salazzle Skorupi Skuntank Stunky Toxapex Toxel Toxtricity Trubbish Weezing"); //60
let den61 = denPokemon.push("61 Butterfree Corviknight Corvisquire Delibird Hawlucha Hoothoot Natu Noctowl Pelipper Rookidee Wingull Xatu"); //61
let den62 = denPokemon.push("62 Gardevoir Grimmsnarl Impidimp Mawile Mimikyu Morelull Morgrem Ralts Rapidash Shiinotic Togekiss Togepi Togetic"); //62
let den63 = denPokemon.push("63 Hydreigon Liepard Linoone Mandibuzz Nickit Obstagoon Pangoro Scrafty Scraggy Sneasel Thievul Tyranitar Vullaby Weavile Zigzagoon"); //63
let den64 = denPokemon.push("64 Applin Axew Dragapult Drakloak Drampa Dreepy Flygon Fraxure Goodra Goomy Hakamo-o Haxorus Jangmo-o Kommo-o Sliggoo Trapinch Turtonator Vibrava"); //64
let den65 = denPokemon.push("65 Braviary Bunnelby Dubwool Eevee Indeedee Oranguru Pidove Skwovet Snorlax Tranquill Unfezant Wooloo"); //65
let den66 = denPokemon.push("66 Ditto"); //66
let den67 = denPokemon.push("67 Arrokuda Basculin Chewtle Corphish Crawdaunt Lapras Mantine Mantyke Mareanie Pyukumuku Toxapex Vaporeon"); //67
let den68 = denPokemon.push("68 Bronzong Bronzor Espeon Hatenna Hatterene Hattrem Inkay Malamar Mr. Mime Mr. Rime Swoobat Woobat"); //68
let den69 = denPokemon.push("69 Bisharp Inkay Liepard Linoone Malamar Nickit Obstagoon Pangoro Pawniard Thievul Umbreon Zigzagoon"); //69
let den70 = denPokemon.push("70 Bounsweet Cherrim Cherubi Cottonee Eldegoss Ferroseed Ferrothorn Gossifleur Leafeon Steenee Tsareena Whimsicott"); //70
let den71 = denPokemon.push("71 Arcanine Carkol Chandelure Flareon Growlithe Heatmor Lampent Litwick Ninetales Sizzlipede Torkoal Vulpix"); //71
let den72 = denPokemon.push("72 Boltund Chinchou Heliolisk Helioptile Jolteon Lanturn Pikachu Toxel Toxtricity Vikavolt Yamper"); //72
let den73 = denPokemon.push("73 Avalugg Bergmite Froslass Frosmoth Glaceon Mr. Mime Mr. Rime Snom Snorunt Vanillish Vanillite Vanilluxe"); //73
let den74 = denPokemon.push("74 Aromatisse Gardevoir Grimmsnarl Impidimp Milcery Morgrem Ralts Slurpuff Spritzee Swirlix Sylveon Togekiss Togepi Togetic"); //74
let den75 = denPokemon.push("75 Araquanid Barboach Dewpider Gyarados Kingler Krabby Magikarp Quagsire Qwilfish Whiscash Wishiwashi Wooper"); //75
let den76 = denPokemon.push("76 Basculin Binacle Kingler Krabby Mantine Mantyke Octillery Pyukumuku Qwilfish Remoraid Wailmer Wailord"); //76
let den77 = denPokemon.push("77 Arcanine Centiskorch Charizard Charmander Charmeleon Growlithe Heatmor Litwick Ninetales Salazzle Sizzlipede Torkoal Vulpix"); //77
let den78 = denPokemon.push("78 Arrokuda Basculin Chewtle Drednaw Gastrodon Gyarados Kingler Krabby Magikarp Pyukumuku Qwilfish Wishiwashi"); //78
let den79 = denPokemon.push("79 Appletun Applin Budew Eldegoss Ferroseed Ferrothorn Flapple Gossifleur Lombre Lotad Ludicolo Nuzleaf Roselia Roserade Seedot Shiftry"); //79
let den80 = denPokemon.push("80 Arcanine Carkol Centiskorch Chandelure Coalossal Growlithe Heatmor Lampent Litwick Ninetales Salandit Sizzlipede Torkoal Vulpix"); //80
let den81 = denPokemon.push("81 Bewear Corsola Cursola Doublade Falinks Farfetch'd Gallade Gastly Gengar Haunter Hawlucha Honedge Lucario Machamp Machoke Machop Polteageist Riolu Runerigus Sableye Sinistea Sirfetch'd Stufful Yamask"); //81
let den82 = denPokemon.push("82 Alcremie Gardevoir Grimmsnarl Impidimp Mawile Morelull Morgrem Ponyta Ralts Rapidash Shiinotic Togekiss Togepi Togetic"); //82
let den83 = denPokemon.push("83 Avalugg Barbaracle Bergmite Binacle Bonsly Carkol Coalossal Crustle Cubchoo Delibird Dwebble Eiscue Glalie Lapras Mr. Mime Mr. Rime Onix Rolycoly Snorunt Steelix Stonjourner Sudowoodo Vanillite Vanilluxe"); //83
let den84 = denPokemon.push("84 Bisharp Bronzong Bronzor Duraludon Durant Klang Klink Klinklang Onix Pawniard Riolu Steelix"); //84
let den85 = denPokemon.push("85 Bisharp Bronzong Bronzor Copperajah Duraludon Ferroseed Ferrothorn Honedge Meowth Pawniard Perrserker Stunfisk"); //85
let den86 = denPokemon.push("86 Drapion Garbodor Koffing Mareanie Salandit Salazzle Skorupi Skuntank Stunky Toxapex Toxel Toxtricity Trubbish Weezing"); //86
let den87 = denPokemon.push("87 Aromatisse Gardevoir Grimmsnarl Hatterene Impidimp Milcery Morgrem Ralts Slurpuff Spritzee Swirlix Togekiss Togepi Togetic"); //87
let den88 = denPokemon.push("88 Grimmsnarl Hydreigon Impidimp Liepard Linoone Mandibuzz Morgrem Nickit Pangoro Scrafty Scraggy Thievul Tyranitar Vullaby Zigzagoon"); //88
let den89 = denPokemon.push("89 Butterfree Corviknight Corvisquire Hawlucha Hoothoot Natu Noctowl Pelipper Rookidee Sigilyph Wingull Xatu"); //89
let den90 = denPokemon.push("90 Accelgor Araquanid Blipbug Butterfree Dewpider Dottler Dwebble Escavalier Golisopod Karrablast Orbeetle Shelmet Wimpod"); //90
let den91 = denPokemon.push("91 Arrokuda Basculin Chewtle Corphish Crawdaunt Gyarados Kingler Krabby Lapras Mareanie Pyukumuku Toxapex"); //91
let den92 = denPokemon.push("92 Accelgor Araquanid Blipbug Dewpider Dottler Dwebble Escavalier Golisopod Karrablast Orbeetle Shelmet Wimpod"); //92
let den93 = denPokemon.push("93 Barboach Gastrodon Golett Golurk Palpitoad Quagsire Rhyperior Sandaconda Seismitoad Stunfisk Wooper Yamask"); //93

let den1 = denPokemon.push("1 Conkeldurr Croagunk Gurdurr Hitmonchan Hitmonlee Hitmontop Machamp Machoke Machop Scrafty Scraggy Timburr Toxicroak Tyrogue"); //1
let den2 = denPokemon.push("2 Duosion Elgyem Espurr Gardevoir Gothita Gothitelle Gothorita Kirlia Lunatone Meowstic Munna Musharna Ralts Reuniclus Solosis Solrock"); //2
let den3 = denPokemon.push("3 Barbaracle Binacle Boldore Bonsly Crustle Dwebble Gigalith Rhydon Rhyhorn Roggenrola Shuckle Sudowoodo"); //3
let den4 = denPokemon.push("4 Butterfree Caterpie Charjabug Durant Galvantula Grubbin Joltik Metapod Nincada Ninjask Vikavolt"); //4
let den5 = denPokemon.push("5 Blipbug Butterfree Caterpie Combee Cutiefly Dottler Galvantula Joltik Metapod Orbeetle Ribombee Vespiquen"); //5
let den6 = denPokemon.push("6 Drifblim Drifloon Dusclops Duskull Frillish Gastly Gourgeist Haunter Jellicent Phantump Pumpkaboo Trevenant"); //6
let den7 = denPokemon.push("7 Basculin Chinchou Gyarados Lanturn Magikarp Mantine Mantyke Octillery Remoraid Wailmer Wailord Wishiwashi"); //7
let den8 = denPokemon.push("8 Araquanid Arrokuda Barraskewda Basculin Chewtle Dewpider Drednaw Gastrodon Shellos Wailmer Wailord Wishiwashi"); //8

let den31 = denPokemon.push("31 Braviary Hoothoot Mandibuzz Natu Noctowl Pidove Rufflet Sigilyph Swoobat Tranquill Unfezant Vullaby Woobat Xatu"); //31
let den30 = denPokemon.push("30 Gastly Gloom Haunter Koffing Oddish Qwilfish Roselia Skorupi Toxel Toxtricity Vileplume Weezing"); //30
let den29 = denPokemon.push("29 Drapion Garbodor Mareanie Oddish Qwilfish Roselia Skorupi Skuntank Stunky Toxapex Trubbish Vileplume"); //29
let den28 = denPokemon.push("28 Dhelmise Gourgeist Maractus Morelull Phantump Pumpkaboo Roselia Shiinotic Trevenant"); //28
let den27 = denPokemon.push("27 Appletun Applin Budew Cherrim Cherubi Cottonee Eldegoss Ferroseed Ferrothorn Flapple Gossifleur Roselia Whimsicott"); //27
let den26 = denPokemon.push("26 Bellossom Bounsweet Budew Gloom Lombre Lotad Ludicolo Nuzleaf Oddish Roselia Seedot Shiftry Steenee Tsareena Vileplume"); //26
let den25 = denPokemon.push("25 Boltund Chinchou Heliolisk Helioptile Lanturn Morpeko Pikachu Pincurchin Togedemaru Toxel Toxtricity Yamper"); //25
let den24 = denPokemon.push("24 Charjabug Chinchou Electrike Galvantula Joltik Lanturn Manectric Pichu Pikachu Raichu Vikavolt"); //24
let den23 = denPokemon.push("23 Abomasnow Darmanitan Darumaka Delibird Eiscue Froslass Frosmoth Glalie Mr. Mime Mr. Rime Sneasel Snom Snorunt Snover"); //23
let den22 = denPokemon.push("22 Beartic Cloyster Cubchoo Frosmoth Mamoswine Mr. Mime Mr. Rime Piloswine Sneasel Snom Swinub Weavile"); //22
let den21 = denPokemon.push("21 Abomasnow Avalugg Bergmite Cloyster Delibird Lapras Piloswine Snover Swinub Vanillish Vanillite Vanilluxe"); //21
let den20 = denPokemon.push("20 Arcanine Carkol Centiskorch Coalossal Darmanitan Darumaka Growlithe Litwick Ninetales Salandit Salazzle Sizzlipede Torkoal Vulpix"); //20
let den19 = denPokemon.push("19 Arcanine Chandelure Growlithe Lampent Litwick Ninetales Salandit Salazzle Torkoal Turtonator Vulpix"); //19
let den18 = denPokemon.push("18 Arcanine Centiskorch Darmanitan Darumaka Growlithe Heatmor Lampent Litwick Ninetales Salandit Salazzle Sizzlipede Torkoal Vulpix"); //18
let den17 = denPokemon.push("17 Flygon Hippopotas Hippowdon Piloswine Runerigus Sandaconda Silicobra Stunfisk Swinub Trapinch Vibrava Yamask"); //17
let den16 = denPokemon.push("16 Barboach Diggersby Diglett Drilbur Dugtrio Excadrill Mudbray Mudsdale Nincada Onix Steelix Whiscash"); //16
let den15 = denPokemon.push("15 Barbaracle Binacle Boldore Carkol Coalossal Crustle Dwebble Gigalith Onix Rhyperior Roggenrola Rolycoly"); //15
let den14 = denPokemon.push("14 Baltoy Bronzor Claydol Indeedee Mime Jr. Mr. Mime Mr. Rime Natu Sigilyph Wobbuffet Wynaut Xatu"); //14
let den13 = denPokemon.push("13 Blipbug Dottler Hatenna Hatterene Hattrem Indeedee Mime Jr. Natu Oranguru Orbeetle Ponyta Rapidash Sigilyph Xatu"); //13
let den12 = denPokemon.push("12 Bisharp Bronzong Bronzor Ferroseed Ferrothorn Klink Mawile Pawniard Steelix Togedemaru"); //12
let den11 = denPokemon.push("11 Bisharp Bronzong Bronzor Copperajah Cufant Ferroseed Klang Klink Klinklang Meowth Pawniard Perrserker"); //11
let den9 = denPokemon.push("9 Chewtle Cloyster Corphish Crawdaunt Drednaw Palpitoad Pyukumuku Quagsire Seismitoad Shellder Tympole Wooper"); //9
let den32 = denPokemon.push("32 Corviknight Corvisquire Cramorant Drifblim Drifloon Hawlucha Natu Noibat Pelipper Rookidee Wingull Xatu"); //32
let den33 = denPokemon.push("33 Aromatisse Clefable Clefairy Cleffa Cutiefly Morelull Ribombee Shiinotic Slurpuff Spritzee Swirlix Togekiss Togepi Togetic"); //33
let den34 = denPokemon.push("34 Alcremie Clefable Clefairy Gardevoir Grimmsnarl Impidimp Kirlia Mawile Milcery Mime Jr. Morgrem Ralts Rapidash"); //34
let den35 = denPokemon.push("35 Bisharp Crawdaunt Inkay Liepard Malamar Pawniard Purrloin Sableye Shiftry Skuntank Sneasel Stunky Weavile"); //35
let den36 = denPokemon.push("36 Deino Grimmsnarl Hydreigon Impidimp Linoone Mandibuzz Morgrem Nickit Obstagoon Purrloin Thievul Tyranitar Vullaby Zigzagoon Zweilous"); //36
let den37 = denPokemon.push("37 Axew Drampa Flygon Fraxure Goodra Goomy Hakamo-o Haxorus Jangmo-o Kommo-o Noibat Sliggoo Trapinch Turtonator Vibrava"); //37
let den38 = denPokemon.push("38 Appletun Applin Dragapult Drakloak Dreepy Flapple Goodra Goomy Hakamo-o Jangmo-o Kommo-o Noibat Noivern Sliggoo"); //38
let den39 = denPokemon.push("39 Bewear Bunnelby Cinccino Diggersby Heliolisk Helioptile Hoothoot Minccino Noctowl Pidove Stufful Unfezant"); //39
let den40 = denPokemon.push("40 Braviary Diggersby Dubwool Greedent Indeedee Linoone Munchlax Oranguru Skwovet Snorlax Wooloo Zigzagoon"); //40
let den41 = denPokemon.push("41 Arrokuda Barraskewda Chinchou Cloyster Lanturn Mareanie Palpitoad Seismitoad Shellder Toxapex Tympole Wishiwashi"); //41
let den42 = denPokemon.push("42 Barbaracle Binacle Chewtle Corphish Crawdaunt Drednaw Gastrodon Jellicent Kingler Krabby Pyukumuku Shellos"); //42
}
//---------------------------------------------------------------------------------------------------

//EXCLUSIVES ----------------------------------------------------------------------------------
let swordExclusives = [];
let shieldExclusives = [];
{
let swExclusives = "Farfetch'd Seedot Nuzleaf Shiftry Mawile Solrock Darumaka Darmanitan"
	+ " Scraggy Scrafty Gothita Gothorita Gothitelle Rufflet Braviary Deino Zweilous"
	+ " Hydreigon Swirlix Slurpuff Passimian Turtonator Jangmo-o Hakamo-o Kommo-o"
	+ " Flapple Sirfetch'd Stonjourner";
swordExclusives = swExclusives.split(" ");
let shExclusives = "Ponyta Rapidash Corsola Larvitar Pupitar Tyranitar Lotad Lombre Ludicolo"
	+ " Sableye Lunatone Croagunk Toxicroak Solosis Duosion Reuniclus Vullaby"
	+ " Mandibuzz Spritzee Aromatisse Goomy Sliggoo Goodra Oranguru"
	+ " Drampa Appletun Cursola Eiscue";
shieldExclusives = shExclusives.split(" ");
}
//---------------------------------------------------------------------------------------------------

//let exclusiveFilter = "either";

let pkDenList = [];
for (const pk of denPokemon) {
	let row = pk.split(" ").slice(0);
	row.shift();
	pkDenList = pkDenList.concat(row);
}
pkDenList = [...new Set(pkDenList)];

map.eachLayer(function (layer) { 
	if (layer instanceof L.Marker) {
		layer.on('click', function(e) {
			let altDens = new Dens(layer.options.alt);
			let tier = altDens.link;
			if (tier !== "0") { //TODO: unnecessary check
				let denNumber = parseInt(tier, 10);
				window.open(denToLink(denNumber));
			}
		});
	}

});

//User Options/Controls

let findDenButton = document.getElementById("findDen");
let findDenBlank = document.getElementById("findDenBlank");
let clearFilterButton = document.getElementById("clearFilter");
let denDescDiv = document.getElementById("denDesc");

let mapTypeDropdown = document.getElementById("mapType");
let gameTypeDropdown = document.getElementById("gameType");

/*
gameTypeDropdown.onchange = function() { changeExclusiveFilter(); }
function changeExclusiveFilter() {
	let e = gameTypeDropdown;
	
	exclusiveFilter = e.value;
}
*/

mapTypeDropdown.onchange = function() { changeDenMap(); }
function changeDenMap() {
  let e = mapTypeDropdown;
	
  // remove image layer if it already exists
  if (map.hasLayer(denMap)) {
    map.removeLayer(denMap);
  }
  
  let newMap = MAP_RAW;
  switch (e.value) {
	  case "raw": newMap = MAP_RAW; break;
	  case "numbers": newMap = MAP_RARE; break;
	  case "gmax": newMap = MAP_GMAX; break;	  
  }
  
  denMap = L.imageOverlay(newMap, bounds);
  denMap.addTo(map);
}

findDenButton.onclick = function() { filterDens(); }
clearFilterButton.onclick = function() { filterDens(true); }

findDenBlank.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    event.preventDefault();
    findDenButton.click();
  }
});

//add <option>'s to input datalist (for autocomplete)
var ss = document.getElementById('pkAutoComplete');
for (const str of pkDenList) {
    var opt = document.createElement('option');
    opt.value = str;
    opt.innerHTML = str;
    ss.appendChild(opt);
}
//findDenBlank.list = ss;

function getPokemonInDen(number) {
	let thePokemon = [];
	for (const den of denPokemon) {
		//if (den.toLowerCase().indexOf(number) !== -1) {
		if (den.split(" ")[0].toLowerCase().trim() === number) {
			let inDen = den.split(" ");
			inDen.shift();
			thePokemon = thePokemon.concat(inDen);
		}
	}
	
	return thePokemon;
}

function getExclusive(pk) {
	if (swordExclusives.includes(pk)) {
		return "sword";
	} else if (shieldExclusives.includes(pk)) {
		return "shield";
	}
	
	return undefined;
}

function updateDenDescription() {
	if (denList.length <= 0) {
		denDescDiv.innerHTML = "";
		return;
	} else if (denList.length === 1) {
		if (denList[0].pokemon.length <= 0) {
			denDescDiv.innerHTML = "";
			return;
		}
	}
	
	let descStr = "<div style='font-weight: bold; font-size: large'>Possible Pokemon in Highlighted Dens</div>";
	descStr += `<div><img src="${NORMAL_ICON}" alt="Pokeball" height="20" width="20"> = Normal Pool</div>`;
	descStr += `<div><img src="${RARE_ICON}" alt="Ultra Ball" height="20" width="20"> = Rare Pool</div>`;
	descStr += `<div><img src="${GMAX_ICON}" alt="Master Ball" height="20" width="20"> = Gigantamax Pool</div><br>`;
	for (const den of denList) {
		//descStr += "<div style='text-decoration: underline'>" + den.name + ":</div>";
		descStr += `<a style="color: black; text-decoration: underline" target="_blank" href="${denToLink(den.number)}">${den.name}</a>`;
		descStr += "<div>";
		let maxPerLine = 5; let i = 0;
		for (const pk of den.pokemon) {
			//<a href="url">link text</a>
			let ex = getExclusive(pk);
			if (!ex) {
				color = "black";
			} else if (ex === "sword") {
				color = "blue";
			} else if (ex === "shield") {
				color = "red";
			}
			//descStr += pk;
			descStr += `<a style="color: ${color}; text-decoration: none" target="_blank" href="${pokemonToLink(pk)}">${pk}</a>`;
			if (i < maxPerLine) {
				descStr += " ";
				i++;
			} else {
				descStr += "<br>";
				i = 0;
			}
		}
		descStr += "</div><br>";
	}
	
	denDescDiv.innerHTML = descStr;
}

function filterDens(resetFilter = false) {
	let denText = findDenBlank.value;
	
	let nothing = false;
	if (denText.trim() === "") {
		nothing = true;
	}
	
	if (resetFilter) {
		findDenBlank.value = "";
		nothing = true;
	}
	
	//if is pokemon name, get possible den numbers for pokemon
	denList = []; //reset highlighted den list
	let possibleDens = [];
	if (!nothing && isNaN(parseInt(denText, 10))) {
		nothing = true;
		let name = denText.toLowerCase();
		for (const den of denPokemon) {
			if (den.toLowerCase().indexOf(name) !== -1) {
				let dNumStr = den.split(" ")[0]; //den number
				possibleDens.push(dNumStr);
				//let newDen = new Den(dNumStr, den.split(" ").shift());
				let newDen = new Den(dNumStr, getPokemonInDen(dNumStr));
				denList.push(newDen);
				//denText = dNumStr;
				nothing = false;
				//break;
			}
		}
	}
	
	//if den number in filter, get all pokemon from that den
	if (!isNaN(parseInt(denText, 10))) {
		let addDen = new Den(denText, getPokemonInDen(denText));
		denList.push(addDen);
	}
	
	if (nothing) { denList = []; }

	//valid den number (not a word)
	map.eachLayer(function (layer) {
		if (layer instanceof L.Marker) {
			let altDens = new Dens(layer.options.alt);
			if (nothing) { //empty search box/doesn't exist
				layer.setIcon(icon);
			} else if (possibleDens.length > 0) { //pokemon name in search box
				let rare = false; let normal = false; let gmax = false;
				let linkNum = undefined;
				if (possibleDens.includes(altDens.rare)) {
					rare = true; linkNum = altDens.rare;
					layer.setIcon(rareIcon);
				}
				if (possibleDens.includes(altDens.normal)) {
					normal = true; linkNum = altDens.normal;
					layer.setIcon(normalIcon);
				}
				if (possibleDens.includes(altDens.gmax)) {
					gmax = true; linkNum = altDens.gmax;
					layer.setIcon(gmaxIcon);
				}
				
				if (!(rare || normal || gmax)) {
					layer.setIcon(icon); //no icon					
				}
				
				if (linkNum) {
					layer.off('click');
					layer.on('click', function(e) {
						let denNumber = parseInt(linkNum, 10);
						window.open(denToLink(denNumber));
					});					
				}

				
				if (rare && normal) { layer.setIcon(nrIcon); }
				else if (gmax && normal) { layer.setIcon(ngIcon); }
			} else { //den number
				let damn = false;
				if (altDens.rare === denText) {
					layer.setIcon(rareIcon); //set rare icon
				} else if (altDens.normal === denText) {
					layer.setIcon(normalIcon); //set normal icon
				} else if (altDens.gmax === denText) {
					layer.setIcon(gmaxIcon); //set gmax icon
				} else {
					damn = true;
					layer.setIcon(icon); //no icon
				}
				
				if (!damn) {
					layer.off('click');
					layer.on('click', function(e) {
						let denNumber = parseInt(denText, 10);
						window.open(denToLink(denNumber));
					});					
				}

			}
		}

	});
	
	updateDenDescription();
}

map.on('click', function(e) {
	if (COPY_COORDS) {
		let coords = e.latlng.lat + ", " + e.latlng.lng;
		let template = `var marker = L.marker([${coords}]).addTo(map);`;
		copyToClipboard(template + " //Den #");		
	}
});

function denToLink(denNumber) {
	return `https://www.serebii.net/swordshield/maxraidbattles/den${denNumber}.shtml`;
}

function pokemonToLink(pokemon) {
	return `https://www.serebii.net/pokedex-swsh/${pokemon.toLowerCase()}/`;
}

function centerOnMarker(map, marker) {
  var latLngs = [ marker.getLatLng() ];
  var markerBounds = L.latLngBounds(latLngs);
  map.fitBounds(markerBounds);
}

const copyToClipboard = (str) => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};
