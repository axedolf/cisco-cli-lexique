const CISCO_DATA = {
  themes: [
    { id: "base", name: "Demarrage et modes CLI", accent: "#2f6f73" },
    { id: "interfaces", name: "Interfaces physiques et logiques", accent: "#536d25" },
    { id: "switching", name: "Switching, VLAN et trunks", accent: "#8a5b13" },
    { id: "routing", name: "Routage IPv4/IPv6", accent: "#6750a4" },
    { id: "services", name: "Services reseau", accent: "#0b6bcb" },
    { id: "security", name: "Securite et durcissement", accent: "#9b1c31" },
    { id: "monitoring", name: "Verification et supervision", accent: "#4d6470" },
    { id: "maintenance", name: "Sauvegarde, image et maintenance", accent: "#6b5b2a" },
    { id: "troubleshoot", name: "Depannage", accent: "#a03b16" },
    { id: "wireless", name: "Notions wireless Cisco", accent: "#007078" }
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
      theme: "routing", type: "config", level: "intermediaire",
      title: "OSPFv2 simple aire 0",
      summary: "Active OSPF et annonce des reseaux IPv4.",
      commands: ["router ospf 10", "router-id 1.1.1.1", "network 10.0.0.0 0.0.0.255 area 0", "network 192.168.10.0 0.0.0.255 area 0", "passive-interface default", "no passive-interface gigabitEthernet0/0"],
      notes: ["Le wildcard mask est l'inverse du masque reseau.", "passive-interface limite les voisinages non souhaites."]
    },
    {
      theme: "routing", type: "verify", level: "intermediaire",
      title: "Verifier OSPF",
      summary: "Controle voisins, interfaces, LSDB et routes OSPF.",
      commands: ["show ip ospf neighbor", "show ip ospf interface brief", "show ip protocols", "show ip route ospf", "show ip ospf database"],
      notes: ["Si un voisin reste en INIT ou EXSTART, verifier MTU, area, timers, auth et type de reseau."]
    },
    {
      theme: "routing", type: "config", level: "avance",
      title: "EIGRP nomme",
      summary: "Configure EIGRP moderne avec familles d'adresses.",
      commands: ["router eigrp CAMPUS", "address-family ipv4 unicast autonomous-system 100", "network 10.0.0.0 0.255.255.255", "eigrp router-id 2.2.2.2", "af-interface default", "passive-interface", "exit-af-interface", "af-interface gi0/0", "no passive-interface"],
      notes: ["EIGRP est courant dans certains environnements Cisco historiques."]
    },
    {
      theme: "routing", type: "config", level: "avance",
      title: "BGP voisin eBGP minimal",
      summary: "Etablit une session BGP externe et annonce un prefixe.",
      commands: ["router bgp 65010", "bgp log-neighbor-changes", "neighbor 203.0.113.1 remote-as 65000", "network 198.51.100.0 mask 255.255.255.0"],
      notes: ["Le prefixe annonce doit exister dans la table de routage.", "Filtrage, prefix-list et route-map sont indispensables en production."]
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
      summary: "Limite les adresses MAC autorisees sur un port.",
      commands: ["interface gi1/0/12", "switchport mode access", "switchport port-security", "switchport port-security maximum 2", "switchport port-security mac-address sticky", "switchport port-security violation restrict"],
      notes: ["Le mode shutdown coupe le port en err-disabled; restrict journalise et bloque les MAC excedentaires."]
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
      commands: ["ip dhcp snooping", "ip dhcp snooping vlan 10,20", "interface gi1/0/48", "ip dhcp snooping trust", "interface range gi1/0/1 - 24", "ip dhcp snooping limit rate 20"],
      notes: ["Les trunks vers serveurs DHCP ou uplinks doivent etre trust."]
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
    }
  ],
  glossary: [
    ["ACL", "Access Control List: liste de filtrage du trafic ou de l'acces administration."],
    ["BPDU", "Bridge Protocol Data Unit: trame utilisee par Spanning Tree."],
    ["CEF", "Cisco Express Forwarding: mecanisme de transfert optimise."],
    ["DTP", "Dynamic Trunking Protocol: negociation Cisco du mode trunk."],
    ["HSRP", "Hot Standby Router Protocol: redondance de passerelle Cisco."],
    ["IOS / IOS XE", "Systemes d'exploitation Cisco pour routeurs, switchs et controleurs."],
    ["LACP", "Link Aggregation Control Protocol: protocole standard pour EtherChannel."],
    ["Native VLAN", "VLAN transporte sans tag sur un trunk 802.1Q."],
    ["NVRAM", "Memoire qui conserve la startup-config."],
    ["OSPF", "Open Shortest Path First: protocole de routage dynamique a etat de liens."],
    ["PortFast", "Fonction STP qui met rapidement un port terminal en forwarding."],
    ["SVI", "Switch Virtual Interface: interface VLAN logique sur un switch."],
    ["Trunk", "Lien transportant plusieurs VLAN."],
    ["VTY", "Lignes virtuelles utilisees pour SSH ou Telnet."]
  ]
};
