// ==UserScript==
// @version     0.61
// @name        erreurs sfr tv
// @namespace   https://tv.sfr.fr/
// @description	erreurs (gestion et logs), pavé numérique pour zapper, volume sonore (live et départ), plein écran, reconnexion automatique, interface de configuration
// @author      ced
// @updateURL   https://greasyfork.org/fr/scripts/451721-erreur-b-504
// @downloadURL https://greasyfork.org/fr/scripts/451721-erreur-b-504
// @include     https://tv.sfr.fr/*
// @include     https://tv.sfr.fr/direct-tv/*
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


var channelsInfos3 = [];  


var dataStep = 5;   
var channelsInfos2 = []; 

                                                                                                                                    // !!!! Nom des chaines contenant '
                                                                                                                                    // Variable informant du nombre de champs par chaine
                                                                                                                                    // Variable tableau des chaines      
                                                                                                                                    // Ajout de données relatives aux chaines
                                                                                                                                    // Pour personaliser , modifier le dernier chiffre ( 1 pour la 
                                                                                                                                    //                     1 pour la prendre en compte                                          
                                                                                                                                    //                     0 pour ignorer
                                                                                                                                    // L'interface permet de le faire visuellement
                                                                                                                                    // 
                                                                                                                                    // Nom de la chaine, Canal, Image, url , affiché ou pas

channelsInfos2.push('TF1','1','logos/tv_services/TF1_color.png','tf1','1');
channelsInfos2.push('France 2','2','logos/tv_services/France_2_color.png','france-2','1');
channelsInfos2.push('France 3','3','logos/tv_services/France_3_color.png','france-3','1');
channelsInfos2.push('France 5','5','logos/tv_services/France_5_color.png','france-5','1');
channelsInfos2.push('M6','6','img/apps/chaines/logos/M6100x100fondgris.png','m6','1');
channelsInfos2.push('Arte','7','logos/tv_services/Arte_color.png','arte','1');
channelsInfos2.push('C8','8','logos/tv_services/C8_color.png','c8','1');
channelsInfos2.push('W9','9','logos/tv_services/W9_color.png','w9','1');
channelsInfos2.push('TMC','10','logos/tv_services/TMC_color.png','tmc','1');
channelsInfos2.push('TFX','11','logos/tv_services/TFX_color.png','tfx','1');
channelsInfos2.push('NRJ12','12','logos/tv_services/NRJ12_color.png','nrj12','1');
channelsInfos2.push('LCP','13','logos/tv_services/LCP_color.png','lcp','1');
channelsInfos2.push('France 4','14','logos/tv_services/France_4_color.png','france-4','1');
channelsInfos2.push('BFM TV','15','logos/tv_services/BFM_TV_color.png','bfm-tv','1');
channelsInfos2.push('CNews','16','logos/tv_services/CNews_color.png','cnews','1');
channelsInfos2.push('CStar','17','logos/tv_services/CStar_color.png','cstar','1');
channelsInfos2.push('Gulli','18','img/apps/chaines/logos/Gulli100x100Couleur.png','gulli','1');
channelsInfos2.push('TF1 Séries-Films','20','logos/tv_services/TF1_Series_Films_color.png','tf1-series-films','1');
channelsInfos2.push('La chaine l’Équipe','21','logos/tv_services/L_Equipe_color.png','la-chaine-lequipe','1');
channelsInfos2.push('6ter','22','logos/tv_services/6ter_color.png','6ter','1');
channelsInfos2.push('RMC STORY','23','logos/tv_services/RMC_STORY_color.png','rmc-story','1');
channelsInfos2.push('RMC Découverte','24','logos/tv_services/RMC_Decouverte_color.png','rmc-decouverte','1');
channelsInfos2.push('Chérie 25','25','logos/tv_services/Cherie_25_color.png','cherie-25','1');
channelsInfos2.push('LCI','26','logos/tv_services/LCI_color.png','lci','1');
channelsInfos2.push('franceinfo:','27','logos/tv_services/franceinfo:_color.png','franceinfo','1');
channelsInfos2.push('i24 news','28','logos/tv_services/i24_news_color.png','i24-news','1');
channelsInfos2.push('BFM Business','31','logos/tv_services/BFM_Business_color.png','bfm-business','1');
channelsInfos2.push('TECH & CO','32','img/apps/chaines/logos/SFR100x100COLORTECHCO.png','tech-co','1');
channelsInfos2.push('RMC Sport 1','33','logos/tv_services/RMC_Sport_1_color.png','rmc-sport-1','0');
channelsInfos2.push('BFM PARIS ILE-DE-FRANCE','39','img/apps/chaines/logos/BFMPARISIDF100x100COULEURAVECCONTOUR.png','bfm-paris-ile-de-france','1');
channelsInfos2.push('Discovery Channel','40','logos/tv_services/Discovery_Channel_color.png','discovery-channel','0');
channelsInfos2.push('TLC','41','img/apps/chaines/logos/TLC100x100couleur.png','tlc','0');
channelsInfos2.push('RMC Talk Info','42','img/apps/chaines/logos/RMCTalkInfo100x100couleur.png','rmc-talk-info','1');
channelsInfos2.push('Discovery Investigation','43','img/apps/chaines/logos/ID100x100.png','discovery-investigation','0');
channelsInfos2.push('SFR ACTU','44','img/apps/chaines/logos/SFRActu100100Couleur003.png','sfr-actu','1');
channelsInfos2.push('BFM Grands Reportages','45','img/apps/chaines/logos/BFMGrandsReportages100x100couleur.png','bfm-grands-reportages','1');
channelsInfos2.push('France 24','47','logos/tv_services/France_24_color.png','france-24','1');
channelsInfos2.push('Euronews','48','img/apps/chaines/logos/EURONEWS100x100.png','euronews','0');
channelsInfos2.push('RMC Alerte Secours','49','img/apps/chaines/logos/RMCALERTESECOURS100x100couleur.png','rmc-alerte-secours','1');
channelsInfos2.push('13ème rue','50','logos/tv_services/13eme_rue_color.png','13eme-rue','1');
channelsInfos2.push('Syfy','51','logos/tv_services/Syfy_color.png','syfy','1');
channelsInfos2.push('E! Entertainment','52','logos/tv_services/E_color.png','e-entertainment','1');
channelsInfos2.push('WARNER TV','55','img/apps/chaines/logos/WarnerFond100x100.png','warner-tv','1');
channelsInfos2.push('MTV','56','img/apps/chaines/logos/MTVLOGOCOULEUR100x100.png','mtv','0');
channelsInfos2.push('MCM','57','logos/tv_services/MCM_color.png','mcm','0');
channelsInfos2.push('AB1','58','img/apps/chaines/logos/AB1100x100Noir.png','ab1','1');
channelsInfos2.push('SERIE CLUB','59','logos/tv_services/SERIE_CLUB_color.png','serie-club','0');
channelsInfos2.push('Game One','60','img/apps/chaines/logos/GAMEONE100x100.png','game-one','1');
channelsInfos2.push('Game One +1','61','img/apps/chaines/logos/GAMEONE1100x100.png','game-one-1','1');
channelsInfos2.push('Warner TV Next','62','img/apps/chaines/logos/WB-Next_100x100.png','warner-tv-next','0');
channelsInfos2.push('J-One','63','logos/tv_services/J_One_color.png','j-one','1');
channelsInfos2.push('BET','64','img/apps/chaines/logos/BETLOGONOIR100x100.png','bet','1');
channelsInfos2.push('Comedy Central','65','logos/tv_services/Comedy_Central_color.png','comedy-central','1');
channelsInfos2.push('Paris Première','70','logos/tv_services/Paris_Premiere_color.png','paris-premiere','1');
channelsInfos2.push('Téva','71','logos/tv_services/Teva_color.png','teva','1');
channelsInfos2.push('RTL9','72','img/apps/chaines/logos/RTL9100x100.png','rtl9','1');
channelsInfos2.push('TV Breizh','73','img/apps/chaines/logos/TVBreizh100x100.png','tv-breizh','0');
channelsInfos2.push('TV5 Monde','74','logos/tv_services/TV5_Monde_color.png','tv5-monde','1');
channelsInfos2.push('CANAL+ BOX OFFICE','83','img/apps/chaines/logos/BOX_OFFICE_100x100couleur.png','canal-box-office','0');
channelsInfos2.push('Public Sénat','104','logos/tv_services/publicsenat-100x100.png','public-senat','0');
channelsInfos2.push('RMC Sport Access','106','img/apps/chaines/logos/RMCSportAccess100x100couleur.png','rmc-sport-access','0');
channelsInfos2.push('RMC Talk Sport','107','img/apps/chaines/logos/RMCTalkSport100x100couleur.png','rmc-talk-sport','1');
channelsInfos2.push('RMC Mecanic','108','img/apps/chaines/logos/RMCMECANIC100x100couleur.png','rmc-mecanic','1');
channelsInfos2.push('RMC Sport Live 2','112','img/apps/chaines/logos/RMCSportLive2100x100COULEUR.png','rmc-sport-live-2','0');
channelsInfos2.push('beIN SPORTS 1','115','logos/tv_services/beIN_SPORTS_1_color.png','bein-sports-1','0');
channelsInfos2.push('beIN SPORTS 2','116','logos/tv_services/beIN_SPORTS_2_color.png','bein-sports-2','0');
channelsInfos2.push('beIN SPORTS 3','117','logos/tv_services/beIN_SPORTS_3_color.png','bein-sports-3','0');
channelsInfos2.push('DAZN 1','118','img/apps/chaines/logos/DAZN100x100color.png','dazn-1','0');
channelsInfos2.push('Equidia','119','logos/tv_services/Equidia_color.png','equidia','0');
channelsInfos2.push('MGG TV','121','img/apps/chaines/logos/MGGTVvertical100x100.png','mgg-tv','0');
channelsInfos2.push('Automoto la chaine','125','logos/tv_services/Automoto_color.png','automoto-la-chaine','0');
channelsInfos2.push('Journal du Golf TV','128','img/apps/chaines/logos/JournalduGolf100x100.png','journal-du-golf-tv','1');
channelsInfos2.push('Sport en France','129','logos/tv_services/Sport_en_France_color.png','sport-en-france','1');
channelsInfos2.push('OLPLAY','130','img/apps/chaines/logos/olplay100x100color.png','olplay','0');
channelsInfos2.push('OCS','146','img/apps/chaines/logos/OCS100x100.png','ocs','0');
channelsInfos2.push('CINE+ frisson','147','img/apps/chaines/logos/CineFrisson100x100.png','cine-frisson','0');
channelsInfos2.push('CINE+ émotion','148','img/apps/chaines/logos/CineEmotion100x100.png','cine-emotion','0');
channelsInfos2.push('CINE+ family','149','img/apps/chaines/logos/CineFamily100x100.png','cine-family','0');
channelsInfos2.push('CINE+ festival','150','img/apps/chaines/logos/CineFestival100x100.png','cine-festival','0');
channelsInfos2.push('CINE+ classic','151','img/apps/chaines/logos/CineClassic100x100.png','cine-classic','0');
channelsInfos2.push('Paramount Channel','160','logos/tv_services/Paramount_Channel_color.png','paramount-channel','1');
channelsInfos2.push('Paramount Channel Décalé','161','logos/tv_services/Paramount_Channel_Decale_color.png','paramount-channel-decale','0');
channelsInfos2.push('TCM Cinéma','162','img/apps/chaines/logos/TCM100x100.png','tcm-cinema','0');
channelsInfos2.push('Action','163','logos/tv_services/Action_color.png','action','0');
channelsInfos2.push('INSOMNIA','164','img/apps/chaines/logos/INSOMNIA100x100.png','insomnia','0');
channelsInfos2.push('RMC WOW','167','img/apps/chaines/logos/RMCWOW100x100couleur.png','rmc-wow','1');
channelsInfos2.push('RMC Mystère','168','img/apps/chaines/logos/RMCMystere100x100couleur.png','rmc-mystere','1');
channelsInfos2.push('J irai dormir chez vous','169','img/apps/chaines/logos/RMCJDCV100x100couleur.png','jirai-dormir-chez-vous','1');
channelsInfos2.push('Ushuaia TV','173','logos/tv_services/Ushuaia_TV_color.png','ushuaia-tv','0');
channelsInfos2.push('TREK','174','logos/tv_services/TREK_color.png','trek','0');
channelsInfos2.push('Crime District','175','img/apps/chaines/logos/NEUFCRIMEDISCTRICT100x100.png','crime-district','0');
channelsInfos2.push('Marmiton TV','176','img/apps/chaines/logos/MarmitonTV100x100.png','marmiton-tv','1');
channelsInfos2.push('Histoire','177','logos/tv_services/Histoire_color.png','histoire','0');
channelsInfos2.push('Toute l Histoire','178','logos/tv_services/Toute_l_Histoire_color.png','toute-lhistoire','0');
channelsInfos2.push('KTO','179','img/apps/chaines/logos/KTO100x100.png','kto','0');
channelsInfos2.push('Animaux','180','logos/tv_services/Animaux_color.png','animaux','0');
channelsInfos2.push('Chasse et Pêche','181','logos/tv_services/Chasse_et_Peche_color.png','chasse-et-peche','0');
channelsInfos2.push('Science et Vie TV','182','logos/tv_services/Science_et_Vie_TV_color.png','science-et-vie-tv','0');
channelsInfos2.push('Luxe TV','183','logos/tv_services/Luxe_TV_color.png','luxe-tv','0');
channelsInfos2.push('Fashion TV','184','logos/tv_services/Fashion_TV_color.png','fashion-tv','0');
channelsInfos2.push('Mens Up TV','185','logos/tv_services/Mens_Up_TV_color.png','mens-up-tv','0');
channelsInfos2.push('Astrocenter TV','186','logos/tv_services/Astrocenter_TV_color.png','astrocenter-tv','0');
channelsInfos2.push('My Zen TV','187','logos/tv_services/myzentv-100x100.png','my-zen-tv','0');
channelsInfos2.push('MUSEUM TV','191','img/apps/chaines/logos/MUSEUMTV100x100.png','museum-tv','0');
channelsInfos2.push('Top Santé TV','197','img/apps/chaines/logos/TopSante100x100.png','top-sante-tv','1');
channelsInfos2.push('Maison & Travaux TV','198','img/apps/chaines/logos/MaisonTravaux100x100.png','maison-travaux-tv','1');
channelsInfos2.push('Auto Plus TV','199','img/apps/chaines/logos/AutoPlus100x100.png','auto-plus-tv','1');
channelsInfos2.push('Nickelodeon Junior','200','img/apps/chaines/logos/NickJr100x100.png','nickelodeon-junior','0');
channelsInfos2.push('Boomerang','201','logos/tv_services/Boomerang_color.png','boomerang','0');
channelsInfos2.push('Boomerang +1','202','logos/tv_services/Boomerang_1_color.png','boomerang-1','0');
channelsInfos2.push('TIJI','203','img/apps/chaines/logos/TIJI100x100.png','tiji','0');
channelsInfos2.push('DREAMWORKS','204','img/apps/chaines/logos/DREAMWORKS100x100.png','dreamworks','1');
channelsInfos2.push('Nickelodeon','205','img/apps/chaines/logos/Nickelodeon100x100Couleur.png','nickelodeon','0');
channelsInfos2.push('Nickelodeon+1','206','logos/tv_services/Nickelodeon_1_color.png','nickelodeon1','0');
channelsInfos2.push('CANAL J','210','img/apps/chaines/logos/CANAL100x100.png','canal-j','0');
channelsInfos2.push('Cartoon Network','211','logos/tv_services/Cartoon_Network_color.png','cartoon-network','0');
channelsInfos2.push('Nickelodeon Teen','212','img/apps/chaines/logos/NickelodeonTeen100x100.png','nickelodeon-teen','0');
channelsInfos2.push('Cartoonito','213','img/apps/chaines/logos/CARTOONITO100x100Couleur.png','cartoonito','1');
channelsInfos2.push('Mangas','231','img/apps/chaines/logos/LogoManga100x100.png','mangas','0');
channelsInfos2.push('Lucky Jack','234','logos/tv_services/Lucky_Jack_color.png','lucky-jack','0');
channelsInfos2.push('MTV Hits','250','img/apps/chaines/logos/MTVHITSlogonoir100x100.png','mtv-hits','0');
channelsInfos2.push('M6 Music','254','logos/tv_services/M6_Music_color.png','m6-music','1');
channelsInfos2.push('RFM TV','255','logos/tv_services/RFM_TV_color.png','rfm-tv','1');
channelsInfos2.push('NRJ Hits','256','logos/tv_services/NRJ_Hits_color.png','nrj-hits','0');
channelsInfos2.push('Mezzo','260','img/apps/chaines/logos/Mezzo100x100fondblanc.png','mezzo','0');
channelsInfos2.push('Mezzo Live HD','261','img/apps/chaines/logos/MezzoLive100x100fondblanc.png','mezzo-live-hd','0');
channelsInfos2.push('MELODY TV','262','logos/tv_services/MELODY_TV_color.png','melody-tv','0');
channelsInfos2.push('Trace Urban','263','logos/tv_services/Trace_Urban_color.png','trace-urban','0');
channelsInfos2.push('Trace Toca','264','logos/tv_services/Trace_Toca_color.png','trace-toca','0');
channelsInfos2.push('TRACE CARIBBEAN','265','logos/tv_services/TRACE_CARIBBEAN_color.png','trace-caribbean','0');
channelsInfos2.push('Trace Gospel','266','logos/tv_services/Trace_Gospel_color.png','trace-gospel','0');
channelsInfos2.push('BBLACK Classik','267','logos/tv_services/BBLACK_CLASSIK_color.png','bblack-classik','0');
channelsInfos2.push('BBLACK Caribbean','268','logos/tv_services/BBLACK_CARIBBEAN_color.png','bblack-caribbean','0');
channelsInfos2.push('BBLACK Africa','269','logos/tv_services/BBLACK_AFRICA_color.png','bblack-africa','0');
channelsInfos2.push('Melody d Afrique','272','logos/tv_services/Melody_d_Afrique_color.png','melody-dafrique','0');
channelsInfos2.push('BFM Lyon','281','logos/tv_services/BFM_Lyon_color.png','bfm-lyon','1');
channelsInfos2.push('BFM Grand Lille','282','logos/tv_services/bfmgrandlille-100x100.png','bfm-grand-lille','1');
channelsInfos2.push('BFM Grand Littoral','283','logos/tv_services/bfmgrandlittoral-100x100.png','bfm-grand-littoral','1');
channelsInfos2.push('BFM MARSEILLE PROVENCE','284','img/apps/chaines/logos/NEUFBFMMARSEILLEPROV100x100.png','bfm-marseille-provence','1');
channelsInfos2.push('BFM NICE COTE D AZUR','285','img/apps/chaines/logos/NEUFBFMNICECOTEDAZUR100x100.png','bfm-nice-cote-dazur','1');
channelsInfos2.push('BFM TOULON VAR','286','img/apps/chaines/logos/NEUFBFMTOULONVAR100x100.png','bfm-toulon-var','1');
channelsInfos2.push('BFM DICI ALPES DU SUD','287','img/apps/chaines/logos/BFMDICIALPESDUSUD100x100.png','bfm-dici-alpes-du-sud','1');
channelsInfos2.push('BFM DICI HAUTE-PROVENCE','288','img/apps/chaines/logos/BFMDICIHAUTEPROVENCE100x100.png','bfm-dici-haute-provence','1');
channelsInfos2.push('BFM ALSACE','289','img/apps/chaines/logos/BFMALSACE100x100.png','bfm-alsace','1');
channelsInfos2.push('BFM NORMANDIE','290','img/apps/chaines/logos/BFMNORMANDIE100x100COULEUR.png','bfm-normandie','1');
channelsInfos2.push('vià30','295','logos/tv_services/via30_color.png','via30','0');
channelsInfos2.push('vià31','296','logos/tv_services/via31_color.png','via31','0');
channelsInfos2.push('vià34','297','logos/tv_services/via34_color.png','via34','0');
channelsInfos2.push('vià66','298','logos/tv_services/via66_color.png','via66','0');
channelsInfos2.push('beIN SPORTS MAX 4','300','logos/tv_services/beIN_SPORTS_MAX_4_color.png','bein-sports-max-4','0');
channelsInfos2.push('beIN SPORTS MAX 5','301','logos/tv_services/beIN_SPORTS_MAX_5_color.png','bein-sports-max-5','0');
channelsInfos2.push('beIN SPORTS MAX 6','302','logos/tv_services/beIN_SPORTS_MAX_6_color.png','bein-sports-max-6','0');
channelsInfos2.push('beIN SPORTS MAX 7','303','logos/tv_services/beIN_SPORTS_MAX_7_color.png','bein-sports-max-7','0');
channelsInfos2.push('beIN SPORTS MAX 8','304','logos/tv_services/beIN_SPORTS_MAX_8_color.png','bein-sports-max-8','0');
channelsInfos2.push('beIN SPORTS MAX 9','305','logos/tv_services/beIN_SPORTS_MAX_9_color.png','bein-sports-max-9','0');
channelsInfos2.push('beIN SPORTS MAX 10','306','logos/tv_services/beIN_SPORTS_MAX_10_color.png','bein-sports-max-10','0');
channelsInfos2.push('RMC Sport Live 3','316','img/apps/chaines/logos/RMCSPORTLIVE3100x100.png','rmc-sport-live-3','0');
channelsInfos2.push('RMC Sport Live 4','317','img/apps/chaines/logos/RMCSPORTLIVE4100x100.png','rmc-sport-live-4','0');
channelsInfos2.push('+ d’Afrique','390','img/apps/chaines/logos/PLUSDAFRIQUE100x100Couleur.png','dafrique','0');
channelsInfos2.push('France 3 - Alpes','431','logos/tv_services/France-3-Alpes-Color.jpg','france-3-alpes','1');
channelsInfos2.push('France 3 - Alsace','432','logos/tv_services/France-3-Alsace-Color.jpg','france-3-alsace','1');
channelsInfos2.push('France 3 - Aquitaine','433','logos/tv_services/France-3-Aquitaine-Color.jpg','france-3-aquitaine','1');
channelsInfos2.push('France 3 - Auvergne','434','logos/tv_services/France-3-Auvergne-Color.jpg','france-3-auvergne','1');
channelsInfos2.push('France 3 - Basse-Normandie','435','logos/tv_services/France-3-Normandie-Color.jpg','france-3-basse-normandie','1');
channelsInfos2.push('France 3 - Bourgogne','436','logos/tv_services/France-3-Bourgogne-Color.jpg','france-3-bourgogne','1');
channelsInfos2.push('France 3 - Bretagne','437','logos/tv_services/France-3-Bretagne-Color.jpg','france-3-bretagne','1');
channelsInfos2.push('France 3 - Centre','438','img/apps/chaines/logos/France3CenCouleur.jpg','france-3-centre','1');
channelsInfos2.push('France 3 - Champagne-Ardenne','439','logos/tv_services/France-3-Champagne-Ardenne-Color.jpg','france-3-champagne-ardenne','1');
channelsInfos2.push('France 3 - Via Stella','440','logos/tv_services/France-3-Corse-Color.jpg','france-3-via-stella','1');
channelsInfos2.push('France 3 - Côte d Azur','441','logos/tv_services/France-3-Cote-Azur-Color.jpg','france-3-cote-dazur','1');
channelsInfos2.push('France 3 - Franche-Comté','442','logos/tv_services/France-3-Franche-Comte-Color.jpg','france-3-franche-comte','1');
channelsInfos2.push('France 3 - Haute-Normandie','443','logos/tv_services/France-3-Normandie-Color.jpg','france-3-haute-normandie','1');
channelsInfos2.push('France 3 - Languedoc','444','logos/tv_services/France-3-Languedoc-Roussillon-Color.jpg','france-3-languedoc','1');
channelsInfos2.push('France 3 - Limousin','445','logos/tv_services/France-3-Limousin-Color.jpg','france-3-limousin','1');
channelsInfos2.push('France 3 - Lorraine','446','logos/tv_services/France-3-Lorraine-Color.jpg','france-3-lorraine','1');
channelsInfos2.push('France 3 - Midi-Pyrénées','447','logos/tv_services/France-3-Midi-Pyrenees-Color.jpg','france-3-midi-pyrenees','1');
channelsInfos2.push('France 3 - Nord Pas-de-Calais','448','logos/tv_services/France-3-Nord-pas-de-Calais-Color.jpg','france-3-nord-pas-de-calais','1');
channelsInfos2.push('France 3 - Paris Ile-de-France','449','logos/tv_services/France-3-Paris-IdF-Color.jpg','france-3-paris-ile-de-france','1');
channelsInfos2.push('France 3 - Pays de Loire','450','logos/tv_services/France-3-Pyas-de-la-Loire-Color.jpg','france-3-pays-de-loire','1');
channelsInfos2.push('France 3 - Picardie','451','logos/tv_services/France-3-Picardie-Color.jpg','france-3-picardie','1');
channelsInfos2.push('France 3 - Poitou-Charentes','452','logos/tv_services/France-3-Poitou-Charentes-Color.jpg','france-3-poitou-charentes','1');
channelsInfos2.push('France 3 - Provence Alpes','453','logos/tv_services/France-3-Provence-Alpes-Color.jpg','france-3-provence-alpes','1');
channelsInfos2.push('France 3 - Rhône-Alpes','454','logos/tv_services/France-3-Rhone-Alpes-Color.jpg','france-3-rhone-alpes','1');
channelsInfos2.push('France 3 Nouvelle Aquitaine','455','logos/tv_services/France-3-Nouvelle-Aquitaine-Color.jpg','france-3-nouvelle-aquitaine','1');
channelsInfos2.push('Canal 21','457','logos/tv_services/Canal_21_color.png','canal-21','0');
channelsInfos2.push('20 Minutes TV','461','img/apps/chaines/logos/20mnTV100x100.png','20-minutes-tv','0');
channelsInfos2.push('Télé Bocal','464','logos/tv_services/Tele_Bocal_color.png','tele-bocal','1');
channelsInfos2.push('vià93','467','img/apps/chaines/logos/Via93100x100.png','via93','0');
channelsInfos2.push('Figaro TV IDF','468','img/apps/chaines/logos/LEFIGARO100x100couleur.png','figaro-tv-idf','0');
channelsInfos2.push('TV78','469','img/apps/chaines/logos/TV78100x100COULEUR.png','tv78','0');
channelsInfos2.push('Lyon Capitale TV','476','img/apps/chaines/logos/lyoncapitaletv1100x100couleur.png','lyon-capitale-tv','0');
channelsInfos2.push('Télé Grenoble','477','img/apps/chaines/logos/LogoTlgrenoble100x100.png','tele-grenoble','0');
channelsInfos2.push('TL7','478','logos/tv_services/TL7_Saint_etienne_color.png','tl7','0');
channelsInfos2.push('8 Mont Blanc','480','logos/tv_services/8_Mont_Blanc_color.png','8-mont-blanc','0');
channelsInfos2.push('IL TV','481','logos/tv_services/IL_TV_color.png','il-tv','0');
channelsInfos2.push('ASTV','482','img/apps/chaines/logos/ASTV100x100couleuir.png','astv','1');
channelsInfos2.push('TELEGOHELLE','485','logos/tv_services/TELEGOHELLE_color.png','telegohelle','0');
channelsInfos2.push('Wéo Picardie','486','img/apps/chaines/logos/WeoPicardie100x100.png','weo-picardie','1');
channelsInfos2.push('Wéo TV, La voix du nord','487','img/apps/chaines/logos/WEOLAVDN100x100.png','weo-tv-la-voix-du-nord','0');
channelsInfos2.push('Vià MATÉLÉ','489','img/apps/chaines/logos/viamatele100x100couleur.png','via-matele','1');
channelsInfos2.push('7 A LIMOGES','490','logos/tv_services/7_A_LIMOGES_color.png','7-a-limoges','0');
channelsInfos2.push('TV7 Bordeaux','491','logos/tv_services/TV7_Bordeaux_color.png','tv7-bordeaux','0');
channelsInfos2.push('TVPI','492','img/apps/chaines/logos/Tvpilogojaunealpha100x100.png','tvpi','1');
channelsInfos2.push('KANALDUDE','496','img/apps/chaines/logos/Kanaldude100x100fondblanc.png','kanaldude','1');
channelsInfos2.push('TV2COM','501','img/apps/chaines/logos/100x100tv2com.png','tv2com','1');
channelsInfos2.push('NA TV','504','img/apps/chaines/logos/NATV100x100couleur.png','na-tv','1');
channelsInfos2.push('Canal 32','505','logos/tv_services/Canal_32_color.png','canal-32','0');
channelsInfos2.push('VIA Mirabelle','506','logos/tv_services/VIA_Mirabelle_color.png','via-mirabelle','0');
channelsInfos2.push('Puissance TV','507','img/apps/chaines/logos/PUISSANCETV100x100.png','puissance-tv','1');
channelsInfos2.push('TVMonaco','511','img/apps/chaines/logos/TVMonaco100x100.png','tvmonaco','1');
channelsInfos2.push('Mosaïk Cristal','512','logos/tv_services/Mosaik_color.png','mosaik-cristal','0');
channelsInfos2.push('TV8 Moselle-Est','513','logos/tv_services/TV8_Moselle_Est_color.png','tv8-moselle-est','0');
channelsInfos2.push('Vosges tv','514','img/apps/chaines/logos/VOSGES100x100couleur.png','vosges-tv','0');
channelsInfos2.push('Cannes Lérins TV','515','img/apps/chaines/logos/CannesLerins100x100.png','cannes-lerins-tv','1');
channelsInfos2.push('Maritima TV','520','logos/tv_services/Maritima_TV_color.png','maritima-tv','0');
channelsInfos2.push('MAURIENNE TV','522','img/apps/chaines/logos/mauriennetv100x100.png','maurienne-tv','1');
channelsInfos2.push('Angers télé','523','img/apps/chaines/logos/AngersTV100x100.png','angers-tele','0');
channelsInfos2.push('Télénantes','524','logos/tv_services/Telenantes_color.png','telenantes','0');
channelsInfos2.push('TV Vendée','525','logos/tv_services/TV_Vendee_color.png','tv-vendee','0');
channelsInfos2.push('LMtv Sarthe','526','img/apps/chaines/logos/LMTV100x100.png','lmtv-sarthe','1');
channelsInfos2.push('TEBEO','529','img/apps/chaines/logos/TEBEOcolor1.png','tebeo','1');
channelsInfos2.push('TV RENNES 35','530','img/apps/chaines/logos/TVRennes35100x100couleur.png','tv-rennes-35','1');
channelsInfos2.push('TV Tours','533','logos/tv_services/TV_Tours_color.png','tv-tours','0');
channelsInfos2.push('ZOUK TV','536','logos/tv_services/ZOUK_TV_color.png','zouk-tv','0');
channelsInfos2.push('Télé Paese','537','logos/tv_services/Tele_Paese_color.png','tele-paese','0');
channelsInfos2.push('CNN International','541','logos/tv_services/CNN_International_color.png','cnn-international','1');
channelsInfos2.push('BBC NEWS','542','img/apps/chaines/logos/BBCNews100x100.png','bbc-news','0');
channelsInfos2.push('France 24 Anglais','543','logos/tv_services/France_24_English_color.png','france-24-anglais','1');
channelsInfos2.push('CNBC Europe','544','logos/tv_services/CNBC_EUROPE_color.png','cnbc-europe','0');
channelsInfos2.push('Bloomberg PAN-European','545','logos/tv_services/Bloomberg_PAN_European_color.png','bloomberg-pan-european','0');
channelsInfos2.push('Al Jazeera English','546','logos/tv_services/Al_Jazeera_English_color.png','al-jazeera-english','0');
channelsInfos2.push('i24 News Anglais','547','logos/tv_services/I24_NEWS_ENGLISH_color.png','i24-news-anglais','1');
channelsInfos2.push('NHK WORLD-JAPAN','548','logos/tv_services/NHK_WORLD_JAPAN_color.png','nhk-world-japan','1');
channelsInfos2.push('Sky News','549','logos/tv_services/Sky_News_color.png','sky-news','0');
channelsInfos2.push('TGCOM24','550','img/apps/chaines/logos/LogoTGCOM100x100couleur.png','tgcom24','1');
channelsInfos2.push('i24 News Arabe','555','logos/tv_services/I24_NEWS_ARABIC_color.png','i24-news-arabe','1');
channelsInfos2.push('France 24 Arabe','556','logos/tv_services/France_24_Arabic_color.png','france-24-arabe','1');
channelsInfos2.push('Medi1TV','558','logos/tv_services/Medi1TV_color.png','medi1tv','0');
channelsInfos2.push('AL ARABIYA','559','img/apps/chaines/logos/AlArabiya100x100.png','al-arabiya','0');
channelsInfos2.push('Ennahar TV','561','logos/tv_services/Ennahar_TV_color.png','ennahar-tv','0');
channelsInfos2.push('Canal 11','568','img/apps/chaines/logos/Channel11100x100fondblanc.png','canal-11','0');
channelsInfos2.push('France 24 Espanol','573','img/apps/chaines/logos/FR24esp100x100.png','france-24-espanol','1');
channelsInfos2.push('24h','574','logos/tv_services/24H_TVE_color.png','24h','0');
channelsInfos2.push('TVE','575','logos/tv_services/TVEI_color.png','tve','0');
channelsInfos2.push('DW-TV','578','logos/tv_services/DW_TV_color.png','dw-tv','0');
channelsInfos2.push('WELT','579','logos/tv_services/WELT_color.png','welt','0');
channelsInfos2.push('Record News','586','logos/tv_services/Record_News_color.png','record-news','0');
channelsInfos2.push('Africa 24','595','logos/tv_services/Africa_24_color.png','africa-24','0');
channelsInfos2.push('Canal2','597','logos/tv_services/Canal2_color.png','canal2','0');
channelsInfos2.push('V+','602','img/apps/chaines/logos/V100x100.png','v','0');
channelsInfos2.push('Porto Canal','604','logos/tv_services/Porto_Canal_color.png','porto-canal','0');
channelsInfos2.push('Local Visao','605','logos/tv_services/Local_Visao_color.png','local-visao','0');
channelsInfos2.push('Benfica TV','608','logos/tv_services/Benfica_TV_color.png','benfica-tv','0');
channelsInfos2.push('A BOLA TV','609','logos/tv_services/A_BOLA_TV_color.png','a-bola-tv','0');
channelsInfos2.push('Canal Q','622','logos/tv_services/Canal_Q_color.png','canal-q','0');
channelsInfos2.push('RTPI','624','logos/tv_services/RTPI_color.png','rtpi','0');
channelsInfos2.push('Rai Uno','626','img/apps/chaines/logos/rai1100x100.png','rai-uno','0');
channelsInfos2.push('RAI SCUOLA','629','logos/tv_services/rai-scuola-100x100-couleur.png','rai-scuola','0');
channelsInfos2.push('RAI STORIA','630','logos/tv_services/rai-storia-100x100-couleur.png','rai-storia','0');
channelsInfos2.push('REAL MADRID TV','645','img/apps/chaines/logos/RealMadridTV100x100couleur.png','real-madrid-tv','0');
channelsInfos2.push('STAR TVE','646','img/apps/chaines/logos/StarTVE100x100.png','star-tve','0');
channelsInfos2.push('ALL FLAMENCO_','650','img/apps/chaines/logos/AllFlamenco100x100.png','all-flamenco','0');
channelsInfos2.push('TVG EUROPA','651','logos/tv_services/TVG_EUROPA_color.png','tvg-europa','0');
channelsInfos2.push('etb basque','655','img/apps/chaines/logos/ETBBasque2022logo100x100couleur.png','etb-basque','0');
channelsInfos2.push('TELE MADRID','657','img/apps/chaines/logos/TeleMadrid100x100couleur.png','tele-madrid','0');
channelsInfos2.push('ANDALUCIA TV','658','img/apps/chaines/logos/AndaluciaTV100x100.png','andalucia-tv','0');
channelsInfos2.push('Boomerang Anglais','664','img/apps/chaines/logos/Boomerang100x100.png','boomerang-anglais','0');
channelsInfos2.push('FilmBox Arthouse','665','img/apps/chaines/logos/FILMBOX100x100.png','filmbox-arthouse','0');
channelsInfos2.push('TCM Anglais','666','img/apps/chaines/logos/TCM100x100.png','tcm-anglais','0');
channelsInfos2.push('TinyTeen','667','img/apps/chaines/logos/TinyTeen100x100.png','tinyteen','0');
channelsInfos2.push('Lang Lab','668','img/apps/chaines/logos/LangLab100x100.png','lang-lab','0');
channelsInfos2.push('Lingo Toons','669','img/apps/chaines/logos/LingoToons100x100.png','lingo-toons','0');
channelsInfos2.push('DocuBox HD','670','img/apps/chaines/logos/DOCUBOX100x100.png','docubox-hd','0');
channelsInfos2.push('FashionBox HD','671','img/apps/chaines/logos/FASHION100x100.png','fashionbox-hd','0');
channelsInfos2.push('ProSieben','673','logos/tv_services/ProSieben_color.png','prosieben','0');
channelsInfos2.push('N-TV','674','logos/tv_services/N_TV_color.png','n-tv','0');
channelsInfos2.push('RTL Television','675','img/apps/chaines/logos/RTLlogocollection06cmyk100x100.png','rtl-television','0');
channelsInfos2.push('RTL2','676','logos/tv_services/RTL2_color.png','rtl2','0');
channelsInfos2.push('Super RTL','678','logos/tv_services/Super_RTL_color.png','super-rtl','0');
channelsInfos2.push('VOX','680','logos/tv_services/Vox_color.png','vox','0');
channelsInfos2.push('KABEL EINS','682','logos/tv_services/KABEL_EINS_color.png','kabel-eins','0');
channelsInfos2.push('RTL NITRO TV','685','logos/tv_services/RTL_NITRO_TV_color.png','rtl-nitro-tv','0');
channelsInfos2.push('Arte Allemand','686','logos/tv_services/Arte_Allemand_color.png','arte-allemand','0');
channelsInfos2.push('TVP Polonia','700','logos/tv_services/TVP_Polonia_color.png','tvp-polonia','0');
channelsInfos2.push('Armenia 1','713','logos/tv_services/Armenia_1_color.png','armenia-1','0');
channelsInfos2.push('ART CINEMA','733','img/apps/chaines/logos/ARTCINEMA100x100couleur.png','art-cinema','0');
channelsInfos2.push('ART AFLAM 1','734','img/apps/chaines/logos/ARTAFLAM1100x100couleur.png','art-aflam-1','0');
channelsInfos2.push('ART AFLAM 2','735','img/apps/chaines/logos/ARTAFLAM2100x100couleur.png','art-aflam-2','0');
channelsInfos2.push('AL HEKAYAT 1','736','img/apps/chaines/logos/AlHekayat100x100.png','al-hekayat-1','0');
channelsInfos2.push('AL HEKAYAT 2','737','img/apps/chaines/logos/ALHEKAYAT2100x100couleur.png','al-hekayat-2','0');
channelsInfos2.push('TV Romania International','738','logos/tv_services/TV_Romania_International_color.png','tv-romania-international','0');
channelsInfos2.push('Bahia TV','739','img/apps/chaines/logos/Bahia100x100Couleur.png','bahia-tv','0');
channelsInfos2.push('Télé Maroc','740','img/apps/chaines/logos/telemaroc100x100color.png','tele-maroc','0');
channelsInfos2.push('Canal Algérie','742','logos/tv_services/Canal_Algerie_color.png','canal-algerie','0');
channelsInfos2.push('Beur FM TV','746','logos/tv_services/Beur_FM_TV_color.png','beur-fm-tv','0');
channelsInfos2.push('2M Maroc','749','logos/tv_services/2M_Maroc_color.png','2m-maroc','0');
channelsInfos2.push('Al Aoula','750','logos/tv_services/Al_Aoula_color.png','al-aoula','0');
channelsInfos2.push('Arryadia','751','logos/tv_services/Arryadia_color.png','arryadia','0');
channelsInfos2.push('Assadissa','752','logos/tv_services/Assadissa_color.png','assadissa','0');
channelsInfos2.push('Watania 2','758','img/apps/chaines/logos/Watania2100x100Couleur.png','watania-2','0');
channelsInfos2.push('Tunisia 1','759','logos/tv_services/Tunisia_1_color.png','tunisia-1','0');
channelsInfos2.push('Asharq News','760','img/apps/chaines/logos/ASHARQNEWS100x100COULEUR.png','asharq-news','1');
channelsInfos2.push('Berbère TV','765','logos/tv_services/Berbere_TV_color.png','berbere-tv','0');
channelsInfos2.push('Sky News Arabia','767','img/apps/chaines/logos/SKYNEWSARABIA100x100COULEUR.png','sky-news-arabia','0');
channelsInfos2.push('CHADA TV','768','img/apps/chaines/logos/CHADATV100x100.png','chada-tv','0');
channelsInfos2.push('Rotana Comedy','769','img/apps/chaines/logos/RotanaComedy100x100.png','rotana-comedy','0');
channelsInfos2.push('HELWA TV','770','img/apps/chaines/logos/100x100couleur.png','helwa-tv','0');
channelsInfos2.push('Alaraby 1','773','img/apps/chaines/logos/alaraby100x100.png','alaraby-1','0');
channelsInfos2.push('Echorouk News','774','logos/tv_services/Echorouk_News_color.png','echorouk-news','0');
channelsInfos2.push('El Bilad TV','775','logos/tv_services/elbiladtv-100x100.png','el-bilad-tv','0');
channelsInfos2.push('Dizi','776','img/apps/chaines/logos/DIZI100x100COULEUR.png','dizi','0');
channelsInfos2.push('Alaraby 2','777','img/apps/chaines/logos/Alaraby2100x100Couleur.png','alaraby-2','0');
channelsInfos2.push('Rotana Aflam+','778','img/apps/chaines/logos/RotanaAflam100x100.png','rotana-aflam','0');
channelsInfos2.push('Rotana Cinéma+ FR','779','img/apps/chaines/logos/RatanaCinama100x100Couleur.png','rotana-cinema-fr','0');
channelsInfos2.push('Rotana Music','780','img/apps/chaines/logos/RotanaMusic100x100.png','rotana-music','0');
channelsInfos2.push('Rotana Kids','782','img/apps/chaines/logos/RotanaKids100x100.png','rotana-kids','0');
channelsInfos2.push('Rotana Cinema','783','logos/tv_services/Rotana_Cinema_color.png','rotana-cinema','0');
channelsInfos2.push('Rotana Classic','784','img/apps/chaines/logos/ROTANACLASSIC100x100COULEUR.png','rotana-classic','0');
channelsInfos2.push('Nessma','785','logos/tv_services/Nessma_color.png','nessma','0');
channelsInfos2.push('DMC','786','img/apps/chaines/logos/DMC100x100color.png','dmc','0');
channelsInfos2.push('Fix and Foxi','787','img/apps/chaines/logos/FOXETFOXI100x100color.png','fix-and-foxi','0');
channelsInfos2.push('Carthage+','788','img/apps/chaines/logos/carthage100x100color.png','carthage','0');
channelsInfos2.push('DMC Drama','789','img/apps/chaines/logos/dmcdrama100x100color.png','dmc-drama','0');
channelsInfos2.push('Iqraa International','790','logos/tv_services/Iqraa_International_color.png','iqraa-international','0');
channelsInfos2.push('Iqraa TV','791','logos/tv_services/Iqraa_TV_color.png','iqraa-tv','0');
channelsInfos2.push('Al Majd Holy Quran','792','logos/tv_services/Al_Majd_Holy_Quran_color.png','al-majd-holy-quran','0');
channelsInfos2.push('Al Maghribia','798','logos/tv_services/Al_Maghribia_color.png','al-maghribia','0');
channelsInfos2.push('Arrabiâ','799','logos/tv_services/Arrabia_color.png','arrabia','0');
channelsInfos2.push('LBC Sat','801','img/apps/chaines/logos/LBC_100x100-couleur.png','lbc-sat','0');
channelsInfos2.push('Lana TV','802','img/apps/chaines/logos/LanaTV100x100.png','lana-tv','1');
channelsInfos2.push('Murr TV','805','logos/tv_services/Murr_TV_color.png','murr-tv','0');
channelsInfos2.push('Rotana M+','806','img/apps/chaines/logos/Rotana-M+_100x100-couleur.png','rotana-m','0');
channelsInfos2.push('Dubaï TV','807','logos/tv_services/Dubai_TV_color.png','dubai-tv','0');
channelsInfos2.push('ON TV','809','img/apps/chaines/logos/ontv100x100color.png','on-tv','0');
channelsInfos2.push('HANNIBAL TV','810','logos/tv_services/HANNIBALTV-100x100.png','hannibal-tv','0');
channelsInfos2.push('Al Masriya','813','logos/tv_services/Al_Masriya_color.png','al-masriya','0');
channelsInfos2.push('The Israeli Network','814','logos/tv_services/The_Israeli_Network_color.png','the-israeli-network','0');
channelsInfos2.push('Jordan Satellite Channel','815','logos/tv_services/Jordan_Satellite_Channel_color.png','jordan-satellite-channel','0');
channelsInfos2.push('Euro Star','818','img/apps/chaines/logos/EUROSTAR100x100.png','euro-star','0');
channelsInfos2.push('Euro D','819','img/apps/chaines/logos/eurod100x100.png','euro-d','0');
channelsInfos2.push('BEIN MOVIES','821','logos/tv_services/beinmovies-100x100-couleur.png','bein-movies','0');
channelsInfos2.push('SHOW MAX','822','logos/tv_services/showmax-100x100-couleur.png','show-max','0');
channelsInfos2.push('ATV Avrupa','824','img/apps/chaines/logos/ATVAVRUPA100x100.png','atv-avrupa','0');
channelsInfos2.push('KANAL 7 AVRUPA','825','logos/tv_services/avrupa-100x100-couleur.png','kanal-7-avrupa','0');
channelsInfos2.push('ORTB','839','logos/tv_services/ORTB_color.png','ortb','0');
channelsInfos2.push('NOVELAS','840','img/apps/chaines/logos/100x100couleurNOVELAS.png','novelas','0');
channelsInfos2.push('CRTV','841','logos/tv_services/CRTV_color.png','crtv','0');
channelsInfos2.push('CHERIFLA TV','844','img/apps/chaines/logos/100x100Cherifla.png','cherifla-tv','0');
channelsInfos2.push('ORTC','845','logos/tv_services/ORTC_color.png','ortc','0');
channelsInfos2.push('TV Congo','846','logos/tv_services/TV_Congo_color.png','tv-congo','0');
channelsInfos2.push('Maboke TV','847','img/apps/chaines/logos/MABOKE_TV_100x100-COULEUR.png','maboke-tv','0');
channelsInfos2.push('RTNC','848','logos/tv_services/RTNC_color.png','rtnc','0');
channelsInfos2.push('NCI','849','img/apps/chaines/logos/NCI100x100couleurNCI.png','nci','0');
channelsInfos2.push('RTI 1','851','img/apps/chaines/logos/RTI1100x100Couleur.png','rti-1','0');
channelsInfos2.push('CDIRECT','852','img/apps/chaines/logos/100x100couleurCDIRECT.png','cdirect','0');
channelsInfos2.push('Gabon 1ère','853','img/apps/chaines/logos/GABON_1ERE_100x100_COULEUR.png','gabon-1ere','0');
channelsInfos2.push('RTG','854','img/apps/chaines/logos/RTG100x100COULEUR.png','rtg','0');
channelsInfos2.push('TVM','855','logos/tv_services/TVM_color.png','tvm','0');
channelsInfos2.push('ORTM','856','img/apps/chaines/logos/ORTM100x100Couleur.png','ortm','0');
channelsInfos2.push('Nollywood TV','858','img/apps/chaines/logos/NollywoodTV100x100.png','nollywood-tv','0');
channelsInfos2.push('Pulaagu','859','img/apps/chaines/logos/PULAAGU100x100.png','pulaagu','0');
channelsInfos2.push('Trace Africa','861','logos/tv_services/Trace_Africa_color.png','trace-africa','0');
channelsInfos2.push('Vox Africa','862','logos/tv_services/Vox_Africa_color.png','vox-africa','0');
channelsInfos2.push('2STV','863','logos/tv_services/2STV_color.png','2stv','0');
channelsInfos2.push('RTS 1','864','logos/tv_services/RTS_1_color.png','rts-1','0');
channelsInfos2.push('TFM','866','logos/tv_services/TFM_color.png','tfm','0');
channelsInfos2.push('SUNU YEUF','867','img/apps/chaines/logos/100x100couleurSUNUYEUF.png','sunu-yeuf','0');
channelsInfos2.push('Beijing TV','878','logos/tv_services/Beijing_TV_color.png','beijing-tv','0');
channelsInfos2.push('CCTV YuLe','879','logos/tv_services/CCTV_YuLe_color.png','cctv-yule','0');
channelsInfos2.push('CCTV-4','880','logos/tv_services/CCTV_4_color.png','cctv-4','0');
channelsInfos2.push('CMC','881','logos/tv_services/CMC_color.png','cmc','0');
channelsInfos2.push('Hunan TV','882','logos/tv_services/Hunan_Satellite_TV_color.png','hunan-tv','0');
channelsInfos2.push('JSBC International','883','logos/tv_services/JSBC_International_color.png','jsbc-international','0');
channelsInfos2.push('Phoenix CNE','884','logos/tv_services/Phoenix_CNE_color.png','phoenix-cne','0');
channelsInfos2.push('Dragon TV','886','logos/tv_services/Dragon_TV_color.png','dragon-tv','0');
channelsInfos2.push('Great Wall Elite','887','img/apps/chaines/logos/GWE100x100couleur.png','great-wall-elite','0');
channelsInfos2.push('Zhejiang Star TV','888','img/apps/chaines/logos/ZHEJIANGSTV100x100couleur.png','zhejiang-star-tv','0');
channelsInfos2.push('GRT GBA Satellite TV','916','img/apps/chaines/logos/GRTGBASatelliteTV100x100couleur.png','grt-gba-satellite-tv','0');
channelsInfos2.push('CGTN-Documentary','918','logos/tv_services/CGTN_Documentary_color.png','cgtn-documentary','0');
channelsInfos2.push('CGTN-Français','920','logos/tv_services/CGTN_Francais_color.png','cgtn-francais','0');
channelsInfos2.push('NTD','921','logos/tv_services/NTD_color.png','ntd','0');
channelsInfos2.push('NHK World Premium','938','img/apps/chaines/logos/NHK-_WORLD_PREMIUM_100x100-couleur.png','nhk-world-premium','0');
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function createDivVideoState()                                                                                                      // Fonction qui crée le bandeau rouge
{
 if ( window.location.href.includes('https://tv.sfr.fr/direct-tv/') )                                                               // Si l'url est un live
    {
    var div = document.createElement("div");                                                                                        // Création de l'élément
    div.style.top        = "0";                                                                                                     // Position verticale de l'élément  
    div.style.left       = "0";                                                                                                     // Position horizontale de l'élément
    div.style.width      = "10%";                                                                                                   // Largeur de l'élément
    div.style.height     = "40px";                                                                                                  // Hauteur de l'élément
    div.style.position   = "fixed";                                                                                                 // Type de position de l'élément  
    div.style.background = "red";                                                                                                   // Couleur de fond de l'élément (rouge)
    div.style.color      = "white";                                                                                                 // Couleur de la police du texte (blanc) 
    div.style.fontSize   = "32px";                                                                                                  // Taille de la police du texte 
    div.innerHTML        =  videoPlaying;                                                                                           // Texte de l'élément    
    div.style.textAlign  = "center";                                                                                                // Position du texte de l'élément     
    div.style.zIndex     = zindex1;                                                                                                 // Mettre au premier plan l'élément
    div.setAttribute('id', 'divVideoState');                                                                                        // Définir un id pour retrouver l'élément  
    document.body.appendChild(div);                                                                                                 // Ajouter l'élément 
   
    setTimeout( () => { document.getElementById("divVideoState").remove(); },1000);                                                 // Supression de l'élément au bout de 1s   
    } 
}  
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function createRedDivFunc()                                                                                                         // Fonction qui crée le bandeau rouge
{
 if ( window.location.href.includes('https://tv.sfr.fr/direct-tv/') )// Si l'url est un live
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
    html1 = html1.replace("https://tv.sfr.fr/direct-tv/", "");                                                                        // Remplacement de "https://tv.sfr.fr/channel/" par rien afin d'obtenir un nombre
    html1 = html1.replace(";play=true", "");                                                                                        // Remplacement 
                    
    for ( var i=0; i<channelsInfos2.length/dataStep; i++ )                                                                          // Boucle qui parcourt le tableau channelsInfos2
        if ( channelsInfos2[dataStep*i+3] == html1 )                                                                                // Si l'occurence (pas de 3) du tableau est égale au fameux nombre qui finit l'url 
           { 
           html1 = channelsInfos2[dataStep*i];                                                                                      // html1 vaut le nom de la chaine tv
           break;                                                                                                                   // Stopper la boucle 
           }     
    
    var canGetTitle = document.querySelector(".info h1") !== null;                                                                  // Vérifier que le programme existe
    if ( canGetTitle )   
       html1 += " - "+document.querySelector(".info h1").innerHTML;                                                                 // L'ajouter si il existe

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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function mykeyupFunc(event)                                                                                                         // Fonction éxécutée lorsqu'une touche est relachée
{   
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Modifier les chaines du tableau vignettes
if ( event.key === "v" )                                                                                                            // Si la touche relachée est "f"   
if (    window.location.href.includes('https://tv.sfr.fr/content/') 
     || window.location.href.includes('https://tv.sfr.fr/direct-tv/') )                                                             // Si l'url est un live ou un replay 
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
            
          if ( channelsInfos2[dataStep*u+4] == 1 )                                                                    
             {                 
             //addStuff += ' style="background-color:rgba(0,0,255,0.5);" '; 
             //addStuff += ' style="background-color:#0000FF80;" '; 
             addStuff += ' style="background-color:blue;opacity:0.8;" '; 
             }   
          else 
             { 
             addStuff += ' style="background-color:white;opacity:0.8;" ';   
             }
             
         //var folder = "";                                                                                                         // Variable pour le dossier de l'image                   
         //if ( channelsInfos2[dataStep*u+2]  == "1" ) folder = "logos/tv_services/";                                               // Deux dossiers possibles pour les images
         // else  folder = "img/apps/chaines/logos/";    
                              
         var nameChannel = channelsInfos2[dataStep*u+0];                                                                            // Variable pour le titre de l'image                 
              
         htmlCodeChannelTabConfig += '<td'+ addStuff + ' ';                                                                         // Ajout d'une cellule
           
         htmlCodeChannelTabConfig += 'onclick="';                                                                                   // Fonction click de la cellule
         //htmlCodeChannelTabConfig += 'this.style.backgroundColor = this.style.backgroundColor==\'#0000FF80\'? \'#FFFFFF80\':\'#0000FF80\';';         
         htmlCodeChannelTabConfig += 'this.style.backgroundColor = this.style.backgroundColor==\'white\'? \'blue\':\'white\'; ';    // Changer de couleur au clic
         htmlCodeChannelTabConfig +=  '">';           
         htmlCodeChannelTabConfig += '<img style="opacity:1;background-color:white;" width="' + imgChannelWidthConfig ;             // Image de la chaine 
         htmlCodeChannelTabConfig += 'px" src="http://static-cdn.tv.sfr.net/data/';                                                 // Image de la chaine     
         htmlCodeChannelTabConfig +=  channelsInfos2[dataStep*u+2] + '" title="' + nameChannel + '">';                     // Image de la chaine 
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
             channelsInfos2[dataStep*(u-1)+4] = '0';                                                                                // Changement de valeur 
             myChannelConfig += ''+0;                                                                                               // Ajout d'un 0
             } 
          else
             { 
             channelsInfos2[dataStep*(u-1)+4] = '1';                                                                                // Changement de valeur 
             myChannelConfig += ''+1;                                                                                               // Ajout d'un 1  
             } 
            
          if ( (u) % 4 == 0  )                                                                                                      // Si le modulo vaut 0 , une suite de 4 '0' ou '1' est obtenue
             {                          
             myChannelConfigTemp += ''+channelsInfos2[dataStep*(u-1)+4];                                                            // Changement de la variable
             myChannelConfig2 += ''+parseInt(myChannelConfigTemp,2).toString(16);                                                   // La suite de 4 '0' ou '1' est transformé en valeur héxadécimale  
             //console.log(u);  
             //console.log(myChannelConfigTemp);
             myChannelConfigTemp = '';                                                                                              // Réinitialisation de la variable 
             } 
          else
             {
             //console.log(myChannelConfigTemp);
             myChannelConfigTemp += ''+channelsInfos2[dataStep*(u-1)+4];                                                            // Concaténation
             }
          }  
       
      if ( myChannelConfigTemp != '' ) localStorage.setItem("myChannelConfigStored",myChannelConfig2+'_'+myChannelConfigTemp);      // Config sauvegardée localement    
      else  localStorage.setItem("myChannelConfigStored",myChannelConfig2);

      document.getElementById("ChannelTabConfig").remove();                                                                         // Suppression du tableau des chaines
      channelTabAddedConfig = false;                                                                                                // Variable indiquant que le tableau des chaines n'est pas affiché
      }     
   } 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Fonction vignettes des chaines 
if (    window.location.href.includes('https://tv.sfr.fr/content/') 
     || window.location.href.includes('https://tv.sfr.fr/direct-tv/') )                                                             // Si l'url est un live ou un replay
if ( event.code === "NumpadEnter" || event.code === "ControlLeft")                                                                  // Si la touche relachée est "entrée" du pavé numérique ou contrôle gauche
   {  
   if ( channelTabAdded == false )                                                                                                  // Si le tableau des chaines n'est pas affiché
      {        
      var htmlCodeChannelTab = '<table style="background-color:rgba(255, 255, 255, 0.7);" cellspacing=10 cellpadding=10>';          // Variable qui contiendra le code html du tableau
        
      if ( 'nbColumnChannelTab' in localStorage ) nbColumnChannelTab = localStorage.getItem('nbColumnChannelTab');                  // Si la variable est stockée , remplacer celle par défaut
      if ( 'imgChannelWidth' in localStorage ) imgChannelWidth = localStorage.getItem('imgChannelWidth');                           // Si la variable est stockée , remplacer celle par défaut
        
      let nbAddedColumns = 0;             
      for ( var u=0; u<channelsInfos2.length/dataStep; u++ )                                                                        // Boucle    
          if ( channelsInfos2[dataStep*u+4] == 1 )                                                                    
             {                                                                                                 
             //var folder = "";                                                                                                     // Variable pour le dossier de l'image   
             //if ( channelsInfos2[dataStep*u+2]  == "1" ) folder = "logos/tv_services/";                                           // Deux dossiers possibles pour les images
             //else  folder = "img/apps/chaines/logos/";    
                              
             var nameChannel = channelsInfos2[dataStep*u+0];                                                                        // Variable pour le titre de l'image                 
               
             htmlCodeChannelTab += '<div>';
             htmlCodeChannelTab += '<td><a href="https://tv.sfr.fr/direct-tv/' +  channelsInfos2[dataStep*u+3] + '">';              // Lien pointant vers l'url de la chaine
             htmlCodeChannelTab += '<img width="' + imgChannelWidth + 'px" src="http://static-cdn.tv.sfr.net/data/';                // Image de la chaine     
             htmlCodeChannelTab +=  channelsInfos2[dataStep*u+2] + '" title="' + nameChannel + '">';                                // Image de la chaine 
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Logs
if ( event.key === "l" )                                                                                                            // Si la touche relachée est "l"   
if (   window.location.href.includes('https://tv.sfr.fr/direct-tv/')
    || window.location.href.includes('https://tv.sfr.fr/content/') )   // Si l'url est un live ou un replay
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Config
if ( event.key === "c" )                                                                                                            // Si la touche relachée est "C" 
if (   window.location.href.includes('https://tv.sfr.fr/direct-tv/')
    || window.location.href.includes('https://tv.sfr.fr/content/') )                                                                // Si l'url est un live ou un replay ,     
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Pour afficher la chaine suivante
if ( window.location.href.includes('https://tv.sfr.fr/direct-tv/') ) // Si l'url est un live
if ( event.code === "NumpadAdd" || event.code === "ArrowRight")                                                                     // Si la touche relachée est "plus" du pavé numérique ou la flèche droite
   {
   let needIndex = 0; 
   var currentChannelNumber = window.location.href.replace('https://tv.sfr.fr/direct-tv/','').replace(";play=true", "");             // Obtenir le nombre à la fin de l'url  
     
   for ( var i=0; i<channelsInfos2.length/dataStep; i++ )                                                                           // Parcourir le tableau        
           
        if ( channelsInfos2[dataStep*i+3] == currentChannelNumber )                                                                  // Si la chaine est trouvée
           { 
           let channelfound = false;
           for ( var j=i+1; j<channelsInfos2.length/dataStep; j++ )    
               {
               if ( channelsInfos2[dataStep*j+4] == '1' ) 
                  { 
                  if ( (j+1) < channelsInfos2.length/dataStep )                                                                     // Si on ne dépasse la fin du tableau             
                     { 
                     window.location.href = 'https://tv.sfr.fr/direct-tv/'+channelsInfos2[dataStep*j+3] ;                           // Chargement de la prochaine chaine      
                     channelfound = true;
                     } 
                  break;
                  }           
              }  
             
           if ( channelfound == false )
              {
              window.location.href = 'https://tv.sfr.fr/direct-tv/'+channelsInfos2[0+3] ;                                           // Fin du tableau atteinte , chargement de la première chaine    
              break;
              } 
             
           break;  
           }
   
   }     
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Chaine précédente 
if ( window.location.href.includes('https://tv.sfr.fr/direct-tv/') ) // Si l'url est un live
if ( event.code === "NumpadSubtract" || event.code === "ArrowLeft")                                                                 // Si la touche relachée est "moins" du pavé numérique ou la flèche gauche
   {
   let needIndex = 0; 
   var currentChannelNumber = window.location.href.replace('https://tv.sfr.fr/direct-tv/','').replace(";play=true", "");            // Obtenir le nombre à la fin de l'url
   for ( var i=0; i<channelsInfos2.length/dataStep; i++ )                                                                           // Parcourir le tableau        
       if ( channelsInfos2[dataStep*i+3] == currentChannelNumber )                                                                  // Si la chaine est trouvée
           { 
           let channelfound = false;
           for ( var j=i-1; j>=0; j-- )    
               {
               if ( channelsInfos2[dataStep*j+4] == '1' ) 
                  { 
                  if ( (j) >= 0 )                                                                                                   // Si l'index n'est pas négatif              
                     { 
                     window.location.href = 'https://tv.sfr.fr/direct-tv/'+channelsInfos2[dataStep*j+3] ;                           // Chargement de la chaine précédente    
                     channelfound = true;
                     } 
                  break;
                  }           
               }  
             
           if ( channelfound == false )        
              for ( var j=channelsInfos2.length/dataStep; j>=0; j-- )                
                  if ( channelsInfos2[dataStep*j+4] == '1' ) 
                     {
                     window.location.href = 'https://tv.sfr.fr/direct-tv/'+channelsInfos2[dataStep*j+3];                            // Début du tableau atteint , chargement de la dernière chaine     
                     break;
                     }
           break;  
           }
   }   
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Fonction changement de chaines
if (    window.location.href.includes('https://tv.sfr.fr/direct-tv/')
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
                             console.log("----- login");  
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Fonction plein écran ou fenêtre
if (   window.location.href.includes('https://tv.sfr.fr/direct-tv/')
    || window.location.href.includes('https://tv.sfr.fr/content/')   )                                                              // Si l'url est un live ou un replay
if ( event.code === "NumpadDecimal" || event.code === "ShiftLeft")                                                                  // Si la touche relachée est "." du pavé numérique ou maj gauche
   {   
   var fullScreenElement = document.fullscreenElement;                                                                              // Quel élément est en plein écran
   if ( fullScreenElement == null)                                                                                                  // Si aucun élément est en plein écran
      { 
      //var testElement = document.getElementsByClassName("shaka-container shaka-video-container")[0];                              // Trouver le conteneur vidéo
      var testElement = document.getElementById("shaka-player-video");    
      //var testElement = document.getElementsByClassName("player-container")[0];  
      // var testElement = document.getElementsByTagName("web-player")[0]
        
      if ( typeof(testElement) != 'undefined' || testElement != null )  
         testElement.requestFullscreen();                                                                                           // Passer en plein écran le conteneur vidéo                   
      }
   else 
      document.exitFullscreen();                                                                                                    // Sinon sortir du plein écran      
   }  
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Fonction pour diminuer le son
if (   window.location.href.includes('https://tv.sfr.fr/direct-tv/')
    || window.location.href.includes('https://tv.sfr.fr/content/') )                                                                // Si l'url est un live ou un replay
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  Fonction pour augmenter le son
if (   window.location.href.includes('https://tv.sfr.fr/direct-tv/')
    || window.location.href.includes('https://tv.sfr.fr/content/') )                                                                // Si l'url est un live ou un replay
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
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function myLog(error)                                                                                                               // Fonction qui me permet d'enregistrer les erreurs
{                                                                                                                                   // Au rechargement la console s'efface
let d = new Date();                                                                                                                 // Date
let textDate = d.toLocaleDateString()+' '+d.toLocaleTimeString();                                                                   // Date
let currentChannelUrl = window.location.href.replace('https://tv.sfr.fr/direct-tv/','').replace(";play=true", "");                  // Url  
let currentChannelName = " ";                                                                                                       // Nom
let currentChannelNumber = "";                                                                                                      // Canal

for ( var c=0; c<channelsInfos2.length/dataStep; c++ )                                                                              // Boucle                                                                                 
    if ( currentChannelUrl == channelsInfos2[dataStep*c+3] )                                                                        // Chercher Url
       {
       currentChannelName = channelsInfos2[dataStep*c+0] ;     
       currentChannelNumber = channelsInfos2[dataStep*c+1] ; 
       break;                                                                                                                       // Casser la boucle
       }  
  
if ( window.location.href.includes('https://tv.sfr.fr/?state') )                                                                    // Cas particulier de l'url   
   { 
   currentChannelUrl = "_";                                                                                                         // Variable
   currentChannelName = "_";                                                                                                        // Variable
   }    

let myError = "<td>"+textDate+"<td>"+currentChannelName+"<td>"+currentChannelNumber+"<td>"+error;                                   // Création du code pour une rangée du tableau html
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
}  
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function searchErrorFunc()                                                                                                          // Fonction qui contrôle l'apparition des erreurs
{     
// createDivVideoState();                                                                                                           // Afficher l'état du lecteur vidéo  
window.document.body.addEventListener('keyup', mykeyupFunc);                                                                        // Gestion des touches 
var connectState = false;   
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if ( !window.location.href.includes('https://www.sfr.fr/cas/login?service=https') )  
   if ( document.getElementsByTagName("gen8-profile").length > 0 )
      {
      if ( document.getElementsByTagName("gen8-profile")[0].getAttribute("pn") == "Se connecter" )
         {
         myLog("Se connecter");
         document.getElementsByTagName("gen8-profile")[0].children[0].click();
         }
      else connectState = true;           
      }
   else
      {
      myLog("No profile");                                                                                                          // Log Fonction                     
      setTimeout( () => { location.reload(); },1000);      
      }    
  
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if ( window.location.href.includes('https://www.sfr.fr/cas/login?service=https'))                                                   // Si c'est une redirection vers la connexion ( 1ère visite du site , session expirée )
   { 
   if ( 'myUserName' in localStorage  && 'myPassword' in localStorage ) 
      {
      if ( document.getElementById("username").getAttribute("type") != "hidden" )   
         document.getElementById("username").value = localStorage.getItem('myUserName');                                            // Remplir le mail de l'utilisateur
        
      document.getElementById("password").value = localStorage.getItem('myPassword');                                               // Remplir le mot de passe
        
      setTimeout(function () { document.getElementById("identifier").click(); } ,1500) ;                                            // Attendre x secondes et simuler l'appui sur le bouton
      }              
   }   

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
var Overlay = document.getElementsByClassName("cdk-overlay-container force");                                                       // Tableau pointant vers les éléments ayant pour classes 'cdk-overlay-container' et 'force'     
if ( Overlay.length > 0 )  
   {
   myLog(document.querySelector(".cdk-overlay-container.force web-modal-header").textContent.trim());                               // Texte du '<web-modal-header' (enfant de l'overlay à deux classes)
   setTimeout( () => { location.reload(); },2000);
   }  
//else console.log("no overlay"); 
*/  
var Overlay = document.getElementsByClassName("cdk-overlay-backdrop app-modal-backdrop cdk-overlay-backdrop-showing");              // Tableau pointant vers l'overlay     
if ( Overlay.length > 0 )  
   {
   if ( document.querySelector(".cdk-overlay-backdrop.app-modal-backdrop.cdk-overlay-backdrop-showing web-modal-header") !== null )
       myLog(document.querySelector(".cdk-overlay-backdrop.app-modal-backdrop.cdk-overlay-backdrop-showing web-modal-header").textContent.trim());   // Texte du '<web-modal-header' (enfant de l'overlay à deux classes)
     
   if ( document.querySelector(".cdk-overlay-backdrop.app-modal-backdrop.cdk-overlay-backdrop-showing .modal__title") !== null)
      {
      myLog(document.querySelector(".cdk-overlay-backdrop.app-modal-backdrop.cdk-overlay-backdrop-showing .modal__title").textContent.trim());   // Texte du '<div class="modal__title"' (enfant de l'overlay à deux classes)
      if ( document.querySelector(".cdk-overlay-backdrop.app-modal-backdrop.cdk-overlay-backdrop-showing .modal__title").textContent.trim() == "Session expirée" )
         sessionExpired == true;
      } 
   setTimeout( () => { location.reload(); },1000);    
   }    
  
/*  
cdk-overlay-backdrop app-modal-backdrop cdk-overlay-backdrop-showing  
 -> div class="modal__title">Session expirée</div> 
 -> <web-modal-header ...  erreur XXX
*/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
if ( connectState == true )                                                                                                         // Si l'utilisateur est connecté 
if (    window.location.href.includes('https://tv.sfr.fr/content/') 
     || window.location.href.includes('https://tv.sfr.fr/direct-tv/')                                                               // Si l'url est un live ou un replay   
   )
   {      
   if ( oldUrl != window.location.href && oldUrl != "")                                                                             // Fix lors de l'utilisation de l'interface utilsateur originale (les chaines)
      FirstTimeScriptIsLoaded = true; 
  
   if ( FirstTimeScriptIsLoaded == true )                                                                                           // Si la variable est définie sur vrai
      {        
      oldUrl = window.location.href;                                                                                                // Fix lors de l'utilisation de l'interface utilsateur originale (les chaines)
      createRedDivFunc();                                                                                                           // Appel de la fonction qui crée le bandeau rouge  
      FirstTimeScriptIsLoaded = false;
      window.addEventListener("keydown",                                                                                            // Désactiver scroll clavier (besoin pour le volume)
                           function(e) { if ( ["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1 ) e.preventDefault(); }, false);
    
      mainLoopStartTime = Date.now();                                                                                               // Timestamp (nb secondes depuis le 01/01/70) de la 1ère exécution
      video = document.getElementById("shaka-player-video");  //document.querySelector('video');                                    // Trouver le lecteur         
     
      if ( video !== null)                                                                                                          // Si le lecteur est trouvé 
         {    
         //console.log("video");  
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
     
   if ( 'nbloopBeforeBegin' in localStorage )  nbloopBeforeBegin  = localStorage.getItem('nbloopBeforeBegin');                      // Si la variable est stockée , remplacer celle par défaut
   if ( 'nbloopBeforeReload' in localStorage ) nbloopBeforeReload = localStorage.getItem('nbloopBeforeReload');                     // Si la variable est stockée , remplacer celle par défaut
     
     
                                                                                                                                    // Cette partie sert à regarder les dates où le lecteur envoye l'événement "progress"                                                                                                                                 
   if (    debugMode != 1                                                                                                            
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
         
      setTimeout( () => { location.reload(); },1000);                                                                               // Simple rechargement !, le lecteur semble gelé 
      }       
   else  
      {    
      //console.log('progress ' + lastTimeVideoEventProgressEvent); 
      }         
   }    
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if ( 'myChannelConfigStored' in localStorage )                                                                                      // Sauvegarde locale trouvée ?   
   {    
   // localStorage.removeItem("myChannelConfigStored");  
   // 2024/11/29 myChannelConfigStored : ffe9de0001e5bf400000800000e10440000000000000800000000000008000000000000000000000000000000000000_00
     
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
       channelsInfos2[dataStep*u+4] = myChannelConfigStoredReverse.charAt(u);                                                       // Modification des valeurs du tableau avec la sauvegarde locale
   }  
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if ( 'mainLoopDelay' in localStorage ) mainLoopDelay = localStorage.getItem('mainLoopDelay');                                       // Si la variable est stockée , remplacer celle par défaut
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
setInterval(searchErrorFunc, mainLoopDelay);                                                                                        // Eexécution sz la vérification toutes les 'mainloopDelay' ms        
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
if ( window.location.href.includes('https://tv.sfr.fr/direct-tv/')) 
if ( event.key === "z" )  
   {  
   var miniguide = document.getElementsByTagName("gen8-miniguide-item");
     
   for ( var i=0; i< miniguide.length; i++  )                                           
       {  
       var channelNameIndex = miniguide[i].children[1].children[0].title.lastIndexOf("sur ");  
       var channelName      = miniguide[i].children[1].children[0].title.substring(channelNameIndex+4);
         
       var channelNumber    = miniguide[i].children[0].children[0].innerHTML.replace(".","");       
       var channelUrl       = miniguide[i].children[1].children[0].children[0].href.replace("https://tv.sfr.fr/direct-tv/","");  
       var channelImg       = miniguide[i].children[1].children[0].children[0].children[0].children[1].children[0].src;     
         
       var canShow = "1";  
       if ( miniguide[i].children[0].children[1] )
          canShow = "0";       
    
       var temp = 'channelsInfos2.push(\''+channelName+'\',\''+channelNumber+'\',\''+channelImg+'\',\''+channelUrl+'\',\''+canShow+'\'); ';
       var isPresent     = 0;
       for ( var j=0; j< channelsInfos3.length; j++  ) 
           if ( channelsInfos3[j] == temp )
              isPresent = 1;
       if ( isPresent == 0)  
            channelsInfos3.push(temp);     
       }
    
   console.log( channelsInfos3.length );   
   }   
////////////////////////////////////////////////////////////////////////////////////////////   
if ( window.location.href.includes('https://tv.sfr.fr/direct-tv/')) 
if ( event.key === "e" )  
   {   
   console.log( channelsInfos3 ); 
   }
//////////////////////////////////////////////////////////////////////////////////////////// 
if ( window.location.href.includes('https://tv.sfr.fr/direct-tv/')) 
if ( event.key === "r" )  
   {  
   var channelsInfos4 = []; 
   for ( var i=0; i< channelsInfos2.length/dataStep; i++  )   
       for ( var j=0; j< channelsInfos3.length/2; j++  ) 
           if (  channelsInfos2[i*dataStep+1] ==  channelsInfos3[j*2] )
              {                
              channelsInfos4.push('channelsInfos2.push(\''+channelsInfos2[i*dataStep+0]+'\',\''+channelsInfos2[i*dataStep+1]+'\',\''+channelsInfos2[i*dataStep+2]+'\',\''+channelsInfos2[i*dataStep+3]+'\',\''+channelsInfos2[i*dataStep+4]+'\',\''+channelsInfos2[i*dataStep+5]+'\',\''+channelsInfos3[j*2+1]+'\'); ');                
              } 
   console.log( channelsInfos4 ); 
   }  
*/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////