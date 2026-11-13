# Industrie et commerces en gros des viandes — IDCC 1534

> La version 2026.1 a été supprimée pendant la bêta, le 13 novembre 2026 : aucune période à partir du 1er janvier 2026 ne la choisissait plus. Les passages qui la citent retracent l’historique des règles reprises par les versions suivantes.

Le fichier 2026.1 entre en vigueur le 1er février 2026. Il est fondé sur l’avenant n° 100 du 12 février 2026 relatif à la revalorisation des salaires minima au 1er février 2026 et de la prime à l’obtention d’un CQP, étendu par arrêté du 20 mai 2026 (JORF n° 0131 du 6 juin 2026, texte n° 88, NOR TRST2612791A), cités dans ses métadonnées. La valeur Publicodes est `industrie et commerces en gros des viandes` ; les règles sont sous `salarié . convention collective . industrie et commerces en gros des viandes`.

La convention collective nationale des entreprises de l’industrie et des commerces en gros des viandes du 20 février 1969 (brochure 3179) couvre les entreprises relevant de l’IDCC 1534. Elle ne couvre pas les industries de la salaison, charcuterie et conserves de viandes (IDCC 1586).

## Règles implémentées

- `niveau` reçoit la classification au format `<niveau>.<échelon>`, avec un niveau en chiffres romains et un échelon de 1 à 3 (défaut : `non renseigné`) :
  - `I.1` à `IV.3` pour les ouvriers et employés ;
  - `V.1` à `VII.3` pour les techniciens et agents de maîtrise ;
  - `VIII.1` à `X.3` pour les cadres.
- `salaire minimum conventionnel . grille` donne le salaire de base mensuel minimum des 30 positions, pour 35 heures par semaine, de 1 835 € (`I.1`) à 6 361 € (`X.3`).
- `salaire minimum conventionnel` multiplie la grille par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois. Par exemple, `IV.2` vaut 2 050 € à temps complet et 1 025 € à mi-temps.
- `niveau hors grille` signale un niveau ou un échelon absent des 30 positions. La grille retourne alors `0 €/mois` et l’application doit traiter l’anomalie.

Les positions `I.1` à `I.3` (de 1 835 € à 1 859 €) sont inférieures au SMIC mensuel de 1 867,02 € en vigueur depuis juin 2026 : l’application doit retenir le plus élevé des deux montants.

## Limites

- L’avenant ne précise pas le nombre d’heures de la grille. Elle est lue comme un salaire mensuel pour 35 heures par semaine (151,67 heures par mois), proratisé selon la quotité, comme l’indiquent les synthèses de la grille (juristique.org). Pour les cadres au forfait, le minimum annuel équivalent n’est pas défini par l’avenant.
- L’avenant entre en vigueur à sa signature pour les adhérents des organisations signataires (Culture Viande, APV, FNEAP) et au plus tard à son extension. L’arrêté d’extension prend effet à sa publication, le 6 juin 2026 : pour les employeurs non adhérents, les périodes de février à mai 2026 sont donc incertaines. La version retient le 1er février 2026.
- L’exemplaire de l’avenant consulté ne reproduit pas ses articles 3 et 4, absents du texte publié par juristique.org. La grille est celle de l’article 2.
- La prime à l’obtention d’un CQP (800 € minimum, article 5) et les autres éléments de la convention (primes, majorations, prévoyance) ne sont pas modélisés.
- Les grilles antérieures au 1er février 2026 ne sont pas modélisées : la première version couvre les périodes à partir de cette date.

## Financement du paritarisme

La révision 2026.2, à la date d'effet de la version 2026.1, ajoute `financement du paritarisme` : les contributions annuelles des employeurs de 0,1 % des rémunérations soumises à cotisations pour le financement du paritarisme et 0,01 % pour la politique emploi-formation de la CPNEFP, soit 0,11 % (article 4 de l'accord du 10 février 2021, KALITEXT000043925608, étendu par arrêté du 17 septembre 2021). Lu sur Légifrance le 8 novembre 2026. Elle s'ajoute à `salarié . cotisations . employeur`, en provision mensuelle ; la régularisation annuelle n'est pas calculée.
