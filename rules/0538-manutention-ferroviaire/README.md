# Manutention ferroviaire et travaux connexes — IDCC 538

Le fichier [2026.1](0538-manutention-ferroviaire.2026.1.publicodes) entre en vigueur le 1er mars 2026. Grilles de l'accord du 27 novembre 2025 au 1er mars 2026. Pour les agents de maîtrise et cadres, l'ancienneté en années révolues remplace les tranches du texte ; avant un an, le montant retenu est celui de la première tranche publiée (0 à 6 mois pour le contremaître, 6 mois à 1 an pour les autres emplois).

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
