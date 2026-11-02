# Charcuterie de détail — IDCC 953

Le fichier [2026.1](0953-charcuterie-detail.2026.1.publicodes) entre en vigueur le 1er janvier 2026 ; il lie les entreprises non adhérentes aux organisations signataires à partir du 23 juillet 2026. Taux horaires de l'avenant n° 64 (de 12,27 € à 20,43 €), convertis en minima mensuels.

La valeur Publicodes est `charcuterie de détail` ; les règles sont sous `salarié . convention collective . charcuterie de détail`.

## Règles implémentées

- `coefficient` : Coefficient de 150 à 330 de la grille.
- `salaire minimum conventionnel` : minimum brut à temps plein de la grille (mensuel), multiplié par `salarié . contrat . temps de travail . quotité` de modele-social ; le montant ne doit donc pas être proratisé une seconde fois.
- `coefficient hors grille` signale une classification absente de la grille (minimum à 0).

## Limites

- Seuls les minima de salaire sont modélisés : primes, majorations, maintien de salaire, indemnités de rupture, santé et prévoyance ne le sont pas.
- Le SMIC reste un plancher à appliquer par le moteur de paie lorsque le minimum conventionnel lui est inférieur.

## Sources

- Avenant n° 64 du 15 janvier 2026 relatif aux salaires au 1er janvier 2026, article 1er (salaires horaires bruts des coefficients 150 à 330), étendu par arrêté du 17 juillet 2026 (JORF du 23 juillet 2026) sous réserve du SMIC. Les taux horaires sont convertis en minima mensuels pour 151,67 heures, arrondis au centime.
- https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054553974
- Convention collective nationale de la charcuterie de détail du 1er décembre 1977, conteneur KALICONT000005635375.
