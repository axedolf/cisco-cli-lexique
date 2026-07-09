const CISCO_DATA = {
  themes: [
    { id: "base", name: "Demarrage et modes CLI", accent: "#2f6f73" },
    { id: "interfaces", name: "Interfaces physiques et logiques", accent: "#536d25" },
    { id: "switching", name: "Switching, VLAN et trunks", accent: "#8a5b13" },
    { id: "routing", name: "Routage IPv4/IPv6", accent: "#6750a4" },
    { id: "ospf", name: "Gestion OSPF", accent: "#7c3aed" },
    { id: "bgp", name: "BGP", accent: "#7e22ce" },
    { id: "qos", name: "QoS", accent: "#b45309" },
    { id: "services", name: "Services reseau", accent: "#0b6bcb" },
    { id: "security", name: "Securite et durcissement", accent: "#9b1c31" },
    { id: "monitoring", name: "Verification et supervision", accent: "#4d6470" },
    { id: "discovery", name: "Equipements connectes aux ports", accent: "#2563eb" },
    { id: "connectivity", name: "Tests ping et connectivite", accent: "#15803d" },
    { id: "quick-diagnostics", name: "Diagnostics rapides Show & Pipe", accent: "#0891b2" },
    { id: "cabling", name: "Diagnostic cables et liens physiques", accent: "#b91c1c" },
    { id: "hardware", name: "Materiel, energie et PoE", accent: "#0f766e" },
    { id: "maintenance", name: "Sauvegarde, image et maintenance", accent: "#6b5b2a" },
    { id: "troubleshoot", name: "Depannage", accent: "#a03b16" },
    { id: "wireless", name: "Notions wireless Cisco", accent: "#007078" },
    { id: "programmability", name: "Automatisation et programmabilite", accent: "#5c6bc0" },
    { id: "emergency", name: "Cheat sheet d'urgence", accent: "#c2410c" }
  ],
  commands: [
    {
      theme: "base", type: "config", level: "base",
      title: "Entrer en mode configuration globale",
      summary: "Point de depart pour modifier la configuration active.",
      commands: ["enable", "configure terminal", "end", "disable"],
      notes: ["Le prompt passe generalement de > a # puis a (config)#.", "Utiliser end ou Ctrl+Z pour revenir au mode privilegie."]
    },
    {
      theme: "base", type: "config", level: "base",
      title: "Nommer l'equipement et desactiver la resolution DNS CLI",
      summary: "Evite les attentes lorsque l'on tape une commande inconnue et identifie clairement l'equipement.",
      commands: ["configure terminal", "hostname SW-CORE-01", "no ip domain-lookup"],
      notes: ["Commande utile en laboratoire comme en production.", "Choisir une convention de nommage stable."]
    },
    {
      theme: "base", type: "config", level: "base",
      title: "Banniere et horodatage des logs",
      summary: "Ajoute un message legal et rend les journaux plus exploitables.",
      commands: ["banner motd # Acces reserve aux personnes autorisees #", "service timestamps log datetime msec localtime show-timezone", "service timestamps debug datetime msec localtime show-timezone"],
      notes: ["Le caractere delimitateur de banner peut etre remplace par un autre symbole absent du texte."]
    },
    {
      theme: "base", type: "verify", level: "base",
      title: "Consulter les configurations",
      summary: "Compare la configuration active et celle sauvegardee au demarrage.",
      commands: ["show running-config", "show startup-config", "show running-config | section line vty", "show running-config interface gi0/1"],
      notes: ["running-config est en RAM; startup-config est chargee au boot."]
    },
    {
      theme: "base", type: "config", level: "base",
      title: "Sauvegarder la configuration",
      summary: "Ecrit la configuration active dans la NVRAM.",
      commands: ["copy running-config startup-config", "write memory"],
      notes: ["La forme copy running-config startup-config est plus explicite et recommandee en documentation."]
    },
    {
      theme: "base", type: "config", level: "base",
      title: "Mots de passe console, enable et VTY",
      summary: "Protege l'acces local et distant de base.",
      commands: ["enable secret MOT_DE_PASSE_FORT", "line console 0", "password MOT_DE_PASSE_CONSOLE", "login", "exit", "line vty 0 15", "password MOT_DE_PASSE_VTY", "login", "exit", "service password-encryption"],
      notes: ["Preferer login local avec comptes nominatifs pour SSH.", "service password-encryption masque les mots de passe de type 7, ce n'est pas un chiffrement fort."]
    },
    {
      theme: "base", type: "config", level: "base",
      title: "Timeout de session CLI",
      summary: "Ferme les sessions inactives automatiquement.",
      commands: ["line console 0", "exec-timeout 10 0", "line vty 0 15", "exec-timeout 10 0"],
      notes: ["exec-timeout 0 0 desactive le timeout, a eviter en production."]
    },
    {
      theme: "interfaces", type: "config", level: "base",
      title: "Configurer une adresse IPv4 sur interface routee",
      summary: "Assigne une adresse et active administrativement le port.",
      commands: ["interface gigabitEthernet0/0", "description WAN vers FAI", "ip address 203.0.113.2 255.255.255.252", "no shutdown"],
      notes: ["Sur un switch L2, les ports sont generalement en mode switchport et ne portent pas d'IP directement."]
    },
    {
      theme: "interfaces", type: "config", level: "intermediaire",
      title: "Convertir un port de switch L3 en port route",
      summary: "Permet d'utiliser un port physique comme interface de routage.",
      commands: ["interface gigabitEthernet1/0/48", "no switchport", "ip address 10.10.255.1 255.255.255.252", "no shutdown"],
      notes: ["Disponible sur switchs multilayer compatibles.", "Verifiez la licence et le modele."]
    },
    {
      theme: "interfaces", type: "verify", level: "base",
      title: "Verifier les interfaces",
      summary: "Affiche etat, IP, vitesse, duplex, erreurs et compteurs.",
      commands: ["show ip interface brief", "show interfaces status", "show interfaces description", "show interfaces gigabitEthernet0/1", "show controllers ethernet-controller gi0/1 phy"],
      notes: ["show interfaces est verbeux mais tres utile pour erreurs CRC, drops, collisions et debit."]
    },
    {
      theme: "interfaces", type: "config", level: "base",
      title: "Configurer une plage de ports",
      summary: "Applique les memes parametres a plusieurs interfaces.",
      commands: ["interface range fastEthernet0/1 - 12", "description Postes utilisateurs", "switchport mode access", "spanning-tree portfast", "no shutdown"],
      notes: ["La syntaxe de range varie selon plateformes: f0/1 - 12 ou f0/1-12."]
    },
    {
      theme: "interfaces", type: "config", level: "base",
      title: "Desactiver et nettoyer un port",
      summary: "Place un port inutilise dans un etat controle.",
      commands: ["interface gigabitEthernet1/0/22", "description UNUSED", "switchport mode access", "switchport access vlan 999", "shutdown"],
      notes: ["Creer un VLAN parking non route peut reduire le risque d'usage accidentel."]
    },
    {
      theme: "interfaces", type: "config", level: "intermediaire",
      title: "Interface loopback",
      summary: "Cree une interface logique stable pour routage, supervision ou identifiant OSPF.",
      commands: ["interface loopback0", "ip address 10.255.0.1 255.255.255.255"],
      notes: ["Une loopback reste up tant que l'equipement fonctionne."]
    },
    {
      theme: "switching", type: "config", level: "base",
      title: "Creer et nommer des VLAN",
      summary: "Ajoute des domaines de broadcast separes.",
      commands: ["vlan 10", "name USERS", "vlan 20", "name VOICE", "vlan 99", "name MANAGEMENT"],
      notes: ["Les VLAN doivent exister avant l'affectation de ports sur beaucoup de plateformes."]
    },
    {
      theme: "switching", type: "config", level: "base",
      title: "Affecter un port a un VLAN d'acces",
      summary: "Configure un port pour un poste, une imprimante ou un equipement non trunk.",
      commands: ["interface gigabitEthernet1/0/10", "switchport mode access", "switchport access vlan 10", "spanning-tree portfast"],
      notes: ["PortFast est adapte aux ports terminaux, pas aux liens entre switchs."]
    },
    {
      theme: "switching", type: "config", level: "intermediaire",
      title: "Configurer voix et data sur un port",
      summary: "Separe le telephone IP et le poste raccorde derriere le telephone.",
      commands: ["interface gigabitEthernet1/0/11", "switchport mode access", "switchport access vlan 10", "switchport voice vlan 20", "spanning-tree portfast"],
      notes: ["Prevoir QoS selon le modele et la politique voix."]
    },
    {
      theme: "switching", type: "verify", level: "base",
      title: "Verifier VLAN et affectations",
      summary: "Controle les VLAN actifs et les ports associes.",
      commands: ["show vlan brief", "show interfaces switchport", "show mac address-table dynamic", "show interfaces status"],
      notes: ["show vlan brief ne montre pas les trunks comme ports membres classiques."]
    },
    {
      theme: "switching", type: "config", level: "intermediaire",
      title: "Configurer un trunk 802.1Q",
      summary: "Transporte plusieurs VLAN entre switchs, routeurs ou pare-feu.",
      commands: ["interface gigabitEthernet1/0/48", "description Trunk vers SW-ACCESS-01", "switchport trunk encapsulation dot1q", "switchport mode trunk", "switchport trunk allowed vlan 10,20,99", "switchport trunk native vlan 999"],
      notes: ["La commande encapsulation n'existe pas sur certains modeles recents.", "Eviter le VLAN 1 comme native VLAN en production."]
    },
    {
      theme: "switching", type: "verify", level: "intermediaire",
      title: "Verifier les trunks",
      summary: "Controle le mode trunk, les VLAN autorises et le native VLAN.",
      commands: ["show interfaces trunk", "show interfaces gi1/0/48 switchport", "show spanning-tree vlan 10"],
      notes: ["Un VLAN peut etre autorise sur trunk mais bloque par STP."]
    },
    {
      theme: "switching", type: "config", level: "intermediaire",
      title: "Desactiver DTP",
      summary: "Force le trunking et evite la negociation automatique.",
      commands: ["interface gigabitEthernet1/0/48", "switchport mode trunk", "switchport nonegotiate"],
      notes: ["Recommande lorsque les deux extremites sont configurees explicitement."]
    },
    {
      theme: "switching", type: "config", level: "avance",
      title: "EtherChannel LACP",
      summary: "Agrege plusieurs liens physiques en un lien logique.",
      commands: ["interface range gi1/0/47 - 48", "channel-group 1 mode active", "exit", "interface port-channel1", "switchport mode trunk", "switchport trunk allowed vlan 10,20,99"],
      notes: ["Les membres doivent avoir vitesse, duplex et configuration compatibles."]
    },
    {
      theme: "switching", type: "verify", level: "avance",
      title: "Verifier EtherChannel",
      summary: "Affiche les bundles, membres et protocoles.",
      commands: ["show etherchannel summary", "show etherchannel port-channel", "show lacp neighbor"],
      notes: ["Dans show etherchannel summary, P indique souvent un port correctement agrege."]
    },
    {
      theme: "switching", type: "config", level: "intermediaire",
      title: "Spanning Tree PortFast et BPDU Guard",
      summary: "Accelere les ports utilisateurs et les protege contre les BPDU inattendus.",
      commands: ["interface range gi1/0/1 - 24", "spanning-tree portfast", "spanning-tree bpduguard enable"],
      notes: ["A appliquer sur ports d'acces vers terminaux uniquement."]
    },
    {
      theme: "switching", type: "verify", level: "intermediaire",
      title: "Verifier Spanning Tree",
      summary: "Identifie root bridge, roles et etats de ports.",
      commands: ["show spanning-tree", "show spanning-tree vlan 10", "show spanning-tree root", "show spanning-tree blockedports"],
      notes: ["Utile pour boucles, ports bloques et chemins inattendus."]
    },
    {
      theme: "routing", type: "config", level: "intermediaire",
      title: "Inter-VLAN routing par sous-interfaces",
      summary: "Router-on-a-stick: un routeur route entre VLAN via un trunk.",
      commands: ["interface gigabitEthernet0/0.10", "encapsulation dot1Q 10", "ip address 192.168.10.1 255.255.255.0", "interface gigabitEthernet0/0.20", "encapsulation dot1Q 20", "ip address 192.168.20.1 255.255.255.0", "interface gigabitEthernet0/0", "no shutdown"],
      notes: ["Le port cote switch doit etre en trunk.", "Chaque sous-interface correspond a un VLAN."]
    },
    {
      theme: "routing", type: "config", level: "intermediaire",
      title: "Inter-VLAN routing par SVI",
      summary: "Un switch L3 route entre VLAN avec des interfaces VLAN.",
      commands: ["ip routing", "interface vlan 10", "ip address 192.168.10.1 255.255.255.0", "no shutdown", "interface vlan 20", "ip address 192.168.20.1 255.255.255.0", "no shutdown"],
      notes: ["Il faut au moins un port actif dans le VLAN pour que la SVI soit up/up sur beaucoup de plateformes."]
    },
    {
      theme: "routing", type: "config", level: "base",
      title: "Route statique IPv4",
      summary: "Ajoute une route manuelle vers un reseau distant.",
      commands: ["ip route 172.16.10.0 255.255.255.0 10.0.0.2", "ip route 0.0.0.0 0.0.0.0 203.0.113.1"],
      notes: ["La seconde commande est une route par defaut."]
    },
    {
      theme: "routing", type: "verify", level: "base",
      title: "Verifier la table de routage",
      summary: "Controle les routes apprises et la meilleure route vers une destination.",
      commands: ["show ip route", "show ip route 172.16.10.0", "show ip cef 172.16.10.5", "show arp"],
      notes: ["CEF montre le chemin de transfert effectif sur beaucoup de plateformes."]
    },
    {
      theme: "ospf", type: "config", level: "intermediaire",
      title: "OSPFv2 simple aire 0",
      summary: "Active OSPF et annonce des reseaux IPv4.",
      commands: ["router ospf 10", "router-id 1.1.1.1", "network 10.0.0.0 0.0.0.255 area 0", "network 192.168.10.0 0.0.0.255 area 0", "passive-interface default", "no passive-interface gigabitEthernet0/0"],
      aliases: ["qspf", "ospf configuration", "aire 0", "area 0", "routage ospf"],
      notes: ["Le wildcard mask est l'inverse du masque reseau.", "passive-interface limite les voisinages non souhaites."]
    },
    {
      theme: "ospf", type: "verify", level: "intermediaire",
      title: "Verifier OSPF",
      summary: "Controle voisins, interfaces, LSDB et routes OSPF.",
      commands: ["show ip ospf neighbor", "show ip ospf interface brief", "show ip protocols", "show ip route ospf", "show ip ospf database"],
      aliases: ["qspf", "voisin ospf", "neighbor ospf", "routes ospf", "etat ospf"],
      notes: ["Si un voisin reste en INIT ou EXSTART, verifier MTU, area, timers, auth et type de reseau."]
    },
    {
      theme: "ospf", type: "config", level: "intermediaire",
      title: "Activer OSPF directement sur interfaces",
      summary: "Configure OSPF au niveau de l'interface au lieu d'utiliser uniquement les commandes network.",
      commands: ["router ospf 10", "router-id 1.1.1.1", "interface gigabitEthernet0/0", "ip ospf 10 area 0", "interface vlan 10", "ip ospf 10 area 10"],
      aliases: ["ospf interface", "ip ospf area", "activer ospf port", "ospf svi"],
      notes: ["Cette methode evite les erreurs de wildcard mask.", "Tres pratique sur SVI, liens point-a-point et interfaces routees."]
    },
    {
      theme: "ospf", type: "config", level: "intermediaire",
      title: "Gerance des interfaces passives OSPF",
      summary: "Annonce des reseaux sans former de voisinage sur les ports utilisateurs.",
      commands: ["router ospf 10", "passive-interface default", "no passive-interface gigabitEthernet0/0", "no passive-interface port-channel1", "show ip protocols | include Passive|Routing for Networks"],
      aliases: ["passive interface ospf", "interface passive", "voisinage ospf", "securiser ospf"],
      notes: ["Bonne pratique: rendre passif par defaut, puis ouvrir seulement les liens vers routeurs voisins.", "Une interface passive annonce le reseau mais n'envoie pas de hello OSPF."]
    },
    {
      theme: "ospf", type: "config", level: "avance",
      title: "Cout OSPF, priorite et type de reseau",
      summary: "Influence le chemin choisi, l'election DR/BDR et le comportement de voisinage.",
      commands: ["interface <interface-name>", "ip ospf cost <cost>", "ip ospf priority <0-255>", "ip ospf network point-to-point", "auto-cost reference-bandwidth 100000", "show ip ospf interface <interface-name>"],
      aliases: ["cost ospf", "cout ospf", "dr bdr", "priority ospf", "point-to-point ospf"],
      notes: ["Configurer auto-cost reference-bandwidth de facon coherente sur tous les routeurs OSPF.", "priority 0 empeche une interface de devenir DR/BDR."]
    },
    {
      theme: "ospf", type: "config", level: "avance",
      title: "Annoncer une route par defaut dans OSPF",
      summary: "Diffuse une route 0.0.0.0/0 vers les routeurs internes.",
      commands: ["ip route 0.0.0.0 0.0.0.0 <next-hop>", "router ospf 10", "default-information originate", "default-information originate always", "show ip route ospf | include 0.0.0.0"],
      aliases: ["default route ospf", "route par defaut ospf", "default-information originate"],
      notes: ["Sans always, la route par defaut doit exister dans la table de routage locale.", "Utiliser always avec prudence pour eviter d'annoncer une sortie Internet inexistante."]
    },
    {
      theme: "ospf", type: "config", level: "avance",
      title: "Redistribution vers OSPF",
      summary: "Injecte des routes statiques, connectees ou d'un autre protocole dans OSPF.",
      commands: ["router ospf 10", "redistribute static subnets", "redistribute connected subnets", "default-metric 20", "show ip ospf database external", "show ip route ospf"],
      aliases: ["redistribute ospf", "redistribution ospf", "routes externes ospf", "lsa type 5"],
      notes: ["Toujours filtrer ou taguer en production avec route-map/prefix-list si necessaire.", "Sans subnets, certains prefixes classless peuvent ne pas etre redistribues."]
    },
    {
      theme: "ospf", type: "security", level: "avance",
      title: "Authentification OSPF",
      summary: "Protege les voisinages OSPF avec une cle d'authentification.",
      commands: ["interface <interface-name>", "ip ospf authentication message-digest", "ip ospf message-digest-key 1 md5 <cle-secrete>", "show ip ospf interface <interface-name>", "show ip ospf neighbor"],
      aliases: ["auth ospf", "authentication ospf", "md5 ospf", "securite ospf"],
      notes: ["La cle doit correspondre des deux cotes du lien.", "Selon les versions, privilegier les mecanismes cryptographiques plus modernes si disponibles."]
    },
    {
      theme: "ospf", type: "verify", level: "avance",
      title: "Diagnostiquer les voisins OSPF bloques",
      summary: "Analyse les etats DOWN, INIT, 2-WAY, EXSTART, EXCHANGE et FULL.",
      commands: ["show ip ospf neighbor detail", "show ip ospf interface <interface-name>", "show ip protocols", "show logging | include OSPF|ADJCHG|Neighbor", "show interfaces <interface-name> | include MTU|line protocol|Internet address", "debug ip ospf adj", "undebug all"],
      aliases: ["depannage ospf", "ospf stuck exstart", "ospf init", "voisin ospf bloque", "debug ospf"],
      notes: ["Verifier dans l'ordre: lien up, IP/masque, area, timers, MTU, authentification, type de reseau et ACL.", "Utiliser debug avec prudence sur equipement charge."]
    },
    {
      theme: "ospf", type: "config", level: "avance",
      title: "OSPFv3 pour IPv6",
      summary: "Active OSPF pour IPv6 avec OSPFv3.",
      commands: ["ipv6 unicast-routing", "ipv6 router ospf 10", "router-id 1.1.1.1", "interface gigabitEthernet0/0", "ipv6 ospf 10 area 0", "show ipv6 ospf neighbor", "show ipv6 route ospf"],
      aliases: ["ospfv3", "ospf ipv6", "ipv6 ospf", "qspf ipv6"],
      notes: ["OSPFv3 utilise toujours un router-id au format IPv4.", "Verifier les adresses link-local et l'activation IPv6 sur l'interface."]
    },
    {
      theme: "routing", type: "config", level: "avance",
      title: "EIGRP nomme",
      summary: "Configure EIGRP moderne avec familles d'adresses.",
      commands: ["router eigrp CAMPUS", "address-family ipv4 unicast autonomous-system 100", "network 10.0.0.0 0.255.255.255", "eigrp router-id 2.2.2.2", "af-interface default", "passive-interface", "exit-af-interface", "af-interface gi0/0", "no passive-interface"],
      notes: ["EIGRP est courant dans certains environnements Cisco historiques."]
    },
    {
      theme: "bgp", type: "config", level: "avance",
      title: "BGP voisin eBGP minimal",
      summary: "Etablit une session BGP externe et annonce un prefixe.",
      commands: ["router bgp 65010", "bgp log-neighbor-changes", "neighbor 203.0.113.1 remote-as 65000", "network 198.51.100.0 mask 255.255.255.0"],
      platforms: ["IOS", "IOS XE"],
      aliases: ["bgp ebgp", "neighbor remote-as", "show ip bgp summary"],
      notes: ["Le prefixe annonce doit exister dans la table de routage.", "Filtrage, prefix-list et route-map sont indispensables en production."]
    },
    {
      theme: "bgp", type: "verify", level: "intermediaire",
      title: "Verifier une session BGP",
      summary: "Controle l'etat des voisins, les routes recues et la route selectionnee.",
      commands: ["show ip bgp summary", "show bgp ipv4 unicast summary", "show ip bgp neighbors 203.0.113.1", "show ip bgp", "show ip route bgp", "show tcp brief | include 179"],
      platforms: ["IOS", "IOS XE", "NX-OS"],
      aliases: ["bgp summary", "etat voisin bgp", "tcp 179", "routes bgp"],
      notes: ["Un voisin stable doit rester en Established; les etats Idle, Active ou Connect indiquent souvent reachability, ACL, AS ou TTL.", "Comparer la table BGP et la table de routage: une route BGP non meilleure peut ne pas etre installee."]
    },
    {
      theme: "bgp", type: "config", level: "avance",
      title: "BGP avec loopback et update-source",
      summary: "Etablit une session BGP depuis une loopback, typique iBGP ou eBGP multihop controle.",
      commands: ["interface loopback0", "ip address 10.255.0.1 255.255.255.255", "router bgp 65010", "neighbor 10.255.0.2 remote-as 65010", "neighbor 10.255.0.2 update-source loopback0", "neighbor 10.255.0.2 description RR-01"],
      platforms: ["IOS", "IOS XE"],
      aliases: ["ibgp loopback", "update-source", "bgp loopback", "route reflector client"],
      notes: ["La loopback distante doit etre joignable par IGP ou route statique avant que BGP monte.", "Pour eBGP non directement connecte, ajouter ebgp-multihop avec une valeur adaptee."]
    },
    {
      theme: "bgp", type: "config", level: "avance",
      title: "Filtrer des annonces BGP avec prefix-list",
      summary: "Limite les prefixes annonces ou recus par un voisin BGP.",
      commands: ["ip prefix-list PL-OUT seq 10 permit 198.51.100.0/24", "ip prefix-list PL-OUT seq 99 deny 0.0.0.0/0 le 32", "router bgp 65010", "neighbor 203.0.113.1 prefix-list PL-OUT out", "clear ip bgp 203.0.113.1 soft out", "show ip prefix-list PL-OUT"],
      platforms: ["IOS", "IOS XE"],
      aliases: ["bgp prefix-list", "filtrage bgp", "clear ip bgp soft", "route policy"],
      notes: ["Toujours prevoir une politique explicite en bordure Internet ou inter-AS.", "Utiliser soft clear pour appliquer une politique sans couper brutalement la session."]
    },
    {
      theme: "bgp", type: "config", level: "avance",
      title: "Politique BGP avec route-map",
      summary: "Applique local-preference, weight, MED ou communautes selon une prefix-list.",
      commands: ["ip prefix-list PL-PREFERRED seq 10 permit 203.0.113.0/24", "route-map RM-IN permit 10", "match ip address prefix-list PL-PREFERRED", "set local-preference 200", "route-map RM-IN permit 100", "router bgp 65010", "neighbor 192.0.2.2 route-map RM-IN in", "clear ip bgp 192.0.2.2 soft in"],
      platforms: ["IOS", "IOS XE"],
      aliases: ["local preference", "local-pref", "route-map bgp", "med", "weight"],
      notes: ["local-preference influence la sortie dans l'AS; weight est local au routeur Cisco.", "Conserver une sequence permit finale si les autres routes doivent continuer a passer."]
    },
    {
      theme: "bgp", type: "troubleshoot", level: "avance",
      title: "Depanner BGP qui ne passe pas Established",
      summary: "Checklist rapide pour voisins BGP bloques en Idle, Active, Connect ou OpenSent.",
      commands: ["show ip bgp summary", "show ip bgp neighbors <neighbor-ip> | include BGP state|Last reset|Error", "ping <neighbor-ip> source <source-ip>", "traceroute <neighbor-ip> source <source-ip>", "show access-lists | include 179|<neighbor-ip>", "show logging | include BGP|ADJCHANGE|TCP", "debug ip bgp updates", "undebug all"],
      platforms: ["IOS", "IOS XE"],
      aliases: ["bgp active", "bgp idle", "bgp opensent", "depannage bgp"],
      notes: ["Verifier reachability, AS distant, source attendue, ACL/pare-feu TCP 179, TTL/eBGP multihop et authentification MD5.", "Activer debug seulement en fenetre controlee."]
    },
    {
      theme: "qos", type: "config", level: "intermediaire",
      title: "QoS MQC simple avec class-map et policy-map",
      summary: "Classe un trafic puis applique une politique de priorisation ou limitation.",
      commands: ["class-map match-any CM-VOICE", "match dscp ef", "match ip dscp ef", "policy-map PM-WAN-OUT", "class CM-VOICE", "priority percent 20", "class class-default", "fair-queue", "interface gigabitEthernet0/0", "service-policy output PM-WAN-OUT"],
      platforms: ["IOS", "IOS XE"],
      aliases: ["qos mqc", "class-map", "policy-map", "service-policy", "voice qos"],
      notes: ["La disponibilite de fair-queue, priority percent et des files depend du modele et de la licence.", "Sur lien WAN, appliquer souvent la policy en sortie sur l'interface de congestion."]
    },
    {
      theme: "qos", type: "verify", level: "intermediaire",
      title: "Verifier une politique QoS appliquee",
      summary: "Controle les classes, compteurs, drops et files d'une service-policy.",
      commands: ["show policy-map", "show policy-map interface", "show policy-map interface gigabitEthernet0/0", "show class-map", "show running-config | section policy-map", "show running-config interface gigabitEthernet0/0"],
      platforms: ["IOS", "IOS XE"],
      aliases: ["show policy-map interface", "compteurs qos", "drops qos", "service-policy"],
      notes: ["Les compteurs qui restent a zero peuvent indiquer un mauvais match ou une policy appliquee dans le mauvais sens.", "Comparer le debit reel, les drops et les files avant/apres changement."]
    },
    {
      theme: "qos", type: "config", level: "intermediaire",
      title: "Marquage DSCP en entree",
      summary: "Marque le trafic entrant pour faciliter le traitement QoS plus loin dans le reseau.",
      commands: ["class-map match-any CM-APP-CRITIQUE", "match access-group name ACL-APP-CRITIQUE", "policy-map PM-MARK-IN", "class CM-APP-CRITIQUE", "set dscp af31", "class class-default", "set dscp default", "interface gigabitEthernet1/0/10", "service-policy input PM-MARK-IN"],
      platforms: ["IOS", "IOS XE"],
      aliases: ["dscp", "marquage qos", "set dscp", "policy input"],
      notes: ["Documenter les classes DSCP acceptees par l'organisation.", "Ne pas faire confiance aux marquages utilisateurs sans politique de trust explicite."]
    },
    {
      theme: "qos", type: "config", level: "avance",
      title: "Policing de trafic avec police",
      summary: "Limite un flux a un debit defini et applique une action en depassement.",
      commands: ["policy-map PM-POLICE-IN", "class class-default", "police 10000000 conform-action transmit exceed-action drop", "interface gigabitEthernet0/1", "service-policy input PM-POLICE-IN", "show policy-map interface gigabitEthernet0/1"],
      platforms: ["IOS", "IOS XE"],
      aliases: ["policer", "policing", "limitation debit", "exceed-action drop"],
      notes: ["Le policing coupe le trafic excedentaire; le shaping est souvent preferable en sortie WAN quand il faut lisser.", "Adapter les valeurs en bits par seconde et valider les impacts applicatifs."]
    },
    {
      theme: "qos", type: "config", level: "avance",
      title: "Shaping WAN parent/enfant",
      summary: "Lisse le debit d'une interface WAN et applique des classes dans une policy enfant.",
      commands: ["policy-map PM-CHILD-QOS", "class CM-VOICE", "priority percent 20", "class class-default", "fair-queue", "policy-map PM-PARENT-SHAPE", "class class-default", "shape average 50000000", "service-policy PM-CHILD-QOS", "interface gigabitEthernet0/0", "service-policy output PM-PARENT-SHAPE"],
      platforms: ["IOS", "IOS XE"],
      aliases: ["shape average", "hierarchical qos", "hqos", "wan qos"],
      notes: ["Configurer le shaping legerement sous le debit operateur reel si l'interface physique est plus rapide que le lien vendu.", "Les syntaxes HQoS varient selon plateformes Catalyst, ISR/ASR et versions IOS XE."]
    },
    {
      theme: "qos", type: "troubleshoot", level: "avance",
      title: "Depanner pertes ou latence avec QoS",
      summary: "Relie les symptomes applicatifs aux compteurs QoS, files et erreurs interface.",
      commands: ["show policy-map interface", "show interfaces <interface-name> | include rate|drop|queue|CRC|error", "show platform hardware qfp active statistics drop", "show running-config | section class-map|policy-map", "show logging | include QOS|POLICY|QUEUE"],
      platforms: ["IOS XE", "Catalyst 9000", "ISR", "ASR"],
      aliases: ["drops qos", "latence voix", "queue drops", "qfp drops"],
      notes: ["Sur IOS XE routeur, les compteurs QFP aident a distinguer drops hardware/software.", "Les commandes platform dependent changent selon famille materielle."]
    },
    {
      theme: "routing", type: "config", level: "intermediaire",
      title: "IPv6 sur interface et route par defaut",
      summary: "Active IPv6 et configure une passerelle.",
      commands: ["ipv6 unicast-routing", "interface gi0/0", "ipv6 address 2001:db8:10::1/64", "no shutdown", "ipv6 route ::/0 2001:db8:10::fe"],
      notes: ["2001:db8::/32 est reserve a la documentation."]
    },
    {
      theme: "routing", type: "verify", level: "intermediaire",
      title: "Verification IPv6",
      summary: "Controle adresses, voisins et routes IPv6.",
      commands: ["show ipv6 interface brief", "show ipv6 route", "show ipv6 neighbors", "ping ipv6 2001:db8:10::fe"],
      notes: ["Les adresses link-local commencent generalement par fe80::."]
    },
    {
      theme: "services", type: "config", level: "intermediaire",
      title: "Serveur DHCP IPv4 local",
      summary: "Distribue des adresses aux clients d'un VLAN.",
      commands: ["ip dhcp excluded-address 192.168.10.1 192.168.10.20", "ip dhcp pool VLAN10-USERS", "network 192.168.10.0 255.255.255.0", "default-router 192.168.10.1", "dns-server 192.168.10.53 1.1.1.1", "domain-name exemple.local", "lease 7"],
      notes: ["Exclure les IP statiques avant de creer le pool."]
    },
    {
      theme: "services", type: "verify", level: "intermediaire",
      title: "Verifier DHCP",
      summary: "Affiche baux, conflits et statistiques.",
      commands: ["show ip dhcp binding", "show ip dhcp pool", "show ip dhcp conflict", "debug ip dhcp server events"],
      notes: ["Utiliser debug avec prudence sur equipements charges."]
    },
    {
      theme: "services", type: "config", level: "intermediaire",
      title: "Relais DHCP",
      summary: "Transmet les requetes DHCP vers un serveur central.",
      commands: ["interface vlan 10", "ip helper-address 192.168.1.50"],
      notes: ["ip helper relaie aussi certains protocoles UDP par defaut selon IOS."]
    },
    {
      theme: "services", type: "config", level: "base",
      title: "NTP client",
      summary: "Synchronise l'heure pour logs, certificats et authentification.",
      commands: ["clock timezone CET 1 0", "clock summer-time CEST recurring last Sun Mar 2:00 last Sun Oct 3:00", "ntp server 192.168.1.10 prefer", "ntp server 192.168.1.11"],
      notes: ["Adapter le fuseau et les serveurs a l'organisation."]
    },
    {
      theme: "services", type: "verify", level: "base",
      title: "Verifier NTP et horloge",
      summary: "Controle l'heure locale et l'etat de synchronisation.",
      commands: ["show clock detail", "show ntp status", "show ntp associations"],
      notes: ["Une heure incorrecte complique fortement le diagnostic."]
    },
    {
      theme: "services", type: "config", level: "intermediaire",
      title: "Syslog distant",
      summary: "Envoie les journaux vers un collecteur central.",
      commands: ["logging host 192.168.1.60", "logging trap warnings", "logging source-interface vlan99", "service timestamps log datetime msec localtime show-timezone"],
      notes: ["Choisir le niveau selon le volume accepte par le SIEM ou syslog."]
    },
    {
      theme: "services", type: "config", level: "intermediaire",
      title: "SNMPv3 lecture seule",
      summary: "Supervision securisee par utilisateur SNMPv3.",
      commands: ["snmp-server group MONITOR v3 priv read VUE-RO", "snmp-server view VUE-RO iso included", "snmp-server user snmpmon MONITOR v3 auth sha AUTH_SECRET priv aes 128 PRIV_SECRET", "snmp-server location Salle reseau", "snmp-server contact noc@example.local"],
      notes: ["Eviter SNMPv2c public/private en production."]
    },
    {
      theme: "security", type: "security", level: "intermediaire",
      title: "Activer SSH version 2",
      summary: "Remplace Telnet pour l'administration distante.",
      commands: ["ip domain-name exemple.local", "username admin privilege 15 secret MOT_DE_PASSE_FORT", "crypto key generate rsa modulus 2048", "ip ssh version 2", "line vty 0 15", "transport input ssh", "login local"],
      notes: ["Prevoir AAA/TACACS+ ou RADIUS pour les environnements gerés."]
    },
    {
      theme: "security", type: "security", level: "avance",
      title: "AAA avec authentification locale de secours",
      summary: "Prepare l'integration TACACS+ ou RADIUS avec fallback local.",
      commands: ["aaa new-model", "aaa authentication login default group tacacs+ local", "aaa authorization exec default group tacacs+ local if-authenticated", "tacacs server TAC1", "address ipv4 192.168.1.70", "key CLE_PARTAGEE"],
      notes: ["Tester depuis une session existante avant de fermer l'acces console."]
    },
    {
      theme: "security", type: "security", level: "intermediaire",
      title: "Port security sur port d'acces",
      summary: "Limite les adresses MAC autorisees sur un port utilisateur et controle le comportement en cas de violation.",
      commands: ["interface gigabitEthernet1/0/12", "description Poste utilisateur - bureau 214", "switchport mode access", "switchport access vlan 10", "switchport nonegotiate", "spanning-tree portfast", "spanning-tree bpduguard enable", "switchport port-security", "switchport port-security maximum 2", "switchport port-security mac-address sticky", "switchport port-security violation restrict", "switchport port-security aging time 15", "switchport port-security aging type inactivity", "show port-security", "show port-security interface gigabitEthernet1/0/12", "show port-security address", "show interfaces status err-disabled"],
      platforms: ["IOS", "IOS XE", "Catalyst"],
      aliases: ["port-security", "sticky mac", "violation restrict", "violation shutdown", "violation protect", "securite port"],
      notes: ["Modes violation: protect bloque silencieusement les MAC excedentaires, restrict bloque et journalise, shutdown met le port en err-disabled.", "Sticky apprend les MAC legitimes et les ecrit dans la running-config; sauvegarder si l'apprentissage doit survivre au reboot.", "Eviter port-security sur uplinks, trunks vers switchs, hyperviseurs ou points d'acces multi-clients sans design specifique."]
    },
    {
      theme: "security", type: "verify", level: "intermediaire",
      title: "Verifier port security",
      summary: "Affiche etat, violations et MAC apprises.",
      commands: ["show port-security", "show port-security interface gi1/0/12", "show port-security address"],
      notes: ["En cas d'err-disabled, verifier aussi show errdisable recovery."]
    },
    {
      theme: "security", type: "security", level: "avance",
      title: "DHCP Snooping",
      summary: "Bloque les serveurs DHCP non autorises sur ports non fiables.",
      commands: ["ip dhcp snooping", "ip dhcp snooping vlan 10,20", "no ip dhcp snooping information option", "interface gigabitEthernet1/0/48", "description Uplink vers distribution", "ip dhcp snooping trust", "interface range gigabitEthernet1/0/1 - 24", "description Ports utilisateurs non fiables", "ip dhcp snooping limit rate 20", "show ip dhcp snooping", "show ip dhcp snooping binding", "show ip dhcp snooping statistics", "show logging | include DHCP_SNOOPING|DHCP"],
      platforms: ["IOS", "IOS XE", "Catalyst"],
      aliases: ["dhcp snooping", "binding dhcp", "dhcp rogue server", "ip dhcp snooping trust", "option 82"],
      notes: ["Les uplinks, trunks vers distribution et ports vers serveurs DHCP legitimes doivent etre trust; les ports utilisateurs restent untrusted.", "Option 82 peut poser probleme avec certains relais ou serveurs DHCP: verifier la politique avant de laisser l'insertion active.", "DHCP Snooping est la base de Dynamic ARP Inspection et IP Source Guard."]
    },
    {
      theme: "security", type: "security", level: "avance",
      title: "Dynamic ARP Inspection",
      summary: "Mitige l'ARP spoofing en s'appuyant sur DHCP Snooping.",
      commands: ["ip arp inspection vlan 10,20", "interface gi1/0/48", "ip arp inspection trust"],
      notes: ["Pour IP statiques, prevoir ACL ARP ou bindings adaptes."]
    },
    {
      theme: "security", type: "security", level: "avance",
      title: "IP Source Guard sur ports d'acces",
      summary: "Valide l'adresse IP source d'un poste a partir des bindings DHCP Snooping ou statiques.",
      commands: ["ip dhcp snooping", "ip dhcp snooping vlan 10", "interface gigabitEthernet1/0/12", "description Poste utilisateur - anti-spoofing", "switchport mode access", "switchport access vlan 10", "ip verify source", "ip verify source port-security", "show ip verify source", "show ip verify source interface gigabitEthernet1/0/12", "show ip dhcp snooping binding interface gigabitEthernet1/0/12", "show logging | include SOURCE_GUARD|DHCP_SNOOPING"],
      platforms: ["IOS", "IOS XE", "Catalyst"],
      aliases: ["ip source guard", "ip verify source", "anti spoofing", "source validation", "ip verify source port-security"],
      notes: ["Depend de DHCP Snooping pour les clients DHCP; prevoir des bindings statiques pour les hotes en IP fixe.", "ip verify source port-security ajoute une validation IP/MAC plus stricte quand Port-security est aussi active.", "A tester par lot de ports limite pour eviter de bloquer des postes legitimes."]
    },
    {
      theme: "security", type: "security", level: "intermediaire",
      title: "BPDU Guard et Root Guard",
      summary: "Protege Spanning Tree contre les switchs non autorises et les changements de racine.",
      commands: ["spanning-tree portfast default", "spanning-tree bpduguard default", "interface gi1/0/24", "spanning-tree guard root", "show spanning-tree inconsistentports", "show interfaces status err-disabled"],
      platforms: ["IOS", "IOS XE", "Catalyst"],
      aliases: ["bpduguard", "root guard", "stp guard", "inconsistent ports"],
      notes: ["BPDU Guard est adapte aux ports utilisateurs; Root Guard est plutot adapte aux liens ou la racine STP ne doit jamais apparaitre.", "Ne pas activer PortFast/BPDU Guard sur un trunk vers un switch legitime."]
    },
    {
      theme: "security", type: "security", level: "intermediaire",
      title: "Storm Control broadcast multicast unknown-unicast",
      summary: "Limite les tempetes L2 qui saturent un VLAN ou un switch d'acces.",
      commands: ["interface range gi1/0/1 - 24", "storm-control broadcast level 1.00 0.50", "storm-control multicast level 2.00 1.00", "storm-control unicast level 2.00 1.00", "storm-control action trap", "show storm-control", "show interfaces counters errors"],
      platforms: ["IOS", "IOS XE", "Catalyst"],
      aliases: ["storm-control", "broadcast storm", "multicast storm", "unknown unicast"],
      notes: ["Les seuils doivent etre adaptes au profil du port; un seuil trop bas peut couper des usages legitimes.", "Sur certains modeles, l'action shutdown met le port en err-disabled."]
    },
    {
      theme: "security", type: "security", level: "avance",
      title: "802.1X filaire avec RADIUS",
      summary: "Active l'authentification reseau par port avec serveur RADIUS.",
      commands: ["aaa new-model", "radius server ISE-01", "address ipv4 192.168.99.20 auth-port 1812 acct-port 1813", "key CLE_RADIUS", "aaa authentication dot1x default group radius", "aaa authorization network default group radius", "dot1x system-auth-control", "interface gi1/0/12", "authentication port-control auto", "dot1x pae authenticator", "show authentication sessions interface gi1/0/12 details"],
      platforms: ["IOS", "IOS XE", "Catalyst"],
      aliases: ["dot1x", "802.1x", "radius", "ise", "authentication sessions"],
      notes: ["Toujours garder un acces console ou un port de secours avant de generaliser 802.1X.", "Les syntaxes recentes Catalyst utilisent souvent access-session; verifier la version IOS XE."]
    },
    {
      theme: "security", type: "security", level: "avance",
      title: "MAB avec VLAN critique",
      summary: "Autorise les equipements sans supplicant 802.1X via leur adresse MAC et prevoit un mode degrade.",
      commands: ["interface gi1/0/20", "authentication order dot1x mab", "authentication priority dot1x mab", "authentication port-control auto", "mab", "dot1x pae authenticator", "authentication event server dead action authorize vlan 998", "authentication event server alive action reinitialize", "show authentication sessions interface gi1/0/20 details"],
      platforms: ["IOS", "IOS XE", "Catalyst"],
      aliases: ["mab", "mac authentication bypass", "vlan critique", "server dead action"],
      notes: ["MAB est moins fort que 802.1X: une MAC peut etre usurpee.", "Utiliser MAB surtout pour imprimantes, telephones ou objets sans supplicant, avec profilage cote RADIUS."]
    },
    {
      theme: "security", type: "security", level: "avance",
      title: "Private VLAN isolated community promiscuous",
      summary: "Isole des hotes dans un meme VLAN IP tout en conservant une passerelle commune.",
      commands: ["vlan 100", "private-vlan primary", "private-vlan association 101,102", "vlan 101", "private-vlan isolated", "vlan 102", "private-vlan community", "interface gi1/0/1", "switchport mode private-vlan host", "switchport private-vlan host-association 100 101", "interface gi1/0/48", "switchport mode private-vlan promiscuous", "switchport private-vlan mapping 100 101,102", "show vlan private-vlan"],
      platforms: ["IOS", "IOS XE", "Catalyst"],
      aliases: ["private vlan", "pvlan", "isolated vlan", "community vlan", "promiscuous"],
      notes: ["Verifier le support materiel/licence et la compatibilite trunk avant de l'utiliser en production.", "Tres utile en hebergement, DMZ ou reseaux d'equipements qui ne doivent pas communiquer entre eux."]
    },
    {
      theme: "security", type: "verify", level: "avance",
      title: "Verifier DHCP Snooping DAI Source Guard",
      summary: "Controle les tables de binding et les protections L2 associees.",
      commands: ["show ip dhcp snooping", "show ip dhcp snooping binding", "show ip arp inspection", "show ip arp inspection interfaces", "show ip arp inspection statistics", "show ip verify source", "show logging | include DHCP_SNOOPING|SW_DAI|SOURCE_GUARD"],
      platforms: ["IOS", "IOS XE", "Catalyst"],
      aliases: ["verify dhcp snooping", "show ip verify source", "show ip arp inspection statistics"],
      notes: ["Si DAI bloque un hote en IP fixe, ajouter une ARP ACL ou un binding statique adapte.", "Comparer VLAN, MAC, IP et interface avant de conclure a une attaque."]
    },
    {
      theme: "security", type: "security", level: "avance",
      title: "ACL IPv4 standard",
      summary: "Filtre selon l'adresse source.",
      commands: ["ip access-list standard MGMT-SOURCES", "permit 192.168.99.0 0.0.0.255", "deny any log", "line vty 0 15", "access-class MGMT-SOURCES in"],
      notes: ["Pratique pour limiter qui peut administrer l'equipement."]
    },
    {
      theme: "security", type: "security", level: "avance",
      title: "ACL IPv4 etendue",
      summary: "Filtre source, destination et protocole.",
      commands: ["ip access-list extended USERS-TO-SERVERS", "permit tcp 192.168.10.0 0.0.0.255 192.168.50.10 0.0.0.0 eq 443", "deny ip any any log", "interface vlan 10", "ip access-group USERS-TO-SERVERS in"],
      notes: ["Placer les ACL etendues pres de la source lorsque possible."]
    },
    {
      theme: "security", type: "security", level: "avance",
      title: "ACL IPv4 etendue nommee avec journalisation",
      summary: "Filtre finement les flux inter-VLAN et journalise les refus importants.",
      commands: ["ip access-list extended VLAN10-TO-SERVERS", "remark Autoriser HTTPS vers application", "permit tcp 192.168.10.0 0.0.0.255 host 192.168.50.10 eq 443", "remark Autoriser DNS vers resolvers", "permit udp 192.168.10.0 0.0.0.255 192.168.50.53 0.0.0.0 eq 53", "deny ip 192.168.10.0 0.0.0.255 any log", "interface vlan 10", "ip access-group VLAN10-TO-SERVERS in", "show access-lists VLAN10-TO-SERVERS"],
      platforms: ["IOS", "IOS XE"],
      aliases: ["extended acl", "acl nommee", "inter vlan filtering", "deny log"],
      notes: ["Les lignes ACL sont evaluees de haut en bas avec deny implicite final.", "Limiter le log sur les denies tres frequents pour eviter de surcharger CPU et syslog."]
    },
    {
      theme: "security", type: "security", level: "avance",
      title: "Zone-Based Policy Firewall ZBF",
      summary: "Segmente les interfaces en zones et applique une politique stateful entre zones.",
      commands: ["zone security INSIDE", "zone security OUTSIDE", "class-map type inspect match-any CM-INSIDE-OUT", "match protocol http", "match protocol https", "match protocol dns", "policy-map type inspect PM-INSIDE-OUT", "class type inspect CM-INSIDE-OUT", "inspect", "class class-default", "drop log", "zone-pair security ZP-IN-OUT source INSIDE destination OUTSIDE", "service-policy type inspect PM-INSIDE-OUT", "interface gi0/0", "zone-member security INSIDE", "interface gi0/1", "zone-member security OUTSIDE", "show policy-map type inspect zone-pair"],
      platforms: ["IOS", "IOS XE", "ISR", "ASR"],
      aliases: ["zbf", "zone based firewall", "zone-pair", "policy-map type inspect"],
      notes: ["Une interface dans une zone ne communique pas avec une autre zone sans zone-pair explicite.", "Prevoir les flux de management et de retour avant activation sur un routeur distant."]
    },
    {
      theme: "security", type: "security", level: "avance",
      title: "CoPP Control Plane Policing",
      summary: "Protege le plan de controle contre les flux excessifs vers le routeur ou switch L3.",
      commands: ["ip access-list extended ACL-COPP-MGMT", "permit tcp 192.168.99.0 0.0.0.255 any eq 22", "permit udp 192.168.99.0 0.0.0.255 any eq 161", "class-map match-any CM-COPP-MGMT", "match access-group name ACL-COPP-MGMT", "policy-map PM-COPP", "class CM-COPP-MGMT", "police 1000000 conform-action transmit exceed-action drop", "class class-default", "police 500000 conform-action transmit exceed-action drop", "control-plane", "service-policy input PM-COPP", "show policy-map control-plane"],
      platforms: ["IOS", "IOS XE", "Catalyst 9000", "ISR", "ASR"],
      aliases: ["copp", "control-plane policing", "control plane", "show policy-map control-plane"],
      notes: ["Commencer par mesurer en observation avant de durcir les seuils.", "Une CoPP trop stricte peut casser OSPF, BGP, SSH, SNMP ou ICMP de diagnostic."]
    },
    {
      theme: "security", type: "security", level: "avance",
      title: "Management Plane Protection MPP",
      summary: "Restreint les protocoles d'administration aux interfaces explicitement autorisees.",
      commands: ["control-plane host", "management-interface gigabitEthernet0/0 allow ssh snmp https", "show management-interface", "show running-config | section control-plane host"],
      platforms: ["IOS", "IOS XE", "ISR", "ASR"],
      aliases: ["mpp", "management plane protection", "control-plane host", "management-interface"],
      notes: ["Toutes les plateformes ne supportent pas MPP; les Catalyst utilisent souvent ACL VTY, VRF management et control-plane policies.", "Tester depuis l'interface de management avant de retirer d'autres chemins d'acces."]
    },
    {
      theme: "security", type: "security", level: "avance",
      title: "Durcissement SSH et HTTPS administration",
      summary: "Renforce les services d'administration et limite leur exposition.",
      commands: ["ip ssh version 2", "ip ssh time-out 60", "ip ssh authentication-retries 3", "ip http secure-server", "no ip http server", "ip http authentication aaa", "ip access-list standard MGMT-SOURCES", "permit 192.168.99.0 0.0.0.255", "line vty 0 15", "transport input ssh", "access-class MGMT-SOURCES in", "exec-timeout 10 0", "show ip ssh", "show ip http server secure status"],
      platforms: ["IOS", "IOS XE", "Catalyst", "ISR", "ASR"],
      aliases: ["ssh hardening", "https hardening", "no ip http server", "access-class"],
      notes: ["Desactiver HTTP clair sauf besoin explicite et temporaire.", "Combiner ACL VTY, AAA, VRF management et journalisation des connexions."]
    },
    {
      theme: "security", type: "security", level: "avance",
      title: "AAA TACACS+ et RADIUS avec fallback local",
      summary: "Centralise l'authentification/autorisation tout en gardant un secours local controle.",
      commands: ["aaa new-model", "username secours privilege 15 algorithm-type scrypt secret MOT_DE_PASSE_FORT", "tacacs server TAC1", "address ipv4 192.168.99.30", "key CLE_TACACS", "radius server RAD1", "address ipv4 192.168.99.31 auth-port 1812 acct-port 1813", "key CLE_RADIUS", "aaa group server tacacs+ TAC-GRP", "server name TAC1", "aaa authentication login default group TAC-GRP local", "aaa authorization exec default group TAC-GRP local if-authenticated", "aaa accounting exec default start-stop group TAC-GRP", "show aaa servers"],
      platforms: ["IOS", "IOS XE", "Catalyst", "ISR", "ASR"],
      aliases: ["aaa tacacs", "aaa radius", "fallback local", "show aaa servers"],
      notes: ["Tester avec une session ouverte avant de fermer les acces existants.", "Conserver un compte local de secours robuste, documente et surveille."]
    },
    {
      theme: "security", type: "security", level: "intermediaire",
      title: "Mots de passe type 8 et type 9",
      summary: "Utilise des secrets modernes pour les comptes locaux quand la plateforme les supporte.",
      commands: ["username admin privilege 15 algorithm-type sha256 secret MOT_DE_PASSE_FORT", "username admin2 privilege 15 algorithm-type scrypt secret MOT_DE_PASSE_FORT", "enable algorithm-type scrypt secret MOT_DE_PASSE_ENABLE", "show running-config | include username|enable secret"],
      platforms: ["IOS XE", "Catalyst 9000", "ISR", "ASR"],
      aliases: ["type 8", "type 9", "sha256 secret", "scrypt secret", "password encryption"],
      notes: ["Type 8 correspond a PBKDF2/SHA-256; type 9 correspond a scrypt selon support IOS XE.", "Eviter les anciens mots de passe reversibles type 7 pour les secrets d'administration."]
    },
    {
      theme: "monitoring", type: "verify", level: "base",
      title: "Commandes show essentielles",
      summary: "Premier reflexe pour etablir l'etat global.",
      commands: ["show version", "show inventory", "show license summary", "show environment all", "show processes cpu sorted", "show processes memory sorted"],
      notes: ["show version donne modele, image, uptime, registre et memoire."]
    },
    {
      theme: "monitoring", type: "verify", level: "base",
      title: "CDP et LLDP",
      summary: "Decouvre les voisins directement connectes.",
      commands: ["show cdp neighbors", "show cdp neighbors detail", "show lldp neighbors", "show lldp neighbors detail"],
      notes: ["CDP est Cisco; LLDP est standard. Desactiver sur ports non fiables si necessaire."]
    },
    {
      theme: "monitoring", type: "config", level: "intermediaire",
      title: "Activer LLDP",
      summary: "Permet la decouverte standard des voisins.",
      commands: ["lldp run", "interface gi1/0/1", "lldp transmit", "lldp receive"],
      notes: ["Utile avec telephones, hyperviseurs et equipements non Cisco."]
    },
    {
      theme: "discovery", type: "verify", level: "base",
      title: "Voir les equipements connectes par port avec CDP/LLDP",
      summary: "Identifie les voisins directement branches sur les ports: switchs, routeurs, telephones IP, bornes Wi-Fi, firewalls ou hyperviseurs.",
      commands: ["show cdp neighbors", "show cdp neighbors detail", "show cdp neighbors interface <interface-name> detail", "show lldp neighbors", "show lldp neighbors detail", "show lldp neighbors interface <interface-name> detail"],
      aliases: ["qui est branche", "equipement connecte port", "voisin port", "adresse ip voisin", "device connected port"],
      notes: ["CDP donne souvent le nom, le modele, l'interface distante et parfois l'adresse IP de management.", "LLDP est standard et utile pour les equipements non Cisco.", "Si rien ne remonte, verifier que CDP/LLDP est active localement et sur l'equipement voisin."]
    },
    {
      theme: "discovery", type: "verify", level: "base",
      title: "Trouver les adresses MAC connectees a un port",
      summary: "Liste les adresses MAC apprises sur un port pour savoir quels equipements communiquent derriere ce lien.",
      commands: ["show mac address-table interface <interface-name>", "show mac address-table dynamic interface <interface-name>", "show mac address-table dynamic vlan <vlan-id>", "show mac address-table address <mac-address>", "show interfaces <interface-name> switchport"],
      aliases: ["mac port", "equipement port", "poste branche", "adresse mac interface", "ip port"],
      notes: ["Sur un port access classique, une ou quelques MAC sont attendues.", "Sur un trunk, un uplink ou un port vers hyperviseur, il peut y avoir beaucoup de MAC.", "La table MAC donne la presence L2, pas directement l'adresse IP."]
    },
    {
      theme: "discovery", type: "verify", level: "intermediaire",
      title: "Associer MAC et adresse IP avec ARP",
      summary: "Fait le lien entre une adresse MAC vue sur un port et son adresse IP si l'equipement L3 connait l'ARP.",
      commands: ["show ip arp", "show ip arp <ip-address>", "show ip arp | include <mac-address>", "show arp | include <mac-address>", "show ip route <ip-address>"],
      aliases: ["trouver ip depuis mac", "mac vers ip", "adresse ip port", "arp mac ip"],
      notes: ["ARP est visible sur le routeur ou le switch L3 qui porte la passerelle du VLAN.", "Sur un switch purement L2, il faut interroger la passerelle ou le routeur du VLAN.", "Generer du trafic, par exemple un ping, peut rafraichir l'entree ARP."]
    },
    {
      theme: "discovery", type: "verify", level: "intermediaire",
      title: "Identifier un poste depuis son IP",
      summary: "Retrouve le port d'un equipement a partir de son adresse IP en combinant ARP et table MAC.",
      commands: ["show ip arp <ip-address>", "show ip arp | include <ip-address>", "show mac address-table address <mac-address>", "show interfaces <interface-name> status", "show interfaces <interface-name> description"],
      aliases: ["trouver port depuis ip", "ip vers port", "poste ip port", "adresse ip equipement"],
      notes: ["Methode: IP vers MAC avec ARP, puis MAC vers port avec la table MAC.", "Si la MAC pointe vers un trunk, continuer la recherche sur le switch voisin indique par CDP/LLDP.", "Verifier que l'IP est dans le bon VLAN et que l'entree ARP n'est pas obsolete."]
    },
    {
      theme: "discovery", type: "verify", level: "intermediaire",
      title: "Voir les clients DHCP connus",
      summary: "Affiche les baux DHCP distribues par l'equipement Cisco ou les bindings appris par DHCP Snooping.",
      commands: ["show ip dhcp binding", "show ip dhcp pool", "show ip dhcp server statistics", "show ip dhcp snooping binding", "show ip dhcp snooping binding interface <interface-name>", "show running-config | section dhcp"],
      aliases: ["liste ip clients", "client connecte ip", "binding dhcp port", "ip mac vlan interface"],
      notes: ["show ip dhcp binding ne fonctionne que si l'equipement fait serveur DHCP.", "DHCP Snooping peut donner MAC, IP, VLAN et interface sur les switchs ou la fonction est active.", "Les IP statiques ne seront pas forcement visibles dans les bindings DHCP."]
    },
    {
      theme: "discovery", type: "troubleshoot", level: "avance",
      title: "Remonter un equipement a travers plusieurs switchs",
      summary: "Suit une adresse MAC de switch en switch jusqu'au port final.",
      commands: ["show mac address-table address <mac-address>", "show cdp neighbors interface <uplink-interface> detail", "show lldp neighbors interface <uplink-interface> detail", "show interfaces trunk", "show spanning-tree vlan <vlan-id>"],
      notes: ["Si la MAC est apprise sur un uplink ou un port-channel, se connecter au switch voisin et repeter la recherche.", "Tenir compte des port-channels: verifier aussi show etherchannel summary.", "Dans un environnement empile ou chassise, le nom d'interface indique souvent le membre de stack."]
    },
    {
      theme: "connectivity", type: "troubleshoot", level: "base",
      title: "Ping simple depuis un equipement Cisco",
      summary: "Teste rapidement la joignabilite IP depuis le routeur ou le switch.",
      commands: ["ping <ip-address>", "ping <hostname>", "ping vrf <vrf-name> <ip-address>", "traceroute <ip-address>", "show ip route <ip-address>"],
      notes: ["Un ping reussi valide ICMP, pas forcement l'application finale.", "Si DNS est absent ou lent, tester directement l'adresse IP.", "Verifier la route avant de conclure a une panne distante."]
    },
    {
      theme: "connectivity", type: "troubleshoot", level: "intermediaire",
      title: "Ping depuis un VLAN ou une interface source",
      summary: "Force l'adresse source du ping pour tester depuis un VLAN de management, utilisateur, voix ou serveur.",
      commands: ["ping <destination-ip> source vlan <vlan-id>", "ping <destination-ip> source <interface-name>", "ping <destination-ip> source <source-ip>", "traceroute <destination-ip> source vlan <vlan-id>", "show ip interface brief | include Vlan<vlan-id>"],
      aliases: ["ping vlan", "ping depuis vlan", "ping source vlan", "test vlan", "ping interface source"],
      notes: ["Tres utile sur un switch L3 ou un routeur avec plusieurs interfaces.", "La SVI du VLAN source doit etre up/up et avoir une adresse IP.", "Si la commande source vlan n'est pas supportee, utiliser l'IP source ou le mode ping etendu."]
    },
    {
      theme: "connectivity", type: "troubleshoot", level: "intermediaire",
      title: "Ping etendu interactif",
      summary: "Utilise le mode ping etendu pour choisir source, taille, repetitions, timeout et options.",
      commands: ["ping", "Protocol [ip]: ip", "Target IP address: <destination-ip>", "Repeat count [5]: 10", "Datagram size [100]: 1500", "Extended commands [n]: y", "Source address or interface: <source-ip-or-interface>", "Set DF bit in IP header? [no]: yes"],
      aliases: ["extended ping", "ping etendu", "ping avec source", "ping taille mtu df"],
      notes: ["Lancer simplement ping sans destination en mode privilegie pour entrer dans l'assistant interactif.", "Le bit DF aide a tester les problemes de MTU.", "La syntaxe exacte varie selon IOS, IOS XE et plateforme."]
    },
    {
      theme: "connectivity", type: "troubleshoot", level: "intermediaire",
      title: "Tester depuis une VRF de management",
      summary: "Verifie la connectivite quand l'equipement utilise une VRF separee pour l'administration.",
      commands: ["show vrf", "show ip route vrf <vrf-name>", "ping vrf <vrf-name> <destination-ip>", "traceroute vrf <vrf-name> <destination-ip>", "ssh -l <user> <destination-ip> vrf <vrf-name>"],
      notes: ["La VRF management est frequente sur IOS XE, Catalyst, ISR et plateformes datacenter.", "Verifier DNS, NTP, syslog et TACACS/RADIUS dans la bonne VRF."]
    },
    {
      theme: "connectivity", type: "troubleshoot", level: "avance",
      title: "Diagnostiquer un ping qui echoue",
      summary: "Checklist de verification quand la destination ne repond pas.",
      commands: ["show ip route <destination-ip>", "show ip cef <destination-ip>", "show access-lists", "show ip interface <source-interface>", "show arp <next-hop-ip>", "traceroute <destination-ip> source <source-interface>", "show logging | include ICMP|ACL|DROP|DENY"],
      notes: ["Verifier route aller, route retour, ACL, VRF, NAT, firewall et etat de l'interface source.", "Un equipement peut bloquer ICMP tout en laissant passer les flux applicatifs.", "Comparer un ping depuis la passerelle du VLAN et depuis un autre VLAN aide a isoler l'ACL ou le routage."]
    },
    {
      theme: "quick-diagnostics", type: "verify", level: "base",
      title: "Nettoyer la vue des interfaces",
      summary: "Affiche rapidement les interfaces utiles sans lignes inutiles ou sans IP.",
      commands: ["show interfaces status", "show ip interface brief | exclude unassigned", "show ip interface brief | include up", "show interfaces status | exclude notconnect", "show interfaces description | exclude admin down"],
      aliases: ["show interface statu", "show interface status", "show interfaces status", "show pipe interface", "include exclude interface", "diagnostic rapide interface"],
      notes: ["Tres utile sur les switchs avec beaucoup de ports inutilises.", "Adapter include/exclude selon le format exact de sortie IOS ou IOS XE."]
    },
    {
      theme: "quick-diagnostics", type: "verify", level: "base",
      title: "Isoler une section de configuration",
      summary: "Extrait rapidement une portion de running-config sans parcourir tout le fichier.",
      commands: ["show running-config | section router ospf", "show running-config | section interface Vlan<vlan-id>", "show running-config | section line vty", "show running-config | begin router ospf", "show running-config interface <interface-name>"],
      aliases: ["show section", "show begin", "running config section", "router ospf section"],
      notes: ["section isole un bloc; begin affiche a partir de la premiere correspondance.", "La casse et les espaces peuvent varier selon plateformes."]
    },
    {
      theme: "quick-diagnostics", type: "troubleshoot", level: "intermediaire",
      title: "Traquer erreurs CRC, input errors et drops",
      summary: "Filtre les compteurs physiques suspects sur toutes les interfaces.",
      commands: ["show interfaces | include (is up|Ethernet|input errors|CRC|drops|overrun)", "show interfaces counters errors", "show controllers ethernet-controller <interface-name> phy", "show logging | include LINK|LINEPROTO|CRC|ERROR"],
      aliases: ["crc cable", "input error", "erreur cablage", "show include crc"],
      notes: ["CRC et input errors orientent souvent vers cable, optique, vitesse/duplex ou port defaillant.", "Comparer les compteurs avant/apres quelques minutes si le probleme est intermittent."]
    },
    {
      theme: "quick-diagnostics", type: "verify", level: "intermediaire",
      title: "Filtrer logs et evenements critiques",
      summary: "Cherche rapidement les evenements qui comptent dans le buffer de logs.",
      commands: ["show logging | include ERR|FAIL|DOWN|UP|OSPF|ADJCHG", "show logging | include ILPOWER|POWER|PoE|TEMP|FAN", "show logging | last 50", "terminal monitor"],
      aliases: ["show logging include", "logs critiques", "filtrer logs"],
      notes: ["terminal monitor affiche les logs en direct dans une session distante.", "Utiliser des mots-cles larges puis affiner selon le symptome."]
    },
    {
      theme: "quick-diagnostics", type: "verify", level: "intermediaire",
      title: "Verifier rapidement OSPF avec pipe",
      summary: "Controle voisinages, configuration OSPF et routes OSPF avec des sorties filtrees.",
      commands: ["show ip ospf neighbor | include FULL|EXSTART|INIT|DOWN", "show ip ospf interface brief", "show running-config | section router ospf", "show ip route ospf | begin Gateway", "show logging | include OSPF|ADJCHG"],
      aliases: ["ospf pipe", "diagnostic ospf rapide", "show ospf include"],
      notes: ["FULL est attendu sur les liens point-a-point; EXSTART/INIT indiquent souvent MTU, area, auth ou timers."]
    },
    {
      theme: "quick-diagnostics", type: "verify", level: "intermediaire",
      title: "Retrouver rapidement MAC, ARP et port",
      summary: "Enchaine les filtres utiles pour retrouver un poste ou equipement connecte.",
      commands: ["show mac address-table dynamic | include <mac-address>|<interface-name>", "show mac address-table interface <interface-name>", "show ip arp | include <ip-address>|<mac-address>", "show cdp neighbors detail | include Device ID|IP address|Interface|Platform"],
      aliases: ["mac arp pipe", "trouver poste rapidement", "ip mac port"],
      notes: ["Commencer par IP vers ARP, puis MAC vers port.", "Si la MAC est sur un uplink, continuer sur le switch voisin."]
    },
    {
      theme: "quick-diagnostics", type: "verify", level: "intermediaire",
      title: "Voir les equipements detectes par Device Tracking",
      summary: "Affiche les clients connus par IP Device Tracking / SISF avec IP, MAC, VLAN et interface quand la fonctionnalite est disponible.",
      commands: ["show ip device tracking all", "show ip device tracking interface <interface-name>", "show device-tracking database", "show device-tracking database interface <interface-name>", "show device-tracking policies", "show device-tracking counters"],
      aliases: ["device tracking", "ip device tracking", "show ip device tracking all", "sisf", "ip mac vlan interface", "equipement detecte"],
      notes: ["La syntaxe varie selon IOS XE: anciennes plateformes utilisent show ip device tracking, les plus recentes utilisent souvent show device-tracking database.", "Cette table est tres utile pour retrouver IP/MAC/VLAN/port sans interroger uniquement ARP ou DHCP Snooping."]
    },
    {
      theme: "cabling", type: "troubleshoot", level: "intermediaire",
      title: "Executer un test cable TDR cuivre",
      summary: "Lance un diagnostic TDR sur un port cuivre pour detecter paire ouverte, court-circuit, longueur anormale ou mismatch.",
      commands: ["show interfaces <interface-name> status", "show interfaces <interface-name>", "show interfaces <interface-name> counters errors", "test cable-diagnostics tdr interface <interface-name>", "show cable-diagnostics tdr interface <interface-name>", "show logging | include TDR|LINK|LINEPROTO|CRC|ERROR"],
      platforms: ["IOS", "IOS XE", "Catalyst"],
      aliases: ["tdr", "test cable", "cable defectueux", "paire coupee", "cable diagnostics"],
      notes: ["Le test TDR est surtout disponible sur ports cuivre Catalyst; il peut provoquer une breve interruption du lien.", "A lancer idealement en fenetre de maintenance ou sur un port non critique.", "Comparer le resultat TDR avec l'etat physique du brassage, le cordon, la prise murale et le patch panel."]
    },
    {
      theme: "cabling", type: "verify", level: "intermediaire",
      title: "Interpreter les resultats TDR",
      summary: "Aide a lire les etats des paires et la distance estimee par le test cable.",
      commands: ["show cable-diagnostics tdr interface <interface-name>", "show interfaces <interface-name> status", "show controllers ethernet-controller <interface-name> phy", "show interfaces <interface-name> | include line protocol|duplex|speed|input errors|CRC"],
      platforms: ["IOS", "IOS XE", "Catalyst"],
      aliases: ["open pair", "short pair", "normal pair", "impedance mismatch", "distance tdr"],
      notes: ["Normal indique une paire coherente; Open oriente vers paire coupee ou cable debranche; Short oriente vers court-circuit; Impedance Mismatch oriente vers mauvais cable, connecteur ou brassage.", "La distance est une estimation: verifier physiquement le chemin de cable avant de conclure.", "Un lien qui negocie en 100 Mb/s au lieu de 1 Gb/s peut indiquer une paire manquante ou defectueuse."]
    },
    {
      theme: "cabling", type: "troubleshoot", level: "base",
      title: "Diagnostiquer CRC input errors et drops cable",
      summary: "Identifie les signes d'un cable cuivre, module optique, duplex ou port defectueux.",
      commands: ["show interfaces <interface-name>", "show interfaces <interface-name> counters errors", "show interfaces | include (is up|input errors|CRC|drops|duplex|rate)", "show logging | include LINK|LINEPROTO|CRC|ERROR|GBIC|SFP", "clear counters <interface-name>", "show interfaces <interface-name> counters errors"],
      platforms: ["IOS", "IOS XE", "NX-OS", "Catalyst"],
      aliases: ["crc", "input errors", "drops cable", "duplex mismatch", "erreur physique"],
      notes: ["clear counters remet les compteurs a zero: noter les valeurs avant si elles servent de preuve.", "CRC qui augmente apres remplacement du cordon indique souvent prise, patch panel, optique, vitesse/duplex ou port.", "Verifier aussi la negociation speed/duplex et les erreurs cote equipement voisin."]
    },
    {
      theme: "cabling", type: "verify", level: "intermediaire",
      title: "Verifier fibre optique SFP et niveaux lumineux",
      summary: "Controle module optique, puissance RX/TX, temperature et alarmes DOM.",
      commands: ["show interfaces transceiver detail", "show inventory | include NAME|PID|SN", "show interfaces <interface-name> status", "show interfaces <interface-name>", "show logging | include SFP|GBIC|TRANSCEIVER|DOM|LINK", "show controllers ethernet-controller <interface-name> phy"],
      platforms: ["IOS XE", "NX-OS", "Catalyst", "Nexus"],
      aliases: ["sfp", "transceiver", "fibre", "rx power", "tx power", "dom"],
      notes: ["Comparer RX/TX aux seuils du constructeur; un RX trop faible pointe vers fibre sale, attenuateur, jarretiere ou distance.", "Nettoyer/connecter la fibre avant de remplacer un module optique.", "Certaines commandes et seuils varient fortement entre Catalyst, Nexus et ISR."]
    },
    {
      theme: "monitoring", type: "verify", level: "intermediaire",
      title: "SPAN local",
      summary: "Miroir de trafic vers un port d'analyse.",
      commands: ["monitor session 1 source interface gi1/0/10 both", "monitor session 1 destination interface gi1/0/24", "show monitor session 1"],
      notes: ["Le port destination ne doit pas servir a une connexion normale pendant le SPAN."]
    },
    {
      theme: "monitoring", type: "verify", level: "base",
      title: "Journaux locaux",
      summary: "Affiche les evenements recents.",
      commands: ["show logging", "terminal monitor", "terminal no monitor", "clear logging"],
      notes: ["terminal monitor affiche les logs dans une session SSH/Telnet."]
    },
    {
      theme: "hardware", type: "verify", level: "base",
      title: "Etat materiel general",
      summary: "Controle le modele, l'inventaire, l'image, l'uptime et les ressources principales.",
      commands: ["show version", "show inventory", "show license summary", "show platform", "show module", "show redundancy"],
      notes: ["Toutes les commandes ne sont pas disponibles sur tous les modeles.", "show platform et show module sont surtout utiles sur Catalyst modulaires ou IOS XE."]
    },
    {
      theme: "hardware", type: "verify", level: "base",
      title: "CPU et memoire",
      summary: "Identifie une saturation CPU ou memoire et les processus responsables.",
      commands: ["show processes cpu sorted 5sec", "show processes cpu history", "show processes memory sorted", "show platform resources", "show platform software status control-processor brief"],
      notes: ["Sur IOS XE, les commandes platform donnent souvent une vision plus detaillee par processeur ou conteneur logiciel."]
    },
    {
      theme: "hardware", type: "verify", level: "base",
      title: "Temperature, ventilateurs et alimentations",
      summary: "Controle l'etat environnemental: temperature, fans, alimentations et alertes chassis.",
      commands: ["show environment all", "show environment temperature", "show environment fan", "show environment power", "show logging | include TEMP|FAN|POWER|PS|ENV"],
      notes: ["La syntaxe varie selon Catalyst, ISR, ASR et Nexus.", "Toute alarme temperature ou alimentation doit etre correlee avec les logs et l'etat physique."]
    },
    {
      theme: "hardware", type: "verify", level: "intermediaire",
      title: "Etat PoE global du switch",
      summary: "Affiche le budget PoE total, la puissance consommee et la puissance restante.",
      commands: ["show power inline", "show power inline police", "show environment power", "show logging | include ILPOWER|POWER|PoE|poe"],
      notes: ["show power inline est la commande de reference sur de nombreux switchs Catalyst.", "Verifier le budget restant avant d'ajouter camera, telephone IP ou borne Wi-Fi."]
    },
    {
      theme: "hardware", type: "verify", level: "intermediaire",
      title: "Etat PoE par port",
      summary: "Verifie si un port fournit du PoE, la classe detectee et la puissance allouee.",
      commands: ["show power inline <interface-name>", "show interfaces <interface-name> status", "show interfaces <interface-name> switchport", "show logging | include <interface-name>|ILPOWER"],
      notes: ["Remplacer <interface-name> par gi1/0/10, te1/0/1, etc.", "Si le port est administrativement down, le PoE peut aussi etre coupe selon plateforme et configuration."]
    },
    {
      theme: "hardware", type: "config", level: "intermediaire",
      title: "Activer ou desactiver PoE sur un port",
      summary: "Controle l'alimentation PoE au niveau d'une interface switch.",
      commands: ["interface <interface-name>", "power inline auto", "power inline never", "power inline static max <milliwatts>"],
      notes: ["power inline auto active la negociation PoE automatique.", "power inline never coupe le PoE sur le port.", "power inline static max limite la puissance; verifier le support modele/IOS."]
    },
    {
      theme: "hardware", type: "config", level: "intermediaire",
      title: "Redemarrer un equipement alimente en PoE",
      summary: "Coupe puis reactive le PoE d'un port pour redemarrer telephone IP, camera ou borne Wi-Fi.",
      commands: ["interface <interface-name>", "power inline never", "power inline auto"],
      notes: ["A utiliser avec prudence: cela coupe physiquement l'equipement raccorde.", "Attendre quelques secondes entre coupure et reactivation si l'equipement ne redemarre pas correctement."]
    },
    {
      theme: "hardware", type: "troubleshoot", level: "avance",
      title: "Depanner une panne PoE",
      summary: "Checklist pour un telephone, une camera ou une borne qui ne s'alimente pas.",
      commands: ["show power inline", "show power inline <interface-name>", "show logging | include ILPOWER|POWER|PoE|<interface-name>", "show interfaces <interface-name> status", "show interfaces <interface-name> counters errors", "test cable-diagnostics tdr interface <interface-name>", "show cable-diagnostics tdr interface <interface-name>"],
      notes: ["Verifier budget PoE, cable, classe PoE, modele d'alimentation et messages ILPOWER.", "Les commandes TDR peuvent couper brievement le lien selon plateforme; a utiliser prudemment."]
    },
    {
      theme: "hardware", type: "verify", level: "avance",
      title: "Stack, alimentation redondante et modules",
      summary: "Controle un stack Catalyst, les membres, les alimentations et les modules transceivers.",
      commands: ["show switch", "show switch stack-ports", "show environment stack", "show inventory", "show interfaces transceiver detail", "show logging | include STACK|SFP|GBIC|POWER"],
      notes: ["Sur StackWise, verifier role active/standby, priorite, etat des stack-ports et versions logicielles."]
    },
    {
      theme: "maintenance", type: "config", level: "base",
      title: "Sauvegarder vers TFTP",
      summary: "Copie la configuration vers un serveur TFTP.",
      commands: ["copy running-config tftp:", "copy startup-config tftp:"],
      notes: ["TFTP est simple mais non chiffre. Preferer SCP/SFTP lorsque possible."]
    },
    {
      theme: "maintenance", type: "config", level: "intermediaire",
      title: "Sauvegarder vers SCP",
      summary: "Transfert chiffre de configuration ou fichiers.",
      commands: ["ip scp server enable", "copy running-config scp://admin@192.168.1.80/SW-CORE-01.cfg"],
      notes: ["Necessite SSH et un serveur SCP joignable."]
    },
    {
      theme: "maintenance", type: "verify", level: "base",
      title: "Explorer le stockage flash",
      summary: "Liste fichiers, espace et images disponibles.",
      commands: ["dir flash:", "show file systems", "verify /md5 flash:image.bin", "more flash:config.text"],
      notes: ["Toujours verifier l'espace avant une mise a jour IOS."]
    },
    {
      theme: "maintenance", type: "config", level: "intermediaire",
      title: "Definir l'image de demarrage",
      summary: "Selectionne l'image IOS/IOS XE chargee au prochain redemarrage.",
      commands: ["show boot", "boot system flash:cat9k_iosxe.17.09.05.SPA.bin", "copy running-config startup-config", "reload"],
      notes: ["La syntaxe exacte depend fortement de la plateforme."]
    },
    {
      theme: "maintenance", type: "troubleshoot", level: "intermediaire",
      title: "Registre de configuration",
      summary: "Controle certains comportements de boot sur routeurs IOS classiques.",
      commands: ["show version | include register", "config-register 0x2102", "config-register 0x2142"],
      notes: ["0x2142 ignore la startup-config au boot, utile en recuperation de mot de passe sur plateformes compatibles."]
    },
    {
      theme: "troubleshoot", type: "troubleshoot", level: "base",
      title: "Tests de connectivite",
      summary: "Valide couche 3 et chemin jusqu'a une destination.",
      commands: ["ping 8.8.8.8", "ping 192.168.10.10 source vlan 99", "traceroute 8.8.8.8", "telnet 192.168.50.10 443"],
      notes: ["Le ping source est tres utile depuis un equipement multi-interface."]
    },
    {
      theme: "troubleshoot", type: "troubleshoot", level: "intermediaire",
      title: "Depanner un port down ou err-disabled",
      summary: "Identifie cause, etat et remise en service.",
      commands: ["show interfaces status err-disabled", "show errdisable recovery", "show logging | include ERR|err|disabled", "interface gi1/0/12", "shutdown", "no shutdown"],
      notes: ["Ne pas remettre en service avant d'avoir compris la cause: BPDU Guard, port-security, UDLD, link-flap."]
    },
    {
      theme: "troubleshoot", type: "troubleshoot", level: "avance",
      title: "Debug avec garde-fous",
      summary: "Active un debug puis l'arrete rapidement.",
      commands: ["terminal monitor", "debug ip ospf adj", "undebug all", "show debugging"],
      notes: ["Les debug peuvent impacter le CPU. A utiliser avec fenetre de maintenance ou ciblage precis."]
    },
    {
      theme: "troubleshoot", type: "troubleshoot", level: "intermediaire",
      title: "Capture embarquee IOS XE",
      summary: "Capture du trafic directement sur l'equipement compatible.",
      commands: ["monitor capture CAP interface gi0/0 both", "monitor capture CAP match ipv4 any any", "monitor capture CAP start", "monitor capture CAP stop", "monitor capture CAP export flash:cap.pcap", "no monitor capture CAP"],
      notes: ["Syntaxe variable selon versions. Verifier l'espace flash avant export."]
    },
    {
      theme: "wireless", type: "verify", level: "intermediaire",
      title: "Commandes WLC IOS XE courantes",
      summary: "Verification de base sur controleurs wireless Catalyst.",
      commands: ["show wireless summary", "show ap summary", "show wireless client summary", "show wlan summary", "show wireless stats client detail"],
      notes: ["Les commandes AireOS historiques different des WLC Catalyst IOS XE."]
    },
    {
      theme: "wireless", type: "config", level: "intermediaire",
      title: "Notions de WLAN",
      summary: "Elements frequents a verifier dans une configuration Wi-Fi.",
      commands: ["show running-config | section wlan", "show running-config | section policy profile", "show running-config | section policy tag", "show running-config | section site tag"],
      notes: ["La configuration wireless moderne assemble WLAN, policy profile, policy tag et site tag."]
    },
    {
      theme: "programmability", type: "config", level: "avance",
      title: "Activer NETCONF sur IOS XE",
      summary: "Prepare l'equipement pour l'automatisation via NETCONF/YANG.",
      commands: ["netconf-yang", "ip ssh version 2", "username admin privilege 15 secret <mot-de-passe>", "show platform software yang-management process"],
      notes: ["Verifier la version IOS XE et les licences avant integration.", "NETCONF utilise generalement SSH sur TCP/830."]
    },
    {
      theme: "programmability", type: "config", level: "avance",
      title: "Activer RESTCONF sur IOS XE",
      summary: "Expose une API REST securisee pour lire et modifier la configuration via modeles YANG.",
      commands: ["ip http secure-server", "restconf", "aaa new-model", "username api privilege 15 secret <mot-de-passe>", "show restconf"],
      notes: ["RESTCONF doit etre protege par HTTPS et controle d'acces.", "Limiter les sources d'administration avec ACL si possible."]
    },
    {
      theme: "programmability", type: "verify", level: "avance",
      title: "Verifier communication avec controleur",
      summary: "Commandes utiles pour diagnostiquer une integration Catalyst Center / DNA ou un outil d'automatisation.",
      commands: ["show clock detail", "show ip route <controller-ip>", "ping <controller-ip> source <interface>", "show ip http server status", "show logging | include RESTCONF|NETCONF|HTTP|SSH"],
      notes: ["DNS, NTP, certificat, routage et ACL sont les causes frequentes d'echec d'onboarding."]
    },
    {
      theme: "security", type: "security", level: "avance",
      title: "Hardening services inutiles",
      summary: "Desactive les services couramment inutiles ou a risque sur routeurs et switchs.",
      commands: ["no ip http server", "ip http secure-server", "no service pad", "no ip source-route", "no ip bootp server", "service tcp-keepalives-in", "service tcp-keepalives-out"],
      notes: ["Ne pas desactiver HTTPS si l'equipement est administre par API, interface web ou controleur.", "Documenter chaque exception de production."]
    },
    {
      theme: "security", type: "security", level: "intermediaire",
      title: "Limiter CDP/LLDP sur interfaces externes",
      summary: "Reduit la fuite d'informations de voisinage vers des liens non fiables.",
      commands: ["interface <interface-name>", "no cdp enable", "no lldp transmit", "no lldp receive"],
      notes: ["Garder CDP/LLDP peut etre utile en interne; le couper surtout sur WAN, DMZ, clients ou liens operateurs."]
    },
    {
      theme: "emergency", type: "troubleshoot", level: "avance",
      title: "CPU a 99%",
      summary: "Checklist courte pour identifier un processus, une tempete ou un debug oublie.",
      commands: ["show processes cpu sorted 5sec", "show processes cpu history", "show logging | last 50", "show interfaces | include line protocol|input rate|packets input|drops|broadcast", "show platform resources", "undebug all"],
      notes: ["Arreter les debug en premier si le CPU monte brutalement.", "Chercher boucle L2, storm broadcast, routage instable ou processus de management."]
    },
    {
      theme: "emergency", type: "troubleshoot", level: "avance",
      title: "Suspicion de boucle reseau",
      summary: "Commandes rapides pour confirmer une boucle L2 ou une tempete broadcast.",
      commands: ["show spanning-tree blockedports", "show spanning-tree detail | include ieee|occurr|from|is executing", "show interfaces counters errors", "show mac address-table dynamic | include Gi|Fa|Te", "show storm-control"],
      notes: ["Eviter les changements massifs sous pression; isoler le lien suspect si l'impact est majeur."]
    },
    {
      theme: "emergency", type: "troubleshoot", level: "avance",
      title: "Perte de route ou boucle de routage",
      summary: "Verification express du chemin et des protocoles de routage.",
      commands: ["show ip route <destination>", "show ip cef <destination>", "traceroute <destination> source <interface>", "show ip protocols", "show ip ospf neighbor", "show ip bgp summary"],
      notes: ["Comparer la route attendue, la route installee et le next-hop effectivement resolu."]
    },
    {
      theme: "emergency", type: "troubleshoot", level: "avance",
      title: "Password recovery IOS classique",
      summary: "Rappel de haut niveau pour recuperation de mot de passe sur plateformes compatibles.",
      commands: ["rommon> confreg 0x2142", "rommon> reset", "copy startup-config running-config", "enable secret <nouveau-secret>", "config-register 0x2102", "copy running-config startup-config"],
      notes: ["Procedure dependante du modele et de la politique de securite.", "Planifier une fenetre de maintenance: un redemarrage est generalement necessaire."]
    }
  ],
  snippets: [
    {
      commandTitle: "Creer et nommer des VLAN",
      title: "Generateur VLAN",
      fields: [
        { key: "vlan", label: "VLAN ID", value: "10" },
        { key: "name", label: "Nom VLAN", value: "USERS" }
      ],
      template: ["vlan {{vlan}}", "name {{name}}"]
    },
    {
      commandTitle: "Affecter un port a un VLAN d'acces",
      title: "Port d'acces",
      fields: [
        { key: "interface", label: "Interface", value: "gigabitEthernet1/0/10" },
        { key: "vlan", label: "VLAN data", value: "10" }
      ],
      template: ["interface {{interface}}", "switchport mode access", "switchport access vlan {{vlan}}", "spanning-tree portfast"]
    },
    {
      commandTitle: "Configurer un trunk 802.1Q",
      title: "Trunk 802.1Q",
      fields: [
        { key: "interface", label: "Interface", value: "gigabitEthernet1/0/48" },
        { key: "vlans", label: "VLAN autorises", value: "10,20,99" },
        { key: "native", label: "Native VLAN", value: "999" }
      ],
      template: ["interface {{interface}}", "switchport mode trunk", "switchport trunk allowed vlan {{vlans}}", "switchport trunk native vlan {{native}}", "switchport nonegotiate"]
    },
    {
      commandTitle: "Inter-VLAN routing par SVI",
      title: "SVI inter-VLAN",
      fields: [
        { key: "vlan", label: "VLAN ID", value: "10" },
        { key: "ip", label: "Passerelle", value: "192.168.10.1" },
        { key: "mask", label: "Masque", value: "255.255.255.0" }
      ],
      template: ["ip routing", "interface vlan {{vlan}}", "ip address {{ip}} {{mask}}", "no shutdown"]
    },
    {
      commandTitle: "Serveur DHCP IPv4 local",
      title: "Pool DHCP",
      fields: [
        { key: "pool", label: "Nom pool", value: "VLAN10-USERS" },
        { key: "network", label: "Reseau", value: "192.168.10.0" },
        { key: "mask", label: "Masque", value: "255.255.255.0" },
        { key: "gateway", label: "Passerelle", value: "192.168.10.1" },
        { key: "dns", label: "DNS", value: "1.1.1.1" }
      ],
      template: ["ip dhcp pool {{pool}}", "network {{network}} {{mask}}", "default-router {{gateway}}", "dns-server {{dns}}"]
    },
    {
      commandTitle: "Activer SSH version 2",
      title: "SSH securise",
      fields: [
        { key: "domain", label: "Domaine", value: "exemple.local" },
        { key: "user", label: "Utilisateur", value: "admin" },
        { key: "secret", label: "Secret", value: "MOT_DE_PASSE_FORT" }
      ],
      template: ["ip domain-name {{domain}}", "username {{user}} privilege 15 secret {{secret}}", "crypto key generate rsa modulus 2048", "ip ssh version 2", "line vty 0 15", "transport input ssh", "login local"]
    },
    {
      commandTitle: "Port security sur port d'acces",
      title: "Port-security access",
      fields: [
        { key: "interface", label: "Interface", value: "gigabitEthernet1/0/12" },
        { key: "vlan", label: "VLAN access", value: "10" },
        { key: "maximum", label: "MAC maximum", value: "2" },
        { key: "violation", label: "Violation", value: "restrict" },
        { key: "aging", label: "Aging minutes", value: "15" }
      ],
      template: ["interface {{interface}}", "switchport mode access", "switchport access vlan {{vlan}}", "switchport nonegotiate", "spanning-tree portfast", "spanning-tree bpduguard enable", "switchport port-security", "switchport port-security maximum {{maximum}}", "switchport port-security mac-address sticky", "switchport port-security violation {{violation}}", "switchport port-security aging time {{aging}}", "switchport port-security aging type inactivity", "show port-security interface {{interface}}"]
    },
    {
      commandTitle: "DHCP Snooping",
      title: "DHCP Snooping VLAN",
      fields: [
        { key: "vlans", label: "VLAN proteges", value: "10,20" },
        { key: "uplink", label: "Uplink trusted", value: "gigabitEthernet1/0/48" },
        { key: "accessRange", label: "Ports utilisateurs", value: "gigabitEthernet1/0/1 - 24" },
        { key: "rate", label: "Rate limit pps", value: "20" }
      ],
      template: ["ip dhcp snooping", "ip dhcp snooping vlan {{vlans}}", "no ip dhcp snooping information option", "interface {{uplink}}", "ip dhcp snooping trust", "interface range {{accessRange}}", "ip dhcp snooping limit rate {{rate}}", "show ip dhcp snooping", "show ip dhcp snooping binding"]
    },
    {
      commandTitle: "IP Source Guard sur ports d'acces",
      title: "IP Source Guard",
      fields: [
        { key: "interface", label: "Interface", value: "gigabitEthernet1/0/12" },
        { key: "vlan", label: "VLAN", value: "10" },
        { key: "mode", label: "Mode", value: "ip verify source" }
      ],
      template: ["ip dhcp snooping", "ip dhcp snooping vlan {{vlan}}", "interface {{interface}}", "switchport mode access", "switchport access vlan {{vlan}}", "{{mode}}", "show ip verify source interface {{interface}}", "show ip dhcp snooping binding interface {{interface}}"]
    },
    {
      commandTitle: "Executer un test cable TDR cuivre",
      title: "Test cable TDR",
      fields: [
        { key: "interface", label: "Interface cuivre", value: "gigabitEthernet1/0/12" }
      ],
      template: ["show interfaces {{interface}} status", "show interfaces {{interface}} counters errors", "test cable-diagnostics tdr interface {{interface}}", "show cable-diagnostics tdr interface {{interface}}", "show logging | include TDR|LINK|LINEPROTO|CRC|ERROR"]
    },
    {
      commandTitle: "Diagnostiquer CRC input errors et drops cable",
      title: "Compteurs erreurs cable",
      fields: [
        { key: "interface", label: "Interface", value: "gigabitEthernet1/0/12" }
      ],
      template: ["show interfaces {{interface}}", "show interfaces {{interface}} counters errors", "show logging | include LINK|LINEPROTO|CRC|ERROR", "! Option apres avoir note les compteurs:", "clear counters {{interface}}", "show interfaces {{interface}} counters errors"]
    },
    {
      commandTitle: "802.1X filaire avec RADIUS",
      title: "802.1X port utilisateur",
      fields: [
        { key: "radius", label: "Serveur RADIUS", value: "192.168.99.20" },
        { key: "secret", label: "Cle partagee", value: "CLE_RADIUS" },
        { key: "interface", label: "Interface", value: "gigabitEthernet1/0/12" }
      ],
      template: ["aaa new-model", "radius server ISE-01", "address ipv4 {{radius}} auth-port 1812 acct-port 1813", "key {{secret}}", "aaa authentication dot1x default group radius", "dot1x system-auth-control", "interface {{interface}}", "authentication port-control auto", "dot1x pae authenticator", "show authentication sessions interface {{interface}} details"]
    },
    {
      commandTitle: "Zone-Based Policy Firewall ZBF",
      title: "ZBF inside vers outside",
      fields: [
        { key: "inside", label: "Interface inside", value: "gigabitEthernet0/0" },
        { key: "outside", label: "Interface outside", value: "gigabitEthernet0/1" },
        { key: "className", label: "Class-map", value: "CM-INSIDE-OUT" },
        { key: "policyName", label: "Policy-map", value: "PM-INSIDE-OUT" }
      ],
      template: ["zone security INSIDE", "zone security OUTSIDE", "class-map type inspect match-any {{className}}", "match protocol http", "match protocol https", "match protocol dns", "policy-map type inspect {{policyName}}", "class type inspect {{className}}", "inspect", "class class-default", "drop log", "zone-pair security ZP-IN-OUT source INSIDE destination OUTSIDE", "service-policy type inspect {{policyName}}", "interface {{inside}}", "zone-member security INSIDE", "interface {{outside}}", "zone-member security OUTSIDE"]
    },
    {
      commandTitle: "Activer ou desactiver PoE sur un port",
      title: "Controle PoE par port",
      fields: [
        { key: "interface", label: "Interface", value: "gigabitEthernet1/0/10" },
        { key: "mode", label: "Mode PoE", value: "auto" },
        { key: "max", label: "Max mW optionnel", value: "30000" }
      ],
      template: ["interface {{interface}}", "power inline {{mode}}", "! Option si supporte par le modele:", "power inline static max {{max}}"]
    },
    {
      commandTitle: "Identifier un poste depuis son IP",
      title: "IP vers port",
      fields: [
        { key: "ip", label: "Adresse IP", value: "192.168.10.25" },
        { key: "mac", label: "MAC trouvee", value: "0011.2233.4455" }
      ],
      template: ["show ip arp {{ip}}", "show mac address-table address {{mac}}", "show interfaces <interface-name> status", "show cdp neighbors interface <interface-name> detail"]
    },
    {
      commandTitle: "Trouver les adresses MAC connectees a un port",
      title: "Port vers MAC/IP",
      fields: [
        { key: "interface", label: "Interface", value: "gigabitEthernet1/0/10" },
        { key: "mac", label: "MAC optionnelle", value: "0011.2233.4455" }
      ],
      template: ["show mac address-table interface {{interface}}", "show cdp neighbors interface {{interface}} detail", "show lldp neighbors interface {{interface}} detail", "show ip arp | include {{mac}}"]
    },
    {
      commandTitle: "Ping depuis un VLAN ou une interface source",
      title: "Ping source VLAN/interface",
      fields: [
        { key: "destination", label: "Destination", value: "8.8.8.8" },
        { key: "vlan", label: "VLAN source", value: "99" },
        { key: "interface", label: "Interface source", value: "vlan99" }
      ],
      template: ["ping {{destination}} source vlan {{vlan}}", "ping {{destination}} source {{interface}}", "traceroute {{destination}} source {{interface}}", "show ip route {{destination}}"]
    },
    {
      commandTitle: "OSPFv2 simple aire 0",
      title: "OSPF aire 0",
      fields: [
        { key: "process", label: "Process ID", value: "10" },
        { key: "routerid", label: "Router ID", value: "1.1.1.1" },
        { key: "network", label: "Reseau", value: "192.168.10.0" },
        { key: "wildcard", label: "Wildcard", value: "0.0.0.255" },
        { key: "uplink", label: "Interface voisin", value: "gigabitEthernet0/0" }
      ],
      template: ["router ospf {{process}}", "router-id {{routerid}}", "network {{network}} {{wildcard}} area 0", "passive-interface default", "no passive-interface {{uplink}}"]
    },
    {
      commandTitle: "Activer OSPF directement sur interfaces",
      title: "OSPF par interface",
      fields: [
        { key: "process", label: "Process ID", value: "10" },
        { key: "interface", label: "Interface", value: "vlan10" },
        { key: "area", label: "Area", value: "0" }
      ],
      template: ["router ospf {{process}}", "interface {{interface}}", "ip ospf {{process}} area {{area}}", "show ip ospf interface {{interface}}", "show ip ospf neighbor"]
    },
    {
      commandTitle: "Annoncer une route par defaut dans OSPF",
      title: "Default route OSPF",
      fields: [
        { key: "nextHop", label: "Next-hop", value: "203.0.113.1" },
        { key: "process", label: "Process ID", value: "10" }
      ],
      template: ["ip route 0.0.0.0 0.0.0.0 {{nextHop}}", "router ospf {{process}}", "default-information originate", "show ip route ospf | include 0.0.0.0"]
    },
    {
      commandTitle: "BGP voisin eBGP minimal",
      title: "eBGP minimal",
      fields: [
        { key: "localAs", label: "AS local", value: "65010" },
        { key: "neighbor", label: "Voisin", value: "203.0.113.1" },
        { key: "remoteAs", label: "AS distant", value: "65000" },
        { key: "prefix", label: "Prefixe", value: "198.51.100.0" },
        { key: "mask", label: "Masque", value: "255.255.255.0" }
      ],
      template: ["router bgp {{localAs}}", "bgp log-neighbor-changes", "neighbor {{neighbor}} remote-as {{remoteAs}}", "network {{prefix}} mask {{mask}}", "show ip bgp summary"]
    },
    {
      commandTitle: "QoS MQC simple avec class-map et policy-map",
      title: "QoS voix WAN",
      fields: [
        { key: "className", label: "Class-map", value: "CM-VOICE" },
        { key: "policyName", label: "Policy-map", value: "PM-WAN-OUT" },
        { key: "priority", label: "Priority %", value: "20" },
        { key: "interface", label: "Interface", value: "gigabitEthernet0/0" }
      ],
      template: ["class-map match-any {{className}}", "match dscp ef", "policy-map {{policyName}}", "class {{className}}", "priority percent {{priority}}", "class class-default", "fair-queue", "interface {{interface}}", "service-policy output {{policyName}}", "show policy-map interface {{interface}}"]
    }
  ],
  scenarios: [
    {
      title: "Mettre en service un switch d'acces",
      steps: [
        "Configurer hostname, no ip domain-lookup, comptes locaux et SSH.",
        "Creer VLAN data, voix, management et parking.",
        "Configurer les ports utilisateurs en access avec PortFast et BPDU Guard.",
        "Configurer l'uplink en trunk avec VLAN autorises et native VLAN dedie.",
        "Ajouter SVI de management, passerelle par defaut ou routage selon modele.",
        "Verifier avec show vlan brief, show interfaces trunk, show cdp/lldp neighbors et show logging."
      ]
    },
    {
      title: "Diagnostiquer un utilisateur sans reseau",
      steps: [
        "Verifier l'etat du port: show interfaces status et show interfaces giX/Y.",
        "Controler VLAN d'acces, port-security et err-disabled.",
        "Verifier table MAC et voisinage ARP.",
        "Tester ping vers passerelle depuis le poste puis depuis le switch si possible.",
        "Controler DHCP binding, pool, helper-address et logs."
      ]
    },
    {
      title: "Activer le routage inter-VLAN",
      steps: [
        "Choisir SVI sur switch L3 ou sous-interfaces sur routeur.",
        "Creer VLAN et trunks necessaires.",
        "Configurer passerelles par VLAN.",
        "Activer ip routing sur switch L3.",
        "Verifier show ip interface brief, show ip route, ping source et ACL eventuelles."
      ]
    },
    {
      title: "Preparer une sauvegarde avant intervention",
      steps: [
        "Capturer show version, show inventory et show running-config.",
        "Sauvegarder running-config vers startup-config.",
        "Exporter vers TFTP/SCP avec nom incluant equipement et date.",
        "Verifier le fichier exporte et noter l'image de boot actuelle."
      ]
    },
    {
      title: "Durcir un equipement avant mise en production",
      steps: [
        "Activer SSH v2, comptes nominatifs ou AAA avec secours local.",
        "Limiter les sources d'administration avec ACL sur les lignes VTY.",
        "Desactiver les services inutiles et documenter les exceptions.",
        "Activer NTP, syslog distant et horodatage precis.",
        "Appliquer BPDU Guard, DHCP Snooping ou port-security selon le role des ports.",
        "Sauvegarder la configuration et tester un acces de secours."
      ]
    },
    {
      title: "Deployer la securite L2 sur un switch d'acces",
      steps: [
        "Identifier les ports utilisateurs, uplinks, serveurs, bornes Wi-Fi et exceptions avant tout changement.",
        "Activer PortFast/BPDU Guard sur ports terminaux uniquement.",
        "Activer DHCP Snooping sur les VLAN utilisateurs et marquer uniquement les uplinks/serveurs DHCP en trust.",
        "Ajouter Dynamic ARP Inspection et IP Source Guard apres verification des bindings DHCP.",
        "Appliquer storm-control avec seuils adaptes au profil des ports.",
        "Deployer port-security, 802.1X ou MAB par groupes pilotes avant generalisation.",
        "Verifier show ip dhcp snooping binding, show ip arp inspection statistics, show authentication sessions et show logging."
      ]
    },
    {
      title: "Preparer un equipement IOS XE pour automatisation",
      steps: [
        "Verifier routage, DNS et NTP vers le controleur ou l'outil d'automatisation.",
        "Activer SSH et un compte d'administration controle.",
        "Activer NETCONF ou RESTCONF selon le besoin.",
        "Limiter l'acces API avec ACL, VRF de management ou politique AAA.",
        "Tester la disponibilite avec show restconf, show platform software yang-management process et les logs."
      ]
    },
    {
      title: "Diagnostiquer un probleme PoE terrain",
      steps: [
        "Verifier le budget global avec show power inline.",
        "Verifier le port cible avec show power inline <interface-name>.",
        "Controler l'etat du lien et les erreurs interface.",
        "Lire les logs ILPOWER/POWER pour detecter budget insuffisant, classe non reconnue ou defaut cable.",
        "Tester power inline never puis power inline auto seulement si une coupure de l'equipement est acceptable.",
        "Si necessaire, utiliser le diagnostic TDR cable en fenetre adaptee."
      ]
    },
    {
      title: "Diagnostiquer un cable cuivre defectueux",
      steps: [
        "Verifier l'etat du port avec show interfaces <interface-name> status.",
        "Lire les erreurs avec show interfaces <interface-name> et show interfaces <interface-name> counters errors.",
        "Lancer test cable-diagnostics tdr interface <interface-name> si le port et la plateforme le supportent.",
        "Lire show cable-diagnostics tdr interface <interface-name> et noter paire, etat et distance estimee.",
        "Remplacer cordon, prise, brassage ou patch panel selon le resultat, puis comparer les compteurs apres quelques minutes.",
        "Verifier aussi le port et les compteurs cote equipement voisin."
      ]
    },
    {
      title: "Identifier ce qui est branche sur un port",
      steps: [
        "Verifier le port: show interfaces <interface-name> status et show interfaces <interface-name> description.",
        "Lire les voisins: show cdp neighbors interface <interface-name> detail et show lldp neighbors interface <interface-name> detail.",
        "Lister les MAC apprises: show mac address-table interface <interface-name>.",
        "Associer MAC et IP depuis la passerelle du VLAN: show ip arp | include <mac-address>.",
        "Si la MAC part vers un uplink, suivre CDP/LLDP vers le switch suivant et repeter la recherche."
      ]
    },
    {
      title: "Tester un ping depuis un VLAN precis",
      steps: [
        "Verifier que la SVI source est up/up: show ip interface brief | include Vlan<vlan-id>.",
        "Verifier la route vers la destination: show ip route <destination-ip>.",
        "Tester ping <destination-ip> source vlan <vlan-id> ou ping <destination-ip> source <source-ip>.",
        "Si besoin, utiliser ping etendu pour regler source, taille, repetitions et bit DF.",
        "Comparer avec traceroute source et verifier ACL, VRF, NAT ou firewall si le ping echoue."
      ]
    },
    {
      title: "Mettre en place OSPF entre deux equipements",
      steps: [
        "Verifier les interfaces et IP: show ip interface brief.",
        "Configurer router ospf <process-id> et router-id stable.",
        "Annoncer les reseaux avec network ou ip ospf <process-id> area <area-id> sur interface.",
        "Mettre passive-interface default puis no passive-interface seulement sur les liens de voisinage.",
        "Verifier show ip ospf neighbor, show ip ospf interface brief, show ip route ospf.",
        "Documenter area, couts, authentification et route par defaut si utilisee."
      ]
    },
    {
      title: "Depanner un voisin OSPF qui ne passe pas FULL",
      steps: [
        "Verifier que le lien est up/up et dans le bon VLAN ou la bonne interface routee.",
        "Comparer area, masque IP, timers hello/dead, MTU, type de reseau et authentification.",
        "Lire show ip ospf neighbor detail et show ip ospf interface <interface-name>.",
        "Chercher les logs OSPF ADJCHG puis utiliser debug ip ospf adj uniquement si necessaire.",
        "Verifier ACL, passive-interface, VRF et filtrage multicast 224.0.0.5/224.0.0.6."
      ]
    }
  ],
  emergency: [
    {
      title: "Incident CPU eleve",
      steps: ["undebug all", "show processes cpu sorted 5sec", "show processes cpu history", "show logging | last 50", "show interfaces | include input rate|broadcast|drops"]
    },
    {
      title: "Incident port coupe",
      steps: ["show interfaces status err-disabled", "show logging | include ERR|disabled", "show port-security interface <interface-name>", "show spanning-tree interface <interface-name> detail", "shutdown / no shutdown seulement apres diagnostic"]
    },
    {
      title: "Incident routage",
      steps: ["show ip route <destination>", "show ip cef <destination>", "traceroute <destination> source <interface>", "show ip protocols", "show ip ospf neighbor / show ip bgp summary selon protocole"]
    },
    {
      title: "Incident PoE",
      steps: ["show power inline", "show power inline <interface-name>", "show logging | include ILPOWER|POWER|PoE", "show environment power", "interface <interface-name> puis power inline never / power inline auto si redemarrage accepte"]
    },
    {
      title: "Incident cable ou lien physique",
      steps: ["show interfaces <interface-name> status", "show interfaces <interface-name> counters errors", "show interfaces <interface-name> | include input errors|CRC|duplex|speed", "test cable-diagnostics tdr interface <interface-name>", "show cable-diagnostics tdr interface <interface-name>", "show logging | include LINK|LINEPROTO|CRC|ERROR"]
    },
    {
      title: "Identifier rapidement un equipement sur un port",
      steps: ["show interfaces <interface-name> status", "show cdp neighbors interface <interface-name> detail", "show lldp neighbors interface <interface-name> detail", "show mac address-table interface <interface-name>", "show ip arp | include <mac-address>"]
    },
    {
      title: "Ping depuis le bon VLAN",
      steps: ["show ip interface brief | include Vlan<vlan-id>", "show ip route <destination-ip>", "ping <destination-ip> source vlan <vlan-id>", "traceroute <destination-ip> source vlan <vlan-id>", "verifier ACL/VRF/route retour si echec"]
    },
    {
      title: "Incident OSPF",
      steps: ["show ip ospf neighbor detail", "show ip ospf interface brief", "show ip route ospf", "show logging | include OSPF|ADJCHG", "verifier area, timers, MTU, auth, passive-interface", "debug ip ospf adj puis undebug all si necessaire"]
    },
    {
      title: "Incident 802.1X ou MAB",
      steps: ["show authentication sessions interface <interface-name> details", "show access-session interface <interface-name> details", "show radius statistics", "show logging | include DOT1X|MAB|AUTHMGR|RADIUS", "test aaa group radius <user> <password> legacy", "verifier VLAN critique, serveur RADIUS et fallback local avant shutdown/no shutdown"]
    }
  ],
  glossary: [
    ["ACL", "Access Control List: liste de filtrage du trafic ou de l'acces administration."],
    ["BPDU", "Bridge Protocol Data Unit: trame utilisee par Spanning Tree."],
    ["CEF", "Cisco Express Forwarding: mecanisme de transfert optimise."],
    ["CDP", "Cisco Discovery Protocol: protocole Cisco de decouverte des voisins directement connectes."],
    ["DTP", "Dynamic Trunking Protocol: negociation Cisco du mode trunk."],
    ["HSRP", "Hot Standby Router Protocol: redondance de passerelle Cisco."],
    ["ICMP", "Protocole utilise notamment par ping et certains messages de diagnostic IP."],
    ["IOS / IOS XE", "Systemes d'exploitation Cisco pour routeurs, switchs et controleurs."],
    ["LACP", "Link Aggregation Control Protocol: protocole standard pour EtherChannel."],
    ["LLDP", "Link Layer Discovery Protocol: protocole standard de decouverte des voisins reseau."],
    ["MAC Address Table", "Table de commutation qui associe une adresse MAC a un VLAN et a un port."],
    ["Native VLAN", "VLAN transporte sans tag sur un trunk 802.1Q."],
    ["NVRAM", "Memoire qui conserve la startup-config."],
    ["OSPF", "Open Shortest Path First: protocole de routage dynamique a etat de liens."],
    ["PortFast", "Fonction STP qui met rapidement un port terminal en forwarding."],
    ["SVI", "Switch Virtual Interface: interface VLAN logique sur un switch."],
    ["Trunk", "Lien transportant plusieurs VLAN."],
    ["VTY", "Lignes virtuelles utilisees pour SSH ou Telnet."]
  ]
};
