// ==UserScript==
// @version     0.54
// @name        erreur b-504
// @namespace   https://tv.sfr.fr/
// @description	erreurs (gestion et logs), pavé numérique pour zapper, volume sonore (live et départ), plein écran, reconnexion automatique, interface de configuration
// @author      ced
// @updateURL   https://greasyfork.org/fr/scripts/451721-erreur-b-504
// @downloadURL https://greasyfork.org/fr/scripts/451721-erreur-b-504
// @include     https://tv.sfr.fr/*
// @include     https://tv.sfr.fr/channel/*
// @include     https://tv.sfr.fr/content/*
// @include     https://tv.sfr.fr/guide
// @include     https://www.sfr.fr/cas/login*
// @exclude     https://tv.sfr.fr/settings  
// @grant       none
// @license     MIT
// @run-at document-start
// ==/UserScript==
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
console.log("----- Hello !");                                                                                                       // La console te salue

var FirstTimeScriptIsLoaded = true;                                                                                                 // Variable servant à déterminer si le script est lancé pour la prmière fois

var zindex1 = 100001;
var zindex2 = 100002;
var zindex3 = 100003;

var ttsUserPref = 0;                                                                                                                // Autoriser la synthése vocale 
var debugMode = 0;                                                                                                                  // Définir sur 1 pour pouvoir garder la console ouverte ! 
var nbLoggedErrors = 50;                                                                                                            // Définir le nombre d'erreurs conservées
var logTabAdded = false;                                                                                                            // Tableau affiché ou pas
var configDivAdded = false;                                                                                                         // Config affiché ou pas

var prompted = false;                                                                                                               // Etat des invites pour entrer les informations de connexion 

var sessionExpired = false;                                                                                                         // Session expirée ?

//var KnownErrors = false;                                                                                                          // Pour plus tard
var mainLoopStartTime = 0;                                                                                                          // Variable pour la date de départ du script
                                                                                                                                    // Attention à la mise en pause !!!!!!!!!!! 

var mainLoopDelay = 3000;                                                                                                           // Délai entre deux contrôles d'erreur
var nbloopBeforeReload = 3;                                                                                                         // Nombre de fois avant de recharger en cas d'interruption de la réception des données 
var nbloopBeforeBegin = 5;                                                                                                          // Nombre de fois avant d'autoriser le rechargement
                                                                                                                                    // Les deux précédents nombres multipliés par le délai (plus haut) définisse une durée 
var video = " ";                                                                                                                    // Variable
var lastTimeVideoEventProgressEvent = 0;                                                                                            // Variable (date à laquelle le lecteur reçoit des données)
var videoPlaying = "";                                                                                                              // Variable relative aux événements (play=2, pause=1, ended=0)

var inputKeys = "";                                                                                                                 // Frappe de touches (pavé numérique)
var inputKeysDelay = 2000;                                                                                                          // Délai pour taper le numéro de la chaine en ms
var oldUrl = "";                                                                                                                    // Url

var channelTabAdded = false;                                                                                                        // Tableau affiché ou pas
var nbColumnChannelTab = 10;                                                                                                        // Le nombre de colonnes dans le tableau
var imgChannelWidth = 75;                                                                                                           // Largeur des images

var channelTabAddedConfig = false;                                                                                                  // Tableau affiché ou pas
var nbColumnChannelTabConfig = 15;                                                                                                  // Le nombre de colonnes dans le tableau
var imgChannelWidthConfig = 50;                                                                                                     // Largeur des images
 
var volumeStart = 1;                                                                                                                // Le volume de départ (0->1)
var volumeStep = 10;                                                                                                                // Le volume est augmenté ou diminué de cette valeur  
var volumeDelay = 5000;                                                                                                             // Délai avant que l'indicateur volume s"efface

// -- Toute l'Histoire 178 -- Men's Up TV 185 -- Melody d'Afrique 272 -- BFM NICE COTE D'AZUR 285 -- France 3 - Côte d'Azur 441     // Nom des chaines contenant '
var dataStep = 6;                                                                                                                   // Variable informant du nombre de champs par chaine
var channelsInfos2 = [];                                                                                                            // Variable tableau des chaines      
channelsInfos2.push('TF1','1','1','TF1_color.png','TF1_color.png','1');                                                             // Ajout de données relatives aux chaines
channelsInfos2.push('France 2','2','1','France_2_color.png','France_2_color.png','1');                                              // Pour personaliser , modifier le dernier chiffre ( 1 pour la 
channelsInfos2.push('France 3','3','1','France_3_color.png','France_3_color.png','1');                                              //                     1 pour la prendre en compte                                          
channelsInfos2.push('France 5','5','1','France_5_color.png','France_5_color.png','1');                                              //                     0 pour ignorer
channelsInfos2.push('M6','6','1','M6_color.png','M6_color.png','1');                                                                // L'interface permet de le faire visuellement
channelsInfos2.push('Arte','7','1','Arte_color.png','Arte_color.png','1');                                                          // 
channelsInfos2.push('C8','8','1','C8_color.png','C8_color.png','1');                                                                // Nom de la chaine, Canal, Repertoire pour l'image, Image, Image, ok ou pas
channelsInfos2.push('W9','9','1','W9_color.png','W9_color.png','1');                                                                // 
channelsInfos2.push('TMC','10','1','TMC_color.png','TMC_color.png','1');
channelsInfos2.push('TFX','11','1','TFX_color.png','TFX_color.png','1');
channelsInfos2.push('NRJ12','12','1','NRJ12_color.png','NRJ12_color.png','1');
channelsInfos2.push('LCP','13','1','LCP_color.png','LCP_color.png','1');
channelsInfos2.push('France 4','14','1','France_4_color.png','France_4_color.png','1');
channelsInfos2.push('BFM TV','15','1','BFM_TV_color.png','BFM_TV_color.png','1');
channelsInfos2.push('CNews','16','1','CNews_color.png','CNews_color.png','1');
channelsInfos2.push('CStar','17','1','CStar_color.png','CStar_color.png','1');
channelsInfos2.push('Gulli','18','1','Gulli_color.png','Gulli_color.png','1');
channelsInfos2.push('TF1 Séries-Films','20','1','TF1_Series_Films_color.png','TF1_Series_Films_color.png','1');
channelsInfos2.push('La chaine l’Équipe','21','1','L_Equipe_color.png','L_Equipe_color.png','1');
channelsInfos2.push('6ter','22','1','6ter_color.png','6ter_color.png','1');
channelsInfos2.push('RMC STORY','23','1','RMC_STORY_color.png','RMC_STORY_color.png','1');
channelsInfos2.push('RMC Découverte','24','1','RMC_Decouverte_color.png','RMC_Decouverte_color.png','1');
channelsInfos2.push('Chérie 25','25','1','Cherie_25_color.png','Cherie_25_color.png','1');
channelsInfos2.push('LCI','26','1','LCI_color.png','LCI_color.png','1');
channelsInfos2.push('franceinfo:','27','1','franceinfo:_color.png','franceinfo:_color.png','1');
channelsInfos2.push('i24 news','28','1','i24_news_color.png','i24_news_color.png','1');
channelsInfos2.push('BFM Business','31','1','BFM_Business_color.png','BFM_Business_color.png','1');
channelsInfos2.push('TECH & CO','32','2','SFR100x100COLORTECHCO.png','SFR100x100COLORTECHCO.png','1');
channelsInfos2.push('RMC Sport 1','33','1','RMC_Sport_1_grayscale.png','RMC_Sport_1_color.png','0');
channelsInfos2.push('RMC Sport 2','34','1','RMC_Sport_2_grayscale.png','RMC_Sport_2_color.png','0');
channelsInfos2.push('Altice Studio','38','1','Altice_Studio_grayscale.png','Altice_Studio_color.png','0');
channelsInfos2.push('BFM PARIS ILE-DE-FRANCE','39','2','BFMPARISIDF100x100COULEURAVECCONTOUR.png','BFMPARISIDF100x100COULEURAVECCONTOUR.png','1');
channelsInfos2.push('Discovery Channel','40','1','Discovery_Channel_grayscale.png','Discovery_Channel_color.png','0');
channelsInfos2.push('Discovery Science','41','1','Discovery_Science_grayscale.png','Discovery_Science_color.png','0');
channelsInfos2.push('Discovery Investigation','43','2','ID100x100GRIS.png','ID100x100.png','0');
channelsInfos2.push('France 24','47','1','France_24_grayscale.png','France_24_color.png','0');
channelsInfos2.push('Euronews','48','1','Euronews_grayscale.png','Euronews_color.png','0');
channelsInfos2.push('13ème rue','50','1','13eme_rue_grayscale.png','13eme_rue_color.png','0');
channelsInfos2.push('Syfy','51','1','Syfy_grayscale.png','Syfy_color.png','0');
channelsInfos2.push('E! Entertainment','52','1','E_grayscale.png','E_color.png','1');
channelsInfos2.push('My Cuisine','55','1','My_Cuisine_grayscale.png','My_Cuisine_color.png','0');
channelsInfos2.push('MTV','56','2','MTVgris100x100.png','MTVgris100x100.png','0');
channelsInfos2.push('MCM','57','1','MCM_grayscale.png','MCM_color.png','0');
channelsInfos2.push('AB1','58','1','AB1_grayscale.png','AB1_color.png','0');
channelsInfos2.push('SERIE CLUB','59','1','SERIE_CLUB_grayscale.png','SERIE_CLUB_color.png','0');
channelsInfos2.push('Game One','60','1','Game_One_color.png','Game_One_color.png','1');
channelsInfos2.push('Game One +1','61','1','Game_One_1_color.png','Game_One_1_color.png','1');
channelsInfos2.push('J-One','63','1','J_One_color.png','J_One_color.png','1');
channelsInfos2.push('BET','64','2','BETLOGONOIR100x100.png','BETLOGONOIR100x100.png','1');
channelsInfos2.push('Comedy Central','65','1','Comedy_Central_color.png','Comedy_Central_color.png','1');
channelsInfos2.push('Paris Première','70','1','Paris_Premiere_color.png','Paris_Premiere_color.png','1');
channelsInfos2.push('Téva','71','1','Teva_color.png','Teva_color.png','1');
channelsInfos2.push('RTL9','72','1','RTL9_color.png','RTL9_color.png','1');
channelsInfos2.push('TV Breizh','73','2','TVBreizh100x100gris.png','TVBreizh100x100.png','0');
channelsInfos2.push('TV5 Monde','74','1','TV5_Monde_color.png','TV5_Monde_color.png','1');
channelsInfos2.push('TF1 + 1','75','1','TF1_1_color.png','TF1_1_color.png','1');
channelsInfos2.push('TMC + 1','76','1','TMC_1_color.png','TMC_1_color.png','1');
channelsInfos2.push('LCP-AN 24/24','103','1','LCP_AN_24_24_grayscale.png','LCP_AN_24_24_color.png','0');
channelsInfos2.push('Public Sénat','104','1','publicsenat-100x100-nb.png','publicsenat-100x100.png','0');
channelsInfos2.push('RMC Sport Access 1','106','1','RMC_Sport_Access_1_grayscale.png','RMC_Sport_Access_1_color.png','0');
channelsInfos2.push('RMC Sport Access 2','107','1','RMC_Sport_Access_2_grayscale.png','RMC_Sport_Access_2_color.png','0');
channelsInfos2.push('beIN SPORTS 1','115','1','beIN_SPORTS_1_grayscale.png','beIN_SPORTS_1_color.png','0');
channelsInfos2.push('beIN SPORTS 2','116','1','beIN_SPORTS_2_grayscale.png','beIN_SPORTS_2_color.png','0');
channelsInfos2.push('beIN SPORTS 3','117','1','beIN_SPORTS_3_grayscale.png','beIN_SPORTS_3_color.png','0');
channelsInfos2.push('Equidia','119','1','Equidia_grayscale.png','Equidia_color.png','0');
channelsInfos2.push('MGG TV','121','2','MGGTVverticalgris100x100.png','MGGTVvertical100x100.png','0');
channelsInfos2.push('Automoto la chaine','125','1','Automoto_grayscale.png','Automoto_color.png','0');
channelsInfos2.push('Golf Channel','126','1','Golf_Channel_grayscale.png','Golf_Channel_color.png','0');
channelsInfos2.push('Sport en France','129','1','Sport_en_France_color.png','Sport_en_France_color.png','1');
channelsInfos2.push('OLPLAY','130','2','olplay100x100grayscale.png','olplay100x100color.png','0');
channelsInfos2.push('OCS Max','141','2','OCSMAX100x100gris.png','OCSMAX100x100couleur.png','0');
channelsInfos2.push('OCS City','142','2','OCSCity100x100gris.png','OCSCity100x100couleur.png','0');
channelsInfos2.push('OCS Choc','143','2','OCSCHOC100x100gris.png','OCSCHOC100x100couleur.png','0');
channelsInfos2.push('OCS Geants','144','2','OCSGEANTS100x100gris.png','OCSGEANTS100x100couleur.png','0');
channelsInfos2.push('Ciné+ Premier','146','1','Cine_Premier_grayscale.png','Cine_Premier_color.png','0');
channelsInfos2.push('Ciné+ Frisson','147','1','Cine_Frisson_grayscale.png','Cine_Frisson_color.png','0');
channelsInfos2.push('Ciné+ Emotion','148','1','Cine_Emotion_grayscale.png','Cine_Emotion_color.png','0');
channelsInfos2.push('Ciné+ Famiz','149','1','Cine_Famiz_grayscale.png','Cine_Famiz_color.png','0');
channelsInfos2.push('Ciné+ Club','150','1','Cine_Club_grayscale.png','Cine_Club_color.png','0');
channelsInfos2.push('Ciné+ Classic','151','1','Cine_Classic_grayscale.png','Cine_Classic_color.png','0');
channelsInfos2.push('Paramount Channel','160','1','Paramount_Channel_color.png','Paramount_Channel_color.png','1');
channelsInfos2.push('Paramount Channel Décalé','161','1','Paramount_Channel_Decale_grayscale.png','Paramount_Channel_Decale_color.png','0');
channelsInfos2.push('TCM Cinéma','162','1','TCM_cinema_grayscale.png','TCM_cinema_color.png','0');
channelsInfos2.push('Action','163','1','Action_grayscale.png','Action_color.png','0');
channelsInfos2.push('Ushuaia TV','173','1','Ushuaia_TV_grayscale.png','Ushuaia_TV_color.png','0');
channelsInfos2.push('TREK','174','1','TREK_grayscale.png','TREK_color.png','0');
channelsInfos2.push('Crime District','175','2','NEUFCRIMEDISCTRICT100x100NB.png','NEUFCRIMEDISCTRICT100x100.png','0'); 
channelsInfos2.push('ESPACE DECOUVERTE','176','2','ESPACEDECOUVERTE100x100NB.png','ESPACEDECOUVERTE100x100.png','0');
channelsInfos2.push('Histoire','177','1','Histoire_grayscale.png','Histoire_color.png','0');
channelsInfos2.push('Toute l Histoire','178','1','Toute_l_Histoire_grayscale.png','Toute_l_Histoire_color.png','0');
channelsInfos2.push('KTO','179','1','KTO_grayscale.png','KTO_color.png','0');
channelsInfos2.push('Animaux','180','1','Animaux_grayscale.png','Animaux_color.png','0');
channelsInfos2.push('Chasse et Pêche','181','1','Chasse_et_Peche_grayscale.png','Chasse_et_Peche_color.png','0');
channelsInfos2.push('Science et Vie TV','182','1','Science_et_Vie_TV_grayscale.png','Science_et_Vie_TV_color.png','0');
channelsInfos2.push('Luxe TV','183','1','Luxe_TV_grayscale.png','Luxe_TV_color.png','0');
channelsInfos2.push('Fashion TV','184','1','Fashion_TV_grayscale.png','Fashion_TV_color.png','0');
channelsInfos2.push('Men s Up TV','185','1','Mens_Up_TV_grayscale.png','Mens_Up_TV_color.png','0');
channelsInfos2.push('Astrocenter TV','186','1','Astrocenter_TV_grayscale.png','Astrocenter_TV_color.png','0');
channelsInfos2.push('Nickelodeon Junior','200','1','Nickelodeon_Junior_grayscale.png','Nickelodeon_Junior_color.png','0');
channelsInfos2.push('Boomerang','201','1','Boomerang_grayscale.png','Boomerang_color.png','0');
channelsInfos2.push('Boomerang +1','202','1','Boomerang_1_grayscale.png','Boomerang_1_color.png','0');
channelsInfos2.push('TIJI','203','1','TIJI_grayscale.png','TIJI_color.png','0');
channelsInfos2.push('Nickelodeon','205','1','Nickelodeon_grayscale.png','Nickelodeon_color.png','0');
channelsInfos2.push('Nickelodeon+1','206','1','Nickelodeon_1_grayscale.png','Nickelodeon_1_color.png','0');
channelsInfos2.push('CANAL J','210','1','CANAL_J_grayscale.png','CANAL_J_color.png','0');
channelsInfos2.push('Cartoon Network','211','1','Cartoon_Network_grayscale.png','Cartoon_Network_color.png','0');
channelsInfos2.push('Nickelodeon Teen','212','1','Nickelodeon_Teen_grayscale.png','Nickelodeon_Teen_color.png','0');
channelsInfos2.push('Boing','213','2','Boing100x100couleur.png','Boing100x100couleur.png','1');
channelsInfos2.push('TOONAMI','214','2','100x100TOONAMIGRIS.png','100x100TOONAMIGRIS.png','0');
channelsInfos2.push('Mangas','231','1','Mangas_grayscale.png','Mangas_color.png','0');
channelsInfos2.push('Lucky Jack','234','1','Lucky_Jack_grayscale.png','Lucky_Jack_color.png','0');
channelsInfos2.push('MTV Hits','250','2','MTVGRIS100x100.png','MTVGRIS100x100.png','0');
channelsInfos2.push('M6 Music','254','1','M6_Music_color.png','M6_Music_color.png','1');
channelsInfos2.push('RFM TV','255','1','RFM_TV_color.png','RFM_TV_color.png','1');
channelsInfos2.push('NRJ Hits','256','1','NRJ_Hits_grayscale.png','NRJ_Hits_color.png','0');
channelsInfos2.push('Mezzo','260','1','Mezzo_grayscale.png','Mezzo_color.png','0');
channelsInfos2.push('Mezzo Live HD','261','1','Mezzo_Live_HD_grayscale.png','Mezzo_Live_HD_color.png','0');
channelsInfos2.push('MELODY TV','262','1','MELODY_TV_grayscale.png','MELODY_TV_color.png','0');
channelsInfos2.push('Trace Urban','263','1','Trace_Urban_grayscale.png','Trace_Urban_color.png','0');
channelsInfos2.push('Trace Toca','264','1','Trace_Toca_grayscale.png','Trace_Toca_color.png','0');
channelsInfos2.push('TRACE CARIBBEAN','265','1','TRACE_CARIBBEAN_grayscale.png','TRACE_CARIBBEAN_color.png','0');
channelsInfos2.push('Trace Gospel','266','1','Trace_Gospel_grayscale.png','Trace_Gospel_color.png','0');
channelsInfos2.push('BBLACK Classik','267','1','BBLACK_CLASSIK_grayscale.png','BBLACK_CLASSIK_color.png','0');
channelsInfos2.push('BBLACK Caribbean','268','1','BBLACK_CARIBBEAN_grayscale.png','BBLACK_CARIBBEAN_color.png','0');
channelsInfos2.push('BBLACK Africa','269','1','BBLACK_AFRICA_grayscale.png','BBLACK_AFRICA_color.png','0');
channelsInfos2.push('Melody d Afrique','272','1','Melody_d_Afrique_grayscale.png','Melody_d_Afrique_color.png','0');
channelsInfos2.push('BFM Lyon','281','1','BFM_Lyon_color.png','BFM_Lyon_color.png','1');
channelsInfos2.push('BFM Grand Lille','282','1','bfmgrandlille-100x100.png','bfmgrandlille-100x100.png','0');
channelsInfos2.push('BFM Grand Littoral','283','1','bfmgrandlittoral-100x100.png','bfmgrandlittoral-100x100.png','0');
channelsInfos2.push('BFM MARSEILLE PROVENCE','284','2','NEUFBFMMARSEILLEPROV100x100.png','NEUFBFMMARSEILLEPROV100x100.png','0');
channelsInfos2.push('BFM NICE COTE D AZUR','285','2','NEUFBFMNICECOTEDAZUR100x100.png','NEUFBFMNICECOTEDAZUR100x100.png','0');
channelsInfos2.push('BFM TOULON VAR','286','2','NEUFBFMTOULONVAR100x100.png','NEUFBFMTOULONVAR100x100.png','0');
channelsInfos2.push('BFM DICI ALPES DU SUD','287','2','BFMDICIALPESDUSUD100x100.png','BFMDICIALPESDUSUD100x100.png','0');
channelsInfos2.push('BFM DICI HAUTE-PROVENCE','288','2','BFMDICIHAUTEPROVENCE100x100.png','BFMDICIHAUTEPROVENCE100x100.png','0');
channelsInfos2.push('BFM ALSACE','289','2','BFMALSACE100x100.png','BFMALSACE100x100.png','0');
channelsInfos2.push('BFM NORMANDIE','290','2','BFMNORMANDIE100x100COULEUR.png','BFMNORMANDIE100x100COULEUR.png','0');
channelsInfos2.push('vià30','295','1','via30_grayscale.png','via30_color.png','0');
channelsInfos2.push('vià31','296','1','via31_grayscale.png','via31_color.png','0');
channelsInfos2.push('vià34','297','1','via34_grayscale.png','via34_color.png','0');
channelsInfos2.push('vià66','298','1','via66_grayscale.png','via66_color.png','0');
channelsInfos2.push('beIN SPORTS MAX 4','300','1','beIN_SPORTS_MAX_4_grayscale.png','beIN_SPORTS_MAX_4_color.png','0');
channelsInfos2.push('beIN SPORTS MAX 5','301','1','beIN_SPORTS_MAX_5_grayscale.png','beIN_SPORTS_MAX_5_color.png','0');
channelsInfos2.push('beIN SPORTS MAX 6','302','1','beIN_SPORTS_MAX_6_grayscale.png','beIN_SPORTS_MAX_6_color.png','0');
channelsInfos2.push('beIN SPORTS MAX 7','303','1','beIN_SPORTS_MAX_7_grayscale.png','beIN_SPORTS_MAX_7_color.png','0');
channelsInfos2.push('beIN SPORTS MAX 8','304','1','beIN_SPORTS_MAX_8_grayscale.png','beIN_SPORTS_MAX_8_color.png','0');
channelsInfos2.push('beIN SPORTS MAX 9','305','1','beIN_SPORTS_MAX_9_grayscale.png','beIN_SPORTS_MAX_9_color.png','0');
channelsInfos2.push('beIN SPORTS MAX 10','306','1','beIN_SPORTS_MAX_10_grayscale.png','beIN_SPORTS_MAX_10_color.png','0');
channelsInfos2.push('RMC Sport Live 3','316','2','RMCSPORTLIVE3100x100NB.png','RMCSPORTLIVE3100x100.png','0');
channelsInfos2.push('RMC Sport Live 4','317','2','RMCSPORTLIVE4100x100NB.png','RMCSPORTLIVE4100x100.png','0');
channelsInfos2.push('RMC Sport Live 5','318','1','RMC_Sport_Live_5_grayscale.png','RMC_Sport_Live_5_color.png','0');
channelsInfos2.push('RMC Sport Live 6','319','1','RMC_Sport_Live_6_grayscale.png','RMC_Sport_Live_6_color.png','0');
channelsInfos2.push('RMC Sport Live 7','320','1','RMC_Sport_Live_7_grayscale.png','RMC_Sport_Live_7_color.png','0');
channelsInfos2.push('RMC Sport Live 8','321','1','RMC_Sport_Live_8_grayscale.png','RMC_Sport_Live_8_color.png','0');
channelsInfos2.push('RMC Sport Live 9','322','1','RMC_Sport_Live_9_grayscale.png','RMC_Sport_Live_9_color.png','0');
channelsInfos2.push('RMC Sport Live 10','323','1','RMC_Sport_Live_10_grayscale.png','RMC_Sport_Live_10_color.png','0');
channelsInfos2.push('RMC Sport Live 11','324','1','RMC_Sport_Live_11_grayscale.png','RMC_Sport_Live_11_color.png','0');
channelsInfos2.push('RMC Sport Live 12','325','1','RMC_Sport_Live_12_grayscale.png','RMC_Sport_Live_12_color.png','0');
channelsInfos2.push('RMC Sport Live 13','326','2','LIVE13noir100x100.png','LIVE13couleur100x100.png','0');
channelsInfos2.push('RMC Sport Live 14','327','2','LIVE14noir100x100.png','LIVE14couleur100x100.png','0');
channelsInfos2.push('RMC Sport Live 15','328','2','LIVE15noir100x100.png','LIVE15couleur100x100.png','0');
channelsInfos2.push('RMC Sport Live 16','329','2','LIVE16noir100x100.png','LIVE16couleur100x100.png','0');
channelsInfos2.push('RMC Sport Live 17','330','2','LIVE17noir100x100.png','LIVE17couleur100x100.png','0');
channelsInfos2.push('France 3 - Alpes','431','1','France-3-Alpes-Color.jpg','France-3-Alpes-Color.jpg','0');
channelsInfos2.push('France 3 - Alsace','432','1','France-3-Alsace-Color.jpg','France-3-Alsace-Color.jpg','0');
channelsInfos2.push('France 3 - Aquitaine','433','1','France-3-Aquitaine-Color.jpg','France-3-Aquitaine-Color.jpg','0');
channelsInfos2.push('France 3 - Auvergne','434','1','France-3-Auvergne-Color.jpg','France-3-Auvergne-Color.jpg','0');
channelsInfos2.push('France 3 - Basse-Normandie','435','1','France-3-Normandie-Color.jpg','France-3-Normandie-Color.jpg','0');
channelsInfos2.push('France 3 - Bourgogne','436','1','France-3-Bourgogne-Color.jpg','France-3-Bourgogne-Color.jpg','0');
channelsInfos2.push('France 3 - Bretagne','437','1','France-3-Bretagne-Color.jpg','France-3-Bretagne-Color.jpg','0');
channelsInfos2.push('France 3 - Centre','438','1','France%203%20-%20Centre%20-%20Couleur.jpg','France%203%20-%20Centre%20-%20Couleur.jpg','0');
channelsInfos2.push('France 3 - Champagne-Ardenne','439','1','France-3-Champagne-Ardenne-Color.jpg','France-3-Champagne-Ardenne-Color.jpg','0');
channelsInfos2.push('France 3 - Corse','440','1','France-3-Corse-Color.jpg','France-3-Corse-Color.jpg','0');
channelsInfos2.push('France 3 - Côte d Azur','441','1','France-3-Cote-Azur-Color.jpg','France-3-Cote-Azur-Color.jpg','0');
channelsInfos2.push('France 3 - Franche-Comté','442','1','France-3-Franche-Comte-Color.jpg','France-3-Franche-Comte-Color.jpg','0');
channelsInfos2.push('France 3 - Haute-Normandie','443','1','France-3-Normandie-Color.jpg','France-3-Normandie-Color.jpg','0');
channelsInfos2.push('France 3 - Languedoc','444','1','France-3-Languedoc-Roussillon-Color.jpg','France-3-Languedoc-Roussillon-Color.jpg','0');
channelsInfos2.push('France 3 - Limousin','445','1','France-3-Limousin-Color.jpg','France-3-Limousin-Color.jpg','0');
channelsInfos2.push('France 3 - Lorraine','446','1','France-3-Lorraine-Color.jpg','France-3-Lorraine-Color.jpg','0');
channelsInfos2.push('France 3 - Midi-Pyrénées','447','1','France-3-Midi-Pyrenees-Color.jpg','France-3-Midi-Pyrenees-Color.jpg','0');
channelsInfos2.push('France 3 - Nord Pas-de-Calais','448','1','France-3-Nord-pas-de-Calais-Color.jpg','France-3-Nord-pas-de-Calais-Color.jpg','1');
channelsInfos2.push('France 3 - Paris Ile-de-France','449','1','France-3-Paris-IdF-Color.jpg','France-3-Paris-IdF-Color.jpg','0');
channelsInfos2.push('France 3 - Pays de Loire','450','1','France-3-Pyas-de-la-Loire-Color.jpg','France-3-Pyas-de-la-Loire-Color.jpg','0');
channelsInfos2.push('France 3 - Picardie','451','1','France-3-Picardie-Color.jpg','France-3-Picardie-Color.jpg','0');
channelsInfos2.push('France 3 - Poitou-Charentes','452','1','France-3-Poitou-Charentes-Color.jpg','France-3-Poitou-Charentes-Color.jpg','0');
channelsInfos2.push('France 3 - Provence Alpes','453','1','France-3-Provence-Alpes-Color.jpg','France-3-Provence-Alpes-Color.jpg','0');
channelsInfos2.push('France 3 - Rhône-Alpes','454','1','France-3-Rhone-Alpes-Color.jpg','France-3-Rhone-Alpes-Color.jpg','0');
channelsInfos2.push('France 3 Nouvelle Aquitaine','455','1','France-3-Nouvelle-Aquitaine-Color.jpg','France-3-Nouvelle-Aquitaine-Color.jpg','0');
channelsInfos2.push('Canal 21','457','1','Canal_21_grayscale.png','Canal_21_color.png','0');
channelsInfos2.push('IDF1','461','1','IDF1_grayscale.png','IDF1_color.png','0');
channelsInfos2.push('TELE-VISION MONTREUIL','467','1','TELE_VISION_MONTREUIL_grayscale.png','TELE_VISION_MONTREUIL_color.png','0');
channelsInfos2.push('Museum TV Paris','468','2','MUSEUM100x100GRIS.png','MUSEUM100x100.png','0');
channelsInfos2.push('TV78','469','1','TV78_grayscale.png','TV78_color.png','0');
channelsInfos2.push('LYON TV','476','1','LYON_TV_grayscale.png','LYON_TV_color.png','0');
channelsInfos2.push('Télé Grenoble','477','1','Tele_Grenoble_grayscale.png','Tele_Grenoble_color.png','0');
channelsInfos2.push('TL7','478','1','TL7_Saint_etienne_grayscale.png','TL7_Saint_etienne_color.png','0');
channelsInfos2.push('8 Mont Blanc','480','1','8_Mont_Blanc_grayscale.png','8_Mont_Blanc_color.png','0');
channelsInfos2.push('IL TV','481','1','IL_TV_grayscale.png','IL_TV_color.png','0');
channelsInfos2.push('TELEGOHELLE','485','1','TELEGOHELLE_grayscale.png','TELEGOHELLE_color.png','0');
channelsInfos2.push('Weo','487','1','weo-100x100-nb.png','weo-100x100.png','0');
channelsInfos2.push('Vià MATÉLÉ','489','2','viamatele100x100couleur.png','viamatele100x100couleur.png','1');
channelsInfos2.push('7 A LIMOGES','490','1','7_A_LIMOGES_grayscale.png','7_A_LIMOGES_color.png','0');
channelsInfos2.push('TV7 Bordeaux','491','1','TV7_Bordeaux_grayscale.png','TV7_Bordeaux_color.png','0');
channelsInfos2.push('TVPI','492','1','TVPI_color.png','TVPI_color.png','1');
channelsInfos2.push('TV2COM','501','2','100x100tv2com.png','100x100tv2com.png','1');
channelsInfos2.push('Canal 32','505','1','Canal_32_grayscale.png','Canal_32_color.png','0');
channelsInfos2.push('VIA Mirabelle','506','1','VIA_Mirabelle_grayscale.png','VIA_Mirabelle_color.png','0');
channelsInfos2.push('TELE SCHILTIGHEIM - CANAL','509','1','TELE_SCHILTIGHEIM_CANAL_grayscale.png','TELE_SCHILTIGHEIM_CANAL_color.png','0');
channelsInfos2.push('Mosaïk Cristal','512','1','Mosaik_grayscale.png','Mosaik_color.png','0');
channelsInfos2.push('TV8 Moselle-Est','513','1','TV8_Moselle_Est_grayscale.png','TV8_Moselle_Est_color.png','0');
channelsInfos2.push('VIA Vosges','514','1','VIA_Vosges_grayscale.png','VIA_Vosges_color.png','0');
channelsInfos2.push('WANTZ TV','515','1','WANTZ_TV_grayscale.png','WANTZ_TV_color.png','0');
channelsInfos2.push('Maritima TV','520','1','Maritima_TV_grayscale.png','Maritima_TV_color.png','1');
channelsInfos2.push('MAURIENNE TV','522','2','mauriennetv100x100.png','mauriennetv100x100.png','0');
channelsInfos2.push('Angers télé','523','1','Angers_tele_grayscale.png','Angers_tele_color.png','0');
channelsInfos2.push('Télénantes','524','1','Telenantes_grayscale.png','Telenantes_color.png','0');
channelsInfos2.push('TV Vendée','525','1','TV_Vendee_grayscale.png','TV_Vendee_color.png','0');
channelsInfos2.push('La chaîne normande','527','1','La_chaine_normande_grayscale.png','La_chaine_normande_color.png','0');
channelsInfos2.push('TEBEO','529','1','TEBEO_grayscale.png','TEBEO_color.png','0');
channelsInfos2.push('TV RENNES 35','530','2','TVRennes35100x100couleur.png','TVRennes35100x100couleur.png','1');
channelsInfos2.push('TV Tours','533','1','TV_Tours_grayscale.png','TV_Tours_color.png','0');
channelsInfos2.push('ZOUK TV','536','1','ZOUK_TV_grayscale.png','ZOUK_TV_color.png','0');
channelsInfos2.push('Télé Paese','537','1','Tele_Paese_grayscale.png','Tele_Paese_color.png','0');
channelsInfos2.push('CNN International','541','1','CNN_International_color.png','CNN_International_color.png','1');
channelsInfos2.push('BBC World News','542','1','BBC_World_News_grayscale.png','BBC_World_News_color.png','0');
channelsInfos2.push('France 24 Anglais','543','1','France_24_English_grayscale.png','France_24_English_color.png','0');
channelsInfos2.push('CNBC Europe','544','1','CNBC_EUROPE_grayscale.png','CNBC_EUROPE_color.png','0');
channelsInfos2.push('Bloomberg PAN-European','545','1','Bloomberg_PAN_European_grayscale.png','Bloomberg_PAN_European_color.png','0');
channelsInfos2.push('Al Jazeera English','546','1','Al_Jazeera_English_grayscale.png','Al_Jazeera_English_color.png','0');
channelsInfos2.push('i24 News Anglais','547','1','I24_NEWS_ENGLISH_color.png','I24_NEWS_ENGLISH_color.png','1');
channelsInfos2.push('NHK WORLD-JAPAN','548','1','NHK_WORLD_JAPAN_color.png','NHK_WORLD_JAPAN_color.png','1');
channelsInfos2.push('Sky News','549','1','Sky_News_grayscale.png','Sky_News_color.png','0');
channelsInfos2.push('i24 News Arabe','555','1','I24_NEWS_ARABIC_color.png','I24_NEWS_ARABIC_color.png','1');
channelsInfos2.push('France 24 Arabe','556','1','France_24_Arabic_grayscale.png','France_24_Arabic_color.png','0');
channelsInfos2.push('Medi1TV','558','1','Medi1TV_grayscale.png','Medi1TV_color.png','0');
channelsInfos2.push('AL ARABIYA','559','1','AL_ARABIYA_grayscale.png','AL_ARABIYA_color.png','0');
channelsInfos2.push('Ennahar TV','561','1','Ennahar_TV_grayscale.png','Ennahar_TV_color.png','0');
channelsInfos2.push('24h','574','1','24H_TVE_grayscale.png','24H_TVE_color.png','0');
channelsInfos2.push('TVE','575','1','TVEI_grayscale.png','TVEI_color.png','0');
channelsInfos2.push('DW-TV','578','1','DW_TV_grayscale.png','DW_TV_color.png','0');
channelsInfos2.push('WELT','579','1','WELT_grayscale.png','WELT_color.png','0');
channelsInfos2.push('N-TV','580','1','N_TV_grayscale.png','N_TV_color.png','0');
channelsInfos2.push('Record News','586','1','Record_News_grayscale.png','Record_News_color.png','0');
channelsInfos2.push('Africa 24','595','1','Africa_24_grayscale.png','Africa_24_color.png','0');
channelsInfos2.push('Gabon 24','596','1','Gabon_24_grayscale.png','Gabon_24_color.png','0');
channelsInfos2.push('Canal2','597','1','Canal2_grayscale.png','Canal2_color.png','0');
channelsInfos2.push('TVI ficcao','602','1','TVI_ficcao_grayscale.png','TVI_ficcao_color.png','0');
channelsInfos2.push('Porto Canal','604','1','Porto_Canal_grayscale.png','Porto_Canal_color.png','0');
channelsInfos2.push('Local Visao','605','1','Local_Visao_grayscale.png','Local_Visao_color.png','0');
channelsInfos2.push('Benfica TV','608','1','Benfica_TV_grayscale.png','Benfica_TV_color.png','0');
channelsInfos2.push('A BOLA TV','609','1','A_BOLA_TV_grayscale.png','A_BOLA_TV_color.png','0');
channelsInfos2.push('Canal Q','622','1','Canal_Q_grayscale.png','Canal_Q_color.png','0');
channelsInfos2.push('RTPI','624','1','RTPI_grayscale.png','RTPI_color.png','0');
channelsInfos2.push('Rai Uno','626','1','Rai_Uno_grayscale.png','Rai_Uno_color.png','0');
channelsInfos2.push('RAI SCUOLA','629','1','rai-scuola-100x100-gris.png','rai-scuola-100x100-couleur.png','0');
channelsInfos2.push('RAI STORIA','630','1','rai-storia-100x100-gris.png','rai-storia-100x100-couleur.png','0');
channelsInfos2.push('Somos','645','1','Somos_grayscale.png','Somos_color.png','0');
channelsInfos2.push('A3 Cine','646','1','A3_Cine_grayscale.png','A3_Cine_color.png','0');
channelsInfos2.push('Sol Musica','650','1','Sol_Musica_grayscale.png','Sol_Musica_color.png','0');
channelsInfos2.push('TVG EUROPA','651','1','TVG_EUROPA_grayscale.png','TVG_EUROPA_color.png','0');
channelsInfos2.push('ETB Sat','655','1','ETB_Sat_grayscale.png','ETB_Sat_color.png','0');
channelsInfos2.push('Canal Cocina','657','1','Canal_Cocina_grayscale.png','Canal_Cocina_color.png','0');
channelsInfos2.push('Decasa','658','1','Decasa_grayscale.png','Decasa_color.png','0');
channelsInfos2.push('BBC Entertainment','667','1','BBC_ENTERTAINMENT_grayscale.png','BBC_ENTERTAINMENT_color.png','0');
channelsInfos2.push('ProSieben','673','1','ProSieben_grayscale.png','ProSieben_color.png','0');
channelsInfos2.push('RTL Television','675','1','RTL_Television_grayscale.png','RTL_Television_color.png','0');
channelsInfos2.push('RTL2','676','1','RTL2_grayscale.png','RTL2_color.png','0');
channelsInfos2.push('Super RTL','678','1','Super_RTL_grayscale.png','Super_RTL_color.png','0');
channelsInfos2.push('VOX','680','1','Vox_grayscale.png','Vox_color.png','0');
channelsInfos2.push('KABEL EINS','682','1','KABEL_EINS_grayscale.png','KABEL_EINS_color.png','0');
channelsInfos2.push('RTL NITRO TV','685','1','RTL_NITRO_TV_grayscale.png','RTL_NITRO_TV_color.png','0');
channelsInfos2.push('Arte Allemand','686','1','Arte_Allemand_grayscale.png','Arte_Allemand_color.png','0');
channelsInfos2.push('TVP Polonia','700','1','TVP_Polonia_grayscale.png','TVP_Polonia_color.png','0');
channelsInfos2.push('Armenia 1','713','1','Armenia_1_grayscale.png','Armenia_1_color.png','0');
channelsInfos2.push('Channel One Russia','718','1','Channel_One_Russia_grayscale.png','Channel_One_Russia_color.png','0');
channelsInfos2.push('RTR Planeta','731','1','RTR_Planeta_grayscale.png','RTR_Planeta_color.png','0');
channelsInfos2.push('ART CINEMA','733','2','ARTCINEMA100x100GRIS.png','ARTCINEMA100x100GRIS.png','0');
channelsInfos2.push('ART AFLAM 1','734','2','ARTAFLAM1100x100GRIS.png','ARTAFLAM1100x100GRIS.png','0');
channelsInfos2.push('ART AFLAM 2','735','2','ARTAFLAM2100x100GRIS.png','ARTAFLAM2100x100GRIS.png','0');
channelsInfos2.push('AL HEKAYAT 1','736','2','AlHekayat100x100GRIS.png','AlHekayat100x100.png','0');
channelsInfos2.push('AL HEKAYAT 2','737','2','ALHEKAYAT2100x100gris.png','ALHEKAYAT2100x100couleur.png','0');
channelsInfos2.push('TV Romania International','738','1','TV_Romania_International_grayscale.png','TV_Romania_International_color.png','0');
channelsInfos2.push('Télé Maroc','740','2','telemaroc100x100grayscale.png','telemaroc100x100color.png','0');
channelsInfos2.push('Canal Algérie','742','1','Canal_Algerie_grayscale.png','Canal_Algerie_color.png','0');
channelsInfos2.push('Beur FM TV','746','1','Beur_FM_TV_grayscale.png','Beur_FM_TV_color.png','0');
channelsInfos2.push('2M Maroc','749','1','2M_Maroc_grayscale.png','2M_Maroc_color.png','0');
channelsInfos2.push('Al Aoula','750','1','Al_Aoula_grayscale.png','Al_Aoula_color.png','0');
channelsInfos2.push('Arryadia','751','1','Arryadia_grayscale.png','Arryadia_color.png','0');
channelsInfos2.push('Assadissa','752','1','Assadissa_grayscale.png','Assadissa_color.png','0');
channelsInfos2.push('Tunisia 1','759','1','Tunisia_1_grayscale.png','Tunisia_1_color.png','0');
channelsInfos2.push('Berbère TV','765','1','Berbere_TV_grayscale.png','Berbere_TV_color.png','0');
channelsInfos2.push('Baraem','769','1','Baraem_grayscale.png','Baraem_color.png','0');
channelsInfos2.push('Jeem TV','770','1','Jeem_TV_grayscale.png','Jeem_TV_color.png','0');
channelsInfos2.push('MBC Drama','773','2','mbcdrama100x100grayscale.png','mbcdrama100x100color.png','0');
channelsInfos2.push('Echorouk News','774','1','Echorouk_News_grayscale.png','Echorouk_News_color.png','0');
channelsInfos2.push('El Bilad TV','775','1','elbiladtv-100x100-nb.png','elbiladtv-100x100.png','0');
channelsInfos2.push('MBC','778','2','MBC100x100GRIS.png','MBC100x100COULEUR.png','0');
channelsInfos2.push('MBC 5','780','2','MB5100x100GRIS.png','MB5100x100COULEUR.png','0');
channelsInfos2.push('MBC Masr','782','2','MBCMASR100x100GRIS.png','MBCMASR100x100COULEUR.png','0');
channelsInfos2.push('Rotana Cinema','783','1','Rotana_Cinema_grayscale.png','Rotana_Cinema_color.png','0');
channelsInfos2.push('Nessma','785','1','Nessma_grayscale.png','Nessma_color.png','0');
channelsInfos2.push('DMC','786','2','DMC100x100grayscale.png','DMC100x100color.png','0');
channelsInfos2.push('Fix and Foxi','787','2','FOXETFOXI100x100grayscale.png','FOXETFOXI100x100color.png','0');
channelsInfos2.push('Carthage+','788','2','carthage100x100grayscale.png','carthage100x100color.png','0');
channelsInfos2.push('DMC Drama','789','2','dmcdrama100x100grayscale.png','dmcdrama100x100color.png','0');
channelsInfos2.push('Iqraa International','790','1','Iqraa_International_grayscale.png','Iqraa_International_color.png','0');
channelsInfos2.push('Iqraa TV','791','1','Iqraa_TV_grayscale.png','Iqraa_TV_color.png','0');
channelsInfos2.push('Al Majd Holy Quran','792','1','Al_Majd_Holy_Quran_grayscale.png','Al_Majd_Holy_Quran_color.png','0');
channelsInfos2.push('ERE TV','793','1','ERE_TV_grayscale.png','ERE_TV_color.png','0');
channelsInfos2.push('Al Maghribia','798','1','Al_Maghribia_grayscale.png','Al_Maghribia_color.png','0');
channelsInfos2.push('Arrabiâ','799','1','Arrabia_grayscale.png','Arrabia_color.png','0');
channelsInfos2.push('Murr TV','805','1','Murr_TV_grayscale.png','Murr_TV_color.png','0');
channelsInfos2.push('Dubaï TV','807','1','Dubai_TV_grayscale.png','Dubai_TV_color.png','0');
channelsInfos2.push('ON TV','809','2','ontv100x100grayscale.png','ontv100x100color.png','0');
channelsInfos2.push('HANNIBAL TV','810','1','HANNIBALTV-100x100-NB.png','HANNIBALTV-100x100.png','0');
channelsInfos2.push('Al Masriya','813','1','Al_Masriya_grayscale.png','Al_Masriya_color.png','0');
channelsInfos2.push('The Israeli Network','814','1','The_Israeli_Network_grayscale.png','The_Israeli_Network_color.png','0');
channelsInfos2.push('Jordan Satellite Channel','815','1','Jordan_Satellite_Channel_grayscale.png','Jordan_Satellite_Channel_color.png','0');
channelsInfos2.push('Euro Star','818','2','EUROSTAR100x100GRIS.png','EUROSTAR100x100.png','0');
channelsInfos2.push('Euro D','819','2','eurod100x100gri.png','eurod100x100.png','0');
channelsInfos2.push('BEIN MOVIES','821','1','beinmovies-100x100-gris.png','beinmovies-100x100-couleur.png','0');
channelsInfos2.push('SHOW MAX','822','1','showmax-100x100-nb.png','showmax-100x100-couleur.png','0');
channelsInfos2.push('ATV Avrupa','824','2','ATVAVRUPA100x100gri.png','ATVAVRUPA100x100.png','0');
channelsInfos2.push('KANAL 7 AVRUPA','825','1','avrupa-100x100-gris.png','avrupa-100x100-couleur.png','0');
channelsInfos2.push('Golfe TV','838','1','Golfe_TV_grayscale.png','Golfe_TV_color.png','0');
channelsInfos2.push('ORTB','839','1','ORTB_grayscale.png','ORTB_color.png','0');
channelsInfos2.push('RTB','840','1','RTB_grayscale.png','RTB_color.png','0');
channelsInfos2.push('CRTV','841','1','CRTV_grayscale.png','CRTV_color.png','0');
channelsInfos2.push('STV2','844','1','STV2_grayscale.png','STV2_color.png','0');
channelsInfos2.push('ORTC','845','1','ORTC_grayscale.png','ORTC_color.png','0');
channelsInfos2.push('TV Congo','846','1','TV_Congo_grayscale.png','TV_Congo_color.png','0');
channelsInfos2.push('RTNC','848','1','RTNC_grayscale.png','RTNC_color.png','0');
channelsInfos2.push('Antenne A','849','1','Antenne_A_grayscale.png','Antenne_A_color.png','0');
channelsInfos2.push('RTI 1','851','1','RTI_1_grayscale.png','RTI_1_color.png','0');
channelsInfos2.push('RTG','854','1','RTG_grayscale.png','RTG_color.png','0');
channelsInfos2.push('TVM','855','1','TVM_grayscale.png','TVM_color.png','0');
channelsInfos2.push('ORTM','856','1','ORTM_grayscale.png','ORTM_color.png','0');
channelsInfos2.push('Nollywood TV','858','1','Nollywood_TV_grayscale.png','Nollywood_TV_color.png','0');
channelsInfos2.push('Africâble','859','1','Africable_grayscale.png','Africable_color.png','0');
channelsInfos2.push('Trace Africa','861','1','Trace_Africa_grayscale.png','Trace_Africa_color.png','0');
channelsInfos2.push('Vox Africa','862','1','Vox_Africa_grayscale.png','Vox_Africa_color.png','0');
channelsInfos2.push('2STV','863','1','2STV_grayscale.png','2STV_color.png','0');
channelsInfos2.push('RTS 1','864','1','RTS_1_grayscale.png','RTS_1_color.png','0');
channelsInfos2.push('TFM','866','1','TFM_grayscale.png','TFM_color.png','0');
channelsInfos2.push('Beijing TV','878','1','Beijing_TV_grayscale.png','Beijing_TV_color.png','0');
channelsInfos2.push('CCTV YuLe','879','1','CCTV_YuLe_grayscale.png','CCTV_YuLe_color.png','0');
channelsInfos2.push('CCTV-4','880','1','CCTV_4_grayscale.png','CCTV_4_color.png','0');
channelsInfos2.push('CMC','881','1','CMC_grayscale.png','CMC_color.png','0');
channelsInfos2.push('Hunan TV','882','1','Hunan_Satellite_TV_grayscale.png','Hunan_Satellite_TV_color.png','0');
channelsInfos2.push('JSBC International','883','1','JSBC_International_grayscale.png','JSBC_International_color.png','0');
channelsInfos2.push('Phoenix CNE','884','1','Phoenix_CNE_grayscale.png','Phoenix_CNE_color.png','0');
channelsInfos2.push('Dragon TV','886','1','Dragon_TV_grayscale.png','Dragon_TV_color.png','0');
channelsInfos2.push('Great Wall Elite','887','1','Great_Wall_Elite_grayscale.png','Great_Wall_Elite_color.png','0');
channelsInfos2.push('Zhejiang Star TV','888','1','ZHEJIANG_STAR_TV_grayscale.png','ZHEJIANG_STAR_TV_color.png','0');
channelsInfos2.push('TVS2','916','1','TVS2_grayscale.png','TVS2_color.png','0');
channelsInfos2.push('CGTN-Documentary','918','1','CGTN_Documentary_grayscale.png','CGTN_Documentary_color.png','0');
channelsInfos2.push('CGTN-Français','920','1','CGTN_Francais_grayscale.png','CGTN_Francais_color.png','0');
channelsInfos2.push('NTD','921','1','NTD_grayscale.png','NTD_color.png','0');
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function createRedDivFunc()                                                                                                         // Fonction qui crée le bandeau rouge
{
 if ( window.location.href.includes('https://tv.sfr.fr/channel/') )                                                                 // Si l'url est un live
    {
    var div = document.createElement("div");                                                                                        // Création de l'élément
    div.style.top        = "0";                                                                                                     // Position verticale de l'élément  
    div.style.left       = "0";                                                                                                     // Position horizontale de l'élément
    div.style.width      = "100%";                                                                                                  // Largeur de l'élément
    div.style.height     = "40px";                                                                                                  // Hauteur de l'élément
    div.style.position   = "fixed";                                                                                                 // Type de position de l'élément  
    div.style.background = "red";                                                                                                   // Couleur de fond de l'élément (rouge)
    div.style.color      = "white";                                                                                                 // Couleur de la police du texte (blanc) 
    div.style.fontSize   = "32px";                                                                                                  // Taille de la police du texte 
      
    var html1 = "";      

    html1 =  window.location.href;                                                                                                  // Assignation del'url à la variable html1    
    html1 = html1.replace("https://tv.sfr.fr/channel/", "");                                                                        // Remplacement de "https://tv.sfr.fr/channel/" par rien afin d'obtenir un nombre
    html1 = html1.replace(";play=true", "");                                                                                        // Remplacement 
                    
    for ( var i=0; i<channelsInfos2.length/dataStep; i++ )                                                                          // Boucle qui parcourt le tableau channelsInfos2
        if ( channelsInfos2[dataStep*i+1] == html1 )                                                                                // Si l'occurence (pas de 3) du tableau est égale au fameux nombre qui finit l'url 
           { 
           html1 = channelsInfos2[dataStep*i];                                                                                      // html1 vaut le nom de la chaine tv
           break;                                                                                                                   // Stopper la boucle 
           }     
             
    if ( document.getElementsByClassName("program-heading__title program-heading--large").length > 0 )                              // Si le titre du programme existe
       {
       html1 += " - ";
       html1 += document.getElementsByClassName("program-heading__title program-heading--large")[0].textContent;                    // Recherche du titre du programme diffusé  
       }  
    if ( document.getElementsByClassName("program-heading__category").length > 0 )                                                  // Si la catégorie du programme existe
       {
       html1 += " - "; 
       html1 += document.getElementsByClassName("program-heading__category")[0].textContent;                                        // Recherche de la catégorie du programme diffusé  
       } 
    //html1 += " - ";                  
    //html1 += document.getElementsByTagName("gen8-fip-description")[0].textContent;                                                // Recherche de la description du programme diffusé 
  
    div.innerHTML        =  html1;                                                                                                  // Texte de l'élément    
    div.style.textAlign  = "center";                                                                                                // Position du texte de l'élément     
    div.style.zIndex     = zindex1;                                                                                                 // Mettre au premier plan l'élément
    div.setAttribute('id', 'divScript');                                                                                            // Définir un id pour retrouver l'élément  
    document.body.appendChild(div);                                                                                                 // Ajouter l'élément 
   
    setTimeout( () => { document.getElementById("divScript").remove(); },1000);                                                     // Supression de l'élément ayant l'id 'divscript' (le bandeau rouge) au bout de 1s   
    } 
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function mykeyupFunc(event)                                                                                                         // Fonction éxécutée lorsqu'une touche est relachée
{
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Modifier les chaines du tableau vignettes
if ( event.key === "v" )                                                                                                            // Si la touche relachée est "f"   
if ( window.location.href.includes('https://tv.sfr.fr/channel/') || window.location.href.includes('https://tv.sfr.fr/content/') )   // Si l'url est un live ou un replay 
   {
   if ( channelTabAddedConfig == false )                                                                                            // Si le tableau des chaines n'est pas affiché
      {        
      var htmlCodeChannelTabConfig  = '<table style="background-color:rgba(255,255,255,0.7);" cellspacing=10 cellpadding=10>';      // Variable qui contiendra le code html du tableau
          htmlCodeChannelTabConfig += '<tr><td style="opacity:1;" colspan="'+nbColumnChannelTabConfig+'">';        //  
          if ( 'myChannelConfigStored' in localStorage ) htmlCodeChannelTabConfig += "myChannelConfigStored : " + localStorage.getItem("myChannelConfigStored"); 
          htmlCodeChannelTabConfig += "<tr>";
        
      if ( 'nbColumnChannelTabConfig' in localStorage ) nbColumnChannelTabConfig = localStorage.getItem('nbColumnChannelTabConfig');// Si la variable est stockée , remplacer celle par défaut
      if ( 'imgChannelWidthConfig' in localStorage ) imgChannelWidthConfig = localStorage.getItem('imgChannelWidthConfig');         // Si la variable est stockée , remplacer celle par défaut
        
      let nbAddedColumnsConfig = 0;  
      let addStuff = "";
      for ( var u=0; u<channelsInfos2.length/dataStep; u++ )                                                                        // Boucle    
          { 
          addStuff = ' id="ChannelTabConfigTd'+ u + '"';  
            
          if ( channelsInfos2[dataStep*u+5] == 1 )                                                                    
             {                 
             //addStuff += ' style="background-color:rgba(0,0,255,0.5);" '; 
             //addStuff += ' style="background-color:#0000FF80;" '; 
             addStuff += ' style="background-color:blue;opacity:0.8;" '; 
             }   
          else 
             { 
             addStuff += ' style="background-color:white;opacity:0.8;" ';   
             }
               
         var folder = "";                                                                                                           // Variable pour le dossier de l'image     
               
         if ( channelsInfos2[dataStep*u+2]  == "1" ) folder = "logos/tv_services/";                                                 // Deux dossiers possibles pour les images
         else  folder = "img/apps/chaines/logos/";    
                              
         var nameChannel = channelsInfos2[dataStep*u+0];                                                                            // Variable pour le titre de l'image                 
               
         htmlCodeChannelTabConfig += '<td'+ addStuff + ' ';                                                                         // Ajout d'une cellule
           
         htmlCodeChannelTabConfig += 'onclick="';                                                                                   // Fonction click de la cellule
         //htmlCodeChannelTabConfig += 'this.style.backgroundColor = this.style.backgroundColor==\'#0000FF80\'? \'#FFFFFF80\':\'#0000FF80\';';         
         htmlCodeChannelTabConfig += 'this.style.backgroundColor = this.style.backgroundColor==\'white\'? \'blue\':\'white\'; ';    // Changer de couleur au clic
         htmlCodeChannelTabConfig +=  '">';           
         htmlCodeChannelTabConfig += '<img style="opacity:1;background-color:white;" width="' + imgChannelWidthConfig ;             // Image de la chaine 
         htmlCodeChannelTabConfig += 'px" src="http://static-cdn.tv.sfr.net/data/';                                                 // Image de la chaine     
         htmlCodeChannelTabConfig +=  folder + channelsInfos2[dataStep*u+4] + '" title="' + nameChannel + '">';                     // Image de la chaine 
         htmlCodeChannelTabConfig += '<div ';                                                                                       // Ajout d'un bloc "div"
         htmlCodeChannelTabConfig += 'style="margin-top:1em;text-align:center;background-color:#000000;color:#FFFFFF;opacity:1; ">';// Ajout d'un style
         htmlCodeChannelTabConfig +=  channelsInfos2[dataStep*u+1] +'</div>';                                                       // Ajout du numéro du "canal"      
             
         nbAddedColumnsConfig++;                                                                                                    // Incrémentation
         if ( nbAddedColumnsConfig % nbColumnChannelTabConfig == 0 )                                                                // Si le modulo vaut 0 (reste de la division)
            htmlCodeChannelTabConfig += "<tr>";                                                                                     // Création d'une nouvelle rangée  
            
          }
      htmlCodeChannelTabConfig += "</table>";                                                                                       // Fermeture balise "tableau"
  
      var div = document.createElement("div");                                                                                      // Création de l'élément
      div.style.top            = "10vh";                                                                                            // Position verticale de l'élément  
      div.style.width          = "100%";                                                                                            // Largeur de l'élément
      div.style.maxHeight      = "80vh";                                                                                            // Hauteur maximale de l'élément
      div.style.overflowY      = "auto";                                                                                            // Pour scroll
      div.style.position       = "fixed";                                                                                           // Type de position de l'élément  
      div.style.color          = "white";                                                                                           // Couleur de la police du texte (blanc) 
      div.style.fontSize       = "16px";                                                                                            // Taille de la police du texte 
      div.style.zIndex         = zindex2;                                                                                           // Mettre au premier plan l'élément    
      div.style.display        = "flex";                                                                                            // L'élément est flexible
      div.style.justifyContent = "center";                                                                                          // Style du contenu
      div.setAttribute('id', 'ChannelTabConfig');                                                                                   // Définir un id pour retrouver l'élément      
      div.innerHTML            =  htmlCodeChannelTabConfig;                                                                         // Texte de l'élément   
      
      var fullScreenElement = document.fullscreenElement;                                                                           // Quel élément est en plein écran
        
      if ( fullScreenElement != null)                                                                                               // Si un élément est en plein écran
         fullScreenElement.insertBefore(div,fullScreenElement.firstChild);                                                          // Insérer le tableau avant le premier enfant
      else                                                                                                                          // Pas d'élément en plein écran
         document.body.appendChild(div);                                                                                            // Ajouter l'élément 
      
      channelTabAddedConfig = true;                                                                                                 // Variable indiquant que le tableau des chaines est affiché        
      } 
     
   else                                                                                                                             // Sinon le tableau des chaines est affiché
                                                                                                                                    // A la fermeture , sauvegarde de la config
      { 
      var myChannelConfig ='';                                                                                                      // Definition d'une variable utilisée comme une valeur binaire
      var myChannelConfigTemp ='';                                                                                                  // Definition d'une variable 
      var myChannelConfig2 = '';                                                                                                    // Definition d'une variable
      
      for ( var u=1; u<=channelsInfos2.length/dataStep; u++ )                                                                       // Boucle    
          { 
          
          if ( document.getElementById("ChannelTabConfigTd"+(u-1)).style.backgroundColor == "white" )                               // Si l'arrière plan est blanc                              
             { 
             channelsInfos2[dataStep*(u-1)+5] = '0';                                                                                // Changement de valeur 
             myChannelConfig += ''+0;                                                                                               // Ajout d'un 0
             } 
          else
             { 
             channelsInfos2[dataStep*(u-1)+5] = '1';                                                                                // Changement de valeur 
             myChannelConfig += ''+1;                                                                                               // Ajout d'un 1  
             } 
            
          if ( (u) % 4 == 0  )                                                                                                      // Si le modulo vaut 0 , une suite de 4 '0' ou '1' est obtenue
             {                          
             myChannelConfigTemp += ''+channelsInfos2[dataStep*(u-1)+5];                                                            // Changement de la variable
             myChannelConfig2 += ''+parseInt(myChannelConfigTemp,2).toString(16);                                                   // La suite de 4 '0' ou '1' est transformé en valeur héxadécimale  
             //console.log(u);  
             //console.log(myChannelConfigTemp);
             myChannelConfigTemp = '';                                                                                              // Réinitialisation de la variable 
             } 
          else
             {
             //console.log(myChannelConfigTemp);
             myChannelConfigTemp += ''+channelsInfos2[dataStep*(u-1)+5];                                                            // Concaténation
             }
          }  
       
      if ( myChannelConfigTemp != '' ) localStorage.setItem("myChannelConfigStored",myChannelConfig2+'_'+myChannelConfigTemp);      // Config sauvegardée localement    
      else  localStorage.setItem("myChannelConfigStored",myChannelConfig2);

      document.getElementById("ChannelTabConfig").remove();                                                                         // Suppression du tableau des chaines
      channelTabAddedConfig = false;                                                                                                // Variable indiquant que le tableau des chaines n'est pas affiché
      }     
   } 
  
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Fonction vignettes des chaines
if ( window.location.href.includes('https://tv.sfr.fr/channel/') || window.location.href.includes('https://tv.sfr.fr/content/') )   // Si l'url est un live ou un replay
if ( event.code === "NumpadEnter" || event.code === "ControlLeft")                                                                  // Si la touche relachée est "entrée" du pavé numérique ou contrôle gauche
   {  
   if ( channelTabAdded == false )                                                                                                  // Si le tableau des chaines n'est pas affiché
      {        
      var htmlCodeChannelTab = '<table style="background-color:rgba(255, 255, 255, 0.7);" cellspacing=10 cellpadding=10>';          // Variable qui contiendra le code html du tableau
        
      if ( 'nbColumnChannelTab' in localStorage ) nbColumnChannelTab = localStorage.getItem('nbColumnChannelTab');                  // Si la variable est stockée , remplacer celle par défaut
      if ( 'imgChannelWidth' in localStorage ) imgChannelWidth = localStorage.getItem('imgChannelWidth');                           // Si la variable est stockée , remplacer celle par défaut
        
      let nbAddedColumns = 0;             
      for ( var u=0; u<channelsInfos2.length/dataStep; u++ )                                                                        // Boucle    
          if ( channelsInfos2[dataStep*u+5] == 1 )                                                                    
             {                                                                                                 
             var folder = "";                                                                                                       // Variable pour le dossier de l'image     
               
             if ( channelsInfos2[dataStep*u+2]  == "1" ) folder = "logos/tv_services/";                                             // Deux dossiers possibles pour les images
             else  folder = "img/apps/chaines/logos/";    
                              
             var nameChannel = channelsInfos2[dataStep*u+0];                                                                        // Variable pour le titre de l'image                 
               
             htmlCodeChannelTab += '<div>';
             htmlCodeChannelTab += '<td><a href="https://tv.sfr.fr/channel/' +  channelsInfos2[dataStep*u+1] + '">';                // Lien pointant vers l'url de la chaine
             htmlCodeChannelTab += '<img width="' + imgChannelWidth + 'px" src="http://static-cdn.tv.sfr.net/data/';                // Image de la chaine     
             htmlCodeChannelTab +=  folder + channelsInfos2[dataStep*u+4] + '" title="' + nameChannel + '">';                       // Image de la chaine 
             htmlCodeChannelTab += '</a>';                                                                                          // Fermeture balise "lien"
             htmlCodeChannelTab += '</div><div style="margin-top:1em;text-align:center;background-color:#000000;color:#FFFFFF; ">'; // Ajout d'un bloc "div"
             htmlCodeChannelTab +=  channelsInfos2[dataStep*u+1] +'</div>';                                                         // Ajout du numéro du "canal"      
             
             nbAddedColumns++;
             if ( nbAddedColumns % nbColumnChannelTab == 0 )                                                                        // Si le modulo vaut 0 
                htmlCodeChannelTab += "<tr>";                                                                                       // Création d'une nouvelle rangée  
             } 
     
      htmlCodeChannelTab += "</table>";                                                                                             // Fermeture balise "tableau"
  
      var div = document.createElement("div");                                                                                      // Création de l'élément
      div.style.top            = "10vh";                                                                                            // Position verticale de l'élément  
      div.style.width          = "100%";                                                                                            // Largeur de l'élément
      div.style.maxHeight      = "80vh";                                                                                            // Hauteur maximale de l'élément
      div.style.overflowY      = "auto";                                                                                            // Pour scroll
      div.style.position       = "fixed";                                                                                           // Type de position de l'élément  
      div.style.color          = "white";                                                                                           // Couleur de la police du texte (blanc) 
      div.style.fontSize       = "16px";                                                                                            // Taille de la police du texte 
      div.style.zIndex         = zindex2;                                                                                           // Mettre au premier plan l'élément    
      div.style.display        = "flex";                                                                                            // L'élément est flexible
      div.style.justifyContent = "center";                                                                                          // Style du contenu
      div.setAttribute('id', 'ChannelTab');                                                                                         // Définir un id pour retrouver l'élément      
      div.innerHTML            =  htmlCodeChannelTab;                                                                               // Texte de l'élément   
      
      var fullScreenElement = document.fullscreenElement;                                                                           // Quel élément est en plein écran
        
      if ( fullScreenElement != null)                                                                                               // Si un élément est en plein écran
         fullScreenElement.insertBefore(div,fullScreenElement.firstChild);                                                          // Insérer le tableau avant le premier enfant
      else                                                                                                                          // Pas d'élément en plein écran
         document.body.appendChild(div);                                                                                            // Ajouter l'élément 
      
      channelTabAdded = true;                                                                                                       // Variable indiquant que le tableau des chaines est affiché        
      } 
   else                                                                                                                             // Sinon le tableau des chaines est affiché
      { 
      document.getElementById("ChannelTab").remove();                                                                               // Suppression du tableau des chaines
      channelTabAdded = false;                                                                                                      // Variable indiquant que le tableau des chaines n'est pas affiché
      }     
   } 

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Pour afficher la chaine suivante
if ( window.location.href.includes('https://tv.sfr.fr/channel/'))                                                                   // Si l'url est un live
if ( event.code === "NumpadAdd" || event.code === "ArrowRight")                                                                     // Si la touche relachée est "plus" du pavé numérique ou la flèche droite
   {
   let needIndex = 0; 
   var currentChannelNumber = window.location.href.replace('https://tv.sfr.fr/channel/','').replace(";play=true", "");              // Obtenir le nombre à la fin de l'url
   for ( var i=0; i<channelsInfos2.length/dataStep; i++ )                                                                           // Parcourir le tableau        
       if ( channelsInfos2[dataStep*i+1] == currentChannelNumber )                                                                  // Si la chaine est trouvée
           { 
           let channelfound = false;
           for ( var j=i+1; j<channelsInfos2.length/dataStep; j++ )    
               {
               if ( channelsInfos2[dataStep*j+5] == '1' ) 
                  { 
                  if ( (j+1) < channelsInfos2.length/dataStep )                                                                     // Si on ne dépasse la fin du tableau             
                     { 
                     window.location.href = 'https://tv.sfr.fr/channel/'+channelsInfos2[dataStep*j+1] ;                             // Chargement de la prochaine chaine      
                     channelfound = true;
                     } 
                  break;
                  }           
              }  
             
           if ( channelfound == false )
              {
              window.location.href = 'https://tv.sfr.fr/channel/'+channelsInfos2[0+1] ;                                             // Fin du tableau atteinte , chargement de la première chaine    
              break;
              } 
             
           break;  
           }
 }     

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Chaine précédente 
if ( window.location.href.includes('https://tv.sfr.fr/channel/'))                                                                   // Si l'url est un live
if ( event.code === "NumpadSubtract" || event.code === "ArrowLeft")                                                                 // Si la touche relachée est "moins" du pavé numérique ou la flèche gauche
   {
   let needIndex = 0; 
   var currentChannelNumber = window.location.href.replace('https://tv.sfr.fr/channel/','').replace(";play=true", "");              // Obtenir le nombre à la fin de l'url
   for ( var i=0; i<channelsInfos2.length/dataStep; i++ )                                                                           // Parcourir le tableau        
       if ( channelsInfos2[dataStep*i+1] == currentChannelNumber )                                                                  // Si la chaine est trouvée
           { 
           let channelfound = false;
           for ( var j=i-1; j>=0; j-- )    
               {
               if ( channelsInfos2[dataStep*j+5] == '1' ) 
                  { 
                  if ( (j) >= 0 )                                                                                                   // Si l'index n'est pas négatif              
                     { 
                     window.location.href = 'https://tv.sfr.fr/channel/'+channelsInfos2[dataStep*(j)+1] ;                           // Chargement de la chaine précédente    
                     channelfound = true;
                     } 
                  break;
                  }           
               }  
             
           if ( channelfound == false )        
              for ( var j=channelsInfos2.length/dataStep; j>=0; j-- )                
                  if ( channelsInfos2[dataStep*j+5] == '1' ) 
                     {
                     window.location.href = 'https://tv.sfr.fr/channel/'+channelsInfos2[dataStep*(j)+1];                            // Début du tableau atteint , chargement de la dernière chaine     
                     break;
                     }
           break;  
           }
   }   
  
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Fonction changement de chaines
if ( window.location.href.includes('https://tv.sfr.fr/channel/')                                                                    // Si l'url est un live ou un replay
     || window.location.href.includes('https://tv.sfr.fr/content/')                                                                 // Si l'url est un un replay
     || window.location.href.includes('https://www.sfr.fr/cas/login')                                                               // Si l'url est la page de connexion
   ) 
if ( event.code === "Numpad0" || event.code === "Numpad1" || event.code === "Numpad2" || event.code === "Numpad3"                   // Si la touche relachée est une touche du pavé numérique (0-9)  
                              || event.code === "Numpad4" || event.code === "Numpad5" || event.code === "Numpad6"   
                              || event.code === "Numpad7" || event.code === "Numpad8" || event.code === "Numpad9" 
   ||
   event.code === "Digit0"    || event.code === "Digit1" || event.code === "Digit2" || event.code === "Digit3"                      // Si la touche relachée est un chiffre (0-9)  
                              || event.code === "Digit4" || event.code === "Digit5" || event.code === "Digit6"   
                              || event.code === "Digit7" || event.code === "Digit8" || event.code === "Digit9" 
   
   
   
   )  
   {
   var divInputKeys =  document.getElementById('DivInputKeys');                                                                     // Variable pour le div avec l'id "DivInputKeys"
   
   if ( typeof(divInputKeys) == 'undefined' || divInputKeys == null )                                                               // Chercher si le div avec l'id "DivInputKeys" existe
      {
      var div = document.createElement("div");                                                                                      // Création de l'élément
      div.style.top            = "1em";                                                                                             // Position verticale de l'élément  
      div.style.left           = "1em";                                                                                             // Position horizontale de l'élément
      div.style.background     = "rgba(0, 0, 0, 0.9)";                                                                              // Opacité de l'élément
      div.style.position       = "fixed";                                                                                           // Type de position de l'élément  
      div.style.color          = "white";                                                                                           // Couleur de la police du texte (blanc) 
      div.style.fontSize       = "1.5em";                                                                                           // Taille de la police du texte 
      div.style.textAlign      = "center";                                                                                          // Position du texte de l'élément     
      div.style.zIndex         = zindex3;                                                                                           // Mettre au premier plan l'élément
      div.style.border         = "0.1em solid white";                                                                               // Encadrer
      div.style.padding        = "0.3em";                                                                                           // Marge intérieure
      div.innerHTML            =  event.code.replace('Numpad','').replace('Digit','');                                              // Texte de l'élément  
      div.setAttribute('id', 'DivInputKeys');                                                                                       // Définir un id pour retrouver l'élément     

      var fullScreenElement = document.fullscreenElement;                                                                           // Quel élément est en plein écran
      if ( fullScreenElement != null)                                                                                               // Si un élément est en plein écran
         fullScreenElement.insertBefore(div,fullScreenElement.firstChild);                                                          // Insérer le tableau avant le premier enfant
      else                                                                                                                          // Pas d'élément en plein écran
         document.body.appendChild(div);                                                                                            // Ajouter l'élément              
        
      inputKeys = event.code.replace('Numpad','').replace('Digit','');                                                              // Supression de Numpad ou  Digit
      }      
   else                                                                                                                             // Sinon le div existe et une nouvelle touche est relachée
      {
      divInputKeys.innerHTML += event.code.replace('Numpad','').replace('Digit','');                                                // Texte de l'élément   
      inputKeys += event.code.replace('Numpad','').replace('Digit','');                                                             // Supression de Numpad
      }   
   
   setTimeout(function () {                                                                                                         // Fonction qui attend avant de changer la chaine     
                          var channelfound = false;                                                                                 // Variable définition     

                          if ( !window.location.href.includes('https://www.sfr.fr/cas/login'))                                      // Si ce n'est pas la page de connexion  
                             {
                             for ( var c=0; c<channelsInfos2.length/dataStep; c++ )                                                 // Boucle                                                                                                                   
                                 if ( inputKeys == channelsInfos2[dataStep*c+1] )                                                   // Correspondance entrée utilisateur et canal
                                    {
                                    window.location.href = 'https://tv.sfr.fr/channel/' + inputKeys;                                // Chargement de la chaine
                                    channelfound = true;                                                                            // La chaine a été trouvée
                                    break;                                                                                          // Casser la boucle
                                    }  
                                                                
                             if ( channelfound == false )                                                                           // Si la chaine n'a pas été trouvée
                                {        
                                divInputKeys.innerHTML= "Pas de chaine";                                                            // Indicateur visuel
                                setTimeout(function () { document.getElementById('DivInputKeys').remove(); } ,inputKeysDelay) ;     // Effacer l'Indicateur visuel
                                }   
                             }          
                                                             
                          if ( window.location.href.includes('https://www.sfr.fr/cas/login?service=https'))                         // Si c'est la page de connexion (redirection depuis une chaine tv)  
                             {
                             if ( inputKeys == "0000" )                                                                             // L'utilisateur a saisi 0000
                                {
                                 localStorage.removeItem("myUserName");                                                             // Effacer le nom ou l'email enregistré
                                 localStorage.removeItem("myPassword");                                                             // Effacer le mot de passe enregistré
                                 divInputKeys.innerHTML= "LocalStorage effacé";                                                     // Indicateur visuel
                                 setTimeout(function () { document.getElementById('DivInputKeys').remove(); } ,inputKeysDelay) ;    // Effacer l'Indicateur visuel
                                }       
                          
                             if ( inputKeys == "0001" && prompted == false )                                                        // L'utilisateur a saisi 0001
                                {
                                prompted = true;                                                                                    // Variable sur vrai
                                var getInputUsername = prompt("Enter your username or your email:");                                // Afficher une invite de saisie pour le nom ou l'email
                                localStorage.setItem("myUserName",getInputUsername);                                                // Enregistrer 
                                var getInputPassword = prompt("Enter your password :");                                             // Afficher une invite de saisie pour le mot de passe
                                localStorage.setItem("myPassword",getInputPassword);                                                // Enregistrer
                                //prompted = false;                                                                                 // Variable sur faux
                                }    
  
                             if ( inputKeys == "0002" )                                                                             // L'utilisateur a saisi 0002
                                {
                                 var textFromLocalStorage = "";                                                                     // Variable définition
                                 textFromLocalStorage += localStorage.getItem("myUserName");                                        // Variable , ajouter le nom ou l'email
                                 textFromLocalStorage += '  / ';                                                                    // Variable 
                                 textFromLocalStorage += localStorage.getItem("myPassword");                                        // Variable , ajouter le mot de passe
                                 divInputKeys.innerHTML= textFromLocalStorage;                                                      // Afficher les infos utilisateur
                                 //inputKeys = "";
                                 setTimeout(function () { document.getElementById('DivInputKeys').remove(); } ,inputKeysDelay) ;    // Effacer l'Indicateur visuel
                                }      
                             } 
     
                          } ,inputKeysDelay) ;                              
   }   
  
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  Fonction plein écran ou fenêtre
if ( window.location.href.includes('https://tv.sfr.fr/channel/') || window.location.href.includes('https://tv.sfr.fr/content/') )   // Si l'url est un live ou un replay
if ( event.code === "NumpadDecimal" || event.code === "ShiftLeft")                                                                  // Si la touche relachée est "." du pavé numérique ou maj gauche
   {   
   var fullScreenElement = document.fullscreenElement;                                                                              // Quel élément est en plein écran
   if ( fullScreenElement == null)                                                                                                  // Si aucun élément est en plein écran
      { 
      //var testElement = document.getElementsByClassName("shaka-container shaka-video-container")[0];                                // Trouver le conteneur vidéo
      //var testElement = document.getElementById("shaka-player-video");    
      var testElement = document.getElementsByClassName("player-container")[0];  
        
      if ( typeof(testElement) != 'undefined' || testElement != null )  
         testElement.requestFullscreen();                                                                                           // Passer en plein écran le conteneur vidéo                   
      }
   else 
      document.exitFullscreen();                                                                                                    // Sinon sortir du plein écran      
   }  
  
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  Fonction pour diminuer le son
if ( window.location.href.includes('https://tv.sfr.fr/channel/') || window.location.href.includes('https://tv.sfr.fr/content/') )   // Si l'url est un live ou un replay
if ( event.code === "ArrowDown" )                                                                                                   // Si la touche relachée est "bas" 
   {  
   if ( 'volumeStep' in localStorage )   volumeStep = localStorage.getItem('volumeStep');                                           // Si volumeStep existe dans localStorage , assignation d'une valeur    
     
   var elementShakaPlayerVideo = document.getElementById("shaka-player-video");                                                     // Trouver l'élément vidéo
   var videoVolume = elementShakaPlayerVideo.volume;                                                                                // Trouver le volume de l'élément vidéo (0-1)
     
   if ( videoVolume - volumeStep/100 > 0 )                                                                                          // Si le nouveau volume est supérieur à zéro
      {
      elementShakaPlayerVideo.volume = (videoVolume-volumeStep/100).toFixed(2);                                                     // Diminuer le volume
      }
   else  
      elementShakaPlayerVideo.volume = 0;                                                                                           // Sinon mettre le volume à zéro       
     
   var divVolume =  document.getElementById('DivVolume');                                                                           // Variable pour le div avec l'id "DivVolume"
   
   if ( typeof(divVolume) == 'undefined' || divVolume == null )                                                                     // Chercher si le div avec l'id "DivVolume" existe
      {
      var div = document.createElement("div");                                                                                      // Création de l'élément
      div.style.top            = "3.3em";                                                                                           // Position verticale de l'élément  
      div.style.left           = "1em";                                                                                             // Position horizontale de l'élément
      div.style.background     = "rgba(0, 0, 0, 0.9)";                                                                              // Opacité de l'élément
      div.style.position       = "fixed";                                                                                           // Type de position de l'élément  
      div.style.color          = "white";                                                                                           // Couleur de la police du texte (blanc) 
      div.style.fontSize       = "1.5em";                                                                                           // Taille de la police du texte 
      div.style.textAlign      = "center";                                                                                          // Position du texte de l'élément     
      div.style.zIndex         = zindex3;                                                                                           // Mettre au premier plan l'élément
      div.style.border         = "0.1em solid white";                                                                               // Encadrer
      div.style.padding        = "0.3em";                                                                                           // Marge intérieure
      div.innerHTML            = "Vol: " + Math.trunc(100*elementShakaPlayerVideo.volume) + "%";                                    // Texte de l'élément  
      div.setAttribute('id', 'DivVolume');                                                                                          // Définir un id pour retrouver l'élément     

      var fullScreenElement = document.fullscreenElement;                                                                           // Quel élément est en plein écran
        
      if ( fullScreenElement != null)                                                                                               // Si un élément est en plein écran
         fullScreenElement.insertBefore(div,fullScreenElement.firstChild);                                                          // Insérer le tableau avant le premier enfant              
      else                                                                                                                          // Pas d'élément en plein écran
         document.body.appendChild(div);                                                                                            // Ajouter l'élément              
      
      if ( 'volumeDelay' in localStorage )   volumeDelay = localStorage.getItem('volumeDelay');  
      setTimeout(function () { document.getElementById('DivVolume').remove(); } ,volumeDelay);                                      // Fonction qui attend avant d'effacer l'indicateur de volume   
      }      
   else                                                                                                                             // Sinon le div existe 
      divVolume.innerHTML = "Vol: " + Math.trunc(100*elementShakaPlayerVideo.volume) + "%";                                         // Texte de l'élément               
   }   
  
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  Fonction pour augmenter le son
if ( window.location.href.includes('https://tv.sfr.fr/channel/') || window.location.href.includes('https://tv.sfr.fr/content/') )   // Si l'url est un live ou un replay
if ( event.code === "ArrowUp" )                                                                                                     // Si la touche relachée est "haut" 
   {        
   if ( 'volumeStep' in localStorage )   volumeStep = localStorage.getItem('volumeStep');                                           // Si volumeStep existe dans localStorage , assignation d'une valeur                                                                                            
     
   var elementShakaPlayerVideo = document.getElementById("shaka-player-video");                                                     // Trouver l'élément vidéo
   var videoVolume = elementShakaPlayerVideo.volume;                                                                                // Trouver le volume de l'élément vidéo (0-1)
     
   if ( videoVolume + volumeStep/100 > 1 )                                                                                          // Si le nouveau volume est supérieur à un
      elementShakaPlayerVideo.volume = 1;                                                                                           // Mettre le volume à 100% 
   else  
      {
      elementShakaPlayerVideo.volume = (videoVolume+volumeStep/100).toFixed(2);                                                     // Augmenter le volume     
      }     
        
     
   var divVolume =  document.getElementById('DivVolume');                                                                           // Variable pour le div avec l'id "DivVolume"
   
   if ( typeof(divVolume) == 'undefined' || divVolume == null )                                                                     // Chercher si le div avec l'id "DivVolume" existe
      {
      var div = document.createElement("div");                                                                                      // Création de l'élément
      div.style.top            = "3.3em";                                                                                           // Position verticale de l'élément  
      div.style.left           = "1em";                                                                                             // Position horizontale de l'élément
      div.style.background     = "rgba(0, 0, 0, 0.9)";                                                                              // Opacité de l'élément
      div.style.position       = "fixed";                                                                                           // Type de position de l'élément  
      div.style.color          = "white";                                                                                           // Couleur de la police du texte (blanc) 
      div.style.fontSize       = "1.5em";                                                                                           // Taille de la police du texte 
      div.style.textAlign      = "center";                                                                                          // Position du texte de l'élément     
      div.style.zIndex         = zindex3;                                                                                           // Mettre au premier plan l'élément
      div.style.border         = "0.1em solid white";                                                                               // Encadrer
      div.style.padding        = "0.3em";                                                                                           // Marge intérieure
      div.innerHTML            = "Vol: " + Math.trunc(100*elementShakaPlayerVideo.volume) + "%";                                    // Texte de l'élément  
      div.setAttribute('id', 'DivVolume');                                                                                          // Définir un id pour retrouver l'élément     

      var fullScreenElement = document.fullscreenElement;                                                                           // Quel élément est en plein écran
        
      if ( fullScreenElement != null)                                                                                               // Si un élément est en plein écran
         fullScreenElement.insertBefore(div,fullScreenElement.firstChild);                                                          // Insérer le tableau avant le premier enfant
      else                                                                                                                          // Pas d'élément en plein écran
         document.body.appendChild(div);                                                                                            // Ajouter l'élément              
      
      if ( 'volumeDelay' in localStorage ) volumeDelay = localStorage.getItem('volumeDelay');  
      setTimeout(function () { document.getElementById('DivVolume').remove(); } ,volumeDelay);                                      // Fonction qui attend avant d'effacer l'indicateur de volume   
      }      
   else                                                                                                                             // Sinon le div existe 
      divVolume.innerHTML = "Vol: " + Math.trunc(100*elementShakaPlayerVideo.volume) + "%";                                         // Texte de l'élément                
   }  

/////////////////////////////////////////////////////////////////////////////////
/*
if ( event.key === "k" )                                                                                                            // Si la touche relachée est "k" pour simuler un log
if ( window.location.href.includes('https://tv.sfr.fr/channel/') || window.location.href.includes('https://tv.sfr.fr/content/') )   // Si l'url est un live ou un replay ,     
   { 
   //myLog("test");                                                                                                                 // Simuler un log    
   myLog("1");myLog("2");myLog("3");myLog("4");myLog("5");myLog("6");myLog("7");myLog("8");myLog("9");myLog("10");                  // Simuler des logs  
   } 
  
if ( event.key === "j" )                                                                                                            // Si la touche relachée est "j" pour recup les erreurs dans la console
if ( window.location.href.includes('https://tv.sfr.fr/channel/') || window.location.href.includes('https://tv.sfr.fr/content/') )   // Si l'url est un live ou un replay ,     
   for (i = 0; i < localStorage.length; i++)                                                                                        // Parcourir les variables stockées 
       if ( localStorage.key(i).includes('ErrorLogged'))                                                                            // En particulier celle ayant pour nom ErrorLogged
          console.log(localStorage.key(i) + "=[" + localStorage.getItem(localStorage.key(i)) + "]");                                // Message console
*/    
  
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Config
if ( event.key === "c" )                                                                                                            // Si la touche relachée est "C" 
if ( window.location.href.includes('https://tv.sfr.fr/channel/') || window.location.href.includes('https://tv.sfr.fr/content/') )   // Si l'url est un live ou un replay ,     
   { 
   if ( configDivAdded == false )                                                                                                   // Si div config n'est pas affiché
      {        
      var htmlCodeConfigDiv = '<table  cellspacing=10 cellpadding=10 style="background-color:rgba(0, 0, 0, 0.7);">';                // Variable contenant le code html du tableau config 
      
      if ( 'volumeStart' in localStorage ) volumeStart = localStorage.getItem('volumeStart');                                       // Si la variable est stockée , remplacer celle par défaut
      htmlCodeConfigDiv    +=  '<tr><td><input type="range" style="vertical-align:middle;margin:2px;width:150px;"';                 // Input type range pour définir les valeurs des variables
      htmlCodeConfigDiv    +=  'id="VolumeStart" name="VolumeStart" min="0" max="100" step="5" value="' + volumeStart*100 + '"';    // La même chose en dessous pour les autres variables     
      htmlCodeConfigDiv    +=  'oninput=" this.parentElement.nextElementSibling.nextElementSibling.innerText=this.value;';  
      htmlCodeConfigDiv    +=  '          localStorage.setItem(\'volumeStart\',this.value/100);';  
      htmlCodeConfigDiv    +=  '          volumeStart = this.value*100;">';    
      htmlCodeConfigDiv    += '<td title="Volume de départ">volumeStart';
      htmlCodeConfigDiv    += '<td>' + volumeStart*100;       

      if ( 'volumeStep' in localStorage ) volumeStep = localStorage.getItem('volumeStep');  
      htmlCodeConfigDiv    +=  '<tr><td><input type="range" style="vertical-align:middle;margin:2px;width:150px;"';      
      htmlCodeConfigDiv    +=  'id="VolRange" name="VolRange" min="5" max="25" step="5" value="' + volumeStep + '" ';    
      htmlCodeConfigDiv    +=  'oninput=" this.parentElement.nextElementSibling.nextElementSibling.innerText=this.value;    ';  
      htmlCodeConfigDiv    +=  '          localStorage.setItem(\'volumeStep\',this.value);';  
      htmlCodeConfigDiv    +=  '          volumeStep = this.value;">';  
      htmlCodeConfigDiv    += '<td title="Augmenter ou dimiuer le volume de cette valeur">volumeStep';
      htmlCodeConfigDiv    += '<td>' + volumeStep;   
        
      if ( 'volumeDelay' in localStorage ) volumeDelay = localStorage.getItem('volumeDelay');  
      htmlCodeConfigDiv    +=  '<tr><td><input type="range" style="vertical-align:middle;margin:2px;width:150px;"';      
      htmlCodeConfigDiv    +=  'id="VolumeDelay" name="VolumeDelay" min="1" max="10" step="1" value="' + volumeDelay/1000 + '"';    
      htmlCodeConfigDiv    +=  'oninput=" this.parentElement.nextElementSibling.nextElementSibling.innerText = this.value; ';  
      htmlCodeConfigDiv    +=  '          localStorage.setItem(\'volumeDelay\',this.value*1000);';  
      htmlCodeConfigDiv    +=  '          volumeDelay = this.value*1000;">';  
      htmlCodeConfigDiv    += '<td title="Délai avant effacement de l\'indicateur de volume">volumeDelay';
      htmlCodeConfigDiv    += '<td>' + volumeDelay/1000;               
  
      if ( 'inputKeysDelay' in localStorage ) inputKeysDelay  = localStorage.getItem('inputKeysDelay');  
      htmlCodeConfigDiv    +=  '<tr><td><input type="range" style="vertical-align:middle;margin:2px;width:150px;"';      
      htmlCodeConfigDiv    +=  'id="InputKeysDelay" name="InputKeysDelay" min="1" max="10" step="1" value="' + inputKeysDelay/1000 + '"';    
      htmlCodeConfigDiv    +=  'oninput=" this.parentElement.nextElementSibling.nextElementSibling.innerText = this.value; ';  
      htmlCodeConfigDiv    +=  '          localStorage.setItem(\'inputKeysDelay\',this.value*1000);';   
      htmlCodeConfigDiv    +=  '          inputKeysDelay = this.value*1000;">';  
      htmlCodeConfigDiv    += '<td title="Délai pour saisir le numéro d\'une chaine">inputKeysDelay';
      htmlCodeConfigDiv    += '<td>' + inputKeysDelay/1000;             
        
      if ( 'nbLoggedErrors' in localStorage ) nbLoggedErrors = localStorage.getItem('nbLoggedErrors');  
      htmlCodeConfigDiv    +=  '<tr><td><input type="range" style="vertical-align:middle;margin:2px;width:150px;"';      
      htmlCodeConfigDiv    +=  'id="NbLoggedErrors" name="NbLoggedErrors" min="0" max="150" step="10" value="' + nbLoggedErrors + '"';       
      htmlCodeConfigDiv    +=  'oninput=" this.parentElement.nextElementSibling.nextElementSibling.innerText = this.value; ';          
      htmlCodeConfigDiv    +=  '          localStorage.setItem(\'nbLoggedErrors\',this.value);';
      htmlCodeConfigDiv    +=  '          nbLoggedErrors = this.value;">';  
      htmlCodeConfigDiv    += '<td title="Nombre d\'erreurs conservées">nbLoggedErrors';
      htmlCodeConfigDiv    += '<td>' + nbLoggedErrors;      
      htmlCodeConfigDiv    += '<tr><td colspan=3 id="TDFixLogs" style="text-align:center;">Cliquer ici pour fix les logs si vous réduisez le nombre <br>Les plus récents sont conservés'; 
       
      if ( 'imgChannelWidth' in localStorage ) imgChannelWidth = localStorage.getItem('imgChannelWidth');  
      htmlCodeConfigDiv    +=  '<tr><td><input type="range" style="vertical-align:middle;margin:2px;width:150px;"';      
      htmlCodeConfigDiv    +=  'id="ImgChannelWidth" name="ImgChannelWidth" min="20" max="150" step="5" value="' + imgChannelWidth + '"';       
      htmlCodeConfigDiv    +=  'oninput=" this.parentElement.nextElementSibling.nextElementSibling.innerText = this.value; ';          
      htmlCodeConfigDiv    +=  '          localStorage.setItem(\'imgChannelWidth\',this.value);';
      htmlCodeConfigDiv    +=  '          imgChannelWidth = this.value;">';  
      htmlCodeConfigDiv    += '<td title="Largeur des vignettes">imgChannelWidth';
      htmlCodeConfigDiv    += '<td>' + imgChannelWidth;      
      
      if ( 'nbColumnChannelTab' in localStorage ) nbColumnChannelTab = localStorage.getItem('nbColumnChannelTab');  
      htmlCodeConfigDiv    +=  '<tr><td><input type="range" style="vertical-align:middle;margin:2px;width:150px;"';      
      htmlCodeConfigDiv    +=  'id="NbColumnChannelTab" name="NbColumnChannelTab" min="5" max="20" step="1" value="' + nbColumnChannelTab + '"';       
      htmlCodeConfigDiv    +=  'oninput=" this.parentElement.nextElementSibling.nextElementSibling.innerText = this.value; ';          
      htmlCodeConfigDiv    +=  '          localStorage.setItem(\'nbColumnChannelTab\',this.value);';
      htmlCodeConfigDiv    +=  '          nbColumnChannelTab = this.value;">';  
      htmlCodeConfigDiv    += '<td title="Nombre de colonnes du tableau des vignettes">nbColumnChannelTab';
      htmlCodeConfigDiv    += '<td>' + nbColumnChannelTab;    
        
      if ( 'nbloopBeforeReload' in localStorage ) nbloopBeforeReload = localStorage.getItem('nbloopBeforeReload');  
      htmlCodeConfigDiv    +=  '<tr><td><input type="range" style="vertical-align:middle;margin:2px;width:150px;"';      
      htmlCodeConfigDiv    +=  'id="NbloopBeforeReload" name="NbloopBeforeReload" min="3" max="15" step="1" value="' + nbloopBeforeReload + '"';       
      htmlCodeConfigDiv    +=  'oninput=" this.parentElement.nextElementSibling.nextElementSibling.innerText = this.value; ';          
      htmlCodeConfigDiv    +=  '          localStorage.setItem(\'nbloopBeforeReload\',this.value);';
      htmlCodeConfigDiv    +=  '          nbloopBeforeReload = this.value;">';  
      htmlCodeConfigDiv    += '<td title="Nombre de fois où un lag est détecté avant de recharger la page">nbloopBeforeReload';
      htmlCodeConfigDiv    += '<td>' + nbloopBeforeReload;    
      
      if ( 'nbloopBeforeBegin' in localStorage ) nbloopBeforeBegin = localStorage.getItem('nbloopBeforeBegin');  
      htmlCodeConfigDiv    +=  '<tr><td><input type="range" style="vertical-align:middle;margin:2px;width:150px;"';      
      htmlCodeConfigDiv    +=  'id="NbloopBeforeBegin" name="NbloopBeforeBegin" min="1" max="15" step="1" value="' + nbloopBeforeBegin + '"';       
      htmlCodeConfigDiv    +=  'oninput=" this.parentElement.nextElementSibling.nextElementSibling.innerText = this.value; ';          
      htmlCodeConfigDiv    +=  '          localStorage.setItem(\'nbloopBeforeBegin\',this.value);';
      htmlCodeConfigDiv    +=  '          nbloopBeforeBegin = this.value;">';  
      htmlCodeConfigDiv    += '<td title="Nombre de fois où la fonction de recherche des erreurs s\'éxécute avant de prendre en compte les lags">nbloopBeforeBegin';
      htmlCodeConfigDiv    += '<td>' + nbloopBeforeBegin;      
      
      if ( 'mainLoopDelay' in localStorage ) mainLoopDelay = localStorage.getItem('mainLoopDelay');  
      htmlCodeConfigDiv    +=  '<tr><td><input type="range" style="vertical-align:middle;margin:2px;width:150px;"';      
      htmlCodeConfigDiv    +=  'id="MainLoopDelay" name="MainLoopDelay" min="3" max="15" step="1" value="' + mainLoopDelay/1000 + '"';       
      htmlCodeConfigDiv    +=  'oninput=" this.parentElement.nextElementSibling.nextElementSibling.innerText = this.value; ';          
      htmlCodeConfigDiv    +=  '          localStorage.setItem(\'mainLoopDelay\',this.value*1000);';
      htmlCodeConfigDiv    +=  '          mainLoopDelay = this.value*1000;">';  
      htmlCodeConfigDiv    += '<td title="Délai entre deux éxécution de la fonction de recherche des erreurs , besoin de rafraîchir la page">mainLoopDelay';
      htmlCodeConfigDiv    += '<td>' +  mainLoopDelay/1000;    
        
      htmlCodeConfigDiv    += '<tr><td colspan=3 style="text-align:center;">Si les variables ne sont pas prises en compte <br>Fermer et ouvrir de nouveau l\'interface';  
        
      var div = document.createElement("div");                                                                                      // Création de l'élément
      div.style.top            = "20vh";                                                                                            // Position verticale de l'élément  
      div.style.width          = "100%";                                                                                            // Largeur de l'élément
      div.style.maxHeight      = "70vh";                                                                                            // Hauteur maximale de l'élément
      div.style.overflowY      = "auto";                                                                                            // Pour scroll
      div.style.position       = "fixed";                                                                                           // Type de position de l'élément  
      div.style.color          = "white";                                                                                           // Couleur de la police du texte (blanc) 
      div.style.fontSize       = "16px";                                                                                            // Taille de la police du texte 
      div.style.zIndex         = zindex2;                                                                                           // Mettre au premier plan l'élément    
      div.style.display        = "flex";                                                                                            // L'élément est flexible
      div.style.justifyContent = "center";                                                                                          // Style du contenu
      div.setAttribute('id', 'ConfigDiv');                                                                                          // Définir un id pour retrouver l'élément      
      div.innerHTML            = htmlCodeConfigDiv;                                                                                 // Texte de l'élément   
      
      var fullScreenElement = document.fullscreenElement;                                                                           // Quel élément est en plein écran
        
      if ( fullScreenElement != null )                                                                                              // Si un élément est en plein écran
         fullScreenElement.insertBefore(div,fullScreenElement.firstChild);                                                          // Insérer le div avant le premier enfant
      else                                                                                                                          // Pas d'élément en plein écran
         document.body.appendChild(div);                                                                                            // Ajouter l'élément 
        
     
      document.getElementById("TDFixLogs").onclick =  function() {                                                                  // Ajout d'une fonction qui conserve les logs les plus récents
                                                                 var trueNbLoggedErrors = 0;
        
                                                                 for (i = 0; i < localStorage.length; i++)                          // Parcourir les variables stockées 
                                                                     if ( localStorage.key(i).includes('ErrorLogged'))              // En particulier celle ayant pour nom ErrorLogged
                                                                        trueNbLoggedErrors++;
        
                                                                 if ( nbLoggedErrors < trueNbLoggedErrors)                          // Si il y a plus d'erreurs stockées que la nouvelle valeur définie                                                                           
                                                                    { 
                                                                    for ( l=1 ; l<=nbLoggedErrors ; l++)                            // Remplacement des valeurs les plus anciennes
                                                                        {    
                                                                        let index = l+trueNbLoggedErrors-nbLoggedErrors;
                                                                        localStorage.setItem('ErrorLogged'+l, localStorage.getItem('ErrorLogged'+index ) );    
                                                                        } 
                                                                    for ( l= Number(nbLoggedErrors) + 1; l<=trueNbLoggedErrors ; l++)// Chercher les erreurs en trop et les supprimer    
                                                                        localStorage.removeItem('ErrorLogged'+l);    
                                                                    } 
                                                                 };   
        
      configDivAdded = true;                                                                                                        // Variable indiquant que le div config est affiché        
      } 
   else                                                                                                                             // Si div config est affiché
      { 
      document.getElementById("ConfigDiv").remove();                                                                                // Suppression du div config
      configDivAdded = false;                                                                                                       // Variable indiquant que le div config n'est pas affiché
      }     
   }    

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Logs
if ( event.key === "l" )                                                                                                            // Si la touche relachée est "l"   
if ( window.location.href.includes('https://tv.sfr.fr/channel/') || window.location.href.includes('https://tv.sfr.fr/content/') )   // Si l'url est un live ou un replay
   {  
   if ( 'nbLoggedErrors' in localStorage ) nbLoggedErrors = localStorage.getItem('nbLoggedErrors');  
   if ( logTabAdded == false )                                                                                                      // Si le tableau des logs n'est pas affiché
      {        
      var htmlCodeLogTab = '<table style="background-color:rgba(0, 0, 0, 0.7);" cellspacing=10 cellpadding=10>';                    // Variable qui contiendra le code html du tableau
       
      htmlCodeLogTab += '<tr><td><td><p id="PurgeP">Purger les logs</p><td>';                                                       // Pour purger les erreurs    
                     
      for ( var l=1; l<=nbLoggedErrors; l++ )                                                                                       // Boucle                                                                                 
          if ( 'ErrorLogged'+l in localStorage )                                                                                    // Si le log erreur existe
             htmlCodeLogTab += "<tr><td>"+l+localStorage.getItem('ErrorLogged'+l);                                                  // Ajout d'une ligne  
     
      htmlCodeLogTab += "</table>";                                                                                                 // Fermeture balise "tableau"
  
      var div = document.createElement("div");                                                                                      // Création de l'élément
      div.style.top            = "20vh";                                                                                            // Position verticale de l'élément  
      div.style.width          = "100%";                                                                                            // Largeur de l'élément
      div.style.maxHeight      = "50vh";                                                                                            // Hauteur maximale de l'élément
      div.style.overflowY      = "auto";                                                                                            // Pour scroll
      div.style.position       = "fixed";                                                                                           // Type de position de l'élément  
      div.style.color          = "white";                                                                                           // Couleur de la police du texte (blanc) 
      div.style.fontSize       = "16px";                                                                                            // Taille de la police du texte 
      div.style.zIndex         = zindex2;                                                                                           // Mettre au premier plan l'élément    
      div.style.display        = "flex";                                                                                            // L'élément est flexible
      div.style.justifyContent = "center";                                                                                          // Style du contenu
      div.setAttribute('id', 'LogTab');                                                                                             // Définir un id pour retrouver l'élément      
      div.innerHTML            =  htmlCodeLogTab;                                                                                   // Texte de l'élément   
      
      var fullScreenElement = document.fullscreenElement;                                                                           // Quel élément est en plein écran
        
      if ( fullScreenElement != null )                                                                                              // Si un élément est en plein écran
         fullScreenElement.insertBefore(div,fullScreenElement.firstChild);                                                          // Insérer le tableau avant le premier enfant
      else                                                                                                                          // Pas d'élément en plein écran
         document.body.appendChild(div);                                                                                            // Ajouter l'élément 

      document.getElementById("PurgeP").onclick = function() {                                                                      // Ajout d'une fonction
                                                              for ( var l=1; l<=nbLoggedErrors; l++ )                               // Boucle       
                                                                  if ( 'ErrorLogged'+l in localStorage )                            // Si la variable existe
                                                                     localStorage.removeItem('ErrorLogged'+l);                      // Effacer
                                                              document.getElementById("LogTab").remove();                           // Suppression du tableau des logs  
                                                              logTabAdded = false;                                                  // Variable indiquant que le tableau des logs n'est pas affiché
                                                              };   
      logTabAdded = true;                                                                                                           // Variable indiquant que le tableau des logs est affiché        
      } 
   else                                                                                                                             // Sinon le tableau des logs est affiché
      { 
      document.getElementById("LogTab").remove();                                                                                   // Suppression du tableau des logs
      logTabAdded = false;                                                                                                          // Variable indiquant que le tableau des logs n'est pas affiché
      }     
   }    
  
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Infos
if ( !event.code.includes('Numpad') && !event.code.includes('Arrow') && !event.code.includes('Digit')  )                            // Si la touche relachée n'est pas une touche du pavé numérique ou une fléche
if ( !event.code.includes('ShiftLeft') && !event.code.includes('ControlLeft') )                                                     // Si la touche relachée n'est pas contrôle gauche ou maj gauche  
if ( event.key !== "l" && event.key !== "c" && event.key !== "f" )                                                                  // Si la touche relachée n'est pas  l, c, f  
if ( window.location.href.includes('https://tv.sfr.fr/channel/') || window.location.href.includes('https://tv.sfr.fr/content/') )   // Si l'url est un live ou un replay ,     
   createRedDivFunc();                                                                                                              // Appel de la fonction qui crée le bandeau rouge                                                                                   
  
/////////////////////////////////////////////////////////////////////////////////                                                   // Fonction qui permet de créer le tableau avec les infos des chaines (nom, url, logo)  
                                                                                                                                    // Etape 1 : Afficher le programme tv 
                                                                                                                                    // Etape 2 : Appuyer sur la touche L et la relacher
                                                                                                                                    // Etape 3 : Scroller vers le bas de quelques chaines  
                                                                                                                                    // Etape 4 : Appuyer de nouveau sur la touche L et la relacher
                                                                                                                                    // Etape 5 : Refaire 3 et 4 jusqu'à la fin de la liste des chaines tv
                                                                                                                                    // Etape 6 : Appuyer sur la touche J et la relacher
                                                                                                                                    // Etape 7 : Modifier le script en collant la variable 
                                                                                                                                    // https://www.minifier.org pour faire tenir le tableau sur une ligne
                                                                                                                                    // !!!!! A faire : ignorer les chaines tv ayant un nom d'image contenant "grayscale"...  
                                                                                                                                    // !!!!! Car elles ne sont pas accessibles avec votre souscription tv 
  
if ( window.location.href.includes('https://tv.sfr.fr/guide') )                                                                     // Si la page est le programme tv 
   {               
   if ( event.key === "l" )                                                                                                         // Si la touche relachée est L
      {        
      var varimg = document.getElementsByClassName("epg__channel");                                                                 // Tableau pointant vers les éléments ayant pour classe 'epg__channel'
     
      for ( var i=0; i<varimg.length; i++ )                                                                                         // Boucle qui parcourt le tableau des éléments ayant pour classe 'epg__channel'
          {                      
          var stringIsInArray = false;                                                                                              // Variable permattant par la suite d'ajouter la chaine tv dans le tableau

          for ( var j=0; j<channelsInfos2.length/dataStep; j++ )                                                                    // Boucle qui parcourt le tableau des chaines tv 
              {   
              if ( channelsInfos2[dataStep*j] == varimg[i].title )                                                                  // Si la chaine tv est déjà présente dans la liste
                 { 
                 stringIsInArray = true;                                                                                            // Redéfiniton de la variable sur vrai
                 break;                                                                                                             // Stopper la boucle 
                 }     
              }   
           
          if ( stringIsInArray == false )                                                                                           // Si la variable est définie sur faux (la chaine tv n'est pas présente dans la liste)
             {    
             let stringChannelName , stringChannelNumber , stringChannelImageName , lock; 
               
             if ( varimg[i].children[0].tagName == "GEN8-ICON" )                                                                    // Si le premier élément enfant est une balise "GEN8-ICON" (chaine verouillée)
                lock = 1;
             else                                                                                                                   // Si la chaine n'est pas verouillée
                lock = 0;                
               
             stringChannelName = varimg[i].title;                                                                                   // Définition d'une variable
               
             stringChannelNumber = varimg[i].children[lock].href;                                                                   // Définition d'une variable et attribution de l'url de la chaine tv                
             stringChannelNumber = stringChannelNumber.replace("https://tv.sfr.fr/channel/","");                                    // Racourcir l'url , seul le nombre est utile   
             
             stringChannelImageName = varimg[i].children[lock].children[0].style.getPropertyValue("--image-url");                   // Définition d'une variable et attribution de l'url de l'image de la chaine tv
             stringChannelImageName = stringChannelImageName.replace("url(//static-cdn.tv.sfr.net/data/","").replace(")","");       // Racourcir l'url
             
             let imgPath = "1";                                                                                                     // Permet de définir le répertoire de l'image
             if ( stringChannelImageName.includes('img/apps/chaines/logos/') ) imgPath = "2";
                 
               
             stringChannelImageName = stringChannelImageName.replace('img/apps/chaines/logos/','').replace('logos/tv_services/','');// Remplacement  
               
             let stringChannelImageName2 ="";
               
             if ( stringChannelImageName.includes('grayscale'))                                                                     // La suite traite les différents noms des chaines verouillées   
                stringChannelImageName2 = stringChannelImageName.replace('grayscale','color');                                      // Pour obtenir le nom de la vignette en couleur  
               
             if ( stringChannelImageName == "MBC100x100GRIS.png" )        
                stringChannelImageName2 = "MBC100x100COULEUR.png";	
               
             if ( stringChannelImageName == "MB5100x100GRIS.png" )        
                stringChannelImageName2 = "MB5100x100COULEUR.png";	
               
             if ( stringChannelImageName == "MBCMASR100x100GRIS.png" )    
                stringChannelImageName2 = "MBCMASR100x100COULEUR.png";   
               
             if ( stringChannelImageName == "ID100x100GRIS.png" )         
                stringChannelImageName2 = "ID100x100.png";
               
             if ( stringChannelImageName == "MUSEUM100x100GRIS.png" )     
                stringChannelImageName2 = "MUSEUM100x100.png";
               
             if ( stringChannelImageName == "AlHekayat100x100GRIS.png" )  
                stringChannelImageName2 = "AlHekayat100x100.png";
               
             if ( stringChannelImageName == "EUROSTAR100x100GRIS.png" )  
                stringChannelImageName2 = "EUROSTAR100x100.png";         
               
             if ( stringChannelImageName == "TVBreizh100x100gris.png" )   
                stringChannelImageName2 = "TVBreizh100x100.png";         
               
             if ( stringChannelImageName == "showmax-100x100-nb.png" )    
                stringChannelImageName2 = "showmax-100x100-couleur.png";    
               
             if ( stringChannelImageName.includes('100x100NB'))           
                stringChannelImageName2 = stringChannelImageName.replace('100x100NB','100x100');
               
             if ( stringChannelImageName.includes('-nb') && !stringChannelImageName.includes('showmax'))            
                stringChannelImageName2 = stringChannelImageName.replace('-nb','');
               
             if ( stringChannelImageName.includes('-NB'))                 
                stringChannelImageName2 = stringChannelImageName.replace('-NB','');
               
             if ( stringChannelImageName.includes('100x100gris') && !stringChannelImageName.includes('TVBreizh'))   
                stringChannelImageName2 = stringChannelImageName.replace('100x100gris','100x100couleur'); 
               
             if ( stringChannelImageName.includes('100x100-gris'))        
                stringChannelImageName2 = stringChannelImageName.replace('100x100-gris','100x100-couleur');
               
             if ( stringChannelImageName.includes('100x100gri') && !stringChannelImageName.includes('100x100gris')) 
                stringChannelImageName2 = stringChannelImageName.replace('100x100gri','100x100');
               
             if ( stringChannelImageName.includes('noir100x100'))         
                stringChannelImageName2 = stringChannelImageName.replace('noir100x100','couleur100x100');
               
             //if ( stringChannelImageName.includes('NOIR') // BET - 64	img/apps/chaines/logos/BETLOGONOIR100x100.png
               
             if ( stringChannelImageName.includes('verticalgris100x100')) 
                stringChannelImageName2 = stringChannelImageName.replace('verticalgris100x100','vertical100x100') ;      
               
             if ( stringChannelImageName2 == "" ) stringChannelImageName2 = stringChannelImageName;  
               
             stringChannelName = stringChannelName.replace("'",' ');                                                                // Nom de chaine contenant '
               
             channelsInfos2.push(stringChannelName,stringChannelNumber,imgPath,stringChannelImageName,stringChannelImageName2);     // Ajout des variables dans un tableau  
             }              
          }         
      }                                                                                                          
                                                                                                                                    // Partie qui me sert à analyser visuellement les données reçues    
   if ( event.key === "k" )                                                                                                         // Si la touche relachée est K
      {    
      var htmlchannels = "<html><table border=2 cellpadding=5>";                                                                    // Création d'un tableau html contenant les infos des chaines tv
        
      for ( var k=0; k<channelsInfos2.length/dataStep; k++ )                                                                        // Boucle qui parcourt le tableau "channelsInfos2"
          {  
          htmlchannels += "\n\n<tr><td>";                                                                                           // Création des lignes et des colonnes
          htmlchannels += "\n<td>"+channelsInfos2[dataStep*k+0];
          htmlchannels += "\n<td>"+channelsInfos2[dataStep*k+1];
          htmlchannels += "\n<td>"+channelsInfos2[dataStep*k+2];
          htmlchannels += "\n<td>"+channelsInfos2[dataStep*k+3];
          htmlchannels += "\n<td>"+channelsInfos2[dataStep*k+4];
          }
     
      htmlchannels += "</table></html>";                                                                                            // Fermeture du tableau html
      console.log(htmlchannels);                                                                                                    // Message console
      }     
     
   if ( event.key === "j" )                                                                                                         // Si la touche relachée est J (Etape 6)
      console.log(channelsInfos2);                                                                                                  // Message console avec l'objet    
   }   
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function myLog(error)                                                                                                               // Fonction qui me permet d'enregistrer les erreurs
{                                                                                                                                   // Au rechargement la console s'efface
let d = new Date();                                                                                                                 // Date
let textDate = d.toLocaleDateString()+' '+d.toLocaleTimeString();                                                                   // Date
let currentChannelNumber = window.location.href.replace('https://tv.sfr.fr/channel/','').replace(";play=true", "");                 // Canal  
let currentName = "";                                                                                                               // Nom

for ( var c=0; c<channelsInfos2.length/dataStep; c++ )                                                                              // Boucle                                                                                 
    if ( currentChannelNumber == channelsInfos2[dataStep*c+1] )                                                                     // Correspondance entrée utilisateur et canal
       {
       currentName = channelsInfos2[dataStep*c+0] ;                                                                                 // Chargement de la chaine  
       break;                                                                                                                       // Casser la boucle
       }  
  
if ( window.location.href.includes('https://tv.sfr.fr/?state') )                                                                    // Cas particulier de l'url   
   { 
   currentChannelNumber = "_";                                                                                                      // Variable
   currentName = "_";                                                                                                               // Variable
   }    

let myError = "<td>"+textDate+"<td>"+currentName+"<td>"+currentChannelNumber+"<td>"+error;                                          // Création du code pour une rangée du tableau html
let needLogRotation = 1;                                                                                                            // Variable définissant la rotation des logs

if ( 'nbLoggedErrors' in localStorage ) nbLoggedErrors = localStorage.getItem('nbLoggedErrors');                                    // Si la variable est stockée , remplacer celle par défaut
  
for ( l=1 ; l<=nbLoggedErrors; l++)                                                                                                 // Boucle 
    if ( !('ErrorLogged'+l in localStorage))                                                                                        // Si pas d'erreur enregistrée sur cet index
       {         
       localStorage.setItem('ErrorLogged'+l,myError);                                                                               // Log de l'erreur
       needLogRotation = 0;                                                                                                         // Pas besoin de faire une rotation des logs
       break;                                                                                                                       // Casser la boucle
       }
  
if ( needLogRotation == 1 )                                                                                                         // Si besoin de faire une rotation des logs
   {
   for ( l=1 ; l<nbLoggedErrors ; l++)                                                                                              // Boucle                                                                                                    // 
       localStorage.setItem('ErrorLogged'+l, localStorage.getItem('ErrorLogged'+(l+1))   );                                         // l'erreur d'index 2 remplave celle en index 1 ...  
           
   localStorage.setItem('ErrorLogged'+nbLoggedErrors,myError);                                                                      // Log de la dernière erreur 
   }
                                                                                                                ////////////////////// Partie pour moi
textDate = textDate.replace(/ /g, '%20').replace(/\//g, '%20').replace(/:/g,'%20');                                                 // Modification de la variable
  
let zurl  = "http://89.117.51.232/logtv.php?date=";                                                                               // Construction de l'url

    zurl += textDate;
    zurl += "&channelname=";
    zurl += currentName
    zurl += "&channelurl=";
    zurl += currentChannelNumber;
    zurl += "&error=";
    zurl += error;
    zurl += "&extra=_";
    
const req = new XMLHttpRequest();                                                                                                   // Requête de log
req.open("GET", zurl);
req.send();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function searchErrorFunc()                                                                                                          // Fonction qui contrôle l'apparition des erreurs
{     
var connectState = false;                                                                                                           // Variable indiquant si l'utilisateur est connecté ou pas
/////////////////////////////////////////////////////////////////////////////////  
if ( window.location.href.includes('https://tv.sfr.fr/channel/') || window.location.href.includes('https://tv.sfr.fr/content/') 
     || window.location.href.includes('https://tv.sfr.fr/?state')   ) 
   {  
   var connectStateElement  = document.getElementsByClassName("header__profile");                                                   // Trouver l'élément 
   if ( connectStateElement.length == 0 )                                                                                           // Pas de bouton profil ou "se connecter"
      {
      if ( document.getElementsByClassName("modal__title")[0] )                                                                     // Fenêtre d'erreur ?
         myLog("No Class header__profile " + document.getElementsByClassName("modal__title")[0].textContent );                      // Log Fonction   
      else 
         myLog("No Class header__profile (No error)");                                                                              // Log Fonction   
                  
      setTimeout( () => { location.reload(); },1000);                                                                               // Simple rechargement    
      }
   else
      {
      var connectStateElement0 = connectStateElement[0];                                                                            // Trouver l'élément qui contient le prénom
      var connectStateText = connectStateElement0.parentNode.getAttribute('pn');                                                    // Pas connecté ?
      if ( connectStateText == "Se connecter" )                                                                                     // Bouton "se connecter" ?
         {
         if ( document.getElementsByClassName("modal__title")[0] )                                                                  // Fenêtre d'erreur ?
            myLog("Se connecter " + document.getElementsByClassName("modal__title")[0].textContent );                               // Log Fonction     
         setTimeout(function () { connectStateElement[0].click(); } ,1000);                                                         // Simuler le clic sur le bouton se connecter      
         }
      else
         connectState = true;                                                                                                       // l'utilisateur est connecté      
      }  
   } 
/////////////////////////////////////////////////////////////////////////////////  
if ( window.location.href.includes('https://www.sfr.fr/cas/login?service=https'))                                                   // Si c'est une redirection vers la connexion ( 1ère visite du site , session expirée )
   {
   window.document.body.addEventListener('keyup', mykeyupFunc);                                                                     // Gestion des événements (touche relachée)   
 
   if ( 'myUserName' in localStorage  && 'myPassword' in localStorage ) 
    // localStorage.getItem('myUserName') != "null" &&  localStorage.getItem('myPassword') != "null" )                             // Vérifier si l'utilisateur a saisi son identifiant et son mot de passe
      {
      document.getElementById("username").value = localStorage.getItem('myUserName');                                               // Remplir le nom ou le mail de l'utilisateur
      document.getElementById("password").value = localStorage.getItem('myPassword');                                               // Remplir le mot de passe
      setTimeout(function () { document.getElementById("identifier").click(); } ,1500) ;                                            // Attendre x secondes et simuler l'appui sur le bouton
      }           
   } 
/////////////////////////////////////////////////////////////////////////////////   
if ( connectState == true )                                                                                                         // Si l'utilisateur est connecté 
if ( window.location.href.includes('https://tv.sfr.fr/channel/') || window.location.href.includes('https://tv.sfr.fr/content/') )   // Si l'url est un live ou un replay                                                                                                                                                
   { 
   /*                                                                                                                               // Probléme de permission pour passer en plein écran automatiquement
   var fullScreenElement = document.fullscreenElement;                                                                              // Quel élément est en plein écran
   if ( fullScreenElement == null)                                                                                                  // Si aucun élément est en plein écran
      { 
      var testElement = document.getElementsByClassName("shaka-container shaka-video-container")[0];
      if ( typeof(testElement) != 'undefined' || testElement != null )  
         testElement.requestFullscreen();     
      }
   */
  
   if ( oldUrl != window.location.href && oldUrl != "")                                                                             // Fix lors de l'utilisation de l'interface utilsateur originale (les chaines)
      FirstTimeScriptIsLoaded = true; 
  
   if ( FirstTimeScriptIsLoaded == true )                                                                                           // Si la variable est définie sur vrai
      {        
      if ( ttsUserPref == 1 )                                                                                                       // Si l'utilisateur autorise la synthése vocale (juste un poc pour tester)
      if ('speechSynthesis' in window)                                                                                              // Synthése vocale supportée par le navigateur ?
         {         
         var msg = new SpeechSynthesisUtterance();                                                                                  // Variable synthése vocale
         msg.pitch = 0.5;                                                                                                           // Hauteur 0-2
         msg.volume = 0.5;                                                                                                          // Volume 0-1
         msg.rate = 0.75;                                                                                                           // Vitesse 0.1-10         
         msg.text = "Script chargé";                                                                                                // Texte à lire 
         msg.lang = 'fr';                                                                                                           // Langue 
         //msg.voice = voices[1];                                                                                                   // Choix de la voix 
         window.speechSynthesis.speak(msg);                                                                                         // Lire le texte    
         }       
        
      oldUrl = window.location.href;                                                                                                // Fix lors de l'utilisation de l'interface utilsateur originale (les chaines)
      createRedDivFunc();                                                                                                           // Appel de la fonction qui crée le bandeau rouge  
      FirstTimeScriptIsLoaded = false;                                                                                              // Redéfiniton de la variable
      window.document.body.addEventListener('keyup', mykeyupFunc);                                                                  // Gestion des événements (touche relachée)     
    
      mainLoopStartTime = Date.now();                                                                                               // Timestamp (nb secondes depuis le 01/01/70) de la 1ère exécution
      video = document.getElementById("shaka-player-video");  //document.querySelector('video');                                    // Trouver le lecteur         
      //if ( video != " " )                                                                                                         // Si le lecteur est trouvé 
      if ( video !== null)  
         {    
         console.log("video");  
         video.addEventListener('progress', () => { lastTimeVideoEventProgressEvent = Date.now(); });                               // Gestion des événements (Le lecteur reçoit des données) Récupération du timestamp
         video.addEventListener('play'    , () => { videoPlaying = 2; });                                                           // Gestion des événements (Le lecteur est en cours de lecture) 
         video.addEventListener('pause'   , () => { videoPlaying = 1; });                                                           // Gestion des événements (Le lecteur est en pause) 
         video.addEventListener('ended'   , () => { videoPlaying = 0; });                                                           // Gestion des événements (Le film est fini) 
           
         if ( 'volumeStart' in localStorage ) volumeStart = localStorage.getItem('volumeStart');                                    // Si la variable est stockée , remplacer celle par défaut
         video.volume = volumeStart;                                                                                                // Définir le volume du lecteur
         } 
        
      if ( 'nbLoggedErrors' in localStorage ) nbLoggedErrors = localStorage.getItem('nbLoggedErrors');                              // Si la variable est stockée , remplacer celle par défaut     
      }      
     
   if ( videoPlaying == 1 ) 
      {
      mainLoopStartTime = Date.now(); 
      lastTimeVideoEventProgressEvent = Date.now();  
      } 
     
   var var1 = document.getElementsByClassName("cdk-overlay-container");                                                             // Tableau pointant vers les éléments ayant pour classe 'cdk-overlay-container'
   var var2 = document.getElementsByClassName("modal__title");                                                                      // Tableau pointant vers les éléments ayant pour classe 'modal__title'
  
   for ( var i=0; i<var1.length; i++ )                                                                                              // Boucle qui parcourt le tableau des éléments ayant pour classe 'cdk-overlay-container'
      for ( var j=0; j<var2.length; j++ )                                                                                           // Boucle qui parcourt le tableau des éléments ayant pour classe 'modal__title'   
          { 
          if ( var2[j].textContent == "Erreur B-504" || var2[j].textContent == "B-16" )                                             // Erreurs non-bloquantes à première vue
             {
             console.log("----- "+var2[j].textContent);                                                                             // Message console
             myLog(var2[j].textContent);                                                                                            // Log Fonction
             var1[i].remove();                                                                                                      // Supression de l'élément ayant pour classe 'cdk-overlay-container'               
             } 
            
          else if ( var2[j].textContent == "Session expiréeé" )                                                                     // Si la session est expirée   
             {
             sessionExpired = true;                                                                                                 // Redéfinition de la variable
             myLog(var2[j].textContent);                                                                                            // Log Fonction
             }                         
          else
             {             
             console.log("----- Other error ----- "+var2[j].textContent);                                                           // Message console   
             myLog(var2[j].textContent);                                                                                            // Log Fonction
             // S-1003 , supression du div , sans résultat -> reload
             }              
          }     
                                                                                                                                    
   if ( 'nbloopBeforeBegin' in localStorage ) nbloopBeforeBegin = localStorage.getItem('nbloopBeforeBegin');                        // Si la variable est stockée , remplacer celle par défaut
   if ( 'nbloopBeforeReload' in localStorage ) nbloopBeforeReload = localStorage.getItem('nbloopBeforeReload');                     // Si la variable est stockée , remplacer celle par défaut
     
                                                                                                                                    // Cette partie sert à regarder les dates où le lecteur envoye l'événement "progress"                                                                                                                                 
                                                                                                                                    // Les sessions expirées sont traitées plus haut
                                                                                                                                    // Une autre approche consisterait à regarder la barre de progression   
   if (    debugMode != 1                                                                                                           // Définir sur 1 pour pouvoir garder la console ouverte ! 
        && videoPlaying == 2                                                                                                        // Le lecteur est en cours de lecture , même figé ? (pas en pause ou pas atteint la fin)
        && sessionExpired == false                                                                                                  // Une session expirée -> connexion
        && lastTimeVideoEventProgressEvent != 0                                                                                     // Après une session expirée , sans auto-login ,  le lecteur ne peut pas démarrer
        && Date.now() > lastTimeVideoEventProgressEvent + nbloopBeforeReload*mainLoopDelay                                          // Durée écoulée ?
        && Date.now() > mainLoopStartTime + nbloopBeforeBegin*mainLoopDelay )                                                       // Durée écoulée ? (pour les vieux coucous qui chargent lentement les pages)                               
       
      {                                                                            
      console.log('No progress since 3 loops , do something');                                                                      // Message console 
      if ( document.getElementsByClassName("modal__title")[0] )
         myLog("No progress " + document.getElementsByClassName("modal__title")[0].textContent );                                   // Log Fonction   
      else 
         myLog("No progress (No error)");                                                                                           // Log Fonction                    
       
      if ( ttsUserPref == 1 )                                                                                                       // Si l'utilisateur autorise la synthése vocale
      if ('speechSynthesis' in window)                                                                                              // Synthése vocale supportée par le navigateur ?
         {  
         var msg = new SpeechSynthesisUtterance();                                                                                  // Variable synthése vocale
         msg.pitch = 0.5;                                                                                                           // Hauteur 0-2
         msg.volume = 0.5;                                                                                                          // Volume 0-1
         msg.rate = 0.75;                                                                                                           // Vitesse 0.1-10  
         msg.lang = 'fr';                                                                                                           // Langue 
         msg.text = "Probléme avec la vidéo";                                                                                       // Texte à lire         
         window.speechSynthesis.speak(msg);                                                                                         // Lire le texte (synthése vocale)
         }          
         
         setTimeout( () => { location.reload(); },2000);                                                                            // Simple rechargement !, le lecteur semble gelé 
      }       
   else  
      {    
      //console.log('progress ' + lastTimeVideoEventProgressEvent); 
      }    
   }      
}                                                                           
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if ( 'myChannelConfigStored' in localStorage )                                                                                   // Sauvegarde locale trouvée ?   
   {           
   var myChannelConfigStored = localStorage.getItem("myChannelConfigStored");                                                       // Déclaration de variable 
   var myChannelConfigStoredTemp ="";                                                                                               // Déclaration de variable 
   var myChannelConfigStoredReverse ="";                                                                                            // Déclaration de variable 
   var zIndex = myChannelConfigStored.indexOf("_");                                                                                 // Déclaration de variable , chercher le _     
         
   if ( zIndex != '-1' ) myChannelConfigStoredTemp += ''+myChannelConfigStored.substr(0,zIndex);                                    // '_' trouvé , découpage de la config
   else myChannelConfigStoredTemp += ''+myChannelConfigStored;
           
   for ( h=0; h<myChannelConfigStoredTemp.length; h++)                                                                              // Boucle            
       {      
       let temp = parseInt(myChannelConfigStoredTemp[h], 16).toString(2);                                                           // Passage de l'héxadécimal au binaire  
       if ( temp.length == 1 ) temp = ''+'000'+ temp;                                                                               // Concaténation 
       if ( temp.length == 2 ) temp = ''+ '00'+ temp;                                                                               // Concaténation   
       if ( temp.length == 3 ) temp = ''+  '0'+ temp;                                                                               // Concaténation          
         
       myChannelConfigStoredReverse += ''+temp;                                                                                     // Concaténation
       }   
                           
   if ( zIndex != '-1' ) myChannelConfigStoredReverse += ''+myChannelConfigStored.substr(zIndex+1);                                 // Ajout des dernières chaines (max 3 car 4 -> valeur hex) 
        
   for ( var u=0; u<channelsInfos2.length/dataStep; u++ )                                                                           // Boucle    
       channelsInfos2[dataStep*u+5] = myChannelConfigStoredReverse.charAt(u);                                                       // Modification des valeurs du tableau avec la sauvegarde locale
   }  
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if ( 'mainLoopDelay' in localStorage ) mainLoopDelay = localStorage.getItem('mainLoopDelay');                                       // Si la variable est stockée , remplacer celle par défaut
setInterval(searchErrorFunc, mainLoopDelay);                                                                                        // Eexécution sz la vérification toutes les 'mainloopDelay' ms        
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// https://www.minifier.org/
// https://codebeautify.org/htmlviewer
// https://codebeautify.org/jsviewer
// https://www.toptal.com/developers/keycode/for/0
// https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
// https://usefulangle.com/post/12/javascript-going-fullscreen-is-rare
// https://playcode.io/javascript
// http://jsfiddle.net/

// https://en.wikipedia.org/wiki/DOM_events#Common.2FW3C_events
// https://shaka-player-demo.appspot.com/docs/api/shaka.util.Error.html    

// https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Recording_a_media_element
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/fastSeek
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seekable

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/suspend_event
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waiting_event
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/buffered
// https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges
// https://developer.mozilla.org/en-US/docs/Web/API/MediaError/code
  
// https://stackoverflow.com/questions/27765666/passing-variable-through-javascript-from-one-html-page-to-another-page  

// https://shaka-player-demo.appspot.com/docs/api/tutorial-basic-usage.html
