# Manutention ferroviaire et travaux connexes — IDCC 538

> La version 2026.1 a été supprimée pendant la bêta, le 13 novembre 2026 : aucune période à partir du 1er janvier 2026 ne la choisissait plus. Les passages qui la citent retracent l’historique des règles reprises par les versions suivantes.

Le fichier 2026.1 entre en vigueur le 1er mars 2026. Grilles de l'accord du 27 novembre 2025 au 1er mars 2026. Pour les agents de maîtrise et cadres, l'ancienneté en années révolues remplace les tranches du texte ; avant un an, le montant retenu est celui de la première tranche publiée (0 à 6 mois pour le contremaître, 6 mois à 1 an pour les autres emplois).

La valeur Publicodes est `manutention ferroviaire` ; les règles sont sous `salarié . convention collective . manutention ferroviaire`.

## Règles implémentées

- `classification` : « ouvrier 156 » à « ouvrier 196 » (coefficient de l'ouvrier, qui intègre son ancienneté dans la catégorie), « employé niveau 1 » à « employé niveau 7 », ou un emploi de maîtrise et d'encadrement : « contremaître », « chef de bordée », « chef de chantier », « chef de service ».
- `ancienneté` : ancienneté dans l'entreprise en années révolues, qui fixe la tranche de la grille.
- `salaire minimum conventionnel` : minimum brut à temps plein de la grille (mensuel), multiplié par `salarié . contrat . temps de travail . quotité` de modele-social ; le montant ne doit donc pas être proratisé une seconde fois.
- `classification hors grille` signale une classification absente de la grille (minimum à 0).

## Limites

- Seuls les minima de salaire sont modélisés : primes, majorations, maintien de salaire, indemnités de rupture, santé et prévoyance ne le sont pas.
- Le SMIC reste un plancher à appliquer par le moteur de paie lorsque le minimum conventionnel lui est inférieur.

## Sources

- Accord du 27 novembre 2025 relatif aux salaires garantis et aux autres éléments de rémunération pour l'année 2026, annexe 1 (grilles de salaires : taux horaires des ouvriers par coefficient, nettoyage et manutention ; salaires mensuels des employés de chantiers ; salaires mensuels des agents de maîtrise et cadres par ancienneté), applicable le premier jour du mois suivant la publication de l'arrêté d'extension, étendu par arrêté du 5 février 2026 (JORF du 10 février 2026), soit le 1er mars 2026. Les taux horaires sont convertis en minima mensuels pour 151,67 heures, arrondis au centime.
- https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000053504132
- Convention collective nationale du personnel des entreprises de manutention ferroviaire et travaux connexes du 6 janvier 1970, conteneur KALICONT000005635702.

## Financement du paritarisme

La révision 2026.2, à la date d'effet de la version 2026.1, ajoute `financement du paritarisme` : la contribution mutualisée aux frais du paritarisme versée à l'AGFP-MF : 0,0085 % de la masse salariale brute (article 3.7-d de l'accord du 12 février 2019, rédigé par l'article 3 de l'accord du 27 octobre 2021, KALITEXT000045111041, étendu par arrêté du 4 février 2022 et appliqué depuis le 1er mars 2022). Elle n'est pas due par les entreprises de 1 à 10 salariés (article 7). La CPPNI peut revoir le taux chaque année ; aucune révision n'est publiée dans KALI. La contribution conventionnelle de formation, dont l'assiette sert de base, n'est pas modélisée. Lu sur Légifrance le 8 novembre 2026. Elle s'ajoute à `salarié . cotisations . employeur`. Le montant mensuel est une provision sur le brut du mois ; la régularisation annuelle et les éventuels minimums par entreprise ne sont pas calculés.
